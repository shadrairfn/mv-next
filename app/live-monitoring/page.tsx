import Image from "next/image";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { images } from "@/lib/images";

const benefits = [
  {
    icon: "mobile",
    title: "Lebih fleksibel",
    text: "Klien atau PIC acara dapat memantau kondisi venue tanpa harus terus berada di satu titik kontrol.",
  },
  {
    icon: "monitor",
    title: "Tampilan multi-view",
    text: "Beberapa area dapat dilihat sekaligus, membantu identifikasi situasi dengan lebih cepat dan efisien.",
  },
  {
    icon: "shield",
    title: "Pendukung koordinasi",
    text: "Sangat membantu ketika penyelenggara perlu mengawasi alur tamu, area panggung, atau area operasional lain secara bersamaan.",
  },
] as const;

const areas = [
  { name: "Area Utama", text: "Pantau aktivitas panggung atau area acara utama." },
  { name: "Entrance & Registrasi", text: "Memudahkan pengawasan arus masuk tamu." },
  { name: "Audience / Tamu", text: "Memastikan suasana area tamu tetap kondusif." },
  {
    name: "Area Pendukung",
    text: "Backstage, koridor, atau area teknis lain dapat ikut dipantau.",
  },
];

export default function LiveMonitoringPage() {
  return (
    <>
      <section className="page-header header-variant-a">
        <div className="container">
          <div className="header-panel">
            <div>
              <div className="eyebrow">Live Monitoring</div>
              <h1>
                Pantau event dari monitor operator hingga{" "}
                <span className="text-gold">perangkat mobile.</span>
              </h1>
              <p>
                Penyelenggara tidak harus selalu berada di area kontrol. Moment View memungkinkan
                pemantauan kondisi acara secara fleksibel melalui tampilan multi-view yang
                informatif.
              </p>
              <div className="ribbon-row">
                <div className="ribbon">
                  <Icon name="mobile" />
                  Tablet / Mobile View
                </div>
                <div className="ribbon">
                  <Icon name="monitor" />
                  Multi Screen Monitoring
                </div>
              </div>
            </div>
            <div className="media-frame">
              <Image
                {...images.monitoring}
                alt="Live monitoring event melalui tablet"
                draggable={false}
                fetchPriority="high"
                loading="eager"
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="container">
          <div className="grid-3">
            {benefits.map(({ icon, title, text }) => (
              <Card icon={icon} key={title} title={title}>
                {text}
              </Card>
            ))}
          </div>
          <div className="note-box" style={{ marginTop: 22 }}>
            <div className="section-heading" style={{ marginBottom: 12 }}>
              <div>
                <div className="eyebrow">Display Example</div>
                <h2 style={{ fontSize: "1.7rem" }}>Simulasi tampilan area monitoring</h2>
              </div>
            </div>
            <div className="video-wall">
              {areas.map(({ name, text }) => (
                <div className="video-thumb" key={name}>
                  <strong>{name}</strong>
                  <span style={{ color: "var(--muted)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
