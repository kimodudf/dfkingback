# Sage Watercolor — Undangan Pernikahan Digital

Template undangan pernikahan digital bertema *sage watercolor botanical*. Static website (HTML, CSS, JavaScript murni) — tanpa backend, siap di-deploy ke GitHub Pages.

## Struktur Project

```
sage-watercolor/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── images/        ← foto pasangan & galeri
│   ├── illustrations/
│   ├── icons/
│   ├── fonts/
│   └── music.mp3       ← musik latar (ganti dengan file Anda)
└── README.md
```

## Cara Edit Konten

Buka `index.html`, cari komentar:

```html
<!-- EDIT CONTENT HERE -->
```

Bagian yang bisa Anda ubah tanpa perlu paham JavaScript:

- Nama mempelai (opening, hero, footer)
- Nama orang tua & keterangan mempelai
- Tanggal, jam, dan lokasi acara (akad & resepsi)
- Foto (letakkan file di `assets/images/`, lalu ubah nama file di `src="..."`)
- Nomor rekening & pemilik rekening
- Link Google Maps pada tombol "Lihat Lokasi"

## Mengganti Foto

Simpan file foto Anda dengan nama berikut di `assets/images/`:

```
groom.jpg
bride.jpg
gallery-1.jpg  s/d  gallery-6.jpg
```

Atau ubah nama file pada atribut `src` di `index.html` sesuai nama file Anda.

## Mengganti Musik

Ganti file `assets/music.mp3` dengan musik pilihan Anda (format mp3), atau ubah path pada tag `<source>` di bagian bawah `index.html`.

## Mengatur Tanggal Countdown

Buka `script.js`, cari baris:

```javascript
const eventDate = new Date('2026-06-20T08:00:00');
```

Ubah tanggal dan jam sesuai acara Anda.

## Mengganti Nama Tamu di URL

Undangan mendukung nama tamu otomatis lewat parameter URL:

```
https://namaanda.github.io/repo-anda/?to=Budi+Santoso
```

## RSVP

Form RSVP saat ini menyimpan data di `localStorage` browser pengunjung (khusus tampilan, tidak terkirim ke Anda). Untuk menerima data RSVP secara nyata, hubungkan ke Google Form atau Google Apps Script Web App — lihat catatan di `script.js` pada bagian `rsvpForm.addEventListener('submit', ...)`.

## Mengubah Warna Tema

Semua warna diatur lewat CSS variables di awal `style.css`:

```css
:root {
  --sage: #8fa58b;
  --sage-dark: #647761;
  --cream: #f7f3e9;
  --paper: #fffdf7;
  --text: #4d554b;
}
```

## Deploy ke GitHub Pages

1. Buat repository baru di GitHub, misalnya `undangan-pernikahan`.
2. Upload seluruh isi folder `sage-watercolor/` ke repository tersebut (root, bukan di dalam subfolder).
3. Masuk ke **Settings → Pages**.
4. Pada **Source**, pilih **Deploy from a branch**, branch `main`, folder `/root`.
5. Simpan. Tunggu beberapa menit, situs akan aktif di:
   ```
   https://username.github.io/undangan-pernikahan/
   ```

Selesai — undangan siap dibagikan.
