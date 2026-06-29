import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { FontAwesome5 } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { getApiUrl } from '../utils/api';

const API_URL = getApiUrl();

const rankSystem = [
    { minXp: 0, maxXp: 149, title: "Pendatang Baru", level: 1, emoji: "🥚", nextThreshold: 150 },
    { minXp: 150, maxXp: 299, title: "Langkah Pertama", level: 2, emoji: "🐣", nextThreshold: 300 },
    { minXp: 300, maxXp: 599, title: "Penjelajah Santai", level: 3, emoji: "🚶🏽‍♂️", nextThreshold: 600 },
    { minXp: 600, maxXp: 1199, title: "Pencari Harmoni", level: 4, emoji: "🎯", nextThreshold: 1200 },
    { minXp: 1200, maxXp: Infinity, title: "Kecamap Overlord", level: 5, emoji: "👑", nextThreshold: 1200 }
];

export default function AdventureTab({ isDark }: { isDark: boolean }) {
  const [xp, setXp] = useState(0); 
  const [levelUpTriggered, setLevelUpTriggered] = useState(false);
  const [activeTimeFilter, setActiveTimeFilter] = useState('all');
  
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const avatarsList = ["🤠", "😎", "🚀", "🦊", "👑", "🦁", "🌸", "🔥"];

  const updateAvatar = async (newAvatar: string) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return;
      const res = await fetch(`${API_URL}/api/user/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ avatar: newAvatar })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setShowAvatarModal(false);
        Alert.alert('Sukses', 'Avatar berhasil diganti! 🎉');
      }
    } catch (e) { console.log("Gagal ganti avatar", e); }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) fetchUserData(token);
    } catch (e) { console.log('Error checking token'); }
  };

  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setXp(data.total_xp);
      } else {
        await SecureStore.deleteItemAsync('userToken');
      }
    } catch (e) { console.log(e); }
  };

  const handleAuth = async () => {
    if (!username || !password || (!isLoginMode && !email)) return Alert.alert('Error', 'Harap isi semua kolom');
    setIsLoading(true);
    try {
      const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
      const body = isLoginMode ? { username, password } : { username, password, email, display_name: username };
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const text = await res.text();
        let errorMsg = 'Terjadi kesalahan pada server';
        try { errorMsg = JSON.parse(text).detail || errorMsg; } catch {}
        Alert.alert('Gagal', errorMsg);
      } else {
        const data = await res.json();
        if (!isLoginMode) {
          Alert.alert('Sukses', 'Akun dibuat! Silakan masuk.');
          setIsLoginMode(true);
        } else {
          await SecureStore.setItemAsync('userToken', data.access_token);
          setUser(data.user);
          setXp(data.user.total_xp);
          setShowAuthModal(false);
          Alert.alert('Sukses', 'Berhasil masuk!');
        }
      }
    } catch (e) {
      Alert.alert('Error', 'Gagal menyambung ke server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    let googleEmail = email.trim() || username.trim();
    if (!googleEmail.includes('@')) {
      googleEmail = googleEmail ? `${googleEmail}@gmail.com` : 'petualang.kecamap@gmail.com';
    }
    setIsLoading(true);
    try {
      const displayName = googleEmail.split('@')[0];
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: googleEmail, display_name: displayName, avatar: "😎" })
      });
      if (res.ok) {
        const data = await res.json();
        await SecureStore.setItemAsync('userToken', data.access_token);
        setUser(data.user);
        setXp(data.user.total_xp);
        setShowAuthModal(false);
        Alert.alert('Sukses 🎉', `Berhasil masuk dengan Akun Google (${googleEmail})!`);
      } else {
        Alert.alert('Gagal', 'Tidak dapat menghubungkan akun Google.');
      }
    } catch (e) {
      Alert.alert('Error', 'Gagal menyambung ke server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setUser(null);
    setXp(0);
  };

  const getCurrentRank = () => rankSystem.find(r => xp >= r.minXp && xp <= r.maxXp) || rankSystem[0];
  const currentRank = getCurrentRank();
  
  const simulateCheckIn = () => {
    const nextXp = xp + 150;
    setXp(nextXp);
    const nextRank = rankSystem.find(r => nextXp >= r.minXp && nextXp <= r.maxXp) || rankSystem[0];
    if (nextRank.level > currentRank.level) {
        setLevelUpTriggered(true);
        setTimeout(() => setLevelUpTriggered(false), 3000);
    }
  };

  const progressPercent = currentRank.level === 5 ? 100 : Math.min(100, Math.round(((xp - currentRank.minXp) / (currentRank.nextThreshold - currentRank.minXp)) * 100));

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#09090b' : '#fafafa' }]} contentContainerStyle={{paddingBottom: 40}}>
      {levelUpTriggered && (
        <ConfettiCannon count={100} origin={{x: -10, y: 0}} />
      )}
      
      {/* Gamified Rank Dashboard */}
      <View style={[styles.statCard, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
          {/* Gamepad Watermark Background */}
          <FontAwesome5 name="gamepad" size={140} color={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} style={styles.watermarkIcon} />
          
          <View style={styles.cardHeader}>
              <Text style={styles.rankLabel}>PERINGKAT EKSPLORASI</Text>
              <View style={styles.onlineBadge}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>LOKAL (LURING)</Text>
              </View>
          </View>
          
          <View style={styles.rankBox}>
              <TouchableOpacity onPress={() => user ? setShowAvatarModal(true) : Alert.alert('Info', 'Silakan masuk dulu untuk ganti avatar.')} style={[styles.iconBox, { backgroundColor: isDark ? '#27272a' : '#f4f4f5', borderColor: isDark ? '#3f3f46' : '#e4e4e7' }]}>
                  <Text style={styles.emoji}>{user?.avatar || currentRank.emoji}</Text>
              </TouchableOpacity>
              <View style={styles.rankInfo}>
                  <Text style={[styles.rankTitle, { color: isDark ? '#ffffff' : '#18181b' }]}>{currentRank.title}</Text>
                  <Text style={[styles.rankLevel, { color: isDark ? '#a1a1aa' : '#71717a' }]}>Level {currentRank.level}</Text>
              </View>
          </View>
          
          <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                  <Text style={[styles.progressText, { color: isDark ? '#a1a1aa' : '#71717a' }]}>XP: {xp} {currentRank.level !== 5 && `/ ${currentRank.nextThreshold}`}</Text>
                  <Text style={[styles.progressText, { color: isDark ? '#a1a1aa' : '#71717a' }]}>{progressPercent}%</Text>
              </View>
              <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#27272a' : '#e4e4e7' }]}>
                  <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
              </View>
          </View>

          {/* Grid Stats */}
          <View style={[styles.gridStats, { borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
              <View style={styles.gridStatCol}>
                  <Text style={styles.gridStatLabel}>KUNJUNGAN</Text>
                  <Text style={[styles.gridStatValue, { color: isDark ? '#ffffff' : '#18181b' }]}>{user ? user.checkin_count : 0}</Text>
              </View>
              <View style={[styles.gridStatCol, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                  <Text style={styles.gridStatLabel}>DISTRIK</Text>
                  <Text style={[styles.gridStatValue, { color: isDark ? '#ffffff' : '#18181b' }]}>{user ? user.district_count : 0}</Text>
              </View>
              <View style={styles.gridStatCol}>
                  <Text style={styles.gridStatLabel}>TOTAL XP</Text>
                  <Text style={[styles.gridStatValue, { color: '#fbbf24' }]}>{xp}</Text>
              </View>
          </View>
      </View>

      {/* Sync Promo Banner */}
      {!user ? (
          <View style={[styles.promoBanner, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.2)' }]}>
              <View style={{flex: 1, paddingRight: 12}}>
                  <Text style={[styles.promoTitle, { color: isDark ? '#fbbf24' : '#b45309' }]}>AMANKAN PERJALANANMU!</Text>
                  <Text style={[styles.promoDesc, { color: isDark ? '#a1a1aa' : '#71717a' }]}>Anda bermain sebagai Tamu. Buat akun gratis untuk mengunci XP & lencana Anda di awan.</Text>
              </View>
              <TouchableOpacity style={styles.promoBtn} onPress={() => setShowAuthModal(true)}>
                  <Text style={styles.promoBtnText}>Daftar / Masuk</Text>
              </TouchableOpacity>
          </View>
      ) : (
          <View style={[styles.promoBanner, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }]}>
              <View style={{flex: 1, paddingRight: 12}}>
                  <Text style={[styles.promoTitle, { color: isDark ? '#34d399' : '#059669' }]}>TERHUBUNG SEBAGAI {user.username.toUpperCase()}</Text>
                  <Text style={[styles.promoDesc, { color: isDark ? '#a1a1aa' : '#71717a' }]}>Progress petualangan Anda selalu tersimpan dengan aman di awan.</Text>
              </View>
              <TouchableOpacity style={[styles.promoBtn, {backgroundColor: '#ef4444'}]} onPress={handleLogout}>
                  <Text style={styles.promoBtnText}>Keluar</Text>
              </TouchableOpacity>
          </View>
      )}

      {/* History Filter Section */}
      <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TEMPAT YANG DIKUNJUNGI</Text>
          <View style={[styles.timeFilterBox, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
              <TouchableOpacity onPress={() => setActiveTimeFilter('all')} style={[styles.timeFilterPill, activeTimeFilter === 'all' && [styles.timeFilterPillActive, { backgroundColor: isDark ? '#3f3f46' : '#ffffff' }]]}>
                  <Text style={[styles.timeFilterText, activeTimeFilter === 'all' ? { color: isDark ? '#ffffff' : '#18181b' } : { color: isDark ? '#a1a1aa' : '#71717a' }]}>Semua</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTimeFilter('week')} style={[styles.timeFilterPill, activeTimeFilter === 'week' && [styles.timeFilterPillActive, { backgroundColor: isDark ? '#3f3f46' : '#ffffff' }]]}>
                  <Text style={[styles.timeFilterText, activeTimeFilter === 'week' ? { color: isDark ? '#ffffff' : '#18181b' } : { color: isDark ? '#a1a1aa' : '#71717a' }]}>Minggu Ini</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTimeFilter('month')} style={[styles.timeFilterPill, activeTimeFilter === 'month' && [styles.timeFilterPillActive, { backgroundColor: isDark ? '#3f3f46' : '#ffffff' }]]}>
                  <Text style={[styles.timeFilterText, activeTimeFilter === 'month' ? { color: isDark ? '#ffffff' : '#18181b' } : { color: isDark ? '#a1a1aa' : '#71717a' }]}>Bulan Ini</Text>
              </TouchableOpacity>
          </View>
      </View>

      {/* History Log */}
      <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RIWAYAT KUNJUNGAN</Text>
          <TouchableOpacity onPress={() => Alert.alert('Unggah Foto 📸', 'Fitur kenangan foto tersimpan di galeri lokal Petualangan Anda!')}>
              <Text style={{fontSize: 12, color: '#0f9f59', fontWeight: 'bold'}}>+ Foto Kenangan</Text>
          </TouchableOpacity>
      </View>
      {user?.history && user.history.length > 0 ? (
          user.history.map((h: any, idx: number) => (
              <View key={idx} style={[styles.statCard, { padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={{fontSize: 20, marginRight: 10}}>📍</Text>
                      <View>
                          <Text style={{fontWeight: 'bold', color: isDark ? '#fff' : '#18181b'}}>{h.spot_name}</Text>
                          <Text style={{fontSize: 11, color: '#0f9f59'}}>#{h.vibe}</Text>
                      </View>
                  </View>
                  <Text style={{fontSize: 10, color: '#71717a'}}>{new Date(h.visited_at).toLocaleDateString()}</Text>
              </View>
          ))
      ) : (
          <View style={[styles.emptyBox, { borderColor: isDark ? '#27272a' : '#e4e4e7' }]}>
              <FontAwesome5 name="shoe-prints" size={24} color={isDark ? '#3f3f46' : '#d4d4d8'} style={{marginBottom: 12}} />
              <Text style={[styles.emptyTitle, { color: isDark ? '#a1a1aa' : '#71717a' }]}>BELUM ADA JEJAK</Text>
              <Text style={[styles.emptyDesc, { color: isDark ? '#71717a' : '#a1a1aa' }]}>Belum ada tempat dikunjungi. Coba check-in di Eksplorasi!</Text>
          </View>
      )}

      {/* Achievements Shelves */}
      <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>LENCANA PENCAPAIAN</Text>
      </View>
      
      <View style={styles.badgeGrid}>
          {user?.badges && user.badges.length > 0 ? (
              user.badges.map((b: any, idx: number) => {
                  const pct = Math.min(100, Math.round((b.current / b.target) * 100));
                  return (
                      <View key={idx} style={[styles.badgeCard, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderColor: b.unlocked ? '#0f9f59' : (isDark ? '#27272a' : '#f4f4f5') }]}>
                          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                              <View style={[styles.badgeIconBox, { backgroundColor: b.unlocked ? '#e6f7ee' : (isDark ? '#27272a' : '#f4f4f5') }]}>
                                  <Text style={{fontSize: 16}}>{b.unlocked ? b.icon : '🔒'}</Text>
                              </View>
                              <View style={{marginLeft: 10, flex: 1}}>
                                  <Text style={[styles.badgeTitle, { color: b.unlocked ? '#0f9f59' : (isDark ? '#a1a1aa' : '#71717a') }]}>{b.name}</Text>
                                  <Text style={[styles.badgeDesc, { color: isDark ? '#71717a' : '#a1a1aa' }]}>Target: {b.target} kunjungan</Text>
                              </View>
                          </View>
                          <View style={styles.badgeProgressHeader}>
                              <Text style={styles.badgeProgressText}>{b.unlocked ? 'TERBUKA 🎉' : 'PROGRES'}</Text>
                              <Text style={styles.badgeProgressText}>{b.current}/{b.target}</Text>
                          </View>
                          <View style={[styles.badgeProgressBar, { backgroundColor: isDark ? '#27272a' : '#e4e4e7' }]}>
                              <View style={{ width: `${pct}%`, height: '100%', backgroundColor: '#0f9f59' }} />
                          </View>
                      </View>
                  );
              })
          ) : (
              <View style={[styles.badgeCard, { backgroundColor: isDark ? '#18181b' : '#ffffff', width: '100%' }]}>
                  <Text style={{color: isDark ? '#a1a1aa' : '#71717a', textAlign: 'center'}}>Masuk akun untuk melihat progres lencana dinamis!</Text>
              </View>
          )}
      </View>

      {!user && (
          <TouchableOpacity style={styles.testBtn} onPress={simulateCheckIn}>
              <Text style={styles.testBtnText}>Tandai Kunjungan (MOCK API +150 XP)</Text>
          </TouchableOpacity>
      )}

      {/* Auth Modal */}
      <Modal visible={showAuthModal} transparent animationType="fade">
          <View style={styles.authModalOverlay}>
              <View style={[styles.authModalContent, { backgroundColor: isDark ? '#18181b' : '#ffffff' }]}>
                  <Text style={[styles.authTitle, { color: isDark ? '#ffffff' : '#18181b' }]}>
                      {isLoginMode ? 'Selamat Datang' : 'Buat Akun'}
                  </Text>
                  <Text style={[styles.authSubtitle, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                      {isLoginMode ? 'Masuk untuk melanjutkan petualangan' : 'Daftar agar XP tidak hilang'}
                  </Text>
                  
                  <TextInput
                      style={[styles.input, { color: isDark ? '#ffffff' : '#18181b', borderColor: isDark ? '#3f3f46' : '#e4e4e7' }]}
                      placeholder="Username"
                      placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                  />
                  
                  {!isLoginMode && (
                      <TextInput
                          style={[styles.input, { color: isDark ? '#ffffff' : '#18181b', borderColor: isDark ? '#3f3f46' : '#e4e4e7' }]}
                          placeholder="Email"
                          placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
                          value={email}
                          onChangeText={setEmail}
                          autoCapitalize="none"
                          keyboardType="email-address"
                      />
                  )}
                  
                  <View style={[styles.passwordContainer, { borderColor: isDark ? '#3f3f46' : '#e4e4e7', backgroundColor: 'transparent' }]}>
                      <TextInput
                          style={[styles.passwordInput, { color: isDark ? '#ffffff' : '#18181b' }]}
                          placeholder="Password"
                          placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                          <FontAwesome5 name={showPassword ? "eye" : "eye-slash"} size={14} color={isDark ? '#a1a1aa' : '#71717a'} />
                      </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity style={styles.authSubmitBtn} onPress={handleAuth} disabled={isLoading}>
                      {isLoading ? <ActivityIndicator color="#fff" /> : (
                          <Text style={styles.authSubmitText}>{isLoginMode ? 'Masuk' : 'Daftar Sekarang'}</Text>
                      )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.authSubmitBtn, { backgroundColor: '#ea4335', marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]} onPress={handleGoogleLogin} disabled={isLoading}>
                      <FontAwesome5 name="google" size={16} color="#fff" style={{ marginRight: 10 }} />
                      <Text style={styles.authSubmitText}>Masuk dengan Akun Google</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.authSwitchBtn} onPress={() => setIsLoginMode(!isLoginMode)}>
                      <Text style={[styles.authSwitchText, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                          {isLoginMode ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
                      </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={{marginTop: 20, alignItems: 'center'}} onPress={() => setShowAuthModal(false)}>
                      <Text style={{color: '#ef4444', fontWeight: 'bold'}}>Batal</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

      {/* Avatar Picker Modal */}
      <Modal visible={showAvatarModal} transparent animationType="slide">
          <View style={styles.authModalOverlay}>
              <View style={[styles.authModalContent, { backgroundColor: isDark ? '#18181b' : '#ffffff' }]}>
                  <Text style={[styles.authTitle, { color: isDark ? '#ffffff' : '#18181b' }]}>Pilih Avatar Karakter</Text>
                  <Text style={[styles.authSubtitle, { color: isDark ? '#a1a1aa' : '#71717a', marginBottom: 20 }]}>Pilih emoji favorit untuk melambangkan gaya penjelajahanmu!</Text>
                  <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, marginBottom: 20}}>
                      {avatarsList.map((av, idx) => (
                          <TouchableOpacity key={idx} onPress={() => updateAvatar(av)} style={{padding: 15, backgroundColor: isDark ? '#27272a' : '#f4f4f5', borderRadius: 16}}>
                              <Text style={{fontSize: 32}}>{av}</Text>
                          </TouchableOpacity>
                      ))}
                  </View>
                  <TouchableOpacity style={[styles.authSubmitBtn, { backgroundColor: '#71717a' }]} onPress={() => setShowAvatarModal(false)}>
                      <Text style={styles.authSubmitText}>Batal</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: '#fafafa',
  },
  statCard: {
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative'
  },
  watermarkIcon: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankLabel: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    backgroundColor: '#34d399',
    borderRadius: 3,
    marginRight: 4,
  },
  onlineText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#34d399',
  },
  rankBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  emoji: {
    fontSize: 30,
  },
  rankInfo: {
    marginLeft: 15,
  },
  rankTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rankLevel: {
    fontSize: 11,
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 25,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0f9f59',
    borderRadius: 4,
  },
  gridStats: {
    flexDirection: 'row',
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
  },
  gridStatCol: {
    flex: 1,
    alignItems: 'center',
  },
  gridStatLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#71717a',
    letterSpacing: 0.5,
  },
  gridStatValue: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4,
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  promoTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  promoDesc: {
    fontSize: 9,
    lineHeight: 14,
  },
  promoBtn: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  promoBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#71717a',
    letterSpacing: 0.5,
  },
  timeFilterBox: {
    flexDirection: 'row',
    padding: 2,
    borderRadius: 12,
  },
  timeFilterPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  timeFilterPillActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeFilterText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  emptyBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 9,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  badgeIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  badgeDesc: {
    fontSize: 8,
    lineHeight: 12,
  },
  badgeProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  badgeProgressText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#71717a',
  },
  badgeProgressBar: {
    height: 4,
    borderRadius: 2,
  },
  testBtn: {
    marginTop: 20,
    backgroundColor: '#0f9f59',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  testBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  authModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
  },
  authModalContent: {
      width: '100%',
      borderRadius: 20,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 15,
      elevation: 10,
  },
  authTitle: {
      fontWeight: 'bold',
      fontSize: 24,
      marginBottom: 8,
      textAlign: 'center'
  },
  authSubtitle: {
      fontSize: 14,
      marginBottom: 24,
      textAlign: 'center'
  },
  input: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 14,
      fontSize: 14,
      marginBottom: 16
  },
  passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 12,
      marginBottom: 16
  },
  passwordInput: {
      flex: 1,
      padding: 14,
      fontSize: 14
  },
  eyeIcon: {
      padding: 14
  },
  authSubmitBtn: {
      backgroundColor: '#0f9f59',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 8
  },
  authSubmitText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16
  },
  authSwitchBtn: {
      marginTop: 20,
      alignItems: 'center'
  },
  authSwitchText: {
      fontSize: 14
  }
});
