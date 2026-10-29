import { describe, expect, it } from "vitest";
import { clientIp, parseTrustedProxies } from "@/lib/contact/client-ip";
import { createRateLimiter } from "@/lib/contact/rate-limit";
import { smtpDiagnostic } from "@/lib/smtp-diagnostic";

const headers = (forwardedFor?: string) => new Headers(forwardedFor ? { "x-forwarded-for": forwardedFor } : {});

describe("clientIp", () => {
  it("uses the rightmost address when no proxy is trusted", () => {
    expect(clientIp(headers("198.51.100.7"), null)).toBe("198.51.100.7");
    expect(clientIp(headers("1.1.1.1, 198.51.100.7"), null)).toBe("198.51.100.7");
  });

  it("skips trusted proxies from the right", () => {
    const trusted = parseTrustedProxies("10.0.0.0/8, 192.0.2.5");
    expect(clientIp(headers("198.51.100.7, 192.0.2.5, 10.1.2.3"), trusted)).toBe("198.51.100.7");
  });

  it("ignores a spoofed address placed left of the real client", () => {
    const trusted = parseTrustedProxies("10.0.0.1");
    expect(clientIp(headers("6.6.6.6, 198.51.100.7, 10.0.0.1"), trusted)).toBe("198.51.100.7");
  });

  it("understands aliases and IPv6", () => {
    const trusted = parseTrustedProxies("loopback, uniquelocal");
    expect(clientIp(headers("2001:db8::1, 192.168.1.1, ::1"), trusted)).toBe("2001:db8::1");
    expect(clientIp(headers("::ffff:198.51.100.7"), null)).toBe("198.51.100.7");
  });

  it("falls back to a shared key for missing or invalid values", () => {
    expect(clientIp(headers(), null)).toBe("unknown");
    expect(clientIp(headers("not-an-ip"), null)).toBe("unknown");
    expect(parseTrustedProxies("")).toBeNull();
  });
});

describe("createRateLimiter", () => {
  it("allows `limit` hits per window, then resets", () => {
    const limiter = createRateLimiter({ windowMs: 1000, limit: 2 });
    expect(limiter.hit("a", 0)).toMatchObject({ allowed: true, remaining: 1 });
    expect(limiter.hit("a", 10)).toMatchObject({ allowed: true, remaining: 0 });
    expect(limiter.hit("a", 20)).toMatchObject({ allowed: false, remaining: 0, resetSeconds: 1 });
    expect(limiter.hit("b", 20).allowed).toBe(true);
    expect(limiter.hit("a", 1001).allowed).toBe(true);
  });
});

describe("smtpDiagnostic", () => {
  it("reports only known codes and hints", () => {
    expect(smtpDiagnostic({ code: "EAUTH", responseCode: 535 })).toMatchObject({ code: "EAUTH", responseCode: 535 });
    const unknown = smtpDiagnostic({ code: "SECRET_TOKEN", responseCode: 200 });
    expect(unknown.code).toBe("SMTP_ERROR");
    expect(unknown).not.toHaveProperty("responseCode");
  });
});
