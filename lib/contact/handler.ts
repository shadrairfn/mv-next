import { clientIp, parseTrustedProxies } from "@/lib/contact/client-ip";
import {
  defaultTransportFactory,
  readMailConfig,
  sendContactMail,
  type Env,
  type TransportFactory,
} from "@/lib/contact/mailer";
import { createRateLimiter, type RateLimiter } from "@/lib/contact/rate-limit";
import { parseContactMessage, ValidationError } from "@/lib/contact/validate";
import { smtpDiagnostic } from "@/lib/smtp-diagnostic";

const maxBodyBytes = 20000;
const windowMs = 15 * 60 * 1000;
const limit = 5;

const success = "Pesan berhasil dikirim. Tim kami akan menghubungi Anda.";
const failure = "Pesan belum dapat dikirim. Silakan coba lagi nanti atau hubungi kami melalui WhatsApp.";

export type ContactHandlerOptions = {
  /** Defaults to process.env, read on every request. */
  env?: Env;
  transportFactory?: TransportFactory;
  rateLimiter?: RateLimiter;
};

function reply(status: number, message: string, headers: Record<string, string> = {}) {
  return Response.json(
    { ok: status === 200, message },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

/** Reads the request body, or returns null once it grows past `max` bytes. */
async function readBody(request: Request, max: number) {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > max) return null;
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

/** Mirrors express.json({ strict: true }): only objects and arrays are accepted. */
function parseJson(text: string): unknown {
  if (!/^\s*[{[]/.test(text)) throw new SyntaxError("Not a JSON object");
  return JSON.parse(text);
}

export function createContactHandler(options: ContactHandlerOptions = {}) {
  const rateLimiter = options.rateLimiter ?? createRateLimiter({ windowMs, limit });
  const transportFactory = options.transportFactory ?? defaultTransportFactory;
  const readEnv = () => options.env ?? process.env;

  async function POST(request: Request) {
    const env = readEnv();

    const origins = (env.CONTACT_ALLOWED_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean);
    const origin = request.headers.get("origin");
    if (!origin || !origins.includes(origin)) return reply(403, "Kirim pesan melalui website resmi kami.");

    const mediaType = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    if (mediaType !== "application/json") return reply(415, "Format pesan tidak didukung.");

    const hit = rateLimiter.hit(clientIp(request.headers, parseTrustedProxies(env.TRUST_PROXY)));
    const rateHeaders = {
      "RateLimit-Policy": `"contact"; q=${hit.limit}; w=${windowMs / 1000}`,
      RateLimit: `"contact"; r=${hit.remaining}; t=${hit.resetSeconds}`,
    };
    if (!hit.allowed) {
      return reply(429, "Terlalu banyak percobaan. Silakan coba lagi dalam 15 menit.", {
        ...rateHeaders,
        "Retry-After": String(hit.resetSeconds),
      });
    }

    const text = await readBody(request, maxBodyBytes);
    if (text === null) return reply(413, "Pesan terlalu panjang.", rateHeaders);

    let body: unknown;
    try {
      body = parseJson(text);
    } catch {
      return reply(400, "Pesan tidak valid.", rateHeaders);
    }
    if (!body || Array.isArray(body) || typeof body !== "object") {
      return reply(400, "Pesan tidak valid.", rateHeaders);
    }

    try {
      const contact = parseContactMessage(body as Record<string, unknown>);
      // Honeypot: pretend success so bots learn nothing, but send nothing.
      if (contact.spam) return reply(200, "Pesan telah diterima.", rateHeaders);

      const config = readMailConfig(env);
      if (!config) return reply(503, failure, rateHeaders);

      const info = await sendContactMail(config, contact, transportFactory);
      if (!info.accepted?.length || info.rejected?.length) return reply(503, failure, rateHeaders);

      // SMTP acceptance is traceable without exposing addresses or message content.
      console.info("Contact email accepted by SMTP.", {
        messageId:
          typeof info.messageId === "string" && /^<[a-zA-Z0-9._@+-]+>$/.test(info.messageId)
            ? info.messageId
            : "unavailable",
        acceptedCount: info.accepted.length,
      });
      return reply(200, success, rateHeaders);
    } catch (error) {
      if (error instanceof ValidationError) return reply(error.status, error.message, rateHeaders);
      // Do not log SMTP errors containing credentials or message content.
      console.error("Contact SMTP delivery failed.", smtpDiagnostic(error as object));
      return reply(503, failure, rateHeaders);
    }
  }

  function methodNotAllowed(request: Request) {
    // Reading the request keeps this handler dynamic instead of prerendered at build time.
    void request.headers;
    return reply(405, "Gunakan form kontak untuk mengirim pesan.", { Allow: "POST" });
  }

  return { POST, methodNotAllowed };
}
