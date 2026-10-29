import { describe, expect, it } from "vitest";
import { createContactHandler, type ContactHandlerOptions } from "@/lib/contact/handler";
import type { MailMessage, TransportOptions } from "@/lib/contact/mailer";

const origin = "https://website.example";
const env = {
  CONTACT_ALLOWED_ORIGINS: origin,
  SMTP_HOST: "smtp.example.com",
  SMTP_PORT: "587",
  SMTP_ENCRYPTION: "tls",
  SMTP_USERNAME: "sender",
  SMTP_PASSWORD: "test-only",
  SMTP_FROM_EMAIL: "sender@example.com",
  SMTP_FROM_NAME: "Website",
  CONTACT_TO_EMAIL: "sales@example.com",
};
const payload = {
  name: "Customer",
  email: "visitor@example.com",
  message: "Need consultation",
  eventName: "Wedding",
  company: "Example",
};

/** Builds a handler and a function that posts to it, mirroring a browser request from `origin`. */
function setup(options: ContactHandlerOptions = {}) {
  const handler = createContactHandler({ env, ...options });
  const send = (body: unknown = payload, headers: Record<string, string> = {}) =>
    handler.POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { origin, "content-type": "application/json", ...headers },
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
    );
  return { handler, send };
}

const mustNotSend = () => {
  throw new Error("Must not send");
};

describe("contact API request checks", () => {
  it("answers other methods with 405 and an Allow header", async () => {
    const { handler } = setup();
    const response = handler.methodNotAllowed(new Request("http://localhost/api/contact"));
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("rejects wrong origin and content type", async () => {
    const { send } = setup({ transportFactory: mustNotSend });
    expect((await send(payload, { origin: "https://evil.example" })).status).toBe(403);
    expect((await send(payload, { origin: "" })).status).toBe(403);
    expect((await send(payload, { "content-type": "text/plain" })).status).toBe(415);
  });

  it("accepts a JSON content type with a charset", async () => {
    const { send } = setup({
      transportFactory: () => ({ sendMail: async () => ({ accepted: ["sales@example.com"], rejected: [] }) }),
    });
    expect((await send(payload, { "content-type": "application/json; charset=utf-8" })).status).toBe(200);
  });

  it.each([
    ["malformed JSON", "{", 400],
    ["a bare string", '"text"', 400],
    ["an empty body", "", 400],
    ["an array", [], 400],
    ["an oversized body", { ...payload, message: "x".repeat(21000) }, 413],
    ["an empty object", {}, 422],
    ["a name with a header injection", { ...payload, name: "Name\r\nBcc: x@example.com" }, 422],
    ["a bad email address", { ...payload, email: "bad" }, 422],
    ["a non-string email", { ...payload, email: ["x@example.com"] }, 422],
    ["a message over 5000 bytes", { ...payload, message: "x".repeat(5001) }, 422],
    ["control characters", { ...payload, message: "hello\u0000world" }, 422],
  ])("rejects %s before SMTP", async (_label, body, status) => {
    const { send } = setup({ transportFactory: mustNotSend });
    expect((await send(body)).status).toBe(status);
  });

  it("rejects an oversized body announced by Content-Length without reading it", async () => {
    const { send } = setup({ transportFactory: mustNotSend });
    const response = await send(payload, { "content-length": "999999" });
    expect(response.status).toBe(413);
  });
});

describe("contact API delivery", () => {
  it.each([
    ["tls", "587"],
    ["ssl", "465"],
  ])("sends plain text to the fixed recipient with %s", async (encryption, port) => {
    let options: TransportOptions | undefined;
    let mail: MailMessage | undefined;
    const { send } = setup({
      env: { ...env, SMTP_ENCRYPTION: encryption, SMTP_PORT: port },
      transportFactory: (value) => {
        options = value;
        return {
          sendMail: async (message) => {
            mail = message;
            return { accepted: ["sales@example.com"], rejected: [] };
          },
        };
      },
    });

    const response = await send({ ...payload, to: "attacker@example.com", from: "attacker@example.com", raw: { path: "/.env" } });
    expect(response.status).toBe(200);
    expect((await response.json()).ok).toBe(true);

    expect(mail?.to).toBe(env.CONTACT_TO_EMAIL);
    expect(mail?.from.address).toBe(env.SMTP_FROM_EMAIL);
    expect(mail?.replyTo.address).toBe(payload.email);
    expect(mail?.text).toMatch(/Wedding/);
    expect(mail).not.toHaveProperty("raw");
    expect(mail).not.toHaveProperty("html");
    expect(options?.secure).toBe(encryption === "ssl");
    expect(options?.requireTLS).toBe(encryption === "tls");
    expect(options?.disableFileAccess).toBe(true);
    expect(options?.disableUrlAccess).toBe(true);
  });

  it.each([
    ["missing SMTP password", { env: { ...env, SMTP_PASSWORD: "" } }],
    ["an invalid port", { env: { ...env, SMTP_PORT: "70000" } }],
    ["an invalid encryption mode", { env: { ...env, SMTP_ENCRYPTION: "none" } }],
    [
      "a transport error",
      { transportFactory: () => ({ sendMail: async () => { throw new Error("secret password"); } }) },
    ],
    [
      "a rejected recipient",
      { transportFactory: () => ({ sendMail: async () => ({ accepted: [], rejected: ["sales@example.com"] }) }) },
    ],
  ] as [string, ContactHandlerOptions][])("answers 503 without leaking details on %s", async (_label, options) => {
    const { send } = setup(options);
    const response = await send();
    expect(response.status).toBe(503);
    expect(await response.text()).not.toMatch(/secret password|test-only/);
  });
});

describe("contact API abuse protection", () => {
  it("sends nothing for the honeypot and blocks the sixth request in the window", async () => {
    let sent = 0;
    const { send } = setup({
      transportFactory: () => ({
        sendMail: async () => {
          sent++;
          return { accepted: ["sales@example.com"] };
        },
      }),
    });

    expect((await send({ ...payload, website: "spam" })).status).toBe(200);
    expect(sent).toBe(0);
    for (let i = 0; i < 4; i++) expect((await send()).status).toBe(200);

    const blocked = await send();
    expect(blocked.status).toBe(429);
    expect(blocked.headers.has("retry-after")).toBe(true);
    expect(sent).toBe(4);
  });

  it("limits each client address separately", async () => {
    const { send } = setup({
      transportFactory: () => ({ sendMail: async () => ({ accepted: ["sales@example.com"] }) }),
    });
    for (let i = 0; i < 5; i++) await send(payload, { "x-forwarded-for": "203.0.113.1" });
    expect((await send(payload, { "x-forwarded-for": "203.0.113.1" })).status).toBe(429);
    expect((await send(payload, { "x-forwarded-for": "203.0.113.2" })).status).toBe(200);
  });
});
