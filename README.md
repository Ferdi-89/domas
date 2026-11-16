# DOMAS — Dompet Mahasiswa

Sistem pengelolaan keuangan mahasiswa berbasis adaptive web dan mobile.

Proyek Kelompok 3 (Tim INISIATOR) — Politeknik Negeri Padang.

---

## 👥 Anggota Kelompok

| Nama | NIM | Peran |
|---|---|---|
| Ferdiyansyah | 2411081009 | _(Project Manager, Lead Programmer )_ |
| Alya Dhiya Najla | 2411081003 | _(System Analyst)_ |
| Aprila Maulida | 2411083002 | _(QA & Dokumentasi)_ |

---

## 📖 Deskripsi Proyek

DOMAS membantu mahasiswa mencatat keuangan, mengatur budget, menyusun daftar belanja yang terhubung dengan budget, serta mengelola patungan (split bill) beserta piutangnya.

**Latar belakang masalah** (kuesioner 33 responden):
- 93,9% responden uang sakunya habis tanpa tahu penyebabnya
- 51,5% tidak mencatat pengeluaran dan hanya mengandalkan ingatan
- 54,5% kesulitan menghitung atau menagih split bill

**Fitur utama (v1.0):**
1. Autentikasi dan manajemen akun (registrasi, login, logout)
2. Manajemen transaksi (pemasukan dan pengeluaran)
3. Budgeting dengan peringatan pada 80% dan 100% limit
4. Shopping List terhubung budget
5. Split Bill per item, Guest Link, dan daftar piutang (pengingat via WhatsApp)
6. Langganan dan tagihan rutin
7. Laporan keuangan bulanan
8. Dukungan multi-platform (Android dan Web)

**Di luar scope v1.0:** payment gateway/e-wallet, pesan WhatsApp otomatis, OCR struk, dan auto-tracking notifikasi transaksi.

Dokumen lengkap: lihat **SRS DOMAS** (`docs/SRS_INISIATOR.docx`).

---

## 🛠️ Teknologi

| Lapisan | Teknologi |
|---|---|
| Klien (Android & Web) | Flutter |
| Back-end | Node.js + Express (REST API) |
| Database | PostgreSQL |
| Autentikasi | JWT |
| Version control | Git + GitHub |

---

## 🚀 Panduan Instalasi dan Menjalankan

### Prasyarat
- [Git](https://git-scm.com/)
- [Flutter SDK](https://docs.flutter.dev/get-started/install) (versi stabil terbaru)
- [Node.js](https://nodejs.org/) LTS (disarankan v18 ke atas)
- [PostgreSQL](https://www.postgresql.org/download/) (v14 ke atas)

### 1. Clone repositori
```bash
git clone https://github.com/Ferdi-89/domas.git
cd domas
```

### 2. Siapkan database
```bash
psql -U postgres -c "CREATE DATABASE domas;"
```

### 3. Jalankan back-end
```bash
cd backend            # sesuaikan dengan nama folder
npm install
cp .env.example .env  # lalu isi nilai di dalam .env
npm run dev
```

Contoh isi `.env`:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/domas
JWT_SECRET=ganti_dengan_string_acak
```

### 4. Jalankan klien Flutter
```bash
cd frontend           # sesuaikan dengan nama folder
flutter pub get
flutter run -d chrome   # versi web
flutter run             # versi Android (emulator/perangkat tersambung)
```

> ⚠️ Bagian instalasi akan diperbarui seiring struktur proyek final. Jika ada langkah yang berubah, update README ini di PR yang sama.

---

## 📁 Struktur Repositori

```
domas/
├── backend/      # Node.js REST API
├── frontend/     # Flutter (Android & Web)
├── docs/         # SRS, diagram, dokumen pendukung
└── README.md
```
_(sesuaikan dengan struktur yang benar-benar dipakai)_

---

## 🤝 Kesepakatan Tim

### Alur kerja Git
- **Dilarang push langsung ke `main`.** Semua perubahan lewat branch dan Pull Request.
- Setiap PR **harus direview minimal 1 anggota lain** sebelum di-merge.
- Branch `main` selalu dalam kondisi bisa dijalankan.

### Penamaan branch
```
feature/<nama-fitur>     contoh: feature/login
fix/<deskripsi>          contoh: fix/hitung-saldo
docs/<deskripsi>         contoh: docs/update-readme
```

### Format pesan commit
```
<tipe>: <deskripsi singkat>

feat: tambah form registrasi
fix: perbaiki validasi nominal transaksi
docs: lengkapi README
refactor: rapikan service budget
```

### Aturan Pull Request
- Judul PR jelas, deskripsi menyebut issue terkait (mis. `Closes #5`)
- Satu PR fokus pada satu fitur/perbaikan
- Jangan merge PR sendiri tanpa review

### Manajemen tugas
- Seluruh kebutuhan dari SRS dicatat sebagai **GitHub Issues**
- Label dan prioritas mengikuti SRS (Tinggi / Sedang / Rendah)
- Papan kerja memakai **GitHub Projects** (To Do → In Progress → Review → Done)

### Komunikasi dan komitmen
- Komunikasi utama: _(trello, grup WhatsApp)_
- Setiap anggota berkontribusi lewat commit rutin sebagai bukti kerja individu

---

## 📌 Status Proyek

- [x] Repositori dibuat
- [x] SRS disusun
- [x] README dan kesepakatan tim
- [ ] Backlog (SRS menjadi Issues)
- [ ] Walking skeleton
- [ ] Pull Request pertama yang direview

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik Politeknik Negeri Padang.
