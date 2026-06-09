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

## 🚀 Panduan Eksekusi (Runbook)

Karena ini menggunakan arsitektur berbasis *microservices*, Anda perlu menjalankan *Backend*, *Web*, dan *Mobile* di tab terminal yang terpisah. Disarankan menggunakan **Anaconda Prompt**.

### 1. Menjalankan Backend Spasial (FastAPI)
Buka terminal baru dan masuk ke folder *backend*:
```bash
cd kecamapkita-backend
# Pastikan environment .env telah disesuaikan (masukkan GEMINI_API_KEY)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- API Documentation (Swagger) tersedia di: `http://localhost:8000/docs`
- Untuk mempopulasikan kembali database (*Seeding*), jalankan: `python seed.py`

### 2. Menjalankan Web Platform (Next.js)
Buka terminal baru dan masuk ke folder *frontend*:
```bash
cd kecamapkita-frontend
npm run dev
```
- Akses web lokal melalui: `http://localhost:3000`

### 3. Menjalankan Aplikasi Mobile (React Native)
Buka terminal baru dan masuk ke folder *mobile*:
```bash
cd kecamapkita-mobile
# Instalasi (jika belum)
npm install
# Jalankan server pengembangan Expo
npx expo start
```
- *Aplikasi siap diuji coba dengan melakukan pemindaian (Scan QR) menggunakan aplikasi **Expo Go** pada perangkat Android/iOS Anda.*

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
