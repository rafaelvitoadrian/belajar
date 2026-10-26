# Menambah dan meninjau materi

Folder ini merupakan sumber konten, terpisah dari kode UI. Materi contoh belum diverifikasi guru. Pengumpulan rujukan dan pemeriksaan teknis tidak berarti tinjauan keagamaan selesai.

- `curriculum.json`: enam tahap; `topics` dan `lessonIds` berpasangan berdasarkan posisi. ID rencana tetap stabil untuk penyimpanan progres. Materi yang belum ditulis terlihat sebagai “Materi disiapkan”.
- `lessons/<id>.json`: metadata, estimasi 5–10 menit (termasuk latihan/refleksi), istilah, 3–5 soal, dan `sumber`.
- `lessons/<id>.md`: penjelasan dan latihan membaca. Markdown disanitasi sebelum ditampilkan.
- `readings.json`: bacaan Arab, transliterasi, arti, sumber, dan metadata audio lokal.
- `audio/`: berkas MP3. Build menyalinnya ke `/content/audio`; PWA menyimpannya untuk offline.

## Template dan urutan penambahan

1. Salin pasangan JSON/Markdown Syahadat atau Bismillah ke ID rencana yang tersedia. Cocokkan `stageId`, `id`, dan nama berkas. Jika menambah topik baru, tambahkan pasangan `topics`/`lessonIds` pada tahapnya.
2. Tulis penjelasan berdasarkan sumber yang ditelusuri. Cantumkan judul, URL HTTPS langsung, nomor ayat/hadis, dan perawi untuk hadis. `sourceIds` pada istilah dan soal wajib menunjuk sumber di pelajaran yang sama. Jangan menyajikan kesimpulan hukum pribadi.
3. Tambahkan 3–5 soal dengan penjelasan bersumber. `answer` memakai indeks mulai dari 0, setiap `id` soal harus unik di seluruh koleksi.
4. Teks Arab, harakat, transliterasi, terjemahan, dan rekaman perlu diperiksa manual oleh guru yang kompeten. Pertahankan `review.status: "perlu-ditinjau"` sebelum itu. Untuk metadata pelajaran, `terverifikasi` hanya sah jika `reviewer` dan `date` terisi berdasarkan tinjauan nyata. Status bacaan pada `readings.json` sengaja tetap “perlu-ditinjau” untuk kedua contoh ini.
5. Untuk perbedaan mazhab, isi `differences` dengan penjelasan netral bersumber dan arahkan pertanyaan praktik kepada guru. Jika pembahasan lebih jauh ditambahkan, sertakan rujukan khusus yang mendukungnya. Jangan menganggap aplikasi sebagai pemberi fatwa.
6. Untuk audio, simpan rekaman dengan nama `[a-z0-9-].mp3`, cantumkan qari dan URL asal, lalu cocokkan bacaan dengan rekaman bersama guru. Isi `audio: null` jika belum tersedia. Jangan memakai suara sintetis sebagai verifikasi bacaan. Periksa izin penggunaan sebelum mendistribusikan ulang rekaman di luar aplikasi pribadi ini.
7. Jalankan `npm test` dan `npm run build`; buka pelajaran untuk pemeriksaan visual dan sumber. Perubahan konten ikut build/PWA berikutnya.

## Rujukan contoh yang telah ditelusuri

- Syahadat dan dasar Islam: Sahih al-Bukhari 8, dari Abdullah bin Umar — https://sunnah.com/bukhari:8
- Hadis Jibril: Sahih Muslim 8a, dari Umar bin al-Khattab melalui Abdullah bin Umar — https://sunnah.com/muslim:8a
- Basmalah: Al-Fatihah 1:1, terjemahan Indonesia Kementerian Agama melalui Quran.com — https://quran.com/id/al-fatihah/1
- Menyebut nama Allah sebelum makan: Sahih al-Bukhari 5376, dari Umar bin Abi Salamah — https://sunnah.com/bukhari:5376
- Catatan perbedaan mazhab: NU Online — https://islam.nu.or.id/syariah/memahami-beda-pendapat-bacaan-basmalah-surat-al-fatihah-dalam-shalat-nNoeL
- Rekaman contoh: Mishary Rashid Alafasy, Al-Fatihah ayat 1, EveryAyah — https://everyayah.com/data/Alafasy_128kbps/001001.mp3

Tautan sumber memerlukan internet; isi pelajaran, font Inter/Amiri, dan rekaman lokal dapat dipakai offline setelah pemasangan cache selesai. Terjemahan penjelas dan transliterasi aplikasi tetap memerlukan pemeriksaan guru.
