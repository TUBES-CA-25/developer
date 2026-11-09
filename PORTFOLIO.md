# ICLabs Developer Portfolio

Halaman Next.js (React) + Tailwind CSS terpisah dari aplikasi utama. README.md asli dipertahankan sebagai dokumentasi Praktikum.

## Menjalankan

```sh
npm ci
npm run dev -- --port 3010
```

Buka http://localhost:3010. `npm run build` menghasilkan situs statis pada `out/`, yang bisa disajikan oleh static hosting. Tidak membutuhkan kredensial backend dan tidak mengubah database.

## Konten dan sumber

- `lib/projects.js`: metadata sistem; bersumber dari `../backend-iclabs/api/README.md`, controller Inventaris, `../backend-iclabs/minio/README.md`, `../sumber-daya-staging/README.md`, dan katalog `../apps/src/App.jsx`.
- API pusat, Sumber Daya, Praktikum, Monitoring Asisten, Peminjaman Lab, Rekrutmen, Inventaris, portal utama, dan object storage ditampilkan beserta cakupan implementasinya.
- Monitoring Praktikum, Administrasi, dan Certification Center tercantum di katalog portal. Stack layanan tidak ditebak karena implementasinya tidak ditemukan di checkout ini.
- `lib/team.js`: 22 nama sesuai nama berkas foto. Ichwal selalu menjadi karakter terdepan dan anggota pertama, dengan peran System Design & DevOps. Peran lain masih `Belum dicantumkan`, menunggu data dari pemilik.
- `public/team/`: turunan WebP terkompresi dari `aset-asisten-nowatermark/`; aset asli tetap utuh.
- `public/images/`: logo dari `../apps/src/assets/logos/` dan foto gedung dari `../sumber-daya-staging/public/images/`.
- Acuan komposisi: `markup.png`. Galeri karakter berlapis, navigasi sistem atas, identitas developer bawah.

## Struktur

`app/` berisi route, metadata, dan CSS responsif; `components/Portfolio.jsx` mengelola pilihan sistem dan anggota. Seluruh interaksi lokal tanpa panggilan API atau layanan eksternal. Reduced motion, fokus keyboard, nama aksesibel, dan tautan lewati konten tersedia.
