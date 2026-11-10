# Panduan Konfigurasi Data Personel & Tautan Sistem ICLabs

File konfigurasi utama terletak di:
[`lib/config.js`](file:///home/ichwal/db-integration-iclabs/developer/lib/config.js)

File ini merupakan **Single Source of Truth (Pusat Data Tunggal)** untuk seluruh portfolio pengembang laboratorium ICLabs. Semua perubahan yang disimpan di file ini akan langsung ter-update di antarmuka web secara otomatis.

---

## 1. Konfigurasi Personel Tim (`teamConfig`)

Setiap personel didefinisikan sebagai objek JavaScript dengan struktur lengkap:

```javascript
{
  id: "ichwal",                             // Identifier unik (huruf kecil, tanpa spasi)
  name: "Ichwal",                           // Nama lengkap resmi
  nickname: "Ichwal",                       // Nama panggilan / label yang muncul di badge roster
  stambuk: "09320210xxx",                   // Nomor Stambuk / NIM mahasiswa
  email: "ichwal@students.umi.ac.id",       // Alamat email aktif (otomatis jadi link mailto:)
  role: "System Design & DevOps",           // Jabatan / peran utama di lab
  jobs: [                                   // Keahlian / spesialisasi pekerjaan (tampil sebagai chip tag)
    "Project Lead",
    "System Architect",
    "DevOps & Cloud",
    "Fullstack Developer"
  ],
  socials: {                                // Tautan akun media sosial
    github: "https://github.com/ichwal",
    instagram: "https://instagram.com/ichwal",
    linkedin: "https://linkedin.com/in/ichwal",
    twitter: "",
    website: "",
  },
  image: "/team/Ichwal.webp",               // Path berkas foto WebP di folder public/team/
  gender: "male",                           // "male" | "female"
  isLead: true,                             // true untuk Kapten/Lead (hanya 1 orang), false untuk lainnya
  row: 1,                                   // Baris di panggung (1 = Depan, 2 = Tengah, 3 = Belakang)
  rowPosition: 4,                           // Urutan posisi dari kiri ke kanan pada baris tersebut
}
```

### Formasi Tata Letak 3 Tingkat (Sesuai `docs/desain/layouts.png`)

| Baris / Layer | Total | Gender | Urutan Personel (Kiri ke Kanan) |
| :--- | :---: | :---: | :--- |
| **Row 3 (Belakang)** | 7 | Perempuan | `Firly` → `Farah` → `halima` → **`Thalita` (Pusat Belakang)** → `Siti Safira` → `Sitti Lutfia` → `Rizqi Ananda Jalil` |
| **Row 2 (Tengah)** | 8 | Laki-laki | `Scania` → `Andi Ahsan Ashuri` → `wanwan` → `Zaki` → `Aan Ms` → `Ikhlas` → `Rafly` → `daifan` |
| **Row 1 (Depan)** | 7 | Laki-laki | `Andi Rifqi Aunur Rahman 1` → `Raihan Nur Rizqillah` → `Fatwa` → **`Ichwal` (Lead / Pusat Depan)** → `Rizwan` → `Muhammad Nur Fuad` → `Nahwa` |

---

## 2. Konfigurasi Tautan & Modul Sistem (`systemsConfig`)

Untuk menambahkan tautan live portal, memperbarui deskripsi, atau menambah modul sistem:

```javascript
{
  id: "integration",                        // ID sistem unik
  label: "Integration",                     // Label nama sistem di tab bar atas
  number: "01",                             // Nomor urut sistem
  isCenterHighlighted: true,                // true jika menjadi sorotan utama di posisi tengah
  url: "https://integration.iclabs.fikom.umi.ac.id", // Tautan sistem aktif (jika kosong "", sistem ditandai 'Modul Internal API')
  active: true,                             // Status keaktifan sistem
  category: "THE CONNECTED CORE",           // Kategori / rumpun arsitektur
  title: "Satu ekosistem.\nSemua terhubung.", // Judul besar tampilan arsitektur
  description: "API pusat yang menghubungkan identitas...", // Ringkasan deskripsi
  features: [                               // Daftar fitur kunci
    "Identitas dan akses bersama",
    "Master akademik dan personel",
    "Penyimpanan berkas & audit",
  ],
  tech: ["Laravel 13", "PHP 8.3", "MySQL 8", "MinIO"], // Stack teknologi yang digunakan
  note: "Integrasi berlangsung per fitur...", // Catatan teknis integrasi
}
```

---

## 3. Konfigurasi Identitas Laboratorium (`labConfig`)

```javascript
export const labConfig = {
  name: "ICLabs",
  fullName: "Integrated Computer Laboratory System",
  faculty: "Fakultas Ilmu Komputer",
  university: "Universitas Muslim Indonesia",
  location: "Makassar, Sulawesi Selatan · WITA",
  season: "2026",
  headline: "Developer By Iclabs",
  subheadline: "Satu visi. 22 personel di balik ekosistem digital laboratorium terintegrasi.",
  totalMembers: 22,
};
```

---

## Cara Melakukan Pembaruan Data
1. Buka file [`lib/config.js`](file:///home/ichwal/db-integration-iclabs/developer/lib/config.js).
2. Temukan objek personel atau sistem yang ingin diisi/diubah.
3. Masukkan data aktual (Stambuk, Email, URL Sistem, akun GitHub/LinkedIn).
4. Simpan file. Jalankan `npm run build` untuk memverifikasi atau jalankan `npm run dev` untuk melihat hasil langsung secara interaktif.
