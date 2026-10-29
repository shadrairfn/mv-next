import Image from "next/image";
import { Icon, type IconName } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { images } from "@/lib/images";

type Feature = { icon: IconName; title: string; text: string };

const leftColumn: Feature[] = [
  {
    icon: "box",
    title: "Panel Box Custom",
    text: "Rumah sistem utama yang ringkas, kokoh, dan mudah dibawa ke venue. Tampilan panel didesain bersih agar cocok untuk area event premium.",
  },
  {
    icon: "camera",
    title: "Kamera CCTV Event",
    text: "Kamera disiapkan untuk menangkap sudut penting acara dengan visual yang jernih, cocok untuk kebutuhan dokumentasi dan monitoring.",
  },
  {
    icon: "monitor",
    title: "Output Monitor",
    text: "Monitoring multi-view memudahkan operator dan penyelenggara memeriksa beberapa area sekaligus dari satu tampilan kontrol.",
  },
];

const rightColumn: Feature[] = [
  {
    icon: "wrench",
    title: "Instalasi Efisien",
    text: "Konfigurasi lapangan dibuat praktis sehingga tim dapat melakukan setup dengan cepat dan lebih minim gangguan terhadap jalannya persiapan acara.",
  },
  {
    icon: "wifi",
    title: "Koneksi Terintegrasi",
    text: "Mendukung sistem monitoring yang tertata rapi melalui kabel, monitor, dan perangkat pendukung lainnya sesuai kebutuhan event.",
  },
  {
    icon: "shield",
    title: "Tampilan Premium",
    text: "Setiap perangkat ditempatkan dengan penataan bersih dan profesional agar tetap selaras dengan estetika venue maupun area backstage.",
  },
];

function FeatureStack({ features }: { features: Feature[] }) {
  return (
    <div className="feature-stack">
      {features.map(({ icon, title, text }) => (
        <div className="feature-box" key={title}>
          <div className="icon-wrap">
            <Icon name={icon} />
          </div>
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProdukPage() {
  return (
    <>
      <section className="page-header header-variant-c">
        <div className="container">
          <div className="header-panel">
            <div className="header-copy">
              <div className="eyebrow">Produk &amp; Sistem</div>
              <h1>
                Perangkat ringkas dengan tampilan{" "}
                <span className="text-gold">mewah dan profesional.</span>
              </h1>
              <p>
                Setiap komponen dirancang agar mudah dibawa, cepat dipasang, dan tetap terlihat
                rapi ketika ditempatkan di area kontrol event.
              </p>
              <div className="ribbon-row">
                <div className="ribbon">
                  <Icon name="box" />
                  Portable system
                </div>
                <div className="ribbon">
                  <Icon name="hd" />
                  Visual jernih
                </div>
              </div>
            </div>
            <div className="media-frame" style={{ borderRadius: 0, minHeight: "100%" }}>
              <Image
                {...images.produk}
                alt="Panel box dan perlengkapan rental CCTV Moment View"
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
          <SectionHeading
            eyebrow="Komponen Utama"
            title="Sistem lengkap yang siap digunakan di berbagai venue"
          >
            Panel box, kamera, output monitor, instalasi, dan koneksi dirancang sebagai satu
            kesatuan agar setup event lebih cepat, rapi, dan profesional.
          </SectionHeading>
          <div className="product-layout">
            <FeatureStack features={leftColumn} />
            <FeatureStack features={rightColumn} />
          </div>
        </div>
      </section>
    </>
  );
}
