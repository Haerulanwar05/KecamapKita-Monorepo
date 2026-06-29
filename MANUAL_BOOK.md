# 📘 BUKU PANDUAN PENGGUNA & PENGEMBANG (MANUAL BOOK)
**Proyek:** KecamapKita – Platform Eksplorasi Wisata & Kuliner Tingkat Kecamatan Berbasis AI  
**Versi:** 1.0.0 (Production Release)  
**Terakhir Diperbarui:** Juni 2026  

---

## 📑 DAFTAR ISI
1. [Pengantar & Gambaran Umum](#1-pengantar--gambaran-umum)
2. [Kebutuhan Sistem](#2-kebutuhan-sistem)
3. [Panduan Pengguna Akhir (End-User Guide)](#3-panduan-pengguna-akhir-end-user-guide)
   - 3.1. Instalasi Aplikasi Android (.apk)
   - 3.2. Registrasi & Masuk dengan Akun Google
   - 3.3. Menjelajahi Wisata Sekitar (Geofencing 15 KM)
   - 3.4. Konsultasi dengan Asisten AI "Pak RT"
   - 3.5. Gamifikasi Check-in & Badge Kecamatan
4. [Panduan Pengembang & Administrator (Developer Guide)](#4-panduan-pengembang--administrator-developer-guide)
   - 4.1. Arsitektur Monorepo
   - 4.2. Konfigurasi Lingkungan (.env)
   - 4.3. Deployment Backend ke Cloud (Hugging Face Spaces)
   - 4.4. Build & Cetak APK Mandiri (EAS CLI)
5. [Tanya Jawab Umum (FAQ & Troubleshooting)](#5-tanya-jawab-umum-faq--troubleshooting)

---

## 1. PENGANTAR & GAMBARAN UMUM
**KecamapKita** adalah aplikasi mobile inovatif yang dirancang untuk mempromosikan potensi pariwisata, kuliner, dan ruang publik tersembunyi (*hidden gems*) di tingkat kecamatan. Aplikasi ini menggabungkan pelacakan koordinat GPS real-time (*Geofencing*), radar satelit OpenStreetMap, kurasi visual kreatif, serta asisten kecerdasan buatan bernama **"Pak RT"** (didukung oleh Google Gemini AI).

---

## 2. KEBUTUHAN SISTEM
Untuk menjalankan aplikasi **KecamapKita** dengan lancar, perangkat pengguna harus memenuhi spesifikasi minimum berikut:
*   **Sistem Operasi:** Android 8.0 (Oreo) atau lebih baru / iOS 13.0+ (via Expo Go).
*   **Perangkat Keras:** RAM minimal 2 GB, Penyimpanan kosong minimal 100 MB.
*   **Perizinan Perangkat (Permissions):** 
    *   Akses Lokasi / GPS (*Location Services*) – **Wajib Aktif** untuk mendeteksi kecamatan sekitar.
    *   Koneksi Internet (*Wi-Fi / Seluler*) – Wajib terhubung ke server cloud.

---

## 3. PANDUAN PENGGUNA AKHIR (END-USER GUIDE)
*(Catatan Laporan Resmi / Skripsi: Pada bagian ini telah disediakan penjelasan antarmuka beserta diagram layout visual. Silakan sisipkan hasil tangkapan layar / screenshot asli aplikasi yang dijalankan melalui **Expo Go (`npm run start`)** pada kotak slot yang tersedia).*

---

### 3.1. Registrasi & Masuk dengan Akun Google
**Penjelasan Fitur:**  
Untuk memberikan kenyamanan maksimal dan keamanan data, KecamapKita menggunakan sistem autentikasi satu ketukan (*One-Tap Login*) terintegrasi dengan Google Identity. Pengguna tidak perlu repot mengisi formulir pendaftaran atau menghafal kata sandi baru.

**Langkah-langkah Masuk:**
1. Buka aplikasi **KecamapKita** melalui peramban atau aplikasi Expo Go di HP Anda. Anda akan disambut oleh animasi pembuka yang elegan.
2. Pada bilah menu navigasi di bagian bawah layar, ketuk ikon **Profil / Petualangan**.
3. Ketuk tombol merah bertuliskan **"Masuk dengan Akun Google"** yang berada di tengah layar.
4. Jendela *pop-up* resmi Google akan muncul. Pilih salah satu email Google Anda yang aktif.
5. Dalam sekejap, profil Anda akan terbangun secara otomatis lengkap dengan nama, foto profil Google, dan dompet poin digital Anda!


> 🖼️ **[BUKTI SCREENSHOT 1: HALAMAN MASUK / LOGIN GOOGLE]**  
> ![Screenshot Login](images/1_login.png)

---

### 3.2. Menjelajahi Wisata Sekitar (Geofencing 15 KM)
**Penjelasan Fitur:**  
Ini adalah fitur inti KecamapKita. Sistem menggunakan teknologi *Geofencing* cerdas yang melacak koordinat GPS secara *real-time*. Aplikasi hanya menampilkan destinasi wisata, kuliner, dan ruang publik yang berada dalam **radius maksimal 15 Kilometer** dari posisi pengguna berpijak, menciptakan rekomendasi yang sangat lokal dan mudah dijangkau.

**Langkah-langkah Eksplorasi:**
1. Pastikan fitur GPS / Lokasi di HP Anda sudah aktif.
2. Buka tab utama **Eksplorasi (Beranda)**. Di bagian atas layar, sistem otomatis mendeteksi nama kecamatan Anda saat ini (contoh: *📍 Kecamatan Coblong, Bandung*).
3. Anda akan melihat deretan kartu visual destinasi wisata terdekat. Setiap kartu dilengkapi dengan foto HD dari Unsplash, label kategori, rating bintang, dan jarak akurat (misal: *1.2 KM dari posisi Anda*).
4. Gunakan pil filter **Vibe** di bawah header (misal: *🍃 Santai, ☕ Kuliner, 📚 Edukasi, 📸 Instagramable*) untuk menyaring tempat sesuai suasana hati Anda.
5. **Radar Satelit Otomatis:** Jika Anda berkunjung ke kecamatan pelosok yang belum ada di database lokal, sistem akan memicu *Overpass API* untuk menarik data taman dan monumen secara langsung dari satelit OpenStreetMap dalam hitungan detik!


> 🖼️ **[BUKTI SCREENSHOT 2: BERANDA EKSPLORASI & RADAR KECAMATAN]**  
> ![Screenshot Eksplorasi](images/2_eksplorasi.png)

---

### 3.3. Konsultasi dengan Asisten AI "Pak RT"
**Penjelasan Fitur:**  
"Pak RT" adalah asisten virtual pintar berbasis **Google Gemini AI** yang bertindak sebagai pemandu lokal ramah 24 jam. Pak RT dilatih khusus untuk memberikan rekomendasi kuliner rahasia (*hidden gems*), rute jalan kaki tercepat, hingga tips berkunjung sesuai cuaca kecamatan saat itu.

**Langkah-langkah Konsultasi:**
1. Ketuk ikon percakapan robot bertuliskan **Asisten AI** pada menu navigasi bawah.
2. Ruang obrolan interaktif dengan Pak RT akan terbuka. Pak RT akan menyapa dengan sapaan khas warga lokal.
3. Ketik pertanyaan apa saja di kolom teks bawah, contoh:  
   * *"Pak RT, di sekitar sini ada tempat nugas yang adem dan kopinya enak gak?"*  
   * *"Apa makanan legendaris yang wajib dicoba di kecamatan ini?"*
4. Ketuk tombol **Kirim (Send)**. Dalam 2 detik, Pak RT akan menjawab dengan bahasa yang santai, akurat, dan merinci rekomendasi tempat beserta perkiraan harganya!


> 🖼️ **[BUKTI SCREENSHOT 3: CHAT DENGAN ASISTEN AI "PAK RT"]**  
> ![Screenshot Chat AI](images/3_chat_pak_rt.png)

---

### 3.4. Gamifikasi Check-in & Badge Kecamatan
**Penjelasan Fitur:**  
Untuk meningkatkan keterlibatan pengguna (*user engagement*), KecamapKita menerapkan sistem gamifikasi eksplorasi. Pengguna yang mendatangi lokasi wisata secara fisik dapat melakukan *Check-in* GPS untuk mengumpulkan poin petualangan serta membuka piala koleksi digital.

**Langkah-langkah Check-in & Klaim Badge:**
1. Kunjungi salah satu tempat wisata yang ada di daftar eksplorasi aplikasi Anda.
2. Setibanya di lokasi, ketuk kartu tempat wisata tersebut untuk membuka halaman detail.
3. Ketuk tombol kuning bertuliskan **"📍 Check-In di Lokasi Ini"**.
4. Sistem akan memvalidasi koordinat GPS Anda. Jika jarak Anda terkonfirmasi berada dalam radius 500 meter dari lokasi wisata, *Check-In* akan dinyatakan **Berhasil**!
5. Efek animasi konfeti perayaan akan meledak di layar, dan Anda akan mendapatkan **+50 Poin Eksplorasi**.
6. Buka tab **Profil** untuk melihat koleksi piala emas dan **Badge Penjelajah Kecamatan** yang berhasil Anda raih!


> 🖼️ **[BUKTI SCREENSHOT 4: CHECK-IN BERHASIL & BADGE PIALA]**  
> ![Screenshot Gamifikasi](images/4_badge_piala.png)

---

### 3.5. Profil Petualangan & Riwayat Lencana
**Penjelasan Fitur:**  
Halaman Profil Petualangan bertindak sebagai dasbor prestasi penjelajah. Setiap check-in wisata dan interaksi akan merekam jejak kunjungan, meningkatkan level eksplorasi (mulai dari *Pendatang Baru*), serta membuka lencana pencapaian khusus seperti *Penyembuh Jiwa*, *Kolektor Rasa*, *Si Paling Kreatif*, hingga *Penjelajah Sejati*.

**Langkah-langkah Memantau Progres:**
1. Ketuk tab **Petualangan** pada menu bawah.
2. Pantau kartu peringkat eksplorasi Anda (menampilkan level, progress bar XP, dan jumlah kunjungan distrik).
3. Gulir ke bawah pada bagian **Lencana Pencapaian** untuk melihat misi eksplorasi yang sedang berjalan maupun yang sudah terbuka.


> 🖼️ **[BUKTI SCREENSHOT 5: PROFIL PETUALANGAN & LENCANA PENCAPAIAN]**  
> ![Screenshot Profil Petualangan](images/5_profil_petualangan.png)

---

## 4. PANDUAN PENGEMBANG & ADMINISTRATOR (DEVELOPER GUIDE)

### 4.1. Arsitektur Monorepo
Proyek ini dikelola dalam satu repositori terpadu (*Monorepo*) dengan struktur folder:
```text
KecamapKita/
├── kecamapkita-backend/   # API Server (FastAPI, SQLite, Python 3.12)
├── kecamapkita-mobile/    # Aplikasi Mobile (React Native, Expo, TypeScript)
├── kecamapkita-web/       # Landing Page & Web Dasbor (React / Prototype HTML)
└── Dockerfile             # Konfigurasi Build Cloud Root (Hugging Face Spaces)
```

### 4.2. Konfigurasi Lingkungan (.env)
Pastikan variabel lingkungan berikut telah dikonfigurasi pada sistem cloud atau file `.env` lokal:
*   **Backend (`kecamapkita-backend/.env` / Cloud Secrets):**
    ```env
    GEMINI_API_KEY="AQ.Ab8RN6Lvzd..." # Kunci API resmi Google AI Studio
    JWT_SECRET_KEY="rahasia_negara_123" # Kunci enkripsi token keamanan
    ```
*   **Mobile (`kecamapkita-mobile/.env`):**
    ```env
    EXPO_PUBLIC_GEMINI_API_KEY="AQ.Ab8RN6Lvzd..."
    EXPO_PUBLIC_API_URL="https://username-kecamapkita-backend.hf.space" # URL Cloud Live
    ```

### 4.3. Deployment Backend ke Cloud (Hugging Face Spaces)
Backend di-host secara gratis 24/7 menggunakan kontainer Docker di **Hugging Face Spaces**:
1. Buat Space baru ber-SDK **Docker (Blank)** di Hugging Face.
2. Masukkan rahasia `GEMINI_API_KEY` dan `JWT_SECRET_KEY` di menu *Settings > Variables and secrets*.
3. Kirim kode dari terminal lokal menggunakan token akses (`hf_...`):
   ```bash
   cd c:\KecamapKita\kecamapkita-backend
   git init && git add . && git commit -m "Deploy Backend"
   git push https://USERNAME:TOKEN_HF@huggingface.co/spaces/USERNAME/kecamapkita-backend HEAD:main --force
   ```
4. Server akan otomatis melakukan *build* dan menjalankan seeder database (`seed.py`) di port `7860`.

### 4.4. Build & Cetak APK Mandiri (EAS CLI)
Untuk mencetak aplikasi mobile menjadi file instalasi `.apk` untuk Android:
1. Aktifkan terminal dan instal EAS CLI secara global:
   ```bash
   npm install -g eas-cli
   ```
2. Masuk ke direktori mobile dan mulai proses build cloud:
   ```bash
   cd c:\KecamapKita\kecamapkita-mobile
   eas build --platform android --profile production_apk
   ```
3. Tunggu proses antrean di cloud Expo selesai (sekitar 10-15 menit). Unduh APK melalui tautan atau scan QR Code yang dihasilkan.

---

## 5. TANYA JAWAB UMUM (FAQ & TROUBLESHOOTING)

**Q: Mengapa rekomendasi tempat wisata kosong atau loading terus?**  
*A: Pastikan GPS ponsel Anda aktif dan izin lokasi telah diberikan untuk aplikasi KecamapKita. Periksa juga koneksi internet Anda agar aplikasi bisa terhubung ke server cloud Hugging Face.*

**Q: Apakah data check-in saya akan hilang jika berganti ponsel?**  
*A: Selama Anda masuk (login) menggunakan Akun Google atau email yang sama, riwayat penjelajahan dan badge piala Anda akan tetap tersimpan dan tersinkronisasi di cloud.*

**Q: Mengapa foto tempat wisata selalu bervariasi dan tidak kaku?**  
*A: Backend KecamapKita dilengkapi algoritma pencocokan kata kunci kontekstual. Jika tempat wisata tidak memiliki foto asli di OpenStreetMap, sistem akan mencarikan foto HD dari Unsplash yang sesuai dengan kategori tempat (misal: Kafe, Taman Alam, Museum Kuliner).*

---
*© 2026 Tim Pengembang KecamapKita. Hak Cipta Dilindungi Undang-Undang.*
