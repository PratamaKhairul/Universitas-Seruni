# Portal Kurikulum Program Studi Geografi

Situs statis multi-halaman Program Studi Geografi, Departemen Geografi dan Ilmu Wilayah, Universitas Seruni.

## Menjalankan

Ekstrak arsip, lalu buka `geografikur.html` di browser. Situs tidak membutuhkan server atau basis data untuk fitur inti.

## Struktur berkas

- `geografikur.html` — beranda
- `profil.html` — profil program studi
- `tentang.html` — pendekatan pembelajaran dan lingkup kajian
- `sejarah.html` — sejarah program studi
- `mata-kuliah.html` — pencarian katalog, filter, peminatan, dan ekspor CSV
- `kurikulum.html` — sebaran mata kuliah semester 1–8, ringkasan SKS, dan simulasi kredit
- `riset-pengabdian.html` — tema riset dan pengabdian
- `assets/style.css` — gaya visual dan tema terang/gelap
- `assets/app.js` — navigasi, tema, pencarian, filter, ekspor, dan render kurikulum
- `assets/courses.js` — data katalog mata kuliah
- `assets/curriculum.js` — data susunan semester

## Data katalog

Katalog berisi 272 entri: 57 mata kuliah wajib dan 215 mata kuliah pilihan dalam tujuh bidang peminatan. Prefix kode kelompok yang dipakai adalah:

- `GKWK` — Wajib Fakultas
- `GLWK` — Wajib Departemen
- `GEWK` — Wajib dan pilihan Program Studi
- `USWK` — Wajib Universitas

Nomor kode mata kuliah di katalog merupakan kode identifikasi usulan agar mata kuliah mudah dicari dan diekspor; bukan klaim bahwa kode tersebut telah ditetapkan secara resmi oleh universitas. Satu mata kuliah pilihan, `Pemodelan Geodesi untuk Kebencanaan`, belum memiliki semester penawaran dalam daftar sumber.

## Distribusi kurikulum

| Semester | SKS |
|---|---:|
| 1 | 19 |
| 2 | 19 |
| 3 | 20 |
| 4 | 23 |
| 5 | 24 |
| 6 | 24 |
| 7 | 10 |
| 8 | 5 |
| **Total** | **144** |

Semester 5 dan 6 masing-masing mencakup alokasi 20 SKS pilihan atau MBKM. Rancangan menyebut 144 SKS sebagai minimum kelulusan, 164 SKS sebagai maksimum pengambilan, serta masa studi maksimum 12 semester atau 6 tahun.

## Tema terang/gelap

Gunakan tombol `Tema gelap` / `Tema terang` pada navigasi. Pilihan tema disimpan di `localStorage` browser dan akan dipakai saat halaman dibuka kembali. Saat belum ada pilihan tersimpan, portal mengikuti preferensi tema perangkat.
