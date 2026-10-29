// Checks the SMTP connection, TLS and login without sending any email.
// Run with Node 22.18+ (type stripping): `npm run smtp:check`, or `node scripts/check-smtp.ts` in the container.
import { existsSync } from "node:fs";
import nodemailer from "nodemailer";
import { smtpDiagnostic } from "../lib/smtp-diagnostic.ts";

if (existsSync(".env")) process.loadEnvFile(".env");

const env = process.env;
const required = ["SMTP_HOST", "SMTP_USERNAME", "SMTP_PASSWORD"];
const encryption = env.SMTP_ENCRYPTION || "tls";
const port = Number(env.SMTP_PORT || 587);

if (
  required.some((key) => !env[key]) ||
  !["tls", "ssl"].includes(encryption) ||
  !Number.isInteger(port) ||
  port < 1 ||
  port > 65535
) {
  console.error("Konfigurasi SMTP belum lengkap atau tidak valid.");
  process.exitCode = 1;
} else {
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: encryption === "ssl",
    requireTLS: encryption === "tls",
    auth: { user: env.SMTP_USERNAME, pass: env.SMTP_PASSWORD },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  try {
    await transport.verify();
    console.log("Koneksi TLS dan autentikasi SMTP berhasil. Tidak ada email yang dikirim.");
  } catch (error) {
    console.error("Pemeriksaan SMTP gagal.", smtpDiagnostic(error as object));
    process.exitCode = 1;
  } finally {
    transport.close();
  }
}
