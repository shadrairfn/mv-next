import nodemailer from "nodemailer";
import type { ContactMessage } from "@/lib/contact/validate";
import { emailPattern } from "@/lib/contact/validate";

export type Env = Record<string, string | undefined>;

export type TransportOptions = {
  host: string;
  port: number;
  secure: boolean;
  requireTLS: boolean;
  auth: { user: string; pass: string };
  connectionTimeout: number;
  greetingTimeout: number;
  socketTimeout: number;
  disableFileAccess: boolean;
  disableUrlAccess: boolean;
};

export type MailMessage = {
  from: { name: string; address: string };
  to: string;
  replyTo: { name: string; address: string };
  subject: string;
  text: string;
};

export type MailInfo = { accepted?: unknown[]; rejected?: unknown[]; messageId?: unknown };

export type MailTransport = { sendMail(message: MailMessage): Promise<MailInfo> };

export type TransportFactory = (options: TransportOptions) => MailTransport;

export const defaultTransportFactory: TransportFactory = (options) => nodemailer.createTransport(options);

const requiredKeys = ["SMTP_HOST", "SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_FROM_EMAIL", "CONTACT_TO_EMAIL"] as const;

/** Reads and validates the SMTP settings; returns null when they are missing or invalid. */
export function readMailConfig(env: Env) {
  const port = Number(env.SMTP_PORT || 587);
  const encryption = env.SMTP_ENCRYPTION || "tls";
  const [host, user, pass, fromEmail, toEmail] = requiredKeys.map((key) => env[key]);

  if (
    !host || !user || !pass || !fromEmail || !toEmail ||
    !emailPattern.test(fromEmail) || !emailPattern.test(toEmail) ||
    !Number.isInteger(port) || port < 1 || port > 65535 ||
    !["tls", "ssl"].includes(encryption)
  ) {
    return null;
  }

  const options: TransportOptions = {
    host,
    port,
    secure: encryption === "ssl",
    requireTLS: encryption === "tls",
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    disableFileAccess: true,
    disableUrlAccess: true,
  };
  return { options, fromEmail, toEmail, brand: env.SMTP_FROM_NAME || "Website" };
}

export type MailConfig = NonNullable<ReturnType<typeof readMailConfig>>;

/** Sends the contact message to the fixed recipient, with the visitor as Reply-To. */
export function sendContactMail(config: MailConfig, contact: ContactMessage, createTransport: TransportFactory) {
  const { name, email, message, details } = contact;
  return createTransport(config.options).sendMail({
    from: { name: config.brand, address: config.fromEmail },
    to: config.toEmail,
    replyTo: { name, address: email },
    subject: `Konsultasi melalui website ${config.brand} - APPIC`,
    text: [
      `Nama: ${name}`,
      `Email: ${email}`,
      ...details.map(([label, value]) => `${label}: ${value}`),
      "",
      "Pesan:",
      message,
    ].join("\n"),
  });
}
