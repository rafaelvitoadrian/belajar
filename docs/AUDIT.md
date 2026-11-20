# Audit fungsi aplikasi

Pemeriksaan menggunakan build produksi lokal, data uji pada konteks browser baru, Node.js 24 dan Chromium. Tabel berikut memetakan kebutuhan ke perilaku yang diperiksa.

| Fungsi | Pemeriksaan |
|---|---|
| Beranda, target, menit dan streak | E2E memeriksa perubahan progres dan pemuatan ulang. Unit test memeriksa persentase, hari terlewat, pergantian tanggal dan tujuh hari. Timer menghitung sesi belajar yang terlihat dan berhenti setelah dua menit tanpa interaksi. |
| Jalur dan pembaca | Pemuat memvalidasi sumber, teks, ID, jawaban dan struktur kurikulum. Uji browser membuka tahap pilihan dari Beranda dan menyelesaikan modul baru. |
| Kuis | Browser memilih jawaban salah, melihat penjelasan, menyelesaikan kuis, dan memulai pengulangan. Status selesai memerlukan baca dan kuis. |
| Bacaan dan hafalan | Browser memutar dan menjeda MP3 setelah jaringan dimatikan. Jadwal pengulangan bertahan setelah muat ulang. Unit test memeriksa kelima interval dan batas satu peningkatan per hari. |
| Kamus dan kartu | Pencarian diuji dengan huruf Arab tanpa harakat dan transliterasi tanpa aksen. Browser menandai favorit dan memindahkan kartu sulit ke akhir sesi. |
| Catatan dan pertanyaan | Browser menyimpan catatan per pelajaran, membuat pertanyaan, dan menandainya sudah dijawab. |
| Pencatat shalat | Browser mengaktifkannya melalui Pengaturan dan memeriksa centang Subuh bertahan setelah muat ulang. |
| Cadangan | Unit test mencakup data hari, hafalan, favorit, catatan, pertanyaan dan pengaturan. Browser mengunduh cadangan, menampilkan pratinjau, memulihkan data dan menolak JSON rusak. |
| PWA, navigasi dan aksesibilitas | Browser memuat ulang tanpa jaringan dan membuka pelajaran. Audit axe mencakup sembilan halaman. Tampilan 390 px diperiksa untuk luapan horizontal dan navigasi keyboard dalam drawer. |

## Perbaikan audit

- Pilihan tahap Beranda sekarang diteruskan melalui alamat halaman, misalnya `#path/6`. Membuka ulang alamat tersebut membuka tahap yang sesuai.
- Jumlah pelajaran tersedia, tombol baca kembali, dan jumlah soal dihitung dari konten. Menambah pelajaran tidak lagi membuat Beranda menganggap semua materi selesai setelah dua pelajaran.
- Uji browser sekarang memulai preview secara otomatis dan dapat memakai Chromium bawaan Playwright bila Chromium sistem tidak tersedia.
- Waktu yang dihabiskan pada latihan ingatan ikut tercatat pada aktivitas belajar.

## Cakupan yang perlu diperiksa manual

Penghitungan lanjutan hari diuji dengan tanggal simulasi. Instalasi dari menu Safari/iOS dan Android fisik, ketepatan bacaan menurut guru, pembaca layar nyata, serta akses domain setelah deployment perlu diperiksa pada perangkat tujuan. Sinkronisasi antarperangkat memakai ekspor/impor manual. Hasil audit lokal tidak memeriksa konfigurasi akun GitHub atau Cloudflare.

Pada 20 November 2026, 22 pengujian unit dan 6 skenario Playwright lulus. Pemeriksaan TypeScript serta build Vite/PWA berhasil. Untuk mengulang, jalankan perintah pada PENERBITAN.md dari checkout bersih.
