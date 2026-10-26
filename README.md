# Belajar Islam

Aplikasi pribadi untuk pemula. Vue 3, Vite, TypeScript, Pinia, Tailwind, Dexie; tanpa backend. Seluruh data pribadi tersimpan di IndexedDB pada browser dan asal situs yang digunakan.

## Menjalankan

```sh
npm ci
npm run dev
npm run test
npm run build
npm run preview
```

Buka alamat yang dicetak Vite. Untuk PWA gunakan build produksi di HTTPS atau localhost.

## Tahap pengerjaan

1. Scaffold dan layout: `npm run build`. Periksa header putih, navigasi kiri, area utama dan kolom Hari Ini; pada layar kecil navigasi menjadi drawer. Angka pada commit ini masih dummy.

2. Konten dan jalur belajar: `npm test -- tests/content.test.ts` dan `npm run build`. Buka Jalur belajar, perluas tahap 1 dan 6, buka template Syahadat/Bismillah dan periksa sumber. Topik lain sengaja tidak dapat dibuka karena materinya belum ditulis.

3. Progres lokal: `npm test -- tests/progress.test.ts` dan `npm run build`. Buka pelajaran, tandai “Saya sudah membaca”, kembali ke Beranda, lalu muat ulang: checklist dan status baca tetap ada. Cincin progres hanya bertambah setelah baca DAN kuis selesai. Menit dihitung pada halaman pelajaran/latihan/bacaan saat tab terlihat, dengan jeda setelah dua menit tanpa interaksi; bukan dari estimasi durasi konten. Hari terlewat tidak mengurangi pelajaran selesai atau ritme terbaik. Grafik menampilkan tujuh hari terakhir menurut zona waktu perangkat. Jangan menilai progres dari angka dummy commit tahap 1.

4. Kuis, audio, dan hafalan: `npm test -- tests/spacedRepetition.test.ts` dan `npm run build`. Selesaikan tiga soal setelah menandai pelajaran dibaca; cek progres setelah muat ulang. Jawab salah, mulai sesi baru: soal tersebut muncul lebih dulu dan penjelasan bersumber selalu ditampilkan. Pada Bacaan dan audio, putar/jeda basmalah, tandai hafal, periksa tanggal pengulangan. Syahadat belum memiliki audio dan diberi keterangan jujur. Pengulangan 1/3/7/14/30 hari, satu peningkatan interval per hari; “Ulangi besok” mengatur ulang interval tanpa mengubah progres pelajaran.

5. Fitur pelengkap dan PWA: `npm test`, `npm run build`, lalu `npm run preview -- --port 4173`. Di terminal lain jalankan `npm run test:e2e`. Uji otomatis browser memakai Chromium dari `/usr/bin/chromium`; sesuaikan `executablePath` di `playwright.config.ts` atau jalankan `npx playwright install chromium` dan hapus opsi tersebut pada perangkat lain.

   Pengujian browser mencakup membaca + kuis hingga progres tersimpan setelah muat ulang, antrean soal salah, catatan dan pertanyaan, favorit, pencatat shalat yang dinyalakan dari Pengaturan, ekspor/impor, penolakan JSON rusak, audio dan pelajaran offline, drawer ponsel, serta pemeriksaan axe untuk WCAG A/AA di delapan halaman. Screenshot lokal dibuat ke `artifacts/` (tidak di-commit).

## Struktur kode

- `src/components/`: komponen UI, kartu bacaan, jalur, catatan, dan pencatat shalat.
- `src/views/`: Beranda, pembaca pelajaran, latihan, bacaan, kamus, catatan, dan pengaturan.
- `src/stores/`: state Pinia dan navigasi berbasis hash.
- `src/data/`: Dexie, skema state, validasi/pemuat konten, dan validasi cadangan.
- `src/lib/`: tanggal lokal, perhitungan progres/streak, timer aktif, pencarian dan spaced repetition.
- `content/`: JSON/Markdown dan MP3 yang dapat diedit serta ditinjau terpisah. Lihat `content/README.md`.
- `tests/`: unit test dan pengujian browser end-to-end.

## Perilaku data dan progres

Cincin keseluruhan memakai 18 topik rencana, bukan hanya dua template yang tersedia. Tiap tahap memiliki tiga topik. Topik tanpa konten tidak diberi progres palsu. Dua template dapat diselesaikan; perluasan materi selanjutnya akan mengisi ID rencana yang sudah tersedia. Pelajaran dihitung selesai setelah sudah dibaca DAN seluruh kuisnya dijawab, berapa pun skornya. Nilai terbaik disimpan; jawaban salah diulang di sesi berikutnya. Pengguna boleh melompat urutan materi tersedia.

State disimpan sebagai snapshot tervalidasi dalam satu transaksi Dexie. Penulisan berurutan mencegah snapshot lama menyusul snapshot baru. Impor memvalidasi versi, batas ukuran, tanggal, nilai, duplikasi, serta hubungan ID; pratinjau jumlah data ditampilkan sebelum penggantian. Penggantian ditulis dahulu secara atomik; kegagalan menulis tidak mengganti snapshot lama. Ekspor memuat data pribadi, tanpa konten pelajaran. Versi format cadangan saat ini adalah 1.

Data lokal terkait profil browser dan alamat situs. Gunakan satu tab aktif untuk mengedit progres; sinkronisasi konflik antar-tab dan antar-perangkat belum disediakan. Menghapus data browser, mengganti alamat aplikasi, atau mode privat dapat menghilangkan data. Ekspor/impor tersedia untuk memindahkan cadangan.

## PWA dan aksesibilitas

Build produksi menghasilkan manifest, ikon 192/512, dan service worker. Sajikan `dist/` menggunakan HTTPS (localhost diperbolehkan). Setelah pemuatan pertama dan service worker aktif, shell aplikasi, font, dua pelajaran, dan audio basmalah tersedia offline. Status “Siap offline” menandai kesiapan service worker. Tautan referensi memerlukan internet. Update ditawarkan melalui tombol; halaman tidak dipaksa memuat ulang saat menulis catatan. Pencatatan shalat bawaan nonaktif dan tidak memengaruhi progres/streak.

UI berbahasa Indonesia, teks Arab diberi `lang="ar"` dan RTL, fokus keyboard terlihat, drawer menahan fokus dan mendukung Escape, serta gerak berkurang mengikuti pengaturan perangkat. Audit axe otomatis membantu memeriksa WCAG A/AA; pemeriksaan pembaca layar dan pemasangan pada perangkat fisik tetap dapat dilakukan secara manual.

## Batas konten saat ini

Hanya Syahadat dan Bismillah yang lengkap sebagai template. Kedua contoh beserta Arab/transliterasinya berstatus **perlu ditinjau guru**, dan audio baru tersedia untuk basmalah. Aplikasi tidak mengeluarkan fatwa. Mengumpulkan sumber bukan pengganti tinjauan guru. Materi lain sengaja belum diisi agar tidak menampilkan isi agama yang direka.

## Hasil verifikasi implementasi

22 unit test lulus, build TypeScript/Vite/PWA lulus, dan 4 pengujian browser Chromium lulus. Audit axe pada delapan halaman tidak menemukan pelanggaran WCAG A/AA yang dicakup pemeriksaan otomatis, termasuk kontras teks. Skenario offline menguji muat ulang, pelajaran, pemutaran/jeda MP3, serta penyimpanan jadwal hafalan tanpa jaringan. Pemasangan di perangkat fisik dan tinjauan keagamaan oleh guru belum dilakukan.
