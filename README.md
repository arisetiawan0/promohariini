# Promo Hari Ini — Signage TV

Website signage untuk TV Android yang menampilkan promo hari ini dari API
`https://promo.beautykendari.id/api/tv/promos/today`.

## Struktur

```
promo-hari-ini/
├── index.html       → aplikasi signage (pilih outlet + tampilan slide)
├── api/promos.js    → serverless function Vercel, perantara ke API promo
└── README.md
```

Token API **tidak pernah** dikirim ke browser — browser hanya memanggil
`/api/promos`, lalu serverless function yang menambahkan header
`Authorization: Bearer ...` di sisi server. Ini sekaligus menghindari
masalah CORS.

## Cara deploy ke Vercel

1. Buat repository GitHub baru, upload seluruh isi folder ini
   (atau pakai `vercel` CLI: jalankan `vercel` di dalam folder).
2. Di Vercel, **Add New Project** → import repository tersebut.
   Tidak perlu build command — biarkan default (framework: Other).
3. (Disarankan) Di **Settings → Environment Variables**, tambahkan:
   - `PROMO_API_TOKEN` = token bearer Anda
   Kalau variabel ini tidak diisi, function memakai token bawaan yang
   tertulis di `api/promos.js`. Mengisi lewat environment variable lebih
   aman karena token tidak ikut tersimpan di repository.
4. Deploy. Buka URL-nya di TV.

## Cara pakai di TV

1. Saat pertama dibuka, muncul layar **pilih outlet** (seluruh master outlet
   B1-B27 dan Online selalu tersedia, plus opsi "Semua Outlet"). Outlet yang
   ditemukan dari data API juga otomatis digabungkan ke daftar.
2. Pilih outlet → **Tampilkan Signage**. Pilihan tersimpan di perangkat,
   jadi setelah TV restart langsung masuk ke signage tanpa ditanya lagi.
3. Untuk mengganti outlet: gerakkan kursor/mouse, lalu klik tombol
   **⚙ Ganti outlet** di pojok kiri atas.

## Perilaku aplikasi

- **Slide**: 3 promo per slide, berganti otomatis tiap 10 detik
  (ubah `SLIDE_MS` di `index.html` jika perlu).
- **Refresh data**: saat halaman dibuka, lalu terjadwal pukul
  **08.00, 12.00, dan 18.00 WITA**, dan otomatis saat ganti hari.
  Jika gagal (koneksi putus), data terakhir tetap ditampilkan dan
  aplikasi mencoba ulang tiap 30 detik.
- **Baris nilai promo**: untuk `jenis_promo = diskon`, angka persen
  diekstrak dari teks `mekanisme` dan ditampilkan besar (mis. **30%**).
  Untuk voucher/gimmick (atau jika persen tidak ditemukan), teks
  `mekanisme` ditampilkan apa adanya.
- **Filter outlet**: promo tampil jika daftar `outlets`-nya memuat kode
  outlet yang dipilih, kosong (dianggap berlaku semua), atau memuat
  entri "Semua". Pilihan "Semua Outlet" menampilkan seluruh promo.
- **Zona waktu**: semua tanggal/jam ditampilkan dalam WITA
  (Asia/Makassar). Tanggal selesai yang jatuh tepat pukul 00:00 WITA
  dianggap batas eksklusif — contoh: `periode_selesai` = 19 Juli 00:00
  WITA ditampilkan sebagai "s/d 18 Jul".
- **Kosong**: jika tidak ada promo hari itu, tampil pesan
  "Belum ada promo untuk hari ini".
