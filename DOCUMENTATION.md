# 🧭 KecamapKita (Rona Kecamatan)

**Sistem Informasi & Petualangan Wisata Mikro Berbasis AI, Geofencing, dan Gamifikasi RPG**

![KecamapKita Banner](https://images.unsplash.com/photo-1558230315-5927395092cf?auto=format&fit=crop&w=1200&h=300&q=80)

KecamapKita adalah platform ekosistem wisata mikro (*micro-tourism*) hibrida yang dirancang khusus untuk mempromosikan destinasi wisata lokal tersembunyi di tingkat Kecamatan. Proyek ini menggabungkan pelacakan lokasi geospasial real-time, gamifikasi RPG interaktif, serta kecerdasan buatan (AI) kontekstual untuk memberikan rekomendasi wisata hiperlokal yang *weather-adaptive* (menyesuaikan cuaca).

---

## 🏗️ Arsitektur Sistem (Monorepo)

Proyek ini dibangun dengan struktur *Monorepo* modern yang memisahkan layanan menjadi tiga komponen utama namun tetap terpusat dalam satu repositori pengelolaan:

```
c:\KecamapKita\
├── kecamapkita-backend/   # REST API Server, Database SQLite, & AI Engine
├── kecamapkita-mobile/    # Aplikasi Mobile Native (React Native / Expo)
├── kecamapkita-frontend/  # Web Dashboard & Eksplorasi Portal (Next.js 14)
├── DOCUMENTATION.md       # Dokumentasi Utama Proyek
└── PROGRESS_TRACKER.md    # Pelacak Kemajuan & Checklist Fitur
```

### 1. 🟢 Backend (`/kecamapkita-backend`)
*Dapur pacu logika geospasial, gamifikasi, dan kecerdasan buatan.*
- **Framework:** FastAPI (Python 3.12) - *Asynchronous & High Performance*.
- **Database:** SQLite Lokal (`aiosqlite`) yang mandiri, super cepat, dan ringan tanpa ketergantungan server cloud eksternal. Perhitungan jarak spasial menggunakan algoritma **Haversine Python Murni**.
- **ORM & Schema:** SQLAlchemy Async Engine dengan Pydantic V2 untuk validasi kontrak data yang ketat.
- **AI Engine:** Google Generative AI (**Gemini 3.5 Flash**) yang dikonfigurasi sebagai asisten virtual lokal bertema **"Pak RT"**.
- **Sistem Keamanan:** Autentikasi berlapis menggunakan *JSON Web Token (JWT)* dan enkripsi sandi *SHA-256 Hashing*.

### 2. 📱 Mobile Application (`/kecamapkita-mobile`)
*Antarmuka native seluler utama untuk penjelajahan lapangan.*
- **Framework:** React Native bersama **Expo SDK 54** (TypeScript).
- **Resolusi IP Dinamis:** Menggunakan `src/utils/api.ts` yang melacak metadata Metro Bundler (`Constants.expoConfig?.hostUri`) secara otomatis, memungkinkan aplikasi mendeteksi alamat IP Wi-Fi laptop penyedia API secara real-time tanpa konfigurasi manual `.env`.
- **Fitur Spesial Mobile:**
  - **Dynamic Dark / Light Mode:** Tersinkronisasi secara manual dan mulus di seluruh lapisan UI.
  - **Location Awareness & Timeout Shield:** Reverse Geocoding (`expo-location`) dengan proteksi *race timeout* 5 detik untuk mendeteksi nama Kecamatan aktif tanpa risiko *freeze/crash*.
  - **Gamifikasi RPG Lengkap:**
    - Pangkat Petualang (Level 1 - 5) dan *Progress Bar* XP.
    - Sistem Check-in Geofencing (validasi jarak < 100 meter dari titik wisata menghasilkan +150 XP).
    - Rak Lencana Pencapaian Dinamis (*Penyembuh Jiwa*, *Kolektor Rasa*, *Kreatif*) yang dihitung real-time dari riwayat kunjungan.
    - Riwayat Penjelajahan (*History Log*) dinamis bergaya kronologis.
    - Ledakan partikel perayaan (*Confetti Cannon*) saat naik level.
  - **Asisten AI Tetangga (Pak RT):** Chatbot interaktif inter-tab dengan penyimpanan riwayat percakapan lokal via `expo-secure-store` serta fitur hapus riwayat.

### 3. 🌐 Web Portal (`/kecamapkita-frontend`)
*Portal eksplorasi dan web dashboard berbasis peramban.*
- **Framework:** Next.js 14 (App Router).
- **Styling & State:** Tailwind CSS dan Zustand State Management.

---

## ✨ Fitur Unggulan

1. **Eksplorasi Vibe-Based:** Saring tempat wisata berdasarkan suasana hati atau kategori unik seperti `#syahdu`, `#kenyang`, `#kreatif`, dan `#sejarah`.
2. **Dynamic OSM Satellite Fetching:** Jika pangkalan data lokal kosong atau pengguna berada di daerah baru di luar radius 15 KM, backend secara otomatis memanggil **Overpass API (OpenStreetMap)** untuk menyuntikkan data wisata asli sekitar pengguna secara seketika (*caching* 12 jam).
3. **AI Pak RT yang Context-Aware:** Asisten AI tidak hanya menjawab obrolan biasa, tetapi mampu menganalisis koordinat GPS pengguna serta memberikan **Nasihat Kustom** untuk setiap kartu tempat wisata di halaman eksplorasi.
4. **Keamanan & Manajemen Sesi:** Pengamanan sesi token disimpan di *Secure Store* seluler dan sinkron terhadap data XP serta pencapaian level secara langsung.

---

## 🎮 Sistem Pangkat & Gamifikasi (Rank System)

Setiap kunjungan yang valid (*Check-in*) memberikan **+150 XP**. Hierarki level petualang diatur sebagai berikut:

| Level | Pangkat | Rentang XP | Emoji | Keterangan |
| :---: | :--- | :---: | :---: | :--- |
| **1** | Pendatang Baru | 0 - 149 XP | 🥚 | Langkah awal menjelajahi kecamatan |
| **2** | Langkah Pertama | 150 - 299 XP | 🐣 | Mulai menemukan rona wisata lokal |
| **3** | Penjelajah Santai | 300 - 599 XP | 🚶🏽‍♂️ | Aktif mengunjungi berbagai spot |
| **4** | Pencari Harmoni | 600 - 1199 XP | 🎯 | Kolektor beragam *vibe* destinasi |
| **5** | Kecamap Overlord | 1200+ XP | 👑 | Penguasa sejati wisata kecamatan |

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

Karena arsitektur monorepo ini terdiri dari backend terpisah dan frontend mobile/web, disarankan menggunakan **Anaconda Prompt** dan membuka **2 hingga 3 tab terminal terpisah**.

### 1. 🟢 Menjalankan Backend Server (Terminal 1)
Buka Anaconda Prompt, aktifkan environment, dan jalankan FastAPI uvicorn:
```cmd
conda activate kecamapkita-env
cd c:\KecamapKita\kecamapkita-backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*Catatan:* Dokumentasi interaktif Swagger REST API dapat diakses melalui peramban di `http://localhost:8000/docs`.

### 2. 📱 Menjalankan Aplikasi Mobile Expo (Terminal 2)
Buka tab Anaconda Prompt baru, aktifkan environment, dan jalankan Expo:
```cmd
conda activate kecamapkita-env
cd c:\KecamapKita\kecamapkita-mobile
expo start
```
- **Koneksi Otomatis:** Aplikasi mobile sudah dilengkapi resolusi IP dinamis, sehingga otomatis mengarah ke IP Wi-Fi laptop Anda.
- **Uji Coba Fisik:** Buka aplikasi **Expo Go** di HP Android/iOS Anda dan pindai *QR Code* yang muncul di terminal.

### 3. 🌐 Menjalankan Web Portal Next.js (Terminal 3 - Opsional)
```cmd
cd c:\KecamapKita\kecamapkita-frontend
npm run dev
```
Akses web portal melalui peramban di `http://localhost:3000`.

---

## 🔌 Referensi Endpoint API Utama

- `POST /api/auth/register` : Mendaftarkan pengguna baru & inisialisasi statistik.
- `POST /api/auth/login` : Autentikasi pengguna & pengembalian JWT Token + Profil lengkap (History, Badges, XP).
- `GET /api/auth/me` : Mengambil data profil dinamis pengguna yang sedang login.
- `POST /api/user/avatar` : Memperbarui emoji avatar karakter pengguna.
- `GET /api/spots` : Mendapatkan daftar spot wisata dengan filter `lat`, `lng`, dan `vibe` (didukung otomatisasi OSM).
- `POST /api/spots/{id}/checkin` : Melakukan check-in kunjungan (validasi radius geofencing 100m & penambahan +150 XP).
- `POST /api/ai/chat` : Mengirim pesan ke asisten AI Pak RT (berbasis Gemini 3.5 Flash).

---

## 📦 Panduan Build & Deployment (Produksi)

### Build Android Standalone APK (`eas.json`)
Aplikasi mobile telah dikonfigurasi untuk menghasilkan file `.apk` mandiri menggunakan EAS Build:
```cmd
cd c:\KecamapKita\kecamapkita-mobile
npx eas build --platform android --profile production_apk
```

---
*Dikembangkan untuk memajukan eksplorasi pariwisata mikro lokal di tingkat Kecamatan. Menyelami rona tersembunyi dari setiap langkah!*
