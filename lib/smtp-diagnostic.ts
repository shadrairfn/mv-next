// Kept free of TypeScript-only runtime syntax so scripts/check-smtp.ts can import it with Node's type stripping.
const knownCodes = new Set([
  "EAUTH",
  "ECONNECTION",
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "ETIMEOUT",
  "EDNS",
  "ENOTFOUND",
  "ESOCKET",
  "ETLS",
  "EPROTOCOL",
  "EENVELOPE",
  "EMESSAGE",
  "CERT_HAS_EXPIRED",
  "DEPTH_ZERO_SELF_SIGNED_CERT",
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
  "ERR_TLS_CERT_ALTNAME_INVALID",
  "ERR_SSL_WRONG_VERSION_NUMBER",
]);

const hints: Record<string, string> = {
  EAUTH: "Autentikasi ditolak. Periksa username, password/app password dan izin SMTP akun.",
  ECONNREFUSED: "Koneksi ditolak. Periksa host, port dan firewall.",
  EDNS: "Host SMTP tidak dapat ditemukan. Periksa SMTP_HOST dan DNS.",
  ENOTFOUND: "Host SMTP tidak dapat ditemukan. Periksa SMTP_HOST dan DNS.",
  ETIMEDOUT: "Koneksi timeout. Periksa host, port, firewall dan pasangan enkripsi.",
  ETIMEOUT: "Koneksi timeout. Periksa host, port, firewall dan pasangan enkripsi.",
  ESOCKET: "Koneksi/socket TLS gagal. Periksa pasangan port dan enkripsi serta sertifikat.",
  ETLS: "TLS gagal. Periksa dukungan STARTTLS dan sertifikat SMTP.",
  EENVELOPE: "Pengirim atau penerima ditolak oleh SMTP. Periksa alamat dan izin provider.",
};

type SmtpError = { code?: unknown; responseCode?: unknown };

/** Reduces an SMTP error to a safe code, status and hint; never includes credentials or message content. */
export function smtpDiagnostic(error: SmtpError = {}) {
  const code = typeof error.code === "string" && knownCodes.has(error.code) ? error.code : "SMTP_ERROR";
  const responseCode = error.responseCode;
  return {
    code,
    ...(typeof responseCode === "number" && Number.isInteger(responseCode) && responseCode >= 400 && responseCode <= 599
      ? { responseCode }
      : {}),
    hint: hints[code] || "Periksa koneksi, sertifikat dan konfigurasi SMTP provider.",
  };
}
