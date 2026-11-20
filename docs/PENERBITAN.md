# GitHub dan Cloudflare Pages

Gunakan Node.js 24 dan Git. Ekstrak ZIP sumber, lalu jalankan semua perintah berikut di folder yang memuat package.json dan package-lock.json.

## Periksa sebelum push

```sh
npm ci
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Pada Linux yang belum memiliki pustaka sistem Chromium, gunakan `npx playwright install --with-deps chromium`. Playwright menjalankan preview di port 4173. Untuk mencoba sendiri gunakan `npm run dev` atau, setelah build, `npm run preview`.

## Simpan ke GitHub

Buat repositori kosong di GitHub. Untuk folder hasil ekstraksi ZIP, jalankan perintah berikut. Ganti NAMA_AKUN dan NAMA_REPO dengan tujuanmu.

```sh
git init -b main
git add .
git status --short
git commit -m "Tambahkan aplikasi Belajar Islam"
git remote add origin https://github.com/NAMA_AKUN/NAMA_REPO.git
git push -u origin main
```

Jika memakai checkout yang sudah memiliki riwayat Git dan origin, pertahankan riwayatnya. Tambahkan tujuan baru dengan `git remote add github https://github.com/NAMA_AKUN/NAMA_REPO.git`, lalu `git push -u github main`. Workflow CI menjalankan pemeriksaan setelah push dan pada pull request. Kredensial Cloudflare tidak diperlukan oleh CI.

## Terbitkan ke proyek Pages yang sudah ada

Proyek ini memakai **Direct Upload**. Push ke GitHub menyimpan kode. Untuk memperbarui situs di proyek Pages yang sama, bangun dan unggah folder dist dari checkout yang hendak diterbitkan.

```sh
npm ci
npm run build
npx wrangler@4 login
npx wrangler@4 whoami
npx wrangler@4 pages project list
npx wrangler@4 pages deploy dist --project-name belajar-islam-selangkah --branch main
npx wrangler@4 pages deployment list --project-name belajar-islam-selangkah
```

Pilih akun yang memiliki proyek tersebut. Untuk otomasi, simpan CLOUDFLARE_API_TOKEN dengan izin Account → Cloudflare Pages → Edit terbatas ke akun itu dan CLOUDFLARE_ACCOUNT_ID sebagai rahasia runner. Jangan memasukkan nilai token ke kode, ZIP, atau riwayat Git. Cabut token yang pernah dibagikan dalam percakapan sebelum membuat token pengganti.

## Verifikasi dan pemulihan

Buka URL produksi dari dashboard proyek dan periksa halaman Latihan ingatan. Gunakan domain produksi yang sama setiap kali belajar agar browser menemukan progres IndexedDB yang sama. Pada perpindahan domain, ekspor JSON dari alamat lama dan impor melalui Pengaturan di alamat baru.

Buka sekali saat online hingga status Siap offline muncul. Aktifkan mode offline di DevTools, muat ulang, buka pelajaran dan putar audio Basmalah. Jika versi lama muncul, pilih Perbarui aplikasi ketika ditawarkan. Hindari menghapus data situs sebelum mengekspor progres.

Jika unggahan gagal, periksa akun dan izin token melalui whoami dan daftar proyek. Jika rilis bermasalah, buka Workers & Pages → proyek → Deployments, pilih deployment produksi terakhir yang berfungsi dan gunakan Rollback. Periksa kompatibilitas cadangan sebelum mengimpor ke versi lama.

Jika memakai ZIP build siap unggah, ekstrak arsip hingga index.html, sw.js, assets dan content berada dalam satu folder. Dari folder tersebut jalankan `npx wrangler@4 pages deploy . --project-name belajar-islam-selangkah --branch main`. Publikasikan ZIP sumber ke GitHub melalui langkah di atas agar materi tetap dapat diedit.
