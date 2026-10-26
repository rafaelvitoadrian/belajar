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
