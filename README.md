# WargaKonek Desa Pajerukan

**Portal Informasi dan Komunikasi Masyarakat Desa Pajerukan, Kecamatan Kalibagor, Kabupaten Banyumas, Jawa Tengah.**

WargaKonek adalah platform web terpadu resmi pemerintah desa yang menggabungkan portal informasi publik, warta kegiatan pembangunan, agenda kemasyarakatan, direktori layanan administrasi kependudukan, serta sistem pelaporan dan pengaduan sarana desa secara transparan dan akuntabel.

---

## 1. Tech Stack

- **Frontend**:
  - **HTML5** (Semantik, Aksesibilitas, dan SEO Best Practices)
  - **Vanilla CSS3** (Desain Editorial Pemerintahan Modern, Color System, Responsive Grid, Utility Classes)
  - **Vanilla JavaScript (ES6+)** (Fetch REST API, DOM Manipulation, Dynamic Timeline & Status Updates)
  - **Lucide Icons** (Icon library resmi berbasis SVG)
  - *Tanpa framework frontend berat (No React/Vue/Next/Angular/Tailwind)*

- **Backend**:
  - **Node.js & Express.js**
  - **RESTful API** dengan format response seragam
  - **JSON Storage Engine & Store Helper** untuk persistensi data secara mandiri tanpa dependensi DB eksternal

---

## 2. Struktur Proyek

```
CICD-learning/
├── package.json
├── README.md
├── server/
│   ├── server.js               # Entry point Express, route cleaner & static server
│   ├── routes/
│   │   └── api.js              # Endpoint router REST API
│   ├── controllers/
│   │   ├── newsController.js   # Warta & pengumuman desa
│   │   ├── eventController.js  # Agenda kegiatan masyarakat
│   │   ├── serviceController.js# Layanan & persyaratan surat
│   │   ├── publicInfoController.js # Dokumen transparansi & APBDes
│   │   ├── reportController.js # CRUD laporan warga & timeline history
│   │   ├── contactController.js# Form pesan aspirasi
│   │   └── statsController.js  # Statistik rekapitulasi desa & dashboard
│   ├── middleware/
│   │   ├── logger.js           # Request logging middleware
│   │   ├── errorHandler.js     # Error handling & 404 handler
│   │   └── validator.js        # Validasi input formulir
│   └── data/
│       ├── database.json       # Penyimpanan data JSON persisten
│       └── store.js            # Access helper & initial demo data
└── public/
    ├── index.html              # Beranda (Hero editorial, warta, agenda, quick service)
    ├── profil.html             # Profil Desa (Sejarah, Visi Misi, Wilayah, Potensi)
    ├── berita.html             # Daftar Berita & Filter Kategori
    ├── berita-detail.html      # Pembaca Artikel Berita Lengkap & Berita Terkait
    ├── agenda.html             # Agenda & Jadwal Kegiatan Desa
    ├── layanan.html            # Panduan Layanan Administrasi Kependudukan
    ├── informasi-publik.html   # Transparansi Anggaran & Dokumen Desa
    ├── kontak.html             # Lokasi Kantor, Jam Pelayanan, & Form Aspirasi
    ├── laporan.html            # Daftar Laporan Warga & Filter Status
    ├── laporan-buat.html       # Formulir Pengajuan Pengaduan Baru
    ├── laporan-detail.html     # Detail Pelacakan Laporan & Timeline Status
    ├── admin/
    │   ├── index.html          # Dashboard Statistik Admin Desa
    │   ├── laporan.html        # Kelola Seluruh Laporan Warga
    │   └── laporan-detail.html # Tinjau, Verifikasi, Proses, & Selesaikan Laporan
    ├── css/
    │   ├── main.css            # Base typography, warna pemerintahan, reset
    │   ├── layout.css          # Topbar, header, navbar, mobile menu, footer
    │   ├── components.css      # Badges, status timeline, table, form, modal, toast
    │   └── pages.css           # Styling editorial news, agenda, dashboard grid
    └── js/
        ├── api.js              # REST Client wrapper, toast, formatting helpers
        ├── auth.js             # Mock role switcher (Warga <-> Admin)
        ├── components.js       # Layout helpers & Lucide icons initializer
        └── pages/              # Script interaktif per halaman
```

