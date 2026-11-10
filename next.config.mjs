const basePath = '/dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Aktifkan mode static export (menghasilkan folder 'out')
  output: 'export',

  // 2. Base URL sub-path (misal: domain.com/dev)
  basePath: basePath,

  // 3. Wajib untuk static hosting Apache agar route /dev/kontak mencari kontak/index.html
  trailingSlash: true,

  // 4. Matikan optimasi gambar server-side (karena tidak ada Node.js server yang berjalan)
  images: {
    unoptimized: true,
  },

  // Menyediakan basePath untuk komponen sisi klien (agar src gambar statis otomatis mengarah ke /dev)
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
