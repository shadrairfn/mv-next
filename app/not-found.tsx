import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">404</div>
            <h2>Halaman tidak ditemukan.</h2>
          </div>
          <p>Alamat yang Anda tuju tidak tersedia atau sudah dipindahkan.</p>
        </div>
        <div className="btn-row">
          <Link className="btn btn-primary" href="/">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </section>
  );
}
