# Website Presentasi Sidang Invention — SMA Gunung Madu

Presentasi: **Pengaruh Lama Fermentasi Buah Kopi terhadap Karakteristik Seduhan Kopi**
Penyusun: Ega Belva Sofyana (XII B) · Pembimbing: Kinanti Kurnia Adisaputri

## Isi folder

```
index.html            halaman presentasi (sesuai laporan terbaru)
css/style.css         tampilan, warna, tema terang/gelap
css/layout.css        tata letak tiap slide (menimpa style.css)
css/chara.css         gerakan karakter animasi di pojok kanan atas
js/app.js             navigasi, layar penuh, tema, animasi, latar motif, grafik
js/chara.js           memilih gerakan karakter (berbeda tiap slide)
assets/img/           logo sekolah dan foto dokumentasi dari laporan
assets/fonts/         IBM Plex Mono (lokal, lisensi OFL)
.nojekyll             agar GitHub Pages menyajikan file apa adanya
```

## Cara menaikkan ke GitHub Pages

1. Buat repositori baru di GitHub (misalnya `presentasi-invention`).
2. Unggah **seluruh isi folder ini** (bukan folder pembungkusnya) ke cabang `main`, sehingga `index.html` berada di akar repositori.
3. Buka **Settings → Pages**, pilih **Deploy from a branch**, cabang `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu beberapa menit. Alamatnya akan berbentuk `https://<username>.github.io/<nama-repositori>/`.

Website ini membutuhkan internet saat dibuka lewat GitHub Pages. Coba buka sekali sebelum hari sidang.

## Transisi

Setiap pindah slide: kartu lama bergerak keluar (arah berbeda per slide), judul dihapus seperti backspace, lalu kartu baru masuk dari arah berbeda dan judul diketik ulang. Menekan panah berulang kali langsung menyelesaikan transisi yang sedang jalan. Dimatikan oleh tombol animasi atau pengaturan "reduce motion".

## Kontrol

| Aksi | Cara |
|---|---|
| Slide berikutnya / sebelumnya | Panah kanan / kiri (juga PageDown / PageUp) atau tombol kecil `‹ ›` |
| Slide pertama / terakhir | Home / End |
| Layar penuh | Tombol kecil atau tombol **F** (keluar dengan **Esc**) |
| Tema terang / gelap | Tombol kecil bulat setengah (default: gelap) |
| Matikan / nyalakan animasi | Tombol kecil bergambar tunas |

Karakter di pojok kanan atas bergerak berbeda tiap pindah slide dan ikut berhenti bila animasi dimatikan.

Pilihan tema dan animasi diingat browser. Alamat `#/12` membuka langsung slide ke-12.

## Bagian yang masih perlu diisi

Cari tulisan `PERLU DIISI` di `index.html`. Bagian yang sengaja dikosongkan atau belum lengkap:

- **Slide 11 (Teknik Pengumpulan Data)** — label primer/sekunder, ketelitian instrumen, dan jumlah ulangan, bila ingin ditampilkan.
- **Slide 18 (Referensi)** — laporan hanya memuat nama penulis dan tahun. Jika ingin format APA lengkap, tambahkan judul dan sumbernya.

## Font

- **IBM Plex Mono** sudah ada di `assets/fonts/`.
- **Cormorant Garamond** dimuat dari Google Fonts (tag `<link>` di `index.html`), jadi butuh internet. Tanpa internet, tampilan memakai font serif cadangan dan tata letak tetap aman. Untuk menyimpannya lokal, unduh berkas fontnya, taruh di `assets/fonts/`, lalu tambahkan aturan `@font-face` di `css/style.css` dan hapus tag Google Fonts.

## Catatan isi

Semua isi bersumber dari laporan invention (versi dengan 25 panelis: Bab IV dan V menjadi acuan data; angka simpangan baku tidak ditampilkan). Salah ketik dan label tabel yang keliru di laporan sudah diperbaiki di website (misalnya label Tabel 4 dan 5). Ilustrasi kopi beruap di cover digambar sebagai bentuk vektor sederhana dengan kode, bukan gambar dari generator AI.
