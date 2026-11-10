export const architectureViews = [
  {
    id: "overview",
    label: "Peta integrasi",
    eyebrow: "01 / Cara sistem tersambung",
    title: "Satu inti kanonik, portal tetap mandiri.",
    description:
      "ICLabs memakai monolit modular: satu API Laravel mengelola domain bersama, sementara setiap portal mempertahankan UI dan adapter servernya sendiri.",
  },
  {
    id: "domains",
    label: "Domain & fitur",
    eyebrow: "02 / Layanan inti & modul ekosistem",
    title: "Lima domain inti, modul ekosistem bertahap.",
    description:
      "Setiap domain punya alur bisnis sendiri; identitas, master, transaksi bersama, audit, dan metadata berkas tetap berada pada pusat integrasi. Status migrasi tiap modul dibaca terpisah.",
  },
  {
    id: "security",
    label: "Keamanan",
    eyebrow: "03 / Batas akses dan data",
    title: "Token dan berkas tidak pernah menjadi urusan browser.",
    description:
      "Portal menyimpan sesi pengguna; adapter server berkomunikasi ke API pusat. Kebijakan akses diputuskan ulang di API pada setiap aksi sensitif.",
  },
  {
    id: "stack",
    label: "Tech stack",
    eyebrow: "04 / Fondasi implementasi",
    title: "PHP, Laravel, React, Next.js, dan layanan operasional.",
    description:
      "Teknologi dipilih per lapisan: core API dan portal PHP, hub React, portfolio Next.js, database kanonik, serta object storage S3-compatible.",
  },
];

export const architectureLayers = [
  {
    id: "clients",
    code: "01",
    label: "Pengguna & browser",
    summary: "Mahasiswa · Dosen · Asisten · Laboran · Admin · Publik",
    detail: "HTTPS, formulir, tabel, kamera/QR, dan sesi portal.",
  },
  {
    id: "portals",
    code: "02",
    label: "Portal & adapter server",
    summary: "Sumber Daya · Praktikum · Monitoring · Peminjaman · Pendaftaran",
    detail: "Sesi portal dan adapter server-to-server; bukan koneksi DB langsung dari portal.",
  },
  {
    id: "api",
    code: "03",
    label: "API pusat ICLabs",
    summary: "Laravel 13 · PHP 8.3 · /api/v1",
    detail: "Monolit modular untuk autentikasi, RBAC, validasi bisnis, transaksi, audit, dan orkestrasi berkas.",
    featured: true,
  },
  {
    id: "data",
    code: "04",
    label: "Data & pekerjaan latar",
    summary: "MySQL 8 · AIStor/MinIO · Email · Scheduler",
    detail: "MySQL menyimpan data kanonik dan metadata; AIStor menyimpan byte objek; scheduler menjalankan pekerjaan terjadwal.",
  },
];

export const architectureIntegrations = [
  {
    label: "Google Sheets publik",
    detail: "Sumber impor jadwal Praktikum: pratinjau dan pencocokan master dilakukan sebelum admin mengonfirmasi simpan.",
  },
  {
    label: "9Router · opsional",
    detail: "Hanya membantu rekomendasi kandidat pada pratinjau; keputusan akhir dan pencocokan manual tetap di tangan admin.",
  },
  {
    label: "Email & notifikasi",
    detail: "Aktivasi/reset sandi dan notifikasi domain dijalankan dari layanan pusat sesuai konfigurasi yang diaktifkan.",
  },
];

export const domainCapabilities = [
  {
    id: "sumber-daya",
    code: "SD",
    title: "Sumber Daya",
    role: "Katalog publik & master bersama",
    features: ["Laboratorium, fasilitas, galeri, dan jadwal publik", "Profil, struktur, Asisten/Dosen, dan referensi master", "Impor tervalidasi dengan pratinjau konflik"],
  },
  {
    id: "praktikum",
    code: "PK",
    title: "ICLabs Praktikum",
    role: "Frekuensi, roster, presensi, nilai",
    features: ["Periode, jadwal, dan sinkronisasi Sheet dengan pratinjau", "Penugasan Asisten 1/2/Pendamping serta pengecekan bentrok", "Presensi, penilaian, pengajuan Dosen, verifikasi, dan histori"],
  },
  {
    id: "monitoring",
    code: "MA",
    title: "Monitoring Asisten",
    role: "Kehadiran harian & koordinasi",
    features: ["QR TV dinamis, dokumentasi, check-in/out, dan auto-pulang", "Izin, logbook, ringkasan, dan kalender kegiatan gabungan", "Dashboard Asisten dan pengelolaan sesuai scope Laboran"],
  },
  {
    id: "peminjaman",
    code: "PL",
    title: "Peminjaman Lab",
    role: "Reservasi, konflik, persetujuan",
    features: ["Ketersediaan ruang dan fasilitas dari identitas pusat", "Booking internal, eksternal dengan proposal privat, dan antrean", "Pemeriksaan ulang bentrok ketika keputusan admin dibuat"],
  },
  {
    id: "pendaftaran",
    code: "PA",
    title: "Pendaftaran Asisten",
    role: "Rekrutmen & seleksi bertahap",
    features: ["Pendaftaran, verifikasi berkas, seleksi, dan keputusan", "Dokumentasi arsitektur mencatat CBT bertoken waktu, riset, dan rubrik presentasi", "Target adapter PHP MVC tanpa database lokal; kontrak/UAT berjalan per tahapan"],
  },
  {
    id: "portal-hub",
    code: "PH",
    title: "Portal Hub ICLabs",
    role: "Gerbang informasi & navigasi",
    features: ["Katalog layanan dan informasi publik ICLabs", "Navigasi ke portal mandiri di dalam ekosistem", "React 19 SPA; autentikasi tetap dikelola setiap portal"],
  },
  {
    id: "inventaris",
    code: "INV",
    title: "Inventaris & Aset",
    role: "Aset, pemeliharaan, QR",
    features: ["Dokumentasi arsitektur mencatat aset, spesifikasi, pemeliharaan, tiket, dan peminjaman inventaris", "Dirancang sebagai PHP MVC dengan atribut EAV terkontrol", "Integrasi API inventaris belum tersedia penuh; pemilik data/kontrak masih perlu ditetapkan"],
  },
  {
    id: "sipemla",
    code: "FIN",
    title: "SIPEMLA & Keuangan",
    role: "Billing & jurnal lab",
    features: ["Tarif kegiatan, tagihan mahasiswa, dan alokasi pembayaran Praktikum", "Bukti bayar serta pembukuan jurnal keuangan laboratorium", "Dokumentasi arsitektur mencatat PHP MVC dengan transaction journal ledger"],
  },
  {
    id: "sertifikasi",
    code: "FCC",
    title: "Certification Center",
    role: "Pelatihan & sertifikasi",
    features: ["Pendaftaran pelatihan IT dan ujian kompetensi", "Penerbitan sertifikat digital", "Dokumentasi arsitektur mencatatnya sebagai Laravel sub-app berbasis PHP 8.3"],
  },
  {
    id: "shared",
    code: "SSOT",
    title: "Layanan bersama",
    role: "Identitas, master, berkas, audit",
    features: ["Akun/role, profil, master akademik, ruang, dan laboratorium", "Metadata berkas, checksum, pemetaan legacy, dan batch import", "Versi optimistik, transaksi atomik yang didukung, dan jejak audit"],
    featured: true,
  },
];

