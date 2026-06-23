// Mengimpor React dan hook yang diperlukan (useState untuk menyimpan data sementara, useEffect untuk menjalankan efek samping)
import React, { useState, useEffect } from 'react';
// Mengimpor komponen-komponen dasar dari React Native untuk membangun antarmuka pengguna
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Text, StatusBar, Platform, AppState } from 'react-native';

// Mengimpor halaman/komponen tab yang akan ditampilkan di bagian tengah layar
import ExploreTab from './src/components/ExploreTab';
import AdventureTab from './src/components/AdventureTab';
import AiNeighborTab from './src/components/AiNeighborTab';

// Mengimpor pustaka untuk mengontrol Navigation Bar bawaan Android (tombol back, home, dll)
import * as NavigationBar from 'expo-navigation-bar';

// Mengimpor ikon vektor dari Expo (menggunakan set ikon FontAwesome5)
import { FontAwesome5 } from '@expo/vector-icons';

export default function App() {
  // State untuk melacak tab mana yang sedang aktif. Defaultnya adalah 'explore' (Eksplorasi)
  const [activeTab, setActiveTab] = useState<'explore' | 'adventure' | 'ai-neighbor'>('explore');
  // State untuk menyimpan preferensi tema (gelap atau terang). Defaultnya false (terang)
  const [isDark, setIsDark] = useState(false);

  // useEffect ini berjalan satu kali saat aplikasi pertama kali dimuat
  useEffect(() => {
    // Mengecek apakah perangkat yang digunakan adalah Android
    if (Platform.OS === 'android') {
      // Memaksa Navigation Bar Android (tombol di bawah layar) agar selalu terlihat
      NavigationBar.setVisibilityAsync("visible");
      // Mengatur agar Navigation Bar tidak hilang sepenuhnya jika digeser (mencegah mode Immersive penuh)
      NavigationBar.setBehaviorAsync("inset-swipe");
    }
    
    // Menambahkan "pendengar" (listener) untuk memantau status aplikasi (misalnya: aktif, background, atau inactive)
    const subscription = AppState.addEventListener('change', nextAppState => {
      // Jika aplikasi kembali "active" (kembali dari background ke foreground) di Android
      if (nextAppState === 'active' && Platform.OS === 'android') {
         // Pastikan Navigation Bar tetap dipaksa untuk terlihat
         NavigationBar.setVisibilityAsync("visible");
      }
    });

    // Membersihkan listener ketika komponen aplikasi ditutup untuk mencegah kebocoran memori (memory leak)
    return () => subscription.remove();
  }, []);

  return (
    // SafeAreaView memastikan konten tidak tertutup oleh poni layar (notch) atau area sensor HP
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090b' : '#ffffff' }]}>
      {/* StatusBar mengatur warna jam dan ikon baterai di bagian paling atas layar */}
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#09090b" : "#ffffff"} />
      
      {/* Bagian Header / Atas Aplikasi */}
      <View style={[styles.header, { backgroundColor: isDark ? 'rgba(9,9,11,0.95)' : 'rgba(255,255,255,0.95)', borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}>
        <View style={styles.headerTitle}>
          {/* Logo Ikon Compass */}
          <View style={styles.logoIcon}>
            <FontAwesome5 name="compass" size={16} color="white" />
          </View>
          {/* Teks Judul dan Subjudul */}
          <View>
            <Text style={[styles.titleText, { color: isDark ? '#ffffff' : '#18181b' }]}>KecamapKita</Text>
            <Text style={styles.subtitleText}>RONA KECAMATAN</Text>
          </View>
        </View>
        
        {/* Tombol Cuaca dan Toggle Dark Mode di Kanan Atas */}
        <View style={{flexDirection: 'row', gap: 8}}>
            {/* Tombol ini akan membalikkan nilai isDark (jika true jadi false, dst) */}
            <TouchableOpacity onPress={() => setIsDark(!isDark)} style={[styles.weatherBtn, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
              <Text style={styles.weatherText}>{isDark ? '🌙' : '☀️'}</Text>
            </TouchableOpacity>
            {/* Tombol Indikator Suhu Cuaca */}
            <TouchableOpacity style={[styles.weatherBtn, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
              <Text style={[styles.weatherText, { color: isDark ? '#ffffff' : '#3f3f46' }]}>32°C</Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* Bagian Konten Utama: Menampilkan komponen tab sesuai dengan activeTab */}
      <View style={styles.mainContent}>
        {activeTab === 'explore' && <ExploreTab isDark={isDark} />}
        {activeTab === 'adventure' && <AdventureTab isDark={isDark} />}
        {activeTab === 'ai-neighbor' && <AiNeighborTab isDark={isDark} />}
      </View>

      {/* Bagian Navigasi Bawah (Bottom Navigation Bar) */}
      <View style={[styles.bottomNav, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderTopColor: isDark ? '#27272a' : '#f4f4f5' }]}>
        {/* Tombol Tab Eksplorasi */}
        <TouchableOpacity style={styles.navBtn} onPress={() => setActiveTab('explore')}>
          <FontAwesome5 name="compass" size={20} color={activeTab === 'explore' ? '#0f9f59' : '#a1a1aa'} />
          <Text style={[styles.navText, activeTab === 'explore' && styles.navTextActive]}>Eksplorasi</Text>
        </TouchableOpacity>
        {/* Tombol Tab Petualangan */}
        <TouchableOpacity style={styles.navBtn} onPress={() => setActiveTab('adventure')}>
          <FontAwesome5 name="medal" size={20} color={activeTab === 'adventure' ? '#0f9f59' : '#a1a1aa'} />
          <Text style={[styles.navText, activeTab === 'adventure' && styles.navTextActive]}>Petualangan</Text>
        </TouchableOpacity>
        {/* Tombol Tab Tanya Pak RT (AI) */}
        <TouchableOpacity style={styles.navBtn} onPress={() => setActiveTab('ai-neighbor')}>
          <FontAwesome5 name="comment-dots" size={20} color={activeTab === 'ai-neighbor' ? '#0f9f59' : '#a1a1aa'} />
          <Text style={[styles.navText, activeTab === 'ai-neighbor' && styles.navTextActive]}>Tanya Pak RT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// StyleSheet untuk mendefinisikan gaya (CSS-like) dari komponen-komponen di atas
const styles = StyleSheet.create({
  container: {
    flex: 1, // Memenuhi seluruh ruang layar yang tersedia
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row', // Menyusun elemen secara horizontal (kiri ke kanan)
    justifyContent: 'space-between', // Memberi jarak maksimal antara elemen kiri dan kanan
    alignItems: 'center', // Meratakan elemen ke tengah secara vertikal
    paddingHorizontal: 24,
    // Di Android, tambahkan tinggi StatusBar agar teks tidak tertutup oleh poni/kamera
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#0f9f59',
    justifyContent: 'center', // Menengahkan ikon di dalam kotak
    alignItems: 'center',
    marginRight: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#18181b',
  },
  subtitleText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0b8247',
    letterSpacing: 1,
    marginTop: 2,
  },
  weatherBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
  },
  weatherText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3f3f46',
  },
  mainContent: {
    flex: 1, // Membiarkan area konten mengambil sisa ruang setelah header dan footer
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Membagi jarak tombol secara rata
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 28 : 12,
    borderTopWidth: 1,
    borderTopColor: '#f4f4f5',
    backgroundColor: '#ffffff',
  },
  navBtn: {
    alignItems: 'center', // Memastikan ikon dan teks berada di tengah
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
    color: '#a1a1aa',
    fontWeight: '600',
  },
  navTextActive: {
    color: '#0f9f59', // Warna teks akan berubah menjadi hijau jika tab sedang aktif
    fontWeight: 'bold',
  }
});
