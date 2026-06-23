# 📊 PROGRESS TRACKER: KecamapKita

*(Status Terakhir: 23 Juni 2026)*

## ✅ FITUR YANG SUDAH SELESAI (COMPLETED)

### 1. Sistem Spasial & Database (Backend)
- [x] **PostGIS Database:** Implementasi PostgreSQL dengan PostGIS untuk perhitungan jarak spasial (`ST_DistanceSphere`).
- [x] **Filter Radius 15KM:** Backend berhasil memblokir tempat wisata yang berjarak lebih dari 15 KM dari *user*.
- [x] **Dynamic OSM Fetching:** Integrasi **Overpass API (OpenStreetMap)** yang berjalan otomatis menyuntikkan data tempat wisata asli jika database Supabase kosong di daerah pengguna.
- [x] **Gemini AI Integration:** Asisten "Pak RT" dipindahkan ke sisi *Backend* untuk menjaga keamanan API Key.

### 2. Autentikasi & Keamanan (Backend)
- [x] **Sistem Login & Register:** Tersedia Endpoint `/api/auth/login` dan `/api/auth/register`.
- [x] **Enkripsi Kata Sandi:** Menggunakan *Hashing SHA256*.
- [x] **Sesi JWT:** Pengamanan berbasis *JSON Web Token* untuk rute yang membutuhkan akun.

### 3. Aplikasi Mobile (React Native / Expo)
- [x] **UI/UX Premium:** Antarmuka responsif dengan *Dark/Light Mode* manual.
- [x] **Location Awareness:** Reverse Geocoding (`expo-location`) berhasil dijalankan untuk mendapatkan nama Kecamatan.
- [x] **AI Chat UI:** Perbaikan *KeyboardAvoidingView* di Android sehingga *input text* tidak tenggelam saat mengetik.
- [x] **Dynamic Routing:** Tombol "Rute" di *ExploreTab* berhasil diperbaiki untuk mengarahkan pengguna ke koordinat asli (*lat*, *lng*) tempat wisata.
- [x] **Secure Storage Login:** Tab Petualangan dilengkapi *Modal Login/Register* dan menggunakan `expo-secure-store` untuk menyimpan *Token*.

---

## 🚧 FITUR YANG BELUM SELESAI / PERLU DIPERBAIKI (PENDING)

### 1. Sinkronisasi Check-in & Gamifikasi (PRIORITAS UTAMA)
- [x] **Tombol Check-in:** Tombol "Tandai Kunjungan" di *ExploreTab* sudah menembak API `/api/spots/{id}/checkin` dan memberikan XP.
- [x] **Data Statistik Profil:** Kolom "KUNJUNGAN" dan "DISTRIK" di *AdventureTab* berhasil menarik data statistik profil yang dinamis dari API `/api/auth/me`.
- [ ] **Level-Up Animasi:** Animasi Confetti masih bergantung simulasi Frontend (Opsional).

### 2. Logika Database untuk OSM Spots (Backend Bug Fix)
- [x] **Check-in OSM Bug:** API `checkin` telah diperbaiki. Kini menggunakan sistem *Dummy Spot* untuk mengamankan Foreign Key sehingga OSM Spots tidak lagi menyebabkan error "Spot not found".

### 3. Penyesuaian Frontend & UI Tambahan
- [x] **Password Visibility (Eye Icon):** Menambahkan tombol ikon mata (eye/eye-slash) di kolom *Password* saat Login/Register agar *user* bisa melihat ketikan sandinya.
- [ ] **Upload Foto (Opsional):** Integrasi bagi *user* untuk bisa mengambil gambar dan mengunggahnya.
- [ ] **Pilih Avatar:** Memungkinkan pengguna mengganti *emoji avatar* mereka di menu profil.

### 4. Penyempurnaan Akhir (Final Polish)
- [ ] **Riwayat Kunjungan (History Log):** Saat ini daftar "TEMPAT YANG DIKUNJUNGI" di *AdventureTab* selalu menampilkan *BELUM ADA JEJAK*. Perlu membuat Endpoint Backend `/api/user/checkins` dan merendernya di Frontend.
- [ ] **Lencana Pencapaian Dinamis:** Progres *Badge* (Penyembuh Jiwa, Kolektor Rasa, dll.) masih ditulis manual 0/2. Perlu logika dari Backend untuk menghitung berapa banyak *vibe* spesifik yang sudah dikunjungi pengguna.
- [ ] **AI Advice di ExploreTab:** Nasihat Pak RT di *ExploreTab* (💡 REKOMENDASI PAK RT) masih bersifat teks statis "Cobain datang dan rasakan suasananya langsung!". Jika memungkinkan, *Backend* harus memberikan teks unik untuk setiap spot.

---
> **Catatan Penulis:** *File ini bersifat sementara untuk *tracking* sisa tugas sebelum aplikasi benar-benar di-deploy ke produksi/Play Store.*
