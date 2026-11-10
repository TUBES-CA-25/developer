/**
 * =============================================================================
 * ICLABS DEVELOPER COLLECTIVE — MASTER CONFIGURATION FILE
 * =============================================================================
 *
 * File ini adalah PUSAT KONFIGURASI TUNGGAL (Single Source of Truth) untuk:
 * 1. Data 22 Personel (Nama, Stambuk/NIM, Email, Peran/Role, Jobs, Sosial Media)
 * 2. Daftar & Tautan Sistem Terintegrasi (URL live, deskripsi, teknologi)
 * 3. Informasi Laboratorium & Identitas Brand
 *
 * PANDUAN PENGISIAN:
 * - Cukup ubah nilai string di dalam tanda kutip ("").
 * - Jika data belum ada, biarkan string kosong ("") atau array kosong ([]).
 * - Simpan file ini, maka halaman web akan otomatis terupdate.
 *
 * =============================================================================
 */

// =============================================================================
// 1. KONFIGURASI PERSONEL (22 ANGGOTA TIM)
// Susunan formasi mengikuti sketsa mockup: docs/desain/layouts.png
// - Baris Belakang (Row 3): 7 Personel Perempuan (Towering & terbesar)
// - Baris Tengah   (Row 2): 8 Personel Laki-laki (Ukuran sedang)
// - Baris Depan    (Row 1): 7 Personel Laki-laki dengan Lead (Ichwal) di tengah
// =============================================================================

