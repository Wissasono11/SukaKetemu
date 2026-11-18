# SukaKetemu

> Platform pelaporan dan penelusuran barang hilang di lingkungan kampus UIN Sunan Kalijaga Yogyakarta.


SukaKetemu adalah platform pelaporan dan penelusuran barang hilang di lingkungan kampus UIN Sunan Kalijaga Yogyakarta. Sistem ini menggunakan pencocokan visual dan teks serta pelacakan titik lokasi untuk mempercepat penemuan barang kembali dan mencegah klaim palsu.

---

## Masalah yang Diselesaikan

Penyebaran informasi barang hilang di kampus selama ini bergantung pada grup WhatsApp dan akun media sosial. Cara ini menimbulkan kendala:

* Lokasi barang tidak tercatat jelas, apakah sudah diserahkan ke pos satpam tertentu atau masih dibawa penemu di area gedung.
* Laporan cepat tenggelam tanpa pencocokan otomatis antara deskripsi barang hilang dan temuan.
* Foto identitas (seperti KTM atau kartu penting) rawan tersebar bebas dan memudahkan klaim palsu.

SukaKetemu menyediakan alur pencatatan terpusat, menyamarkan data sensitif pada foto publik secara otomatis, dan memvalidasi serah terima barang melalui kode verifikasi.

---

## Alur Kerja Sistem

1. **Pelaporan:** Penemu mengunggah foto barang (dikompresi otomatis di sisi klien hingga maksimal 1,5 MB), menentukan lokasi via pemindaian QR checkpoint atau menu gedung, lalu memilih status penguasaan barang (dititipkan di pos satpam atau masih dibawa penemu).
2. **Pencocokan AI:** Model Vision-Language mengekstrak vektor representasi citra dan teks untuk menghitung skor kemiripan laporan hilang dan temuan dengan target Top-5 Accuracy minimal 70%.
3. **Verifikasi Identitas:** Pemilik barang menjawab pertanyaan terkait ciri rahasia yang disimpan terenkripsi sebelum kontak penemu atau detail pengambilan dibuka.
4. **Serah Terima:** Sistem menerbitkan tiket QR dan kode OTP 6-digit dinamis (berlaku 5 menit via Redis) yang dipindai petugas satpam atau penemu saat barang diserahkan.

---

## Tech Stack

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| Frontend | React, Vite, TypeScript, Tailwind CSS, Shadcn UI | PWA dengan dukungan offline storage menggunakan Dexie.js dan Workbox. |
| Backend Core | Express.js (TypeScript) di Vercel Serverless (`sin1`) | REST API, validasi Zod, kalkulasi skor kemiripan, dan penyamaran foto publik dengan Sharp. |
| AI Inference | Python, ONNX Runtime di Docker Hugging Face Spaces | Ekstraksi vektor embedding 512-dimensi dengan pemantauan keep-alive berkala. |
| Basis Data | PostgreSQL 16 + ekstensi `pgvector` (Supabase / Neon) | Penyimpanan relasional transaksi laporan dan pencarian kemiripan vektor kosinus. |
| Storage & Cache | Cloudflare R2 & Upstash Redis | Penyimpanan berkas foto publik/privat serta pengelolaan kode OTP serah terima. |

---

## Panduan Kloning dan Instalasi

Prasyarat: Node.js (versi 20 LTS atau lebih baru) dan Git.

### 1. Kloning Repositori
```bash
git clone https://github.com/username/SukaKetemu.git
cd SukaKetemu
```

### 2. Struktur Direktori
```text
SukaKetemu/
├── frontend/          # Aplikasi web client PWA (React + Vite)
├── backend/           # Core API Express.js (Serverless Vercel)
└── ai-service/        # Layanan inferensi model AI (Docker HFS)
```

### 3. Menjalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
Aplikasi frontend dapat diakses melalui `http://localhost:5173`.

### 4. Menjalankan Backend
```bash
cd ../backend
npm install
npm run dev
```
Server backend berjalan di `http://localhost:3000`.

---

## Tim Pengembang

Proyek ini dikembangkan oleh mahasiswa Program Studi Informatika, Fakultas Sains dan Teknologi, UIN Sunan Kalijaga Yogyakarta:

| Nama Anggota | NIM | Divisi | Peran |
| :--- | :---: | :---: | :--- |
| Bayu Wicaksono | 23106050002 | RPL | Lead Frontend & PWA Engineer |
| Rozin Gunagraha | 23106050084 | RPL | Lead Backend & Cloud Integration Engineer |
| Ahmad Musthofa Aslam | 23106050044 | RPL | Fullstack Location-Discovery & QA Engineer |
| Achmad Al Ghazali | 23106050029 | AI | AI & Multimodal Retrieval Engineer |
| Cleonando Aprilian | 23106050055 | SI | System Analyst, Database Designer & UX Evaluator |
| Muhammad Azzam Rabbani | 23106050026 | PJK | Location System, QR Infrastructure & Offline-Sync Engineer |
| Radinka Rafie Achmad Pradipta | 23106050059 | PJK | DevOps, CI/CD & Cloud Security Engineer |
