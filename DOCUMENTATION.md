# 🧭 KecamapKita (Rona Kecamatan)

**Sistem Informasi & Petualangan Wisata Mikro Berbasis AI dan Geofencing**

![KecamapKita Banner](https://images.unsplash.com/photo-1558230315-5927395092cf?auto=format&fit=crop&w=1200&h=300&q=80)

KecamapKita adalah platform ekosistem wisata mikro (_micro-tourism_) hibrida yang dirancang khusus untuk mempromosikan destinasi wisata lokal di tingkat Kecamatan. Proyek ini menggabungkan penelusuran lokasi, gamifikasi RPG, dan interaksi AI yang cerdas untuk menghidupkan kembali pesona pariwisata tersembunyi.

---

## 🏗️ Arsitektur Proyek (Monorepo)

Proyek ini dibangun menggunakan arsitektur modern yang memisahkan antara _Backend_, _Web Frontend_, dan _Mobile Application_, namun terkumpul dalam satu repositori (_monorepo_) agar mudah dikelola.

### 1. 🟢 Backend (`/kecamapkita-backend`)

_Dapur pacu data dan kecerdasan buatan._

- **Framework:** FastAPI (Python) - _Asynchronous & High Performance_
- **Database:** PostgreSQL dengan ekstensi **PostGIS** untuk kalkulasi jarak geografis presisi tinggi.
- **ORM:** SQLAlchemy (Async) dengan Pydantic V2 untuk validasi _schema_.
- **AI Integration:** Google Generative AI (**Gemini 3.5 Flash**) untuk asisten interaktif "Pak RT".
- **Keamanan:** Autentikasi berbasis JWT (_JSON Web Token_).

### 2. 📱 Mobile App (`/kecamapkita-mobile`)

_Pengalaman utama pengguna untuk eksplorasi di lapangan._

- **Framework:** React Native dengan **Expo** (TypeScript).
- **Desain UI/UX:** Kustomisasi kelas atas (100% _parity_ dengan prototipe HTML).
- **Fitur Spesial:**
  - **Dynamic Dark/Light Mode:** Terintegrasi di seluruh lapisan UI secara manual.
  - **Geofencing Check-in:** Validasi jarak pengguna (<100m) menggunakan `expo-location`.
  - **Bottom Sheet Modal:** Interaksi detail destinasi bergaya _modern floating sheet_.
  - **Weather & Location Awareness:** Toast Banner cuaca dinamis dan indikator *Kecamatan Aktif* (_weather-adaptive_).
  - **Gamifikasi RPG Lengkap (Petualangan):** 
    - Sistem Pangkat (Level 1-5) dengan _Progress Bar_ XP.
    - Dashboard Statistik Eksplorasi (Total Kunjungan, Distrik, XP).
    - Rak Koleksi Lencana Pencapaian (Contoh: _Penyembuh Jiwa_, _Kolektor Rasa_).
    - Riwayat Kunjungan dengan _Time-Filter_ interaktif.
    - Sistem partikel animasi kembang api (_Confetti_) saat _Level Up_.

### 3. 🌐 Web App (`/kecamapkita-frontend`)

_Portal dashboard dan eksplorasi berbasis peramban (browser)._

- **Framework:** Next.js 14 (App Router).
- **Styling:** Tailwind CSS.
- **State Management:** Zustand.
- **Deployment Ready:** Siap di-deploy menggunakan platform _Vercel Edge_.

---

## ✨ Fitur Utama (Highlight)

1. **Eksplorasi Vibe-Based:** Pengguna dapat menyaring destinasi wisata berdasarkan _vibe_ (Contoh: `#Syahdu`, `#Kenyang`, `#Kreatif`).
2. **Kalkulasi Jarak Real-Time:** Aplikasi membaca koordinat GPS perangkat (_Latitude & Longitude_) dan menghitung presisi jarak setiap spot wisata dengan algoritma `ST_DistanceSphere` milik PostGIS.
3. **Asisten AI "Pak RT":** Integrasi API langsung dengan _Gemini 3.5 Flash_ yang merespons pertanyaan secara _context-aware_ (tahu posisi kecamatan pengguna).
4. **Sistem Pangkat Petualangan:**
   - 🥚 Level 1: Pendatang Baru
   - 🐣 Level 2: Langkah Pertama
   - 🚶🏽‍♂️ Level 3: Penjelajah Santai
   - 🎯 Level 4: Pencari Harmoni
   - 👑 Level 5: Kecamap Overlord

---

## 🚀 Panduan Menjalankan Sistem

Karena ini menggunakan arsitektur berbasis _microservices_, Anda perlu menjalankan _Backend_ dan _Mobile_ di tab terminal yang terpisah. Disarankan menggunakan **Anaconda Prompt**.

### Langkah 1: Menyalakan Backend (FastAPI + AI)

Buka terminal baru dan masuk ke folder _backend_:

```bash
cd c:\KecamapKita\kecamapkita-backend
# Aktifkan virtual environment (jika menggunakan conda)
conda activate kecamapkita-env

# Jalankan server uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

_Pastikan file `.env` sudah berisi `GEMINI_API_KEY` milik Anda._

### Langkah 2: Menyalakan Mobile App (React Native)

Buka terminal baru dan masuk ke folder _mobile_:

```bash
cd c:\KecamapKita\kecamapkita-mobile
# Instalasi (jika belum)
npm install

# Jalankan server pengembangan Expo
npx expo start
```

_Aplikasi siap diuji coba dengan melakukan pemindaian (Scan QR) menggunakan aplikasi **Expo Go** pada perangkat Android/iOS Anda._

---

## 🎨 UI/UX Parity Report

Aplikasi _Mobile_ telah melewati tahap penyempurnaan desain untuk menyamai rancangan resolusi tinggi (_High Fidelity_) dari prototipe web:

- [x] Transisi Kartu ke Modal (_Bottom Sheet_) bergaya _floating_.
- [x] Tema Gelap (_Dark Mode_) tersinkronisasi di 100% komponen secara dinamis.
- [x] Tata letak _Padding_, _Border Radius_ (32px), dan _Watermark Gamepad_ yang premium.
- [x] Implementasi Gamifikasi Penuh (Rak Lencana, Statistik Kunjungan, Filter Riwayat, Banner Promo).
- [x] Komponen Cuaca (Toast Banner _Weather Adaptive_) di panel Eksplorasi.
- [x] Indikator perhitungan matematis untuk bar XP bebas _bug_ (maksimum mentok di 100% + _Confetti_).

---

_Dikembangkan untuk memajukan pariwisata mikro Kecamatan oleh Tim KecamapKita._
