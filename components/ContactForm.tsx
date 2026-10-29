"use client";

import { useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";

const fallbackError = "Pesan belum dapat dikirim. Silakan coba lagi nanti atau gunakan WhatsApp.";

export function ContactForm() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  // State updates are async, so a ref is what actually blocks a double submit.
  const inFlight = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) || "");
    const payload = {
      name: value("name"),
      eventName: value("eventName"),
      date: value("date"),
      location: value("location"),
      message: value("message"),
      email: value("email"),
      website: value("website"),
    };

    inFlight.current = true;
    setSending(true);
    setStatus("Sedang mengirim pesan…");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw new Error(result?.message || fallbackError);
      setStatus(result.message);
      form.reset();
    } catch (error) {
      setStatus(
        error instanceof DOMException && error.name === "AbortError"
          ? "Status pengiriman belum dapat dipastikan. Tunggu sebelum mencoba lagi."
          : error instanceof TypeError
            ? "Koneksi terputus. Periksa koneksi sebelum mencoba lagi."
            : error instanceof Error
              ? error.message
              : fallbackError,
      );
    } finally {
      clearTimeout(timer);
      inFlight.current = false;
      setSending(false);
    }
  }

  return (
    <form aria-busy={sending || undefined} className="form-grid" onSubmit={submit}>
      <input
        aria-label="Email Anda untuk balasan"
        autoComplete="email"
        className="input"
        maxLength={254}
        name="email"
        placeholder="Email Anda untuk balasan"
        required
        type="email"
      />
      <div aria-hidden="true" hidden>
        <input autoComplete="off" name="website" tabIndex={-1} />
      </div>
      <p aria-live="polite" role="status" style={{ gridColumn: "1/-1" }}>
        {status}
      </p>
      <input className="input" name="name" placeholder="Nama Anda" required type="text" />
      <input className="input" name="eventName" placeholder="Jenis Event" required type="text" />
      <input className="input" name="date" placeholder="Tanggal Event" type="text" />
      <input className="input" name="location" placeholder="Lokasi Venue" type="text" />
      <textarea className="input" name="message" placeholder="Ceritakan kebutuhan Anda" rows={5} />
      <button className="btn btn-gold contact-submit" disabled={sending} type="submit">
        <Icon name="arrow" strokeWidth={1.9} />
        <span>Kirim Email</span>
      </button>
    </form>
  );
}
