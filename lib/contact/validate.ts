export const emailPattern =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;

// Control characters other than TAB, LF and CR.
const controlCharacters = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;

const detailFields = [
  ["eventName", "Jenis event"],
  ["date", "Tanggal"],
  ["location", "Lokasi"],
  ["company", "Perusahaan"],
  ["need", "Kebutuhan"],
] as const;

export class ValidationError extends Error {
  readonly status = 422;
}

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  /** Optional [label, value] pairs that were filled in. */
  details: [label: string, value: string][];
  /** The hidden `website` field was filled in, so the sender is most likely a bot. */
  spam: boolean;
};

/** Validates the JSON body of a contact request. Throws {@link ValidationError} on bad input. */
export function parseContactMessage(body: Record<string, unknown>): ContactMessage {
  const field = (key: string, max: number, required = false) => {
    const value = body[key] ?? "";
    if (
      typeof value !== "string" ||
      Buffer.byteLength(value) > max ||
      controlCharacters.test(value) ||
      (required && !value.trim())
    ) {
      throw new ValidationError("Periksa kembali isian form Anda.");
    }
    return value.trim();
  };

  const name = field("name", 200, true);
  const email = field("email", 254, true);
  if (!emailPattern.test(email) || /[\r\n]/.test(name)) {
    throw new ValidationError("Nama atau alamat email tidak valid.");
  }
  const message = field("message", 5000);
  const details = detailFields
    .map(([key, label]): [string, string] => [label, field(key, 300)])
    .filter(([, value]) => value);
  const spam = Boolean(field("website", 300));

  return { name, email, message, details, spam };
}
