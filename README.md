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

## 9. Tutorial Deploy ke Proxmox VE (Single LXC Container) dengan CI/CD & Load Balancer

Panduan komprehensif implementasi arsitektur **High Availability (HA)** untuk aplikasi WargaKonek di dalam **Single LXC Container (Proxmox VE)** menggunakan **Nginx Load Balancer** dan otomatisasi **GitHub Actions CI/CD**.

---

### A. Arsitektur Infrastruktur (Single LXC Container)

Dalam arsitektur ini, seluruh stack (Nginx Load Balancer dan 2 Instance Container App) berjalan di dalam **satu LXC Container di Proxmox VE** yang sangat hemat resource namun tetap memiliki redundansi dan failover:

```text
                             [ Public Traffic / Internet ]
                                           │
                                           ▼
                             ┌──────────────────────────┐
                             │     Router / Gateway     │
                             │  (Port Forward 80 & 443) │
                             └─────────────┬────────────┘
                                           │
                     Proxmox VE Node (PVE Virtual Bridge: vmbr0)
                                           │
  ┌────────────────────────────────────────┴────────────────────────────────────────┐
  │  PROXMOX LXC CONTAINER 100 (Ubuntu 24.04 LTS / IP: 192.168.1.50)                │
  │  Features: Nesting=1, Keyctl=1                                                  │
  │                                                                                 │
  │  ┌───────────────────────────────────────────────────────────────────────────┐  │
  │  │                      Nginx Load Balancer (Port: 80 / 443)                 │  │
  │  │                  (Upstream Least-Connection & Failover)                   │  │
  │  └───────────────────────┬───────────────────────────┬───────────────────────┘  │
  │                          │                           │                          │
  │                          ▼                           ▼                          │
  │             ┌─────────────────────────┐ ┌─────────────────────────┐             │
  │             │   App Replica 1 (app1)  │ │   App Replica 2 (app2)  │             │
  │             │   Port Internal: 3001   │ │   Port Internal: 3002   │             │
  │             │   Health: /api/health   │ │   Health: /api/health   │             │
  │             └─────────────────────────┘ └─────────────────────────┘             │
  └────────────────────────────────────────┬────────────────────────────────────────┘
                                           │
                                  [ GitHub Actions CD ]
                               (Deploy via SSH & Pull GHCR)
```

---

### B. Langkah 1: Pembuatan & Konfigurasi LXC Container di Proxmox VE

1. **Download Template OS di Proxmox**:
   - Buka Proxmox Web GUI > Storage `local` > **CT Templates** > Cari `ubuntu-24.04-standard` (atau Debian 12) lalu klik **Download**.

2. **Buat LXC Container (Create CT)**:
   - **CT ID**: `100` (atau sesuai preferensi)
   - **Hostname**: `wargakonek-prod`
   - **Password**: Masukkan password root aman
   - **Template**: Pilih template Ubuntu 24.04
   - **Disk**: 20 GB (atau sesuai kebutuhan)
   - **CPU**: 2 Core
   - **Memory**: RAM 2048 MB (2 GB), Swap 1024 MB
   - **Network**:
     - Bridge: `vmbr0`
     - IPv4: Static (contoh `192.168.1.50/24`)
     - Gateway: `192.168.1.1` (IP Router Anda)
     - DNS: `8.8.8.8` atau DNS Lokal

3. **Aktifkan Nesting & Keyctl (Wajib untuk Docker di LXC Proxmox)**:
   - Pilih Container `100` di Proxmox GUI > **Options** > **Features** > Klik **Edit**.
   - Centang **Nesting** (`nesting=1`) dan **Keyctl** (`keyctl=1`).
   - Klik **OK**, lalu jalankan container (**Start**).

---

### C. Langkah 2: Setup Docker & User Deployment di LXC

Buka Proxmox Console untuk Container `100` dan jalankan:

```bash
# 1. Update paket sistem
apt update && apt upgrade -y

# 2. Install dependensi dan Docker Engine + Docker Compose
apt install -y curl git ufw sudo docker.io docker-compose-v2

# 3. Buat user deployment khusus (non-root)
adduser deployer
usermod -aG sudo,docker deployer

# 4. Siapkan direktori SSH untuk user deployer
mkdir -p /home/deployer/.ssh
chmod 700 /home/deployer/.ssh

# Tambahkan Public SSH Key Anda ke authorized_keys
cat << 'EOF' >> /home/deployer/.ssh/authorized_keys
<PASTE_PUBLIC_SSH_KEY_ANDA_DI_SINI>
EOF

chmod 600 /home/deployer/.ssh/authorized_keys
chown -R deployer:deployer /home/deployer/.ssh
```

---

### D. Langkah 3: Konfigurasi Docker Compose & Load Balancer (Nginx)

Login sebagai user `deployer` dan siapkan project:

```bash
su - deployer
mkdir -p /home/deployer/wargakonek
cd /home/deployer/wargakonek
```

