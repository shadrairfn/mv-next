import Image from "next/image";
import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { images } from "@/lib/images";

const packages = [
  {
    image: images.paket4,
    alt: "Paket 4 Channel Moment View",
    eyebrow: "Paket 4 Channel",
    title: "Ideal untuk event intimate & eksklusif",
    text: "Cocok untuk ulang tahun, private gathering, small wedding, atau event indoor dengan area monitoring yang tidak terlalu luas namun tetap membutuhkan kualitas tampilan yang rapi dan profesional.",
    points: [
      "1 panel box custom + 4 kamera CCTV.",
      "Fokus pada panggung, entrance, area tamu, dan satu area pendukung.",
      "Instalasi cepat dengan tampilan perangkat yang bersih dan elegan.",
    ],
  },
  {
    image: images.paket8,
    alt: "Paket 8 Channel Moment View",
    eyebrow: "Paket 8 Channel",
    title: "Solusi seimbang untuk event menengah",
    text: "Pilihan tepat untuk wedding lebih besar, seminar, wisuda, atau corporate event yang membutuhkan cakupan area lebih luas namun tetap efisien secara setup dan operasional.",
    points: [
      "1 panel box custom + 8 kamera CCTV.",
      "Cakupan lebih merata untuk area masuk, panggung, audience, backstage, dan area service.",
      "Memberikan ruang monitoring yang lebih komprehensif saat acara berlangsung.",
    ],
  },
  {
    image: images.paket16,
    alt: "Paket 16 Channel Moment View",
    eyebrow: "Paket 16 Channel",
    title: "Untuk event besar dengan banyak titik pantau",
    text: "Direkomendasikan untuk acara skala besar, multi-room, atau venue luas yang memerlukan pengawasan lebih detail demi mendukung keamanan dan koordinasi penyelenggara.",
    points: [
      "1 panel box custom + 16 kamera CCTV.",
      "Monitoring mencakup banyak area penting secara simultan.",
      "Sangat ideal untuk acara besar yang menuntut kontrol operasional lebih kuat.",
    ],
  },
];

const comparison = [
  {
    name: "4 Channel",
    for: "Birthday, private event, intimate wedding",
    strength: "Ringkas, ekonomis, tetap premium",
    coverage: "Panggung, pintu masuk, area tamu, area pendukung",
  },
  {
    name: "8 Channel",
    for: "Wedding menengah, seminar, wisuda",
    strength: "Lebih fleksibel untuk beberapa area sekaligus",
    coverage: "Area utama, audience, entrance, backstage, service area",
  },
  {
    name: "16 Channel",
    for: "Event besar, venue luas, multi-area",
    strength: "Kontrol operasional lebih detail dan menyeluruh",
    coverage: "Banyak titik strategis dalam satu venue",
  },
];

export default function PaketPage() {
  return (
    <>
      <section className="page-header header-variant-a">
        <div className="container">
          <div className="header-panel">
            <div>
              <div className="eyebrow">Pilihan Paket</div>
              <h1>
                Paket fleksibel untuk <span className="text-gold">setiap skala event.</span>
              </h1>
              <p>
                Mulai dari kebutuhan event intimate hingga acara besar multi-area, Moment View
                menyediakan beberapa paket channel dengan konfigurasi yang praktis dan tampilan
                premium.
              </p>
              <div className="accent-bar"></div>
            </div>
            <div className="header-side">
              <div className="kicker">
                <Icon name="shield" />
                Aman • Rapi • Siap Pakai
              </div>
              <p style={{ marginTop: 16 }}>
                Setiap paket mengutamakan instalasi yang rapi, kualitas tampilan yang jernih, serta
                panel box custom yang mudah dipindahkan dan cepat digunakan di venue event.
              </p>
              <div className="pill-grid">
                <span className="pill">Panel Box Custom</span>
                <span className="pill">Kamera CCTV</span>
                <span className="pill">Output Monitor</span>
                <span className="pill">Desain Portable</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="container package-list">
          {packages.map(({ image, alt, eyebrow, title, text, points }) => (
            <article className="package-item" key={eyebrow}>
              <div className="package-media media-frame">
                <Image {...image} alt={alt} draggable={false} sizes="(max-width: 900px) 100vw, 50vw" />
              </div>
              <div className="package-copy">
                <div className="eyebrow">{eyebrow}</div>
                <h3>{title}</h3>
                <p>{text}</p>
                <ul className="list">
                  {points.map((point) => (
                    <li key={point}>
                      <Icon name="check" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="page-section" style={{ background: "var(--ice)" }}>
        <div className="container">
          <SectionHeading eyebrow="Perbandingan Paket" title="Pilih paket yang paling sesuai">
            Skala event, jumlah area pantau, dan kompleksitas venue akan menentukan kebutuhan
            channel yang paling tepat.
          </SectionHeading>
          <div className="compare-table">
            <table>
              <thead>
                <tr>
                  <th>Paket</th>
                  <th>Direkomendasikan untuk</th>
                  <th>Kelebihan Utama</th>
                  <th>Cakupan Umum</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(({ name, for: audience, strength, coverage }) => (
                  <tr key={name}>
                    <td>
                      <strong>{name}</strong>
                    </td>
                    <td>{audience}</td>
                    <td>{strength}</td>
                    <td>{coverage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
