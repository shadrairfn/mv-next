import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { contact } from "@/lib/site";

const events = ["Wedding", "Birthday", "Wisuda", "Seminar", "Gathering", "Turnamen"];

export default function KontakPage() {
  return (
    <>
      <section className="page-header header-variant-a">
        <div className="container">
          <div className="header-panel">
            <div>
              <div className="eyebrow">Hubungi Kami</div>
              <h1>
                Diskusikan kebutuhan event Anda bersama{" "}
                <span className="text-gold">Moment View.</span>
              </h1>
              <p>
                Kami siap membantu memberikan rekomendasi paket dan solusi monitoring yang paling
                sesuai dengan skala acara dan kebutuhan venue Anda.
              </p>
              <div className="btn-row">
                <a className="btn btn-primary" href={contact.whatsappUrl} rel="noreferrer" target="_blank">
                  <WhatsAppIcon variant="white" />
                  Chat WhatsApp
                </a>
                <a className="btn btn-light" href="#form-email">
                  <Icon name="mail" />
                  Kirim Email
                </a>
              </div>
            </div>
            <div className="note-box">
              <div className="kicker">
                <Icon name="check" />
                Respon lebih cepat untuk kebutuhan event
              </div>
              <p style={{ marginTop: 16 }}>
                Saat menghubungi kami, Anda bisa menyiapkan informasi seperti jenis event, tanggal
                acara, lokasi venue, estimasi area yang ingin dipantau, dan paket yang diminati.
              </p>
              <div className="pill-grid">
                {events.map((event) => (
                  <span className="pill" key={event}>
                    {event}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="container contact-grid">
          <div className="contact-card">
            <h2 style={{ fontSize: "1.7rem", marginBottom: 4 }}>Informasi Kontak</h2>
            <p style={{ marginBottom: 8 }}>Silakan hubungi kami melalui kanal berikut.</p>
            <a className="contact-item" href={contact.mailto}>
              <div className="icon-wrap">
                <Icon name="mail" />
              </div>
              <div>
                <strong>Email</strong>
                <span>{contact.email}</span>
              </div>
            </a>
            <div className="contact-item">
              <div className="icon-wrap">
                <WhatsAppIcon variant="blue" />
              </div>
              <div>
                <strong>WhatsApp</strong>
                <span>{contact.whatsappLabel}</span>
              </div>
            </div>
          </div>
          <div className="contact-card contact-flow-card" id="form-email">
            <div className="contact-flow-head">
              <div className="eyebrow">Form Konsultasi Cepat</div>
              <h2>Kirim kebutuhan event Anda</h2>
              <p>
                Isi form berikut untuk mengirim konsultasi melalui email. Tim kami akan membalas
                melalui alamat email yang Anda cantumkan.
              </p>
            </div>
            <div className="contact-form-panel">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
