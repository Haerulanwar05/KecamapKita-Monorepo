/** 
 * File ini adalah konfigurasi utama untuk aplikasi web Next.js Anda.
 * Next.js akan membaca file ini saat proses kompilasi (build) atau saat menjalankan server (dev).
 * @type {import('next').NextConfig} 
 */
const nextConfig = {
  // reactStrictMode: Mengaktifkan mode ketat React. 
  // Ini akan memunculkan peringatan (warning) di terminal jika ada kode yang berpotensi error atau menggunakan fitur lawas.
  reactStrictMode: true,
  
  images: {
    // domains: Mengizinkan Next.js komponen <Image /> untuk mengambil gambar eksternal dari domain tertentu.
    // Di sini 'placehold.co' diizinkan, artinya Anda bisa menggunakan gambar dari URL placehold.co.
    domains: ['placehold.co'],
  },
  
  experimental: {
    // optimizeCss: Saat ini dinonaktifkan (false) untuk menghindari error 'Cannot find module critters'
    optimizeCss: false,
  },
  
  compiler: {
    // removeConsole: Menghapus semua perintah `console.log()` di browser.
    // Namun, ini hanya diaktifkan jika aplikasi sedang berada di mode "production" (sudah dirilis/deployed).
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // headers(): Mengatur respons HTTP Header tambahan untuk alasan keamanan.
  async headers() {
    return [
      {
        // Berlaku untuk semua rute di website (/(.*))
        source: '/(.*)',
        headers: [
          {
            // Mencegah peramban (browser) "menebak" jenis file yang salah, melindungi dari serangan sniffing.
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Mencegah website Anda disisipkan ke dalam <iframe> di website lain (mencegah Clickjacking).
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // Mengaktifkan filter XSS (Cross-Site Scripting) bawaan dari browser lama.
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

// Mengekspor konfigurasi agar dapat dibaca oleh sistem Next.js
module.exports = nextConfig;
