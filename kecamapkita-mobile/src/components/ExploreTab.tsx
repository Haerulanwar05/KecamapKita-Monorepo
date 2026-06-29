import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, Linking, Platform, TextInput, ScrollView, Modal } from 'react-native';
import * as Location from 'expo-location';
import { FontAwesome5 } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { getApiUrl } from '../utils/api';

interface SpotData {
    id: number;
    name: string;
    kecamatan: string;
    vibe: string;
    description: string;
    image: string;
    rating: number;
    distance: string;
    facilities: string[];
    aiAdvice: string;
    lat: number;
    lng: number;
}

const vibes = [
    { id: 'all', label: '✨ Semua Vibe' },
    { id: 'syahdu', label: '🍃 #Syahdu' },
    { id: 'kenyang', label: '🍜 #Kenyang' },
    { id: 'kreatif', label: '🎨 #Kreatif' },
    { id: 'sejarah', label: '🏛️ #Sejarah' }
];

export default function ExploreTab({ isDark }: { isDark: boolean }) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [activeVibe, setActiveVibe] = useState('all');
  const [search, setSearch] = useState('');
  const [activeKecamatan, setActiveKecamatan] = useState('Mencari lokasi...');
  const [spots, setSpots] = useState<SpotData[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<SpotData | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      
      // Ambil nama wilayah asli dari Google/Apple Maps bawaan HP
      try {
          const geocodePromise = Location.reverseGeocodeAsync({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude
          });
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));
          const geocode: any = await Promise.race([geocodePromise, timeoutPromise]);
          if (geocode && geocode.length > 0) {
              const districtName = geocode[0].district || geocode[0].city || geocode[0].subregion || "Destinasi";
              setActiveKecamatan(districtName);
          }
      } catch (e) {
          console.log("Gagal atau timeout mendapatkan nama wilayah:", e);
          setActiveKecamatan("Destinasi");
      }
    })();
  }, []);

  // KURIR MULAI BEKERJA: Mengambil data dari Backend
  useEffect(() => {
    if (!location) return;
    const fetchSpots = async () => {
      try {
        // AWAS: Menggunakan resolusi IP dinamis dari Metro Bundler laptop
        const API_URL = getApiUrl(); 
        
        // Fetch Data Tempat Wisata
        const res = await fetch(`${API_URL}/api/spots?lat=${location.coords.latitude}&lng=${location.coords.longitude}&vibe=all`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
            const formattedSpots = data.map((s: any) => ({
                id: s.id,
                name: s.name,
                kecamatan: activeKecamatan !== "Lokasi Tidak Diketahui" ? activeKecamatan : "Destinasi", 
                vibe: s.vibe || "syahdu",
                description: s.description || "Tidak ada deskripsi",
                image: s.image_url || 'https://images.unsplash.com/photo-1596306499317-8490232098fa?w=800',
                rating: 4.8, 
                distance: s.distance ? (s.distance / 1000).toFixed(1) + " km" : "0 km",
                facilities: ["Area Umum", "Parkir"],
                aiAdvice: s.ai_advice || s.description || "Cobain datang dan rasakan suasananya langsung!",
                lat: s.lat,
                lng: s.lng
            }));
            setSpots(formattedSpots);
        }
      } catch (e) {
        console.error("Gagal mengambil data dari Backend:", e);
      }
    };
    fetchSpots();
  }, [location, activeKecamatan]);

  const openDirections = (lat: number, lng: number, name: string) => {
    const scheme = Platform.select({ ios: 'maps://app?daddr=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({ ios: `${scheme}${latLng}`, android: `${scheme}${latLng}(${encodeURIComponent(name)})` });
    if (url) Linking.openURL(url);
  };

  const handleCheckin = async () => {
    if (!location || !selectedSpot) return;
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        Alert.alert('Belum Masuk', 'Silakan daftar atau masuk terlebih dahulu di menu Petualangan.');
        return;
      }

      const API_URL = getApiUrl();
      const body = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        spot_lat: selectedSpot.lat,
        spot_lng: selectedSpot.lng
      };

      const res = await fetch(`${API_URL}/api/spots/${selectedSpot.id}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const text = await res.text();
        let errorMsg = 'Terjadi kesalahan pada server';
        try { errorMsg = JSON.parse(text).detail || errorMsg; } catch {}
        Alert.alert('Gagal Check-in', errorMsg);
        return;
      }
      const data = await res.json();
      Alert.alert('Berhasil! 🎉', 'Kunjungan ditandai! Anda mendapatkan +150 XP. Cek profil Petualangan Anda!');
    } catch (e) {
      Alert.alert('Error', 'Gagal menyambung ke server');
    }
  };

  const getVibeColor = (vibe: string) => {
      if (vibe === 'syahdu') return '#0f9f59';
      if (vibe === 'kenyang') return '#f59e0b';
      if (vibe === 'kreatif') return '#3b82f6';
      return '#71717a';
  };

  const renderSpot = ({ item }: { item: SpotData }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => setSelectedSpot(item)}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.badgesTopLeft}>
                <View style={styles.badgeDark}>
                    <Text style={styles.badgeTextDark}>KEC. {item.kecamatan.toUpperCase()}</Text>
                </View>
                <View style={[styles.badgeVibe, { backgroundColor: getVibeColor(item.vibe) }]}>
                    <Text style={styles.badgeTextDark}>#{item.vibe.toUpperCase()}</Text>
                </View>
            </View>
            <View style={styles.badgeBottomRight}>
                <FontAwesome5 name="star" solid size={10} color="#fbbf24" />
                <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
        </View>
        
        <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.distanceBox}>
                    <FontAwesome5 name="walking" size={10} color="#71717a" style={{marginRight: 4}} />
                    <Text style={styles.distanceText}>{item.distance}</Text>
                </View>
            </View>
            <Text style={styles.descText} numberOfLines={2}>{item.description}</Text>
        </View>
    </TouchableOpacity>
  );

  const filteredSpots = spots.filter(s => 
      (activeVibe === 'all' || s.vibe === activeVibe) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#09090b' : '#fafafa' }]}>
      <View style={[styles.headerBox, { backgroundColor: isDark ? 'rgba(9,9,11,0.95)' : '#ffffff', borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}>
        <TouchableOpacity style={[styles.gpsBtn, { backgroundColor: isDark ? '#064e3b' : '#e6f7ee' }]}>
            <FontAwesome5 name="location-arrow" size={12} color={isDark ? '#34d399' : '#0f9f59'} />
            <Text style={[styles.gpsText, { color: isDark ? '#34d399' : '#086637' }]}>Gunakan lokasi saat ini ({location ? "Terhubung" : "Menunggu"})</Text>
        </TouchableOpacity>
        
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
            <FontAwesome5 name="search" size={14} color={isDark ? '#a1a1aa' : '#a1a1aa'} style={styles.searchIcon} />
            <TextInput 
                style={[styles.searchInput, { color: isDark ? '#ffffff' : '#18181b' }]}
                placeholder="Cari kecamatan (cth: Ubud, Menteng)..."
                placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
                value={search}
                onChangeText={setSearch}
            />
        </View>

        {/* Weather Info Adaptive Toast Banner inside Feed */}
        <View style={[styles.weatherBanner, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.1)' }]}>
            <Text style={{fontSize: 20, marginRight: 12}}>☀️</Text>
            <View style={{flex: 1}}>
                <Text style={[styles.weatherBannerTitle, { color: isDark ? '#34d399' : '#065f46' }]}>CUACA CERAH TERDETEKSI</Text>
                <Text style={[styles.weatherBannerDesc, { color: isDark ? '#a1a1aa' : '#71717a' }]}>Semua destinasi outdoor di sekitar Anda sangat disarankan untuk dikunjungi hari ini!</Text>
            </View>
        </View>

        {/* Active Sub-district Banner */}
        <View style={styles.activeKecamatanBox}>
            <View style={styles.activeDot} />
            <Text style={[styles.activeKecamatanText, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                Destinasi di <Text style={{fontWeight: 'bold', color: isDark ? '#d4d4d8' : '#3f3f46'}}>Kecamatan {activeKecamatan.toUpperCase()}</Text>
            </Text>
        </View>
      </View>

      <View style={[styles.vibeScrollContainer, { backgroundColor: isDark ? '#09090b' : '#ffffff', borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vibeScroll}>
              {vibes.map(v => (
                  <TouchableOpacity 
                    key={v.id} 
                    onPress={() => setActiveVibe(v.id)}
                    style={[styles.vibePill, activeVibe === v.id ? [styles.vibePillActive, { backgroundColor: isDark ? '#ffffff' : '#18181b' }] : [styles.vibePillInactive, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]]}
                  >
                      <Text style={[styles.vibeText, activeVibe === v.id ? [styles.vibeTextActive, { color: isDark ? '#18181b' : '#ffffff' }] : [styles.vibeTextInactive, { color: isDark ? '#a1a1aa' : '#71717a' }]]}>
                          {v.label}
                      </Text>
                  </TouchableOpacity>
              ))}
          </ScrollView>
      </View>

      <FlatList
        data={filteredSpots}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
            <TouchableOpacity style={[styles.card, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]} activeOpacity={0.9} onPress={() => setSelectedSpot(item)}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.cardImage} />
                    <View style={styles.badgesTopLeft}>
                        <View style={styles.badgeDark}>
                            <Text style={styles.badgeTextDark}>KEC. {item.kecamatan.toUpperCase()}</Text>
                        </View>
                        <View style={[styles.badgeVibe, { backgroundColor: getVibeColor(item.vibe) }]}>
                            <Text style={styles.badgeTextDark}>#{item.vibe.toUpperCase()}</Text>
                        </View>
                    </View>
                    <View style={styles.badgeBottomRight}>
                        <FontAwesome5 name="star" solid size={10} color="#fbbf24" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                </View>
                
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#18181b' }]}>{item.name}</Text>
                        <View style={styles.distanceBox}>
                            <FontAwesome5 name="walking" size={10} color={isDark ? '#a1a1aa' : '#71717a'} style={{marginRight: 4}} />
                            <Text style={[styles.distanceText, { color: isDark ? '#a1a1aa' : '#71717a' }]}>{item.distance}</Text>
                        </View>
                    </View>
                    <Text style={[styles.descText, { color: isDark ? '#a1a1aa' : '#a1a1aa' }]} numberOfLines={2}>{item.description}</Text>
                </View>
            </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={selectedSpot !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedSpot(null)}
      >
        <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: isDark ? '#18181b' : '#ffffff' }]}>
                <View style={[styles.modalPullBar, { backgroundColor: isDark ? '#3f3f46' : '#e4e4e7' }]} />
                
                {selectedSpot && (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.modalHero}>
                            <Image source={{ uri: selectedSpot.image }} style={styles.modalHeroImg} />
                            <TouchableOpacity style={[styles.closeModalBtn, { backgroundColor: isDark ? 'rgba(24,24,27,0.95)' : 'rgba(255,255,255,0.95)' }]} onPress={() => setSelectedSpot(null)}>
                                <FontAwesome5 name="times" size={14} color={isDark ? '#ffffff' : '#18181b'} />
                            </TouchableOpacity>
                            <View style={styles.modalHeroOverlay}>
                                <View style={[styles.badgeVibe, { backgroundColor: '#0f9f59', alignSelf: 'flex-start' }]}>
                                    <Text style={styles.badgeTextDark}>KECAMATAN {selectedSpot.kecamatan.toUpperCase()}</Text>
                                </View>
                                <Text style={styles.modalTitle}>{selectedSpot.name}</Text>
                            </View>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={[styles.modalDesc, { color: isDark ? '#e4e4e7' : '#3f3f46' }]}>{selectedSpot.description}</Text>
                            
                            <View style={styles.facilitiesBox}>
                                <Text style={styles.sectionLabel}>FASILITAS PENUNJANG</Text>
                                <View style={styles.facilitiesRow}>
                                    {selectedSpot.facilities.map((fac, idx) => (
                                        <View key={idx} style={[styles.facilityPill, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                                            <Text style={[styles.facilityText, { color: isDark ? '#a1a1aa' : '#52525b' }]}>{fac}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View style={[styles.aiAdviceBox, { backgroundColor: isDark ? '#064e3b' : '#e6f7ee', borderColor: isDark ? '#047857' : '#a7f3d0' }]}>
                                <Text style={[styles.aiAdviceLabel, { color: isDark ? '#34d399' : '#059669' }]}>💡 REKOMENDASI PAK RT</Text>
                                <Text style={[styles.aiAdviceText, { color: isDark ? '#6ee7b7' : '#065f46' }]}>{selectedSpot.aiAdvice}</Text>
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity 
                                    style={[styles.btnRoute, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}
                                    onPress={() => openDirections(selectedSpot.lat, selectedSpot.lng, selectedSpot.name)}
                                >
                                    <FontAwesome5 name="directions" size={14} color="#0f9f59" />
                                    <Text style={[styles.btnRouteText, { color: isDark ? '#ffffff' : '#18181b' }]}>Rute</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btnCheckin} onPress={handleCheckin}>
                                    <FontAwesome5 name="location-arrow" size={14} color="#ffffff" />
                                    <Text style={styles.btnCheckinText}>Tandai Kunjungan (+150 XP)</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  headerBox: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 15, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
  gpsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e6f7ee', paddingVertical: 14, borderRadius: 16, marginBottom: 15 },
  gpsText: { color: '#086637', fontWeight: 'bold', fontSize: 12, marginLeft: 10 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f4f5', borderRadius: 16, paddingHorizontal: 16 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 12, color: '#18181b' },
  weatherBanner: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1, marginTop: 16 },
  weatherBannerTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5, marginBottom: 2 },
  weatherBannerDesc: { fontSize: 9, lineHeight: 14 },
  activeKecamatanBox: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingHorizontal: 4 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#0f9f59', marginRight: 8 },
  activeKecamatanText: { fontSize: 11 },
  vibeScrollContainer: { backgroundColor: '#ffffff', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
  vibeScroll: { paddingHorizontal: 24, paddingVertical: 5 },
  vibePill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, elevation: 1, shadowColor: '#000', shadowOffset:{width:0,height:1}, shadowOpacity: 0.05, shadowRadius: 2 },
  vibePillActive: { backgroundColor: '#18181b' },
  vibePillInactive: { backgroundColor: '#f4f4f5' },
  vibeText: { fontSize: 11, fontWeight: 'bold' },
  vibeTextActive: { color: '#ffffff' },
  vibeTextInactive: { color: '#71717a' },
  listContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  card: { backgroundColor: '#ffffff', borderRadius: 24, marginBottom: 24, borderWidth: 1, borderColor: '#f4f4f5', overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 12 },
  imageContainer: { width: '100%', height: 220, position: 'relative' },
  cardImage: { width: '100%', height: '100%', backgroundColor: '#e4e4e7' },
  badgesTopLeft: { position: 'absolute', top: 16, left: 16, flexDirection: 'row', gap: 6 },
  badgeDark: { backgroundColor: 'rgba(9,9,11,0.75)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  badgeVibe: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  badgeTextDark: { color: 'white', fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
  badgeBottomRight: { position: 'absolute', bottom: 16, right: 16, backgroundColor: 'rgba(9,9,11,0.75)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  ratingText: { color: 'white', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  cardContent: { padding: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#18181b', flex: 1 },
  distanceBox: { flexDirection: 'row', alignItems: 'center' },
  distanceText: { fontSize: 10, color: '#71717a', fontWeight: 'bold' },
  descText: { fontSize: 11, color: '#a1a1aa', lineHeight: 18, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(24,24,27,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32, maxHeight: '92%', overflow: 'hidden' },
  modalPullBar: { width: 48, height: 4, backgroundColor: '#e4e4e7', borderRadius: 2, alignSelf: 'center', marginVertical: 12 },
  modalHero: { height: 240, marginHorizontal: 16, borderRadius: 24, overflow: 'hidden', position: 'relative' },
  modalHeroImg: { width: '100%', height: '100%' },
  closeModalBtn: { position: 'absolute', top: 16, right: 16, width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  modalHeroOverlay: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#ffffff', marginTop: 8 },
  modalBody: { padding: 24 },
  modalDesc: { fontSize: 13, color: '#3f3f46', lineHeight: 22 },
  sectionLabel: { fontSize: 10, fontWeight: '900', color: '#a1a1aa', letterSpacing: 1, marginTop: 24, marginBottom: 12 },
  facilitiesBox: {},
  facilitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  facilityPill: { backgroundColor: '#f4f4f5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  facilityText: { fontSize: 10, color: '#52525b', fontWeight: '700' },
  aiAdviceBox: { backgroundColor: '#e6f7ee', padding: 16, borderRadius: 16, marginTop: 24, borderWidth: 1, borderColor: '#a7f3d0' },
  aiAdviceLabel: { fontSize: 10, fontWeight: '900', color: '#059669', marginBottom: 6 },
  aiAdviceText: { fontSize: 12, color: '#065f46', lineHeight: 20, fontWeight: '500' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 32, paddingBottom: 24 },
  btnRoute: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f4f5', paddingVertical: 14, borderRadius: 16, gap: 8 },
  btnRouteText: { fontSize: 12, fontWeight: '800', color: '#18181b' },
  btnCheckin: { flex: 2.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f9f59', paddingVertical: 14, borderRadius: 16, gap: 8, elevation: 4, shadowColor: '#0f9f59', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8 },
  btnCheckinText: { fontSize: 12, fontWeight: '800', color: '#ffffff' }
});
