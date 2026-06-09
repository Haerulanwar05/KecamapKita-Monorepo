# 🧭 KecamapKita (Rona Kecamatan)

**Sistem Informasi & Petualangan Wisata Mikro Berbasis AI dan Geofencing**

![KecamapKita Banner](https://images.unsplash.com/photo-1558230315-5927395092cf?auto=format&fit=crop&w=1200&h=300&q=80)

KecamapKita adalah platform ekosistem wisata mikro (*micro-tourism*) hibrida yang dirancang khusus untuk menghubungkan wisatawan lokal dengan destinasi tersembunyi berkonsep *weather-adaptive*. Proyek ini diorkestrasi menggunakan teknologi spasial terkini, gamifikasi RPG, dan interaksi AI yang cerdas untuk menghadirkan rekomendasi hiperlokal.

---

## 🏗️ Struktur Repositori (Monorepo)

Proyek ini dibangun menggunakan arsitektur modern yang memisahkan antara *Backend*, *Web Frontend*, dan *Mobile Application*, namun terkumpul dalam satu repositori (*monorepo*) agar mudah dikelola.

### 1. 🟢 Backend (`/kecamapkita-backend`)
*Dapur pacu data dan kecerdasan buatan.*
- **Framework:** FastAPI (Python) - *Asynchronous & High Performance*
- **Database:** PostgreSQL dengan ekstensi **PostGIS** untuk kalkulasi jarak tata ruang `ST_DistanceSphere` yang sangat presisi.
- **ORM:** SQLAlchemy (Async) dengan Pydantic V2 untuk validasi *schema*.
- **AI Integration:** Google Generative AI (**Gemini 3.5 Flash**) untuk asisten interaktif "Pak RT".
- **Keamanan:** Autentikasi berbasis JWT (*JSON Web Token*).

### 2. 📱 Mobile App (`/kecamapkita-mobile`)
*Aplikasi native seluler untuk pengalaman eksplorasi interaktif di lapangan.*
- **Framework:** React Native dengan **Expo** (TypeScript).
- **Desain UI/UX Premium:** Kustomisasi kelas atas (100% *parity* dengan prototipe desain HTML).
- **Fitur Spesial:**
  - **Dynamic Dark/Light Mode:** Terintegrasi di seluruh lapisan antarmuka secara manual.
  - **Geofencing Check-in:** Validasi jarak perangkat keras GPS (<100m) menggunakan `expo-location`.
  - **Weather & Location Awareness:** Toast Banner cuaca dinamis dan indikator *Kecamatan Aktif* untuk menunjang eksplorasi *weather-adaptive*.
  - **Gamifikasi RPG Lengkap (Petualangan):** 
    - Sistem Pangkat (Level 1-5) dengan *Progress Bar* XP.
    - Dashboard Statistik Eksplorasi (Total Kunjungan, Distrik, XP).
    - Rak Koleksi Lencana Pencapaian (Contoh: *Penyembuh Jiwa*, *Kolektor Rasa*).
    - Riwayat Kunjungan dengan *Time-Filter* interaktif.
    - Sistem partikel animasi kembang api (*Confetti*) saat *Level Up*.

### 3. 🌐 Web App (`/kecamapkita-frontend`)
*Portal dashboard dan eksplorasi berbasis peramban (browser).*
- **Framework:** Next.js 14 (App Router).
- **Styling & State:** Tailwind CSS dan Zustand State Manager untuk interaktivitas mulus.

---

## ✨ Fitur Utama (Highlight)

1. **Eksplorasi Vibe-Based:** Pengguna dapat menyaring destinasi wisata berdasarkan *vibe* (Contoh: `#Syahdu`, `#Kenyang`, `#Kreatif`).
2. **Kalkulasi Jarak Real-Time:** Menghitung jarak presisi ke destinasi dengan radius kelengkungan bumi (ST_DistanceSphere).
3. **Asisten AI "Pak RT":** Integrasi API langsung dengan *Gemini 3.5 Flash* yang merespons pertanyaan secara *context-aware* (tahu posisi kecamatan pengguna).
4. **Sistem Pangkat Petualangan:** 
   - 🥚 Level 1: Pendatang Baru
   - 🐣 Level 2: Langkah Pertama
   - 🚶🏽‍♂️ Level 3: Penjelajah Santai
   - 🎯 Level 4: Pencari Harmoni
   - 👑 Level 5: Kecamap Overlord

---

## 🚀 Panduan Instalasi & Eksekusi

Proyek ini menggunakan arsitektur *monorepo* (gabungan beberapa aplikasi). Oleh karena itu, Anda harus menginstal dependensi (library) dan menjalankan masing-masing komponen di **3 tab terminal (Anaconda Prompt) yang berbeda**.

### 1. 🟢 Persiapan & Menjalankan Backend (FastAPI)
Buka tab terminal pertama (Anaconda Prompt), aktifkan environment Python Anda, lalu masuk ke folder backend:

**A. Instalasi Library**
```bash
# Masuk ke folder backend
cd kecamapkita-backend

# (Opsional) Jika Anda belum membuat/mengaktifkan environment:
# conda create -n kecamapkita-env python=3.12 -y
# conda activate kecamapkita-env

# Instal semua library Python yang dibutuhkan (FastAPI, SQLAlchemy, dll)
pip install -r requirements.txt
```

**B. Menjalankan Server Backend**
```bash
# Pastikan file .env sudah diatur sesuai kebutuhan
# Lalu nyalakan server backend:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- API Dokumentasi (Swagger) dapat diakses di: `http://localhost:8000/docs`
- Jika ingin memasukkan data awal destinasi (Seeding), hentikan server sebentar (`Ctrl+C`), jalankan `python seed.py`, lalu nyalakan kembali.

---

### 2. 🌐 Persiapan & Menjalankan Web Platform (Next.js)
Buka tab terminal **kedua** (biarkan tab backend tetap menyala di background), lalu masuk ke folder frontend:

**A. Instalasi Library**
```bash
# Masuk ke folder frontend
cd kecamapkita-frontend

# Instal framework Next.js dan Tailwind CSS
npm install
```

**B. Menjalankan Web Server**
```bash
# Jalankan web di mode development
npm run dev
```
- Buka peramban (browser) Anda dan akses: `http://localhost:3000`

---

### 3. 📱 Persiapan & Menjalankan Aplikasi Mobile (React Native / Expo)
Buka tab terminal **ketiga**, lalu masuk ke folder mobile:

**A. Instalasi Library**
```bash
# Masuk ke folder mobile
cd kecamapkita-mobile

# Instal semua modul React Native dan Expo
npm install
```

**B. Menjalankan Server Expo**
```bash
# Pastikan Anda telah membuat file .env yang memuat EXPO_PUBLIC_GEMINI_API_KEY
# Lalu jalankan server mobile:
npx expo start
```
- *QR Code* akan muncul di terminal Anda.
- **Bagi Pengguna Android:** Unduh aplikasi **Expo Go** dari Google Play Store, lalu pindai *QR code* menggunakan fitur *Scan* di dalam aplikasi tersebut.
- **Bagi Pengguna iOS:** Buka aplikasi **Kamera** bawaan iPhone, pindai *QR code*, lalu klik notifikasi peringatan yang muncul untuk membuka aplikasi Expo Go.
- *Catatan penting: Pastikan Laptop dan Smartphone Anda terhubung pada jaringan WiFi yang sama agar aplikasi dapat termuat.*

---

## ☁️ Automasi & Deployment (Phase 4)

Konfigurasi _Continuous Deployment_ (CD) telah disiapkan secara profesional di setiap sub-direktori:

- **Backend (Docker)**: Berisi `Dockerfile` dengan *Multi-Stage Build* untuk instalasi depedensi geospasial `asyncpg` dan utilitas PostGIS. 
- **Frontend (Vercel Edge)**: Konfigurasi `vercel.json` dan performa di `next.config.js` sudah siap dieksekusi.
- **Mobile (Google Play Store)**: Skema rilis dan penandatanganan sertifikat produksi (*signing keys*) terekam rapi di `eas.json` melalui Expo Application Services (*EAS Submit*).

---
*Dikembangkan untuk memajukan pariwisata mikro Kecamatan oleh Tim KecamapKita.*
*Menyelami rona tersembunyi dari setiap langkah!*
# KecamapKita-Monorepo
