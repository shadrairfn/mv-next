import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { images } from "@/lib/images";

const steps = [
  {
    title: "Konsultasi kebutuhan",
    text: "Tentukan skala event, venue, dan area mana saja yang perlu dipantau.",
  },
  {
    title: "Rekomendasi paket",
    text: "Tim akan membantu memilih jumlah channel dan titik pemasangan yang sesuai.",
  },
  {
    title: "Setup di venue",
    text: "Perangkat dipasang dengan penataan rapi dan alur kerja yang efisien.",
  },
  {
    title: "Monitoring acara",
    text: "Sistem siap digunakan selama event berlangsung untuk membantu pengawasan.",
  },
];

const strengths = [
  {
    icon: "wrench",
    title: "Instalasi tertata",
    text: "Tim menata perangkat dan kabel dengan lebih rapi agar tetap selaras dengan standar event premium.",
  },
  {
    icon: "clock",
    title: "Respons cepat",
    text: "Persiapan dilakukan dengan efisien agar tidak mengganggu ritme persiapan venue maupun rundown acara.",
  },
  {
    icon: "shield",
    title: "Dukungan profesional",
    text: "Layanan berorientasi pada keamanan, kenyamanan, dan kualitas visual yang mendukung jalannya event.",
  },
] as const;

const faqs = [
  {
    question: "Apakah Moment View hanya cocok untuk event besar?",
    answer:
      "Tidak. Paket 4 channel dirancang untuk acara intimate seperti birthday atau private gathering, sedangkan paket 8 dan 16 channel lebih sesuai untuk venue yang lebih luas atau memiliki banyak area penting.",
  },
  {
    question: "Berapa lama proses pemasangan CCTV di venue?",
    answer:
      "Durasi pemasangan bergantung pada jumlah kamera, luas venue, akses jalur kabel, dan kesiapan lokasi. Survey atau informasi venue membantu tim menentukan estimasi setup dengan lebih akurat.",
  },
  {
    question: "Apakah hasil kamera dapat dipantau secara langsung?",
    answer:
      "Ya. Sistem dapat ditampilkan melalui monitor kontrol dan, sesuai konfigurasi event, dapat mendukung monitoring melalui perangkat mobile untuk memudahkan PIC atau penyelenggara.",
  },
  {
    question: "Bagaimana menentukan jumlah kamera yang dibutuhkan?",
    answer:
      "Jumlah kamera ditentukan berdasarkan area prioritas seperti panggung, entrance, area tamu, backstage, koridor, dan area parkir. Tim akan membantu memberikan rekomendasi paket berdasarkan layout venue.",
  },
  {
    question: "Apakah perangkat mengganggu tampilan dekorasi event?",
    answer:
      "Penempatan perangkat direncanakan agar tetap rapi dan minim mengganggu estetika venue. Panel box portable dan jalur instalasi disusun untuk menjaga tampilan area event tetap profesional.",
  },
  {
    question: "Kapan sebaiknya melakukan reservasi?",
    answer:
      "Reservasi sebaiknya dilakukan lebih awal setelah tanggal dan venue acara ditentukan, terutama untuk event besar atau tanggal dengan permintaan tinggi.",
  },
];

export default function TentangPage() {
  return (
    <>
      <section className="page-header header-variant-c">
        <div className="container">
          <div className="header-panel">
            <div className="media-frame" style={{ borderRadius: 0, minHeight: "100%" }}>
              <Image
                {...images.tentang}
                alt="Persiapan instalasi CCTV oleh tim Moment View"
                draggable={false}
                fetchPriority="high"
                loading="eager"
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
            <div className="header-copy">
              <div className="eyebrow">Tentang Moment View</div>
              <h1>
                Tim yang sigap, proses yang rapi, hasil yang{" "}
                <span className="text-gold">lebih meyakinkan.</span>
              </h1>
              <p>
                Moment View berfokus pada layanan rental CCTV untuk event dengan pendekatan yang
                profesional: tampilan perangkat bersih, instalasi efisien, monitoring jelas, dan
                dukungan operasional selama acara berlangsung.
              </p>
              <div className="accent-bar"></div>
            </div>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="container">
          <SectionHeading eyebrow="Cara Kerja" title="Alur layanan kami">
            Proses operasional dirancang agar mudah dipahami dan nyaman untuk penyelenggara event.
          </SectionHeading>
          <div className="workflow">
            {steps.map(({ title, text }, index) => (
              <div className="step" key={title}>
                <div className="step-no">{index + 1}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="page-section" style={{ background: "var(--ice)" }}>
        <div className="container grid-3">
          {strengths.map(({ icon, title, text }) => (
            <Card icon={icon} key={title} title={title}>
              {text}
            </Card>
          ))}
        </div>
      </section>
      <section className="page-section faq-section">
        <div className="container faq-layout">
          <div className="faq-intro">
            <div className="eyebrow">Pertanyaan Umum</div>
            <h2>Hal yang sering ditanyakan sebelum menggunakan Moment View</h2>
            <p>
              Kami merangkum beberapa pertanyaan umum untuk membantu Anda memahami kebutuhan teknis,
              proses instalasi, serta pilihan paket yang sesuai.
            </p>
            <Link className="btn btn-light faq-contact-btn" href="/kontak">
              Masih punya pertanyaan?
            </Link>
          </div>
          <div className="faq-list">
            {faqs.map(({ question, answer }, index) => (
              <details className="faq-item" key={question} open={index === 0 ? true : undefined}>
                <summary>
                  {question}
                  {index < faqs.length - 1 && <span></span>}
                </summary>
                <div className="faq-answer">
                  <p>{answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