---

## 3. Cara Instalasi & Menjalankan Server

### Prasyarat
- **Node.js** (Versi 16 ke atas)
- **npm**

### Langkah Instalasi
1. Clone atau buka direktori proyek di terminal:
   ```bash
   cd d:\Projects\DevOps\CI-CD\CICD-learning
   ```
2. Pasang dependensi Express & CORS:
   ```bash
   npm install
   ```
3. Jalankan server:
   ```bash
   npm start
   ```
4. Buka aplikasi di peramban web:
   - **Portal Warga / Beranda**: [http://localhost:3000](http://localhost:3000)
   - **Dashboard Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 4. Peran Pengguna (Role Warga & Role Admin)

Aplikasi dilengkapi dengan fitur **Mock Role Switcher** di bagian kanan atas (*Topbar*) agar penguji dapat beralih peran dengan sekali klik:

1. **Role Warga**:
   - Menjelajahi seluruh portal informasi publik desa (Berita, Profil, Agenda, Layanan, Dokumen APBDes).
   - Mengajukan laporan/pengaduan baru dengan memilih salah satu dari 16 kategori.
   - Memantau daftar laporan miliknya beserta perkembangan status secara *real-time*.
   - Melihat catatan verifikasi atau tindak lanjut dari perangkat desa pada timeline laporan.

2. **Role Admin (Pemerintah Desa)**:
   - Mengakses panel `/admin` dengan visual badge khusus administrator.
   - Melihat dashboard ringkasan statistik (Total, Menunggu, Ditinjau, Diproses, Selesai, Ditolak).
   - Membuka tabel manajemen seluruh laporan warga dengan pencarian dan filter status/kategori.
   - Melakukan aksi workflow penanganan laporan:
     - **Tandai Ditinjau**: Ketika pertama kali memeriksa laporan baru.
     - **Proses**: Meneruskan laporan ke seksi pembangunan/lapangan dengan catatan instruksi.
     - **Selesai**: Menyelesaikan penanganan dan memberikan catatan solusi pekerjaan.
     - **Tolak**: Menolak laporan yang tidak memenuhi syarat dengan **alasan penolakan wajib diisi**.

---

## 5. Alur Kerja (Workflow) Laporan Warga

```
[ Warga Mengajukan Laporan ]
            │
            ▼
        ( Menunggu )  <── Laporan baru masuk antrean sistem
            │
      [ Admin Meninjau ]
            │
            ▼
        ( Ditinjau )  <── Admin memeriksa keabsahan & lokasi
        ┌───┴────────────────────────┐
        │                            │
   [ Admin Menyetujui ]         [ Admin Menolak ]
        │                            │
        ▼                            ▼
   ( Diproses )                  ( Ditolak )
   Tim teknis bekerja            Disertai alasan wajib
        │
   [ Pekerjaan Selesai ]
        │
        ▼
   ( Selesai )
   Permasalahan terselesaikan
```

Setiap perubahan status otomatis mencatat:
- **Timestamp** waktu perubahan
- **Status baru**
- **Catatan / keterangan resmi tindak lanjut**

---

## 6. Daftar Endpoint REST API

Format respon standar:
```json
{
  "success": true,
  "data": [],
  "message": "Pesan deskriptif"
}
```

| HTTP Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/health` | Health check server |
| `GET` | `/api/stats` | Statistik jumlah laporan dan entitas desa |
| `GET` | `/api/announcements` | Daftar warta berita (query: `category`, `search`, `page`, `limit`) |
| `GET` | `/api/announcements/:id` | Detail artikel berita beserta berita terkait |
| `GET` | `/api/events` | Daftar jadwal agenda desa (query: `limit`) |
| `GET` | `/api/events/:id` | Detail agenda kegiatan |
| `GET` | `/api/services` | Daftar panduan layanan kependudukan |
| `GET` | `/api/services/:id` | Detail persyaratan surat layanan |
| `GET` | `/api/public-info` | Arsip transparansi dokumen APBDes & regulasi |
| `POST` | `/api/contact` | Kirim formulir pesan aspirasi warga |
| `GET` | `/api/report-categories` | Daftar 16 kategori laporan |
| `GET` | `/api/reports` | Daftar laporan warga (query: `status`, `category`, `search`, `reporterId`) |
| `GET` | `/api/reports/:id` | Detail laporan beserta riwayat timeline |
| `POST` | `/api/reports` | Buat laporan baru |
| `PATCH` | `/api/reports/:id/status` | Update status laporan warga |
| `GET` | `/api/reports/:id/history` | Riwayat perubahan status laporan |
| `GET` | `/api/admin/reports` | Mengambil seluruh laporan untuk panel admin |
| `PATCH` | `/api/admin/reports/:id/status` | Update status & catatan tindak lanjut oleh admin |

---

## 7. Kategori Laporan Fleksibel (16 Kategori Awal)

1. Infrastruktur Umum
2. Kebersihan & Lingkungan
3. Keamanan & Ketertiban
4. Fasilitas Umum
5. Pelayanan Masyarakat
6. Sosial & Kesejahteraan
7. Kesehatan
8. Pendidikan
9. Administrasi Desa
10. Transportasi
11. Penerangan Jalan
12. Drainase & Saluran Air
13. Ekonomi & UMKM
14. Pertanian
15. Bantuan Sosial
16. Lainnya

Kategori disimpan secara modular pada `server/data/store.js` dan disediakan melalui API endpoint `/api/report-categories` sehingga mudah ditambah dan terpusat tanpa duplikasi di frontend.

---

## 8. Identitas & Wilayah Desa

- **Desa**: Pajerukan
- **Kecamatan**: Kalibagor
- **Kabupaten**: Banyumas
- **Provinsi**: Jawa Tengah
- **Kode Pos**: 53191

---

## 9. CI/CD Pipeline (GitHub Actions)

WargaKonek dilengkapi dengan pipeline otomatisasi **Continuous Integration (CI)** dan **Continuous Deployment (CD)** menggunakan **GitHub Actions**.

### Alur Pipeline

```text
Developer
   │
   │ git push / pull request
   ▼
GitHub Repository
   │
   ├── [CI Workflow] (.github/workflows/ci.yml)
   │    ├── 1. Checkout Code
   │    ├── 2. Setup Node.js 18 & Cache npm
   │    ├── 3. npm ci (Install Dependency)
   │    ├── 4. Lint Check (if configured)
   │    ├── 5. npm test (11 Automated API & Route Tests)
   │    ├── 6. Docker Build Image (Tag: wargakonek-ci:<sha>)
   │    ├── 7. Run Test Container
   │    ├── 8. Health Check (/api/health polling)
   │    └── 9. Cleanup Container
   │
   └── [CD Workflow] (.github/workflows/cd.yml) - Hanya berjalan saat CI sukses di branch 'main'
        ├── 1. Checkout Code
        ├── 2. Login ke GitHub Container Registry (GHCR)
        ├── 3. Build & Tag Docker Image (:latest & :<sha>)
        ├── 4. Push Image ke ghcr.io/<owner>/wargakonek
        ├── 5. Connect SSH ke Server Deployment
        ├── 6. docker compose pull (Ambil image versi SHA terbaru)
        ├── 7. docker compose up -d (Restart container aplikasi)
        ├── 8. Prune Dangling Images
        └── 9. Production Health Check (Verifikasi HTTP 200 & success: true)
```

---

### 1. Continuous Integration (CI)

File: `.github/workflows/ci.yml`

* **Triggers**:
  * `push` ke branch `main`
  * `pull_request` ke branch `main`
* **Validasi yang Dijalankan**:
  1. **Dependency Installation**: Menggunakan `npm ci` untuk instalasi deterministik.
  2. **Automated Unit & Integration Tests**: Menjalankan test suite berbasis native Node 18 (`tests/api.test.js`) mencakup endpoint `/api/health`, `/api/stats`, `/api/report-categories`, `/api/announcements`, `/api/events`, `/api/services`, `/api/reports`, `/api/contact`, dan routing homepage.
  3. **Docker Build & Container Test**: Memastikan `Dockerfile` dapat dibuild dan container dapat berjalan serta merespon `/api/health` dengan kode status `200` dan body `{"success": true, ...}` sebelum kode dapat dimerge/dideploy.

---

### 2. Continuous Deployment (CD)

File: `.github/workflows/cd.yml`

* **Triggers**:
  * Otomatis setelah workflow `CI` berhasil pada branch `main` (`workflow_run`)
  * Manual trigger via `workflow_dispatch`
* **Container Registry**: **GitHub Container Registry (GHCR)** (`ghcr.io`).
  Setiap image ditandai dengan dua tag:
  * `latest`
  * `<commit-sha>` (contoh: `ghcr.io/username/wargakonek:a91c2de...`)
* **Deployment Method**: SSH remote execution ke Linux VPS/server.
* **Production Health Check**: Melakukan verifikasi langsung ke service aplikasi yang berjalan di server untuk memastikan zero-downtime dan memastikan status server benar-benar beroperasi normal.

---

### 3. Konfigurasi GitHub Secrets

Tambahkan secrets berikut pada repository GitHub Anda melalui menu **Settings > Secrets and variables > Actions**:

| Nama Secret | Deskripsi | Contoh Nilai |
|---|---|---|
| `DEPLOY_HOST` | IP publik atau Domain server VPS | `103.xxx.xxx.xxx` atau `server.desa.id` |
| `DEPLOY_USER` | Username SSH untuk deployment | `ubuntu` atau `deployer` |
| `DEPLOY_SSH_KEY` | Private SSH Key (format OpenSSH / PEM) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `DEPLOY_PATH` | Path direktori kerja project di server | `/home/ubuntu/wargakonek` atau `/var/www/wargakonek` |

> [!WARNING]
> Jangan pernah membagikan atau meng-commit nilai Secret ke dalam repositori publik!

---

### 4. Panduan Persiapan Server Deployment (VPS Linux)

1. **Install Docker & Docker Compose**:
   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose-v2
   sudo usermod -aG docker $USER
   ```

2. **Buat Direktori Proyek di Server**:
   ```bash
   mkdir -p /home/ubuntu/wargakonek
   cd /home/ubuntu/wargakonek
   ```

3. **Salin File Konfigurasi ke Server**:
   Pastikan file `compose.yaml` tersedia di direktori `$DEPLOY_PATH`.

4. **Siapkan File `.env` di Server**:
   Buat file `.env` di server (jangan commit ke Git):
   ```env
   APP_IMAGE=ghcr.io/<your-github-username>/wargakonek:latest
   NODE_ENV=production
   PORT=3000
   ```

5. **Akses GHCR (Jika Package Private)**:
   Jika repositori/paket container diset Private, lakukan login sekali di server menggunakan Personal Access Token (PAT) GitHub:
   ```bash
   echo "<GITHUB_PAT>" | docker login ghcr.io -u <GITHUB_USERNAME> --password-stdin
   ```

---

### 5. Prosedur Rollback

Setiap deployment membuat tag berbasis commit SHA. Jika rilis terbaru mengalami masalah, Anda dapat melakukan rollback instan ke versi sebelumnya melalui server:

```bash
cd /home/ubuntu/wargakonek

# 1. Jalankan image dari commit SHA yang stabil sebelumnya
APP_IMAGE=ghcr.io/<owner>/wargakonek:<previous-commit-sha> docker compose up -d

# 2. Verifikasi status container
docker compose ps
curl http://127.0.0.1:3000/api/health
```

