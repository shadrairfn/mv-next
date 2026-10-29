# Moment View (Next.js)

Website company profile Moment View — rental CCTV untuk event. Ini adalah konversi dari situs statis HTML/CSS/JS + Express ([`shadrairfn/mv`](https://github.com/shadrairfn/mv)) ke Next.js (App Router, TypeScript).

## Struktur

```
app/
  layout.tsx, globals.css      layout root (Header, Footer, proteksi konten) dan CSS asli apa adanya
  page.tsx                     Beranda
  paket/ produk/ solusi-event/ live-monitoring/ tentang/ kontak/    satu halaman per rute (server component)
  api/contact/route.ts         POST /api/contact (pengganti server.js)
  manifest.ts, not-found.tsx, favicon.ico
components/                    Header (client), Footer, ContactForm (client), ProtectContent (client), Card, Icon, ...
lib/
  site.ts, images.ts           data situs (navigasi, kontak) dan ukuran gambar
  contact/                     validasi, rate limiter, IP klien, mailer, handler
  smtp-diagnostic.ts           ringkasan error SMTP yang aman dilog
scripts/check-smtp.ts          cek koneksi/login SMTP tanpa mengirim email
tests/                         Vitest
public/                        gambar (assets/images) dan ikon
```

Hanya `Header`, `ContactForm`, dan `ProtectContent` yang berjalan di browser; halaman lain dirender statis.

## Pengembangan

Butuh Node.js 22.18+ (Docker memakai Node 24).

```bash
npm ci
cp .env.example .env   # isi SMTP_*; untuk lokal set CONTACT_ALLOWED_ORIGINS=http://localhost:3000
npm run dev
```

Perintah lain: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

> Versi Next.js di repo ini memiliki perubahan API. Baca `node_modules/next/dist/docs/` sebelum mengubah konvensi Next (lihat `AGENTS.md`). Catatan: `cacheComponents` aktif, sehingga `export const runtime = ...` tidak boleh dipakai di route handler.

## Konfigurasi (`.env`)

| Variabel | Keterangan |
|---|---|
| `SMTP_HOST`, `SMTP_PORT` | Server SMTP; port default 587 |
| `SMTP_ENCRYPTION` | `tls` (STARTTLS, umumnya 587) atau `ssl` (SMTPS, umumnya 465) |
| `SMTP_USERNAME`, `SMTP_PASSWORD` | Kredensial SMTP (quote jika memuat `#` atau spasi) |
| `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME` | Pengirim; alamatnya harus diizinkan oleh provider |
| `CONTACT_TO_EMAIL` | Penerima tetap pesan kontak |
| `CONTACT_ALLOWED_ORIGINS` | Daftar origin (dipisah koma) yang boleh memanggil `/api/contact` |
| `TRUST_PROXY` | Opsional: IP/subnet reverse proxy tepercaya (juga `loopback`, `linklocal`, `uniquelocal`) |

Nama variabel sama dengan versi Express, jadi `.env` lama bisa dipakai. Detail SMTP dan diagnostik ada di [SMTP-SETUP.md](SMTP-SETUP.md).

## Deploy (Docker di VPS)

```bash
docker compose up -d --build
docker compose logs --tail=50 web
```

Container melayani seluruh website di port 3000; `compose.yaml` meneruskannya hanya ke `127.0.0.1:8080` di host. Arahkan reverse proxy domain ke `http://127.0.0.1:8080` (termasuk `/api/contact`) dan terminasi HTTPS di proxy. `.env` tidak masuk image; compose menyuntikkannya saat container berjalan.

Container berjalan sebagai user non-root dengan filesystem read-only; cache optimasi gambar Next.js ditaruh di `tmpfs`.

### Rate limit dan `TRUST_PROXY`

`/api/contact` dibatasi 5 permintaan per IP per 15 menit, disimpan di memori satu proses (reset saat restart, tidak dibagi antar replica). IP pengunjung dibaca dari `X-Forwarded-For`, mulai dari ujung kanan dan melewati proxy yang tercantum di `TRUST_PROXY`.

- Reverse proxy **harus menimpa** header `X-Forwarded-For` dari klien (misalnya `proxy_set_header X-Forwarded-For $remote_addr;` di nginx). Jangan expose port container langsung ke internet, karena klien bisa memalsukan header itu.
- Isi `TRUST_PROXY` hanya dengan IP/subnet proxy yang benar, bukan rentang yang luas.

## Perbedaan dengan situs lama

- URL tetap sama (`/paket`, `/kontak`, ...). Tautan lama `/index.html` dan `/<halaman>.html` dialihkan permanen (308) ke URL bersih.
- `styles.css` dipindah tanpa perubahan ke `app/globals.css`, ditambah satu aturan agar field form tetap bisa dipilih teksnya.
- Gambar disajikan lewat `next/image` (WebP otomatis, lazy load). File PNG sumber belum dikompres.
- Proteksi salin/klik kanan dipertahankan, kecuali di dalam field form (salin/potong/klik kanan/pilih teks boleh di sana).
- Mode preview berbasis hash (`data-preview`) dari `app.js` tidak dibawa; kode itu tidak aktif di produksi.
- Halaman 404 memakai layout situs; API tetap membalas JSON dengan kode status yang sama (400, 403, 405, 413, 415, 422, 429, 503).
- Tidak dibawa: `MomentView-WebV3.zip`, `.htaccess`, `favicon-test.html`, dan gambar yang tidak dipakai halaman mana pun.