export const teamConfig = [
  // ───────────────────────────────────────────────────────────────────────────
  // BARIS DEPAN (ROW 1) — 7 LAKI-LAKI (Urutan dari KIRI ke KANAN di mockup)
  // ───────────────────────────────────────────────────────────────────────────

  // [1/7 Depan - Kiri Luar] Rifky aunur di mockup
  {
    id: "andi-rifqi",
    name: "Andi Rifqi Aunur Rahman 1",
    nickname: "Rifky Aunur",
    stambuk: "", // Contoh: "09320210001"
    email: "",   // Contoh: "rifqi@students.umi.ac.id"
    role: "Developer",
    jobs: ["Frontend Developer", "Web System"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Andi Rifqi Aunur Rahman 1.webp",
    gender: "male",
    isLead: false,
    row: 1,
    rowPosition: 1, // Kiri paling luar baris 1
  },

  // [2/7 Depan - Kiri Tengah] Raihan di mockup
  {
    id: "raihan",
    name: "Raihan Nur Rizqillah",
    nickname: "Raihan",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Fullstack Developer", "Backend Engineer"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Raihan Nur Rizqillah.webp",
    gender: "male",
    isLead: false,
    row: 1,
    rowPosition: 2,
  },

  // [3/7 Depan - Kiri Dalam] fatwa di mockup
  {
    id: "fatwa",
    name: "Fatwa",
    nickname: "Fatwa",
    stambuk: "",
    email: "",
    role: "Full Stack Developer Peminjaman Laboratorium",
    jobs: ["Frontend Engineer", "Backend Developer"],
    socials: {
      github: "https://github.com/fattsowavy",
      instagram: "https://instagram.com/fatwafajriansyah",
      linkedin: "https://linkedin.com/in/fatwafajriansyah",
      twitter: "",
      website: "https://fattsowavy.my.id",
    },
    image: "/team/Fatwa.webp",
    gender: "male",
    isLead: false,
    row: 1,
    rowPosition: 3,
  },

  // [4/7 Depan - TENGAH / LEAD] Ichwal di mockup (Center Front Captain)
  {
    id: "ichwal",
    name: "Ichwal",
    nickname: "Ichwal",
    stambuk: "13020230049",
    email: "13020230049@students.umi.ac.id",
    role: "System Architect & DevOps",
    jobs: ["Project Lead", "System Architect", "DevOps & Cloud", "Fullstack Developer"],
    socials: {
      github: "https://github.com/ichwalM",
      instagram: "https://instagram.com/ichwal_mr",
      linkedin: "https://linkedin.com/in/ichwal",
      twitter: "",
      website: "https://ichwal.my.id",
    },
    image: "/team/Ichwal.webp",
    gender: "male",
    isLead: true, // Lead / Kapten — tampil natural tanpa efek khusus berlebihan
    row: 1,
    rowPosition: 4, // Tengah baris 1 (Pusat Formasi)
  },

  // [5/7 Depan - Kanan Dalam] Riswan di mockup
  {
    id: "rizwan",
    name: "Rizwan",
    nickname: "Riswan",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Backend Engineer", "API Specialist"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Rizwan.webp",
    gender: "male",
    isLead: false,
    row: 1,
    rowPosition: 5,
  },

  // [6/7 Depan - Kanan Tengah] fuad di mockup
  {
    id: "fuad",
    name: "Muhammad Nur Fuad",
    nickname: "Fuad",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["System Analyst", "Web Developer"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Muhammad Nur Fuad.webp",
    gender: "male",
    isLead: false,
    row: 1,
    rowPosition: 6,
  },

  // [7/7 Depan - Kanan Luar] nahwa di mockup
  {
    id: "nahwa",
    name: "Nahwa",
    nickname: "Nahwa",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Frontend Developer", "Quality Assurance"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Nahwa.webp",
    gender: "male",
    isLead: false,
    row: 1,
    rowPosition: 7, // Kanan paling luar baris 1
  },

  // ───────────────────────────────────────────────────────────────────────────
  // BARIS TENGAH (ROW 2) — 8 LAKI-LAKI (Urutan dari KIRI ke KANAN di mockup)
  // ───────────────────────────────────────────────────────────────────────────

  // [1/8 Tengah - Kiri Luar] Scania di mockup
  {
    id: "scania",
    name: "Scania",
    nickname: "Scania",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Web Developer", "System Support"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Scania.webp",
    gender: "male",
    isLead: false,
    row: 2,
    rowPosition: 1,
  },

  // [2/8 Tengah] Ahwan / Andi Ahsan di mockup
  {
    id: "andi-ahsan",
    name: "Andi Ahsan Ashuri",
    nickname: "Ahsan",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Frontend Engineer", "UI Developer"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Andi Ahsan Ashuri.webp",
    gender: "male",
    isLead: false,
    row: 2,
    rowPosition: 2,
  },

  // [3/8 Tengah] wawan di mockup
  {
    id: "wanwan",
    name: "wanwan",
    nickname: "Wawan",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Fullstack Developer", "Database Admin"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/wanwan.webp",
    gender: "male",
    isLead: false,
    row: 2,
    rowPosition: 3,
  },

  // [4/8 Tengah - Pusat Kiri] zaki di mockup
  {
    id: "zaki",
    name: "Zaki",
    nickname: "Zaki",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Backend Engineer", "Security Support"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Zaki.webp",
    gender: "male",
    isLead: false,
    row: 2,
    rowPosition: 4,
  },

  // [5/8 Tengah - Pusat Kanan] Aan di mockup
  {
    id: "aan",
    name: "Aan Ms",
    nickname: "Aan",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Web Developer", "DevOps Assistant"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Aan Ms.webp",
    gender: "male",
    isLead: false,
    row: 2,
    rowPosition: 5,
  },

  // [6/8 Tengah] ikhlas di mockup
  {
    id: "ikhlas",
    name: "Ikhlas",
    nickname: "Ikhlas",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Frontend Developer", "Interactive UI"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Ikhlas.webp",
    gender: "male",
    isLead: false,
    row: 2,
    rowPosition: 6,
  },

  // [7/8 Tengah] Rafli di mockup
  {
    id: "rafly",
    name: "Rafly",
    nickname: "Rafli",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Backend Developer", "Data Pipeline"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Rafly.webp",
    gender: "male",
    isLead: false,
    row: 2,
    rowPosition: 7,
  },

  // [8/8 Tengah - Kanan Luar] Daifan di mockup
  {
    id: "daifan",
    name: "daifan",
    nickname: "Daifan",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Mobile & Web Developer", "Support Engineer"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/daifan.webp",
    gender: "male",
    isLead: false,
    row: 2,
    rowPosition: 8,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // BARIS BELAKANG (ROW 3) — 7 PEREMPUAN (Urutan dari KIRI ke KANAN di mockup)
  // Semua personil perempuan berhijab berada di baris ini (Towering + Paling Besar)
  // ───────────────────────────────────────────────────────────────────────────

  // [1/7 Belakang - Kiri Luar] Firly di mockup
  {
    id: "firly",
    name: "Firly",
    nickname: "Firly",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Frontend Engineer", "UI/UX Researcher"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Firly.webp",
    gender: "female",
    isLead: false,
    row: 3,
    rowPosition: 1,
  },

  // [2/7 Belakang] Fara di mockup
  {
    id: "farah",
    name: "Farah",
    nickname: "Fara",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["System Analyst", "Database Engineer"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Farah.webp",
    gender: "female",
    isLead: false,
    row: 3,
    rowPosition: 2,
  },

  // [3/7 Belakang] Halima di mockup
  {
    id: "halima",
    name: "halima",
    nickname: "Halima",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Quality Assurance", "Web Developer"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/halima.webp",
    gender: "female",
    isLead: false,
    row: 3,
    rowPosition: 3,
  },

  // [4/7 Belakang - PUSAT TENGAH] Thalita di mockup (Center Back Queen)
  {
    id: "thalita",
    name: "Thalita",
    nickname: "Thalita",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Frontend Developer", "Design System"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Thalita.webp",
    gender: "female",
    isLead: false,
    row: 3,
    rowPosition: 4, // Pusat baris 3
  },

  // [5/7 Belakang] Safira di mockup
  {
    id: "siti-safira",
    name: "Siti Safira",
    nickname: "Safira",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Data Analyst", "Backend Engineer"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Siti Safira.webp",
    gender: "female",
    isLead: false,
    row: 3,
    rowPosition: 5,
  },

  // [6/7 Belakang] Lutfia di mockup
  {
    id: "sitti-lutfia",
    name: "Sitti Lutfia",
    nickname: "Lutfia",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["System Analyst", "UI/UX Designer"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Sitti Lutfia.webp",
    gender: "female",
    isLead: false,
    row: 3,
    rowPosition: 6,
  },

  // [7/7 Belakang - Kanan Luar] Rizki di mockup
  {
    id: "rizqi",
    name: "Rizqi Ananda Jalil",
    nickname: "Rizki",
    stambuk: "",
    email: "",
    role: "Developer",
    jobs: ["Fullstack Developer", "Documentation Lead"],
    socials: {
      github: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    image: "/team/Rizqi Ananda Jalil.webp",
    gender: "female",
    isLead: false,
    row: 3,
    rowPosition: 7,
  },
];

// =============================================================================
// 2. KONFIGURASI TAUTAN & MODUL SISTEM (12 SISTEM)
// Sesuai tata letak atas mockup: [sistem] [sistem] [INTEGRATION] [sistem] [sistem]
// =============================================================================

export const systemsConfig = [
  {
    id: "integration",
    label: "Integration",
    number: "01",
    isCenterHighlighted: true, // Sistem utama di tengah sesuai mockup layouts.png
    // Tautan sistem langsung (isi dengan URL live ketika tersedia):
    url: "https://integration.iclabs.fikom.umi.ac.id",
    active: true,
    category: "THE CONNECTED CORE",
    title: "Satu ekosistem.\nSemua terhubung.",
    description:
      "API pusat yang menghubungkan identitas, data, dan aktivitas seluruh portal laboratorium ICLabs.",
    features: [
      "Identitas dan akses bersama",
      "Master akademik dan personel",
      "Penyimpanan berkas & audit",
    ],
    tech: ["Laravel 13", "PHP 8.3", "MySQL 8", "MinIO"],
    note: "Integrasi berlangsung per fitur. Beberapa portal masih memiliki jalur legacy.",
  },
  {
    id: "sumber-daya",
    label: "Sumber Daya",
    number: "02",
    isCenterHighlighted: false,
    url: "https://sumberdaya.iclabs.fikom.umi.ac.id",
    active: true,
    category: "FACILITIES & PEOPLE",
    title: "Kenali ruang.\nTemukan potensinya.",
    description:
      "Portal informasi fasilitas, direktori personel, dan pengelolaan master laboratorium.",
    features: [
      "Profil & galeri laboratorium",
      "Direktori asisten dan struktur",
      "Jadwal praktikum publik",
    ],
    tech: ["PHP", "MVC", "Tailwind CSS", "REST API"],
    note: "Portal memiliki mode staging yang menggunakan API pusat.",
  },
  {
    id: "praktikum",
    label: "Praktikum",
    number: "03",
    isCenterHighlighted: false,
    url: "https://praktikum.iclabs.fikom.umi.ac.id",
    active: true,
    category: "ACADEMIC OPERATIONS",
    title: "Belajar terarah.\nProgres tercatat.",
    description:
      "Pengelolaan frekuensi, jadwal, peserta, presensi, dan penilaian praktikum dalam satu alur.",
    features: [
      "Impor & sinkron jadwal",
      "Roster dan penugasan asisten",
      "Verifikasi nilai oleh dosen",
    ],
    tech: ["PHP", "JavaScript", "MySQL", "REST API"],
    note: "Histori nilai dan presensi dipertahankan saat perpindahan peserta.",
  },
  {
    id: "monitoring",
    label: "Monitoring",
    number: "04",
    isCenterHighlighted: false,
    url: "https://monitoring.iclabs.fikom.umi.ac.id",
    active: true,
    category: "DAILY OPERATIONS",
    title: "Kehadiran nyata.\nKoordinasi bersama.",
    description:
      "Layanan kehadiran harian dan koordinasi aktivitas asisten laboratorium.",
    features: [
      "Presensi QR & dokumentasi",
      "Izin, logbook, dan rekap",
      "Kalender kegiatan asisten",
    ],
    tech: ["Laravel API", "MySQL", "Object Storage"],
    note: "Informasi fitur berdasarkan modul API pusat; tidak menyatakan seluruh frontend legacy telah dimigrasikan.",
  },
  {
    id: "reservasi",
    label: "Peminjaman Lab",
    number: "05",
    isCenterHighlighted: false,
    url: "https://pinjam.iclabs.fikom.umi.ac.id",
    active: true,
    category: "SPACE & SCHEDULE",
    title: "Ruang bersama.\nKesempatan baru.",
    description:
      "Reservasi fasilitas dengan pemeriksaan bentrok jadwal dan alur persetujuan sesuai jenis pemohon.",
    features: [
      "Kalender reservasi ruang",
      "Pengajuan internal & eksternal",
      "Proposal dan persetujuan admin",
    ],
    tech: ["Laravel API", "MySQL", "Email"],
    note: "Galeri fasilitas menggunakan data Sumber Daya; proposal disimpan secara privat.",
  },
  {
    id: "rekrutmen",
    label: "Rekrutmen",
    number: "06",
    isCenterHighlighted: false,
    url: "https://rekrutmen.iclabs.fikom.umi.ac.id",
    active: true,
    category: "THE NEXT GENERATION",
    title: "Talenta baru.\nCerita berikutnya.",
    description:
      "Layanan pendaftaran dan seleksi calon asisten dari pengajuan berkas hingga pengumuman hasil.",
    features: [
      "Periode & berkas pendaftaran",
      "Ujian, riset, dan penilaian",
      "Rekap keputusan seleksi",
    ],
    tech: ["Laravel API", "MySQL", "Object Storage"],
    note: "Modul API tersedia; status rilis frontend tidak disimpulkan dari ketersediaan endpoint.",
  },
  {
    id: "portal",
    label: "Portal ICLabs",
    number: "07",
    isCenterHighlighted: false,
    url: "https://iclabs.fikom.umi.ac.id",
    active: true,
    category: "ONE STARTING POINT",
    title: "Semua layanan.\nSatu pintu masuk.",
    description:
      "Landing page terpadu yang memperkenalkan layanan ICLabs dan mengarahkan pengunjung ke setiap sistem.",
    features: [
      "Navigasi layanan terpadu",
      "Kartu interaktif & animasi",
      "Identitas UMI, FIKOM, dan ICLabs",
    ],
    tech: ["React", "Vite", "Tailwind CSS", "GSAP"],
    note: "Portal presentasi layanan; autentikasi dikelola oleh masing-masing portal.",
  },
  {
    id: "inventaris",
    label: "Inventaris",
    number: "08",
    isCenterHighlighted: false,
    url: "",
    active: true,
    category: "ASSET MANAGEMENT",
    title: "Aset terkelola.\nOperasi terjaga.",
    description:
      "Modul API inventaris untuk pengelolaan barang dan kebutuhan operasional laboratorium.",
    features: [
      "Pengelolaan barang",
      "Permintaan barang",
      "Dokumen dan laporan inventaris",
    ],
    tech: ["Laravel API", "MySQL"],
    note: "Informasi bersumber dari controller Inventaris di API pusat.",
  },
  {
    id: "storage",
    label: "Object Storage",
    number: "09",
    isCenterHighlighted: false,
    url: "",
    active: true,
    category: "SHARED INFRASTRUCTURE",
    title: "Berkas tersimpan.\nLayanan terhubung.",
    description:
      "Infrastruktur penyimpanan objek bersama untuk mendukung berkas aplikasi ICLabs.",
    features: [
      "Bucket aplikasi berversi",
      "Identitas akses khusus API",
      "Jaringan privat untuk storage",
    ],
    tech: ["MinIO AIStor", "Docker Compose", "Tailscale"],
    note: "Bundle infrastruktur tersedia di repository; bukan portal publik.",
  },
  {
    id: "monitoring-praktikum",
    label: "Monitoring Praktikum",
    number: "10",
    isCenterHighlighted: false,
    url: "",
    active: true,
    category: "SERVICE DIRECTORY",
    title: "Aktivitas praktikum.\nDalam pantauan.",
    description:
      "Layanan pemantauan jadwal, kehadiran, dan pelaksanaan praktikum yang tercantum di portal ICLabs.",
    features: ["Jadwal praktikum", "Kehadiran peserta", "Pelaksanaan kegiatan"],
    tech: [],
    note: "Deskripsi berasal dari katalog portal. Kode implementasi dan teknologi layanan ini belum tersedia.",
  },
  {
    id: "administrasi",
    label: "Administrasi",
    number: "11",
    isCenterHighlighted: false,
    url: "",
    active: true,
    category: "SERVICE DIRECTORY",
    title: "Administrasi rapi.\nProses transparan.",
    description:
      "Layanan administrasi praktikum yang tercantum di katalog layanan ICLabs.",
    features: [
      "Tagihan dan pembayaran",
      "Verifikasi administrasi",
      "Bukti administrasi",
    ],
    tech: [],
    note: "Deskripsi berasal dari katalog portal; stack dan implementasi layanan belum diverifikasi.",
  },
  {
    id: "sertifikasi",
    label: "Certification",
    number: "12",
    isCenterHighlighted: false,
    url: "",
    active: true,
    category: "SERVICE DIRECTORY",
    title: "Kompetensi tumbuh.\nPotensi berkembang.",
    description:
      "FIKOM Certification Center tercantum sebagai platform pelatihan dan sertifikasi kompetensi di portal ICLabs.",
    features: ["Pelatihan kompetensi", "Sertifikasi"],
    tech: [],
    note: "Informasi terbatas pada katalog portal; kode implementasi layanan tidak tersedia.",
  },
];

// =============================================================================
// 3. KONFIGURASI UMUM LABORATORIUM (BRAND & META)
// =============================================================================

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