export const securityControls = [
  {
    code: "01",
    title: "Sesi portal, token di server",
    description: "Browser berinteraksi dengan portal melalui HTTPS. Bearer token pusat dipakai adapter server-to-server dan tidak dikirim ke JavaScript, URL, source, atau local storage.",
  },
  {
    code: "02",
    title: "RBAC + cakupan laboratorium",
    description: "API memeriksa akun aktif, role/izin, kepemilikan, status workflow, serta scope Laboran pada lab yang relevan. UI tidak dapat menggantikan policy API.",
  },
  {
    code: "03",
    title: "Mutasi dapat ditelusuri",
    description: "Perubahan penting diaudit. Endpoint berversi menolak data usang dengan 409; transaksi dan request/correlation ID mendukung pelacakan tanpa menyimpan bearer token.",
  },
  {
    code: "04",
    title: "Berkas lewat policy API",
    description: "MySQL menyimpan metadata, AIStor menyimpan byte. Controller memeriksa policy lalu men-stream berkas; object key, URL bucket, serta presigned URL tidak dibuka ke browser.",
  },
  {
    code: "05",
    title: "Akses storage paling minimum",
    description: "Identitas iclabs-api hanya mengakses bucket aplikasi privat/publik; archive dan pengaturan server tidak tersedia untuk aplikasi. API/console AIStor berada pada jaringan Tailscale.",
  },
  {
    code: "06",
    title: "Operasi aman secara default",
    description: "Aktivasi/reset memakai token sekali pakai; pergantian kata sandi mencabut sesi/token lama. Login/media publik dapat dibatasi lajunya; secret berada di .env/secret store, bukan Git atau log.",
  },
];

export const securityCaveats = [
  "AIStor Free tidak menyediakan enkripsi-at-rest server-side; kerahasiaan tetap bergantung pada policy API, kredensial minimum, jaringan Tailscale, dan backup terenkripsi.",
  "AIStor satu node bukan pengganti backup. Backup off-host dan uji pemulihan perlu disahkan sebelum menjadi satu-satunya salinan berkas penting.",
  "Migrasi portal dilakukan per fitur. Endpoint yang tersedia tidak otomatis membuktikan semua alur legacy sudah berhenti memakai database lokal.",
];

export const stackGroups = [
  {
    layer: "Core & API",
    technologies: ["Laravel 13", "PHP 8.3", "Laravel Sanctum", "Composer", "REST v1", "Flysystem AWS S3 v3"],
    note: "Monolit modular: autentikasi, otorisasi, validasi, audit, dan file orchestration.",
  },
  {
    layer: "Data & object storage",
    technologies: ["MySQL 8", "InnoDB", "AIStor / MinIO", "S3-compatible", "Docker Compose", "Tailscale"],
    note: "MySQL untuk data/metadata kanonik; AIStor untuk byte objek yang dipisah privat/publik/archive.",
  },
  {
    layer: "Portal & adapter",
    technologies: ["PHP MVC", "Native PHP", "cURL HTTPS", "Tailwind CSS", "Bootstrap", "Vanilla JavaScript"],
    note: "Portal menyimpan sesi dan memanggil API dari server; status migrasi bergantung fitur dan UAT masing-masing.",
  },
  {
    layer: "Hub & frontend modern",
    technologies: ["React 19", "Vite 8", "Tailwind CSS", "GSAP 3", "Next.js 16"],
    note: "React/Vite untuk portal hub; Next.js/Tailwind 4 untuk portfolio developer ini.",
  },
  {
    layer: "Infrastruktur & integrasi",
    technologies: ["Apache 2.4", "mod_rewrite", "mod_ssl", "PHP-FPM 8.2/8.3", "Google Sheets", "Email", "Scheduler", "9Router opsional"],
    note: "Routing/SSL di Apache; Sheet dan 9Router hanya digunakan sesuai alur dan konfigurasi domain.",
  },
];
