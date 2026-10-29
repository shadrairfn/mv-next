# Form email (Next.js + Nodemailer)

Form kontak mengirim `POST /api/contact` (`app/api/contact/route.ts`), yang mengirim email lewat SMTP dengan Nodemailer. Tidak memerlukan PHP atau Composer.

## Lokal

```bash
npm ci
cp .env.example .env   # hanya jika belum punya .env
npm run dev
```

Buka http://localhost:3000/. Isi `CONTACT_ALLOWED_ORIGINS=http://localhost:3000` untuk lokal (tambahkan `http://127.0.0.1:3000` jika dipakai, dipisahkan koma). Restart server setelah mengubah `.env`.

Isi `SMTP_HOST`, `SMTP_PORT`, `SMTP_ENCRYPTION` (`tls` untuk STARTTLS, umumnya 587; `ssl` untuk SMTPS, umumnya 465), `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`. Pengirim harus diizinkan provider. `SMTP_FROM_NAME` adalah nama brand dan `CONTACT_TO_EMAIL` adalah penerima tetap. Quote password yang mengandung `#` atau spasi. Kredensial tidak dikirim ke browser. Pengunjung menjadi Reply-To.

## Docker di server

Buat `.env` di sebelah `compose.yaml` (jangan taruh di `public/`). Gunakan `CONTACT_ALLOWED_ORIGINS` untuk domain produksi dengan https (termasuk `www` jika digunakan).

```bash
docker compose up -d --build
docker compose logs --tail=50 web
```

Container melayani seluruh website (halaman, aset, API) pada port 3000; compose meneruskannya hanya ke `127.0.0.1:8080` di host. Arahkan reverse proxy domain ke `http://127.0.0.1:8080`, termasuk `/api/contact`. Jika proxy ada dalam container lain, hubungkan jaringan Docker bersama dan gunakan nama service serta port 3000; jangan memakai `localhost` antar-container. HTTPS diterminasi di reverse proxy.

Jika memakai proxy, isi `TRUST_PROXY` dengan IP/subnet proxy yang benar (dipisahkan koma) agar rate limit membaca IP pengunjung, dan pastikan proxy menimpa header `X-Forwarded-For` dari klien. Jangan isi dengan rentang luas. Tanpa konfigurasi ini, limit bisa dibagi semua pengunjung di balik proxy.

Deploy ulang dengan `docker compose up -d --build`.

## Verifikasi

`npm test` menguji validasi API, batas request, honeypot, rate limit, dan pengiriman lewat transport tiruan tanpa mengirim email asli. Untuk uji end-to-end, gunakan SMTP sandbox atau konfigurasi SMTP asli lalu kirim form. Pastikan inbox tujuan menerima pesan dan Reply mengarah ke pengunjung. Status sukses berarti SMTP menerima pesan, belum menjamin masuk inbox. Atur SPF/DKIM/DMARC di provider email.

Proteksi dasar: JSON maks 20 KB, validasi panjang/format, allowlist origin, honeypot, 5 percobaan/IP/15 menit. Limit disimpan di memori satu proses dan reset saat restart; untuk beberapa replica atau proteksi spam terdistribusi gunakan shared store/WAF/CAPTCHA. Log tidak memuat isi pesan atau kredensial. WhatsApp tetap tersedia sebagai alternatif.

Referensi SMTP: https://nodemailer.com/smtp

## Diagnostik tanpa mengirim email

```bash
npm run smtp:check
docker compose exec web node --no-warnings scripts/check-smtp.ts
```

Memeriksa koneksi, TLS, dan autentikasi, bukan izin From/penerima atau pengiriman ke inbox. Port 465 biasanya `SMTP_ENCRYPTION=ssl`; port 587 biasanya `tls`. Restart server setelah mengubah `.env`. Log hanya menampilkan kode/kategori error, bukan password atau respons mentah SMTP.