1. **Buat file `nginx.conf` untuk Load Balancer**:
   ```bash
   cat << 'EOF' > /home/deployer/wargakonek/nginx.conf
   events { worker_connections 1024; }

   http {
       upstream wargakonek_cluster {
           # Algoritma pembagian beban: least_conn
           least_conn;

           # Load balance ke dua instance app container
           server app1:3000 max_fails=3 fail_timeout=10s;
           server app2:3000 max_fails=3 fail_timeout=10s;
       }

       server {
           listen 80;
           server_name _;

           # Reverse proxy ke upstream cluster
           location / {
               proxy_pass http://wargakonek_cluster;
               proxy_http_version 1.1;

               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Proto $scheme;
               proxy_set_header Upgrade $http_upgrade;
               proxy_set_header Connection 'upgrade';

               # Failover otomatis jika salah satu instance sedang update/down
               proxy_connect_timeout 2s;
               proxy_read_timeout 60s;
               proxy_next_upstream error timeout http_500 http_502 http_503 http_504;
           }

           location /api/health {
               proxy_pass http://wargakonek_cluster/api/health;
               proxy_connect_timeout 2s;
           }
       }
   }
   EOF
   ```

2. **Siapkan `compose.prod.yaml`**:
   ```yaml
   services:
     # Nginx Load Balancer
     lb:
       image: nginx:alpine
       container_name: wargakonek-lb
       restart: unless-stopped
       ports:
         - "80:80"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf:ro
       depends_on:
         - app1
         - app2

     # Instance 1
     app1:
       image: ${APP_IMAGE:-ghcr.io/your-username/wargakonek:latest}
       container_name: wargakonek-app-1
       restart: unless-stopped
       environment:
         - NODE_ENV=production
         - PORT=3000
       healthcheck:
         test: ["CMD-SHELL", "wget -q -O - http://127.0.0.1:3000/api/health || exit 1"]
         interval: 15s
         timeout: 5s
         retries: 3
         start_period: 5s

     # Instance 2
     app2:
       image: ${APP_IMAGE:-ghcr.io/your-username/wargakonek:latest}
       container_name: wargakonek-app-2
       restart: unless-stopped
       environment:
         - NODE_ENV=production
         - PORT=3000
       healthcheck:
         test: ["CMD-SHELL", "wget -q -O - http://127.0.0.1:3000/api/health || exit 1"]
         interval: 15s
         timeout: 5s
         retries: 3
         start_period: 5s
   ```

3. **Buat file `.env` di LXC**:
   ```bash
   cat << 'EOF' > /home/deployer/wargakonek/.env
   APP_IMAGE=ghcr.io/<your-github-username>/wargakonek:latest
   NODE_ENV=production
   PORT=3000
   EOF
   ```

---

### E. Langkah 4: Konfigurasi GitHub Secrets untuk CI/CD

Tambahkan Secrets berikut di GitHub (`Settings > Secrets and variables > Actions`):

| Secret Name | Deskripsi | Contoh Nilai |
|---|---|---|
| `DEPLOY_HOST` | IP publik atau Domain LXC Proxmox (atau IP lokal jika self-hosted runner) | `192.168.1.50` / `pve.desa.id` |
| `DEPLOY_USER` | Username deployment di LXC | `deployer` |
| `DEPLOY_SSH_KEY` | Private SSH Key deployer (tanpa passphrase) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `DEPLOY_PATH` | Lokasi direktori aplikasi di LXC | `/home/deployer/wargakonek` |

---

### F. Alur Otomatisasi CI/CD & Zero-Downtime Deployment

```text
[ Developer Push ke branch 'main' ]
                │
                ▼
      [ GitHub Actions CI ]
        ├── 1. npm ci & Lint
        ├── 2. npm test (11 API Automated Tests)
        ├── 3. Build Docker Image (Tag: wargakonek-ci:<sha>)
        └── 4. Health Check Validasi Container
                │
                ▼ (Hanya saat CI Lulus)
      [ GitHub Actions CD ]
        ├── 1. Build & Push Image ke GHCR (ghcr.io/<owner>/wargakonek:<sha>)
        ├── 2. SSH ke Proxmox LXC Container
        ├── 3. docker compose -f compose.prod.yaml pull (Download image baru)
        ├── 4. Zero-Downtime Rolling Update:
        │       - Restart app1 -> Tunggu health check OK
        │       - Restart app2 -> Tunggu health check OK
        │       - Nginx Load Balancer otomatis mengalihkan request secara mulus
        └── 5. Health Check Verifikasi via Load Balancer (http://<IP_LXC>/api/health)
```

---

### G. Prosedur Rollback Cepat

Jika versi baru yang dideploy bermasalah, Anda dapat melakukan rollback instan ke versi commit SHA stabil sebelumnya:

```bash
cd /home/deployer/wargakonek

# 1. Jalankan image dari SHA commit yang stabil
APP_IMAGE=ghcr.io/<owner>/wargakonek:<previous-commit-sha> docker compose -f compose.prod.yaml up -d

# 2. Verifikasi status Load Balancer & Containers
docker compose -f compose.prod.yaml ps
curl http://127.0.0.1/api/health
```



