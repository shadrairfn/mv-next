import Image from "next/image";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { images } from "@/lib/images";

const events = [
  {
    icon: "event",
    title: "Wedding",
    text: "Memantau area panggung, entrance, meja tamu, dan area resepsi agar momen penting serta arus tamu tetap terkendali.",
  },
  {
    icon: "camera",
    title: "Birthday",
    text: "Cocok untuk acara ulang tahun eksklusif dengan fokus pada dekorasi utama, area tamu, serta aktivitas inti selama acara berlangsung.",
  },
  {
    icon: "monitor",
    title: "Wisuda",
    text: "Membantu pengawasan area stage, audience, dan entrance sehingga jalannya acara lebih tertib dan terdokumentasi.",
  },
  {
    icon: "grid",
    title: "Seminar & Corporate Event",
    text: "Memantau ruang presentasi, audience, dan area registrasi demi mendukung operasional acara yang lebih tertata.",
  },
  {
    icon: "mobile",
    title: "Gathering",
    text: "Memberikan fleksibilitas monitoring untuk area interaksi tamu, hospitality, dan aktivitas komunitas atau perusahaan.",
  },
  {
    icon: "shield",
    title: "Turnamen",
    text: "Sangat berguna untuk memantau area pertandingan, tribun penonton, jalur atlet, dan area teknis lain yang memerlukan pengawasan.",
  },
] as const;

export default function SolusiEventPage() {
  return (
    <>
      <section className="page-header header-variant-b">
        <div className="container">
          <div className="header-panel">
            <div className="header-pattern"></div>
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "grid",
                gridTemplateColumns: "1fr .9fr",
                gap: 24,
                alignItems: "center",
              }}
            >
              <div>
                <div className="eyebrow">Solusi Event</div>
                <h1>
                  Cocok untuk berbagai event{" "}
                  <span
                    className="text-gold"
                    style={{ WebkitTextFillColor: "unset", color: "var(--gold-2)", background: "none" }}
                  >
                    penting dan eksklusif.
                  </span>
                </h1>
                <p>
                  Dari acara keluarga yang intimate hingga event formal berskala besar, Moment View
                  membantu memastikan area penting tetap terpantau dengan baik.
                </p>
              </div>
              <div className="media-frame" style={{ borderColor: "rgba(255,255,255,.18)" }}>
                <Image
                  {...images.solusi}
                  alt="Solusi CCTV untuk berbagai event oleh Moment View"
                  draggable={false}
                  fetchPriority="high"
                  loading="eager"
                  sizes="(max-width: 900px) 100vw, 45vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="container event-grid">
          {events.map(({ icon, title, text }) => (
            <Card className="event-card" icon={icon} key={title} title={title}>
              {text}
            </Card>
          ))}
        </div>
      </section>
      <section className="page-section" style={{ background: "var(--ice)" }}>
        <div className="container">
          <SectionHeading eyebrow="Coverage Example" title="Contoh pemetaan area pantau">
            Pembagian coverage kamera membantu tim menentukan titik pengawasan yang tepat agar area
            prioritas tetap terlihat jelas selama event berlangsung.
          </SectionHeading>
          <div className="media-frame">
            <Image
              {...images.coverage}
              alt="Contoh area yang terpantau kamera untuk event ulang tahun"
              draggable={false}
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </div>
      </section>
    </>
  );
}
