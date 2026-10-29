import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { images } from "@/lib/images";

const proofs = [
  { icon: "shield", title: "Aman & Stabil", text: "Sistem siap untuk event penting." },
  { icon: "monitor", title: "Live Multi-View", text: "Pantau beberapa area sekaligus." },
  { icon: "camera", title: "4 / 8 / 16 Channel", text: "Fleksibel mengikuti skala venue." },
] as const;

const events = ["Wedding", "Birthday", "Wisuda", "Seminar", "Gathering", "Turnamen"];

const reasons = [
  {
    icon: "shield",
    title: "Keamanan lebih terjaga",
    text: "Memantau pintu masuk, area utama, hingga jalur pergerakan tamu untuk meminimalkan blind spot selama acara berlangsung.",
  },
  {
    icon: "camera",
    title: "Dokumentasi visual yang rapi",
    text: "Momen penting, aktivitas panggung, dan interaksi tamu dapat terekam sebagai arsip pendukung evaluasi maupun kebutuhan klien.",
  },
  {
    icon: "wifi",
    title: "Monitoring real-time",
    text: "Penyelenggara dapat melihat kondisi acara secara langsung melalui monitor kontrol ataupun perangkat mobile tanpa harus selalu berada di lokasi inti.",
  },
] as const;

const shortcuts = [
  {
    href: "/paket",
    icon: "grid",
    title: "Paket Rental",
    text: "Bandingkan paket 4, 8, dan 16 channel untuk skala acara yang berbeda.",
    note: "Klik untuk melihat detail paket →",
  },
  {
    href: "/produk",
    icon: "box",
    title: "Produk & Perangkat",
    text: "Lihat komponen utama seperti panel box, kamera, monitor, dan sistem portable.",
    note: "Klik untuk melihat produk →",
  },
  {
    href: "/solusi-event",
    icon: "event",
    title: "Solusi Event",
    text: "Temukan penerapan CCTV untuk wedding, birthday, wisuda, seminar, gathering, dan turnamen.",
    note: "Klik untuk melihat solusi event →",
  },
  {
    href: "/live-monitoring",
    icon: "mobile",
    title: "Live Monitoring",
    text: "Monitoring dari monitor operator hingga tablet atau smartphone untuk fleksibilitas tinggi.",
    note: "Klik untuk melihat live monitoring →",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="hero hero-editorial">
        <div className="hero-editorial-line"></div>
        <div className="container hero-editorial-grid">
          <div className="hero-editorial-copy">
            <div className="premium-label">
              <span className="premium-dot"></span> Rental CCTV for Exclusive Event
            </div>
            <h1>
              Kontrol penuh untuk setiap{" "}
              <span className="text-gold">momen yang tidak boleh terlewat.</span>
            </h1>
            <p>
              Moment View menghadirkan sistem rental CCTV portable untuk wedding, birthday, wisuda,
              seminar, gathering, dan turnamen. Dibangun untuk membantu penyelenggara melihat lebih
              banyak, merespons lebih cepat, dan menjaga acara tetap terkendali.
            </p>
            <div className="btn-row">
              <Link className="btn btn-primary btn-editorial" href="/kontak">
                <WhatsAppIcon variant="white" />
                <span>Konsultasi Event</span>
              </Link>
              <Link className="btn btn-light" href="/paket">
                <Icon name="grid" />
                <span>Lihat Pilihan Paket</span>
              </Link>
            </div>
            <div className="editorial-proof-grid">
              {proofs.map(({ icon, title, text }) => (
                <div className="editorial-proof" key={title}>
                  <Icon name={icon} />
                  <div>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-editorial-visual">
            <div className="editorial-image-card">
              <div className="editorial-card-top">
                <span>EVENT CONTROL</span>
                <span className="live-indicator">
                  <i></i> LIVE
                </span>
              </div>
              <Image
                {...images.home}
                alt="Monitoring event wedding oleh Moment View"
                draggable={false}
                fetchPriority="high"
                loading="eager"
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <div className="editorial-image-overlay"></div>
              <div className="editorial-floating editorial-floating-main">
                <small>Moment View System</small>
                <strong>Professional Event Monitoring</strong>
              </div>
              <div className="editorial-floating editorial-floating-side">
                <small>Coverage</small>
                <strong>Multi Area</strong>
              </div>
            </div>
            <div className="editorial-index">MV / 01</div>
          </div>
        </div>
        <div className="container hero-client-strip">
          {events.map((event, index) => (
            <Fragment key={event}>
              {index > 0 && <i></i>}
              <span>{event}</span>
            </Fragment>
          ))}
        </div>
      </section>
      <section className="page-section">
        <div className="container">
          <SectionHeading eyebrow="Why CCTV Matters" title="Mengapa event penting membutuhkan CCTV?">
            Pada acara premium, momen sekali seumur hidup dan pergerakan tamu harus terdokumentasi
            dengan baik. CCTV membantu memastikan keamanan, monitoring operasional, dan kualitas
            pelayanan tetap optimal.
          </SectionHeading>
          <div className="grid-3">
            {reasons.map(({ icon, title, text }) => (
              <Card icon={icon} key={title} title={title}>
                {text}
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="page-section" style={{ background: "var(--ice)" }}>
        <div className="container">
          <SectionHeading eyebrow="Quick Navigation" title="Jelajahi layanan Moment View">
            Setiap halaman dirancang untuk membantu Anda memahami pilihan paket, perangkat,
            penerapan di berbagai event, dan proses layanan kami.
          </SectionHeading>
          <div className="grid-4">
            {shortcuts.map(({ href, icon, title, text, note }) => (
              <Card href={href} icon={icon} key={href} note={note} title={title}>
                {text}
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
