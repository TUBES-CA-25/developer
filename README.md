# Pindah Frekuensi, Urutan Stambuk, Pencarian Master

## Memperbarui instalasi sebelumnya
1. Cadangkan database dan folder aplikasi.
2. Import database/update-pindah-frekuensi.sql sekali melalui phpMyAdmin. Semua peserta lama tetap aktif secara default. Jangan import ulang schema.sql pada database yang sudah digunakan.
3. Salin api.php, app/transfer.php, app/bootstrap.php, app/classes.php, dan assets/app.js. Pertahankan config.php. Tekan Ctrl+F5.
4. Jika server berada di balik reverse proxy HTTPS, pertahankan konfigurasi public_origin sesuai alamat aplikasi Anda (lihat patch origin sebelumnya).

## Pindah frekuensi mahasiswa
Admin membuka Data Master → Master Frekuensi Praktikum → cari mahasiswa → Pindah frekuensi. Pilih jadwal asal dan tujuan, lalu isi alasan. Jadwal tujuan harus sudah dibuat, berbeda frekuensi, dan memiliki mata kuliah, tahun akademik, semester serta prodi yang sama. Kedua jadwal harus aktif dengan status Draft/Perlu Revisi. Jadwal dikunci/terverifikasi harus dibuka kembali melalui alur admin.

Keanggotaan frekuensi dipindahkan. Peserta pada jadwal asal yang dipilih dinonaktifkan; tujuan mendapat peserta baru. Nilai/absensi lama tidak dihapus atau disalin ke jadwal tujuan. Riwayat lama tetap di database dan tidak masuk daftar aktif, rekap, progres, ekspor atau Nilai Saya. Catatan perpindahan tersedia pada audit jadwal. Jadwal lain yang tidak dipilih tidak diubah.

Jika mahasiswa sudah memiliki keanggotaan frekuensi tujuan atau pernah memiliki peserta/riwayat pada jadwal tujuan, sistem menolak pemindahan agar tidak menggabungkan riwayat. Sinkron peserta tidak mengaktifkan kembali peserta lama yang telah dinonaktifkan.

## Urutan dan pencarian
Absensi, penilaian serta rekap memakai urutan stambuk numerik terkecil ke terbesar, dengan NIM asli tetap ditampilkan (termasuk nol di depan). Semua tabel master memiliki pencarian tanpa membedakan huruf besar/kecil. Hasil mencari isi kolom yang terlihat; nomor urut diperbarui sesuai hasil dan jumlah hasil ditampilkan. Periode aktif serta ambang nilai berbentuk form, bukan tabel.

Pengujian: 12 pemeriksaan pemindahan dan urutan lulus pada PHP 7.1.11/MariaDB XAMPP. Sintaks JavaScript dan PHP diperiksa. Paket tidak mengubah database operasional secara otomatis.

# Asisten 2 Opsional

Jadwal wajib memiliki Asisten 1; Asisten 2 boleh kosong. Form menyediakan pilihan Tidak ada (opsional). Pada import jadwal, kosongkan email asisten 2; header tersebut juga boleh tidak ada. Email Asisten 1 tetap wajib. Jika Asisten 2 diisi, akun harus aktif dengan role asisten dan berbeda dari Asisten 1. Email salah tetap ditolak, bukan diabaikan.

Pembaruan dari versi Role Asisten: cadangkan database, import database/update-asisten2-opsional.sql, lalu salin app/admin.php, app/bootstrap.php, dan assets/app.js. Pertahankan config.php. Tekan Ctrl+F5. Instalasi baru cukup memakai schema.sql terbaru.

# Role Asisten Terpadu

Role akun sekarang: admin, dosen, asisten, mahasiswa. Akun Asisten bisa dipilih sebagai Asisten 1 pada suatu jadwal dan Asisten 2 pada jadwal lainnya. Posisi tersebut tetap berbeda pada jadwal; orang yang sama tidak dapat mengisi kedua posisi sekaligus pada satu jadwal. Akses tetap dibatasi pada jadwal yang ditugaskan.

## Memperbarui versi sebelumnya
1. Cadangkan database dan file aplikasi.
2. Import database/update-role-asisten.sql pada database aplikasi di phpMyAdmin.
3. Salin seluruh folder app dan assets dari paket ini. Pertahankan config.php. Tekan Ctrl+F5 dan login ulang.

Migrasi mempertahankan ID akun, password, profil asisten, penugasan jadwal, nilai dan absensi. Catatan audit lama tetap menyimpan role historis. Instalasi baru cukup memakai schema.sql terbaru.

Import Akun Pengguna sekarang memakai nilai role `asisten`, bukan `asisten1` atau `asisten2`. Sesuaikan file Excel lama sebelum import.

# Import Akun Pengguna

Admin: Data Master → Akun Pengguna → Import Excel. Unduh template, isi nama/email/role/password/nim, lalu Periksa file dan Import akun. Maksimal 100 akun / 4 MB per XLSX, tanpa formula. Role: admin, dosen, asisten, mahasiswa. Password 12–72 byte; gunakan password awal berbeda untuk setiap pengguna. NIM harus ditulis sebagai teks, wajib untuk mahasiswa dan harus sudah terdaftar dengan nama yang sesuai. Kosongkan NIM untuk role staf.

Email atau NIM yang sudah mempunyai akun ditolak; import tidak menimpa akun lama. Satu kesalahan membatalkan seluruh file. Server memvalidasi ulang ketika menyimpan. Profil dosen/asisten dan relasi akun mahasiswa dibuat otomatis. Password disimpan sebagai hash bcrypt dan tidak masuk pratinjau atau audit.

