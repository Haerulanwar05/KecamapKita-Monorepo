import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { FontAwesome5 } from '@expo/vector-icons';

const rankSystem = [
    { minXp: 0, maxXp: 149, title: "Pendatang Baru", level: 1, emoji: "🥚", nextThreshold: 150 },
    { minXp: 150, maxXp: 299, title: "Langkah Pertama", level: 2, emoji: "🐣", nextThreshold: 300 },
    { minXp: 300, maxXp: 599, title: "Penjelajah Santai", level: 3, emoji: "🚶🏽‍♂️", nextThreshold: 600 },
    { minXp: 600, maxXp: 1199, title: "Pencari Harmoni", level: 4, emoji: "🎯", nextThreshold: 1200 },
    { minXp: 1200, maxXp: Infinity, title: "Kecamap Overlord", level: 5, emoji: "👑", nextThreshold: 1200 }
];

export default function AdventureTab({ isDark }: { isDark: boolean }) {
  const [xp, setXp] = useState(0); // Set to 0 to match screenshot
  const [levelUpTriggered, setLevelUpTriggered] = useState(false);
  const [activeTimeFilter, setActiveTimeFilter] = useState('all');

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
              <View style={[styles.iconBox, { backgroundColor: isDark ? '#27272a' : '#f4f4f5', borderColor: isDark ? '#3f3f46' : '#e4e4e7' }]}>
                  <Text style={styles.emoji}>{currentRank.emoji}</Text>
              </View>
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
                  <Text style={[styles.gridStatValue, { color: isDark ? '#ffffff' : '#18181b' }]}>0</Text>
              </View>
              <View style={[styles.gridStatCol, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                  <Text style={styles.gridStatLabel}>DISTRIK</Text>
                  <Text style={[styles.gridStatValue, { color: isDark ? '#ffffff' : '#18181b' }]}>0</Text>
              </View>
              <View style={styles.gridStatCol}>
                  <Text style={styles.gridStatLabel}>TOTAL XP</Text>
                  <Text style={[styles.gridStatValue, { color: '#fbbf24' }]}>{xp}</Text>
              </View>
          </View>
      </View>

      {/* Sync Promo Banner */}
      <View style={[styles.promoBanner, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.2)' }]}>
          <View style={{flex: 1, paddingRight: 12}}>
              <Text style={[styles.promoTitle, { color: isDark ? '#fbbf24' : '#b45309' }]}>AMANKAN PERJALANANMU!</Text>
              <Text style={[styles.promoDesc, { color: isDark ? '#a1a1aa' : '#71717a' }]}>Anda bermain sebagai Tamu. Buat akun gratis untuk mengunci XP & lencana Anda di awan.</Text>
          </View>
          <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>Daftar</Text>
          </TouchableOpacity>
      </View>

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

      {/* Empty State History */}
      <View style={[styles.emptyBox, { borderColor: isDark ? '#27272a' : '#e4e4e7' }]}>
          <FontAwesome5 name="shoe-prints" size={24} color={isDark ? '#3f3f46' : '#d4d4d8'} style={{marginBottom: 12}} />
          <Text style={[styles.emptyTitle, { color: isDark ? '#a1a1aa' : '#71717a' }]}>BELUM ADA JEJAK</Text>
          <Text style={[styles.emptyDesc, { color: isDark ? '#71717a' : '#a1a1aa' }]}>Belum ada tempat dikunjungi dalam rentang waktu ini.</Text>
      </View>

      {/* Achievements Shelves */}
      <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>LENCANA PENCAPAIAN</Text>
      </View>
      
      <View style={styles.badgeGrid}>
          {/* Badge 1 */}
          <View style={[styles.badgeCard, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                  <View style={[styles.badgeIconBox, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                      <FontAwesome5 name="lock" size={14} color="#fbbf24" />
                  </View>
                  <View style={{marginLeft: 10, flex: 1}}>
                      <Text style={[styles.badgeTitle, { color: isDark ? '#a1a1aa' : '#71717a' }]}>Penyembuh Jiwa</Text>
                      <Text style={[styles.badgeDesc, { color: isDark ? '#71717a' : '#a1a1aa' }]}>Kunjungi 2 spot ber-vibe #syahdu</Text>
                  </View>
              </View>
              <View style={styles.badgeProgressHeader}>
                  <Text style={styles.badgeProgressText}>PROGRES</Text>
                  <Text style={styles.badgeProgressText}>0/2</Text>
              </View>
              <View style={[styles.badgeProgressBar, { backgroundColor: isDark ? '#27272a' : '#e4e4e7' }]} />
          </View>
          
          {/* Badge 2 */}
          <View style={[styles.badgeCard, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                  <View style={[styles.badgeIconBox, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                      <FontAwesome5 name="lock" size={14} color="#fbbf24" />
                  </View>
                  <View style={{marginLeft: 10, flex: 1}}>
                      <Text style={[styles.badgeTitle, { color: isDark ? '#a1a1aa' : '#71717a' }]}>Kolektor Rasa</Text>
                      <Text style={[styles.badgeDesc, { color: isDark ? '#71717a' : '#a1a1aa' }]}>Kunjungi 1 kuliner #kenyang</Text>
                  </View>
              </View>
              <View style={styles.badgeProgressHeader}>
                  <Text style={styles.badgeProgressText}>PROGRES</Text>
                  <Text style={styles.badgeProgressText}>0/1</Text>
              </View>
              <View style={[styles.badgeProgressBar, { backgroundColor: isDark ? '#27272a' : '#e4e4e7' }]} />
          </View>

          {/* Badge 3 */}
          <View style={[styles.badgeCard, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                  <View style={[styles.badgeIconBox, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                      <FontAwesome5 name="lock" size={14} color="#fbbf24" />
                  </View>
                  <View style={{marginLeft: 10, flex: 1}}>
                      <Text style={[styles.badgeTitle, { color: isDark ? '#a1a1aa' : '#71717a' }]}>Inspirator</Text>
                      <Text style={[styles.badgeDesc, { color: isDark ? '#71717a' : '#a1a1aa' }]}>Kunjungi 1 tongkrongan #kreatif</Text>
                  </View>
              </View>
              <View style={styles.badgeProgressHeader}>
                  <Text style={styles.badgeProgressText}>PROGRES</Text>
                  <Text style={styles.badgeProgressText}>0/1</Text>
              </View>
              <View style={[styles.badgeProgressBar, { backgroundColor: isDark ? '#27272a' : '#e4e4e7' }]} />
          </View>

          {/* Badge 4 */}
          <View style={[styles.badgeCard, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                  <View style={[styles.badgeIconBox, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                      <FontAwesome5 name="lock" size={14} color="#fbbf24" />
                  </View>
                  <View style={{marginLeft: 10, flex: 1}}>
                      <Text style={[styles.badgeTitle, { color: isDark ? '#a1a1aa' : '#71717a' }]}>Kecamap Overlord</Text>
                      <Text style={[styles.badgeDesc, { color: isDark ? '#71717a' : '#a1a1aa' }]}>Kunjungi 3 kecamatan berbeda</Text>
                  </View>
              </View>
              <View style={styles.badgeProgressHeader}>
                  <Text style={styles.badgeProgressText}>PROGRES</Text>
                  <Text style={styles.badgeProgressText}>0/3</Text>
              </View>
              <View style={[styles.badgeProgressBar, { backgroundColor: isDark ? '#27272a' : '#e4e4e7' }]} />
          </View>
      </View>

      <TouchableOpacity style={styles.testBtn} onPress={simulateCheckIn}>
          <Text style={styles.testBtnText}>Tandai Kunjungan (MOCK API +150 XP)</Text>
      </TouchableOpacity>
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
  }
});