Pembaruan dari versi Periode Aktif: salin api.php, app/admin.php, app/user_import.php, dan assets/app.js. Tidak ada perubahan database. Pertahankan config.php, lalu Ctrl+F5.

# Pembaruan Periode Semester Aktif

Admin: buka Data Master → Periode Semester Aktif. Pilih semester dan tahun akademik dari master, lalu tanggal mulai dan selesai. Klik Simpan periode aktif. Tiga kotak ringkasan tampil pada seluruh akun: Semester aktif, Tahun akademik, Periode pelaksanaan praktikum. Pengaturan ini tidak menghapus atau menyembunyikan jadwal/nilai lama. Sebelum diatur, ringkasan menampilkan Belum diatur.

Untuk memperbarui versi Master Frekuensi: cadangkan database, import database/update-periode-aktif.sql, lalu salin api.php, app/period.php, assets/app.js, dan assets/style.css. Pertahankan config.php. Tekan Ctrl+F5. Instalasi baru cukup memakai schema.sql terbaru.

# ICLabs Praktikum — Master Frekuensi

PHP native 7.1.11, PDO MySQL/MariaDB, XAMPP localhost. Tanpa Composer/Node/Python untuk menjalankan aplikasi.

## Pembaruan instalasi yang sudah digunakan

1. Cadangkan database dan folder aplikasi.
2. Pilih database aplikasi di phpMyAdmin. Jika belum pernah memasang pembaruan kolom frequency, import `database/update-frekuensi.sql` sekali terlebih dahulu. Lewati langkah ini jika kolom frequency sudah tersedia.
3. Import `database/update-master-frekuensi.sql` **sekali**. SQL ini memerlukan pembaruan frequency di langkah sebelumnya. Jangan import ulang schema.sql.
4. Salin `api.php`, seluruh folder `app`, `assets`, dan `database` dari paket ini ke folder aplikasi. Pertahankan config.php dan database yang sudah digunakan. Tekan Ctrl+F5 setelah membuka aplikasi.

SQL membuat master frekuensi dan keanggotaan banyak frekuensi per mahasiswa. Peserta, absensi, dan nilai historis tidak dihapus. Jadwal lama tanpa kode frekuensi mendapat kode LEGACY-ID. Tabel kelas lama tetap disimpan sebagai arsip relasi historis, tetapi tidak lagi tersedia sebagai master atau digunakan untuk sinkronisasi peserta baru.

## Cara penggunaan

- **Data Master → Master Frekuensi Praktikum** menampilkan No, NIM, Nama, Kelas, Frekuensi. Tersedia pencarian, tambah peserta, unduh template dan import XLSX.
- Pilih prodi saat menambah/import peserta. Kolom file: `nim`, `nama`, `kelas`, `frekuensi`. Gunakan NIM sebagai teks. Maksimal 4 MB / 2.000 baris, tanpa formula.
- Frekuensi baru dibuat otomatis saat tambah/import. **Daftar Frekuensi** juga dapat dipakai membuat kode kosong sebelum peserta diisi. Kode frekuensi unik dan terhubung ke prodi.
- NIM yang sama boleh muncul dalam beberapa frekuensi dengan nama/prodi yang sama. Duplikat pasangan NIM + frekuensi ditolak. Ketidaksesuaian identitas ditolak untuk mencegah data mahasiswa tertimpa. Satu kesalahan membatalkan seluruh import.
- Kelas hanya informasi peserta, bukan kelompok pembagi jadwal. Jadwal memilih program studi dan frekuensi, bukan kelas.
- Sesudah mengisi master anggota, buka jadwal dan klik **Sinkron peserta**. Sistem menambahkan anggota aktif dari frekuensi tersebut. Sinkronisasi berulang tidak menggandakan peserta dan tidak menghapus riwayat lama.
- Frekuensi yang sudah mempunyai anggota/jadwal tidak dapat diganti nama atau prodinya. Jadwal berpeserta tidak dapat dipindah frekuensi. Buat frekuensi/jadwal baru bila kelompoknya berbeda.
- Import jadwal memakai template baru dari aplikasi: tahun akademik, semester, prodi, kode mk, laboratorium, email dosen, email asisten 1, email asisten 2, hari, jam, aktif, frekuensi. Frekuensi harus sudah terdaftar. Kolom kelas tidak lagi digunakan.

## Instalasi baru

Ekstrak folder praktikum-iclabs ke C:\xampp\htdocs. Jalankan Apache dan MySQL. Buat database praktikum_fikom (utf8mb4_unicode_ci), import database/schema.sql, lalu sesuaikan config.php. Buka http://localhost/praktikum-iclabs/setup.php untuk membuat akun admin dengan password minimal 12 karakter. Untuk instalasi baru tidak perlu menjalankan kedua SQL update.

## Fitur lainnya

Login berlatar foto laboratorium, logo ICLabs, logout, akses mahasiswa hanya ke nilai sendiri, evaluasi/asistensi dinamis, maksimal 14 pertemuan, verifikasi/penguncian, dan laporan tetap tersedia. Admin membuat akun mahasiswa melalui Akun Pengguna dan menghubungkannya ke NIM. Nilai masing-masing praktikum disimpan terpisah per jadwal/peserta.

## Pengujian

Sebelas pemeriksaan frekuensi lulus pada PHP 7.1.11 dan MariaDB 10.1.28: relasi satu NIM ke beberapa frekuensi, identitas, duplikat, import jadwal, dan sinkronisasi. Migrasi diuji pada database terpisah: peserta historis tetap utuh dan keanggotaan terbentuk. Semua file PHP serta JavaScript lolos pemeriksaan sintaks. Pengujian CLI tests/frequency.php hanya untuk database test_ yang baru dibuat melalui tests/prepare.php; jangan gunakan database operasional.
