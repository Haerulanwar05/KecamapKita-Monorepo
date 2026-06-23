import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import * as Location from 'expo-location';

export default function AiNeighborTab({ isDark }: { isDark: boolean }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Halo tetangga! Saya Pak RT. Saya sudah terhubung dengan sistem AI dan database peta kita. Coba tanya saya sesuatu (misal: 'ada tempat ngopi dekat sini?')", sender: 'bot' }
  ]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
        const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:8000';
        
        // Ambil lokasi GPS secara real-time untuk diberikan ke Pak RT
        let lat = 0;
        let lng = 0;
        let districtName = "Tidak Diketahui";
        
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({});
            lat = loc.coords.latitude;
            lng = loc.coords.longitude;
            
            // Tanya ke Google/OS nama jalan/kecamatannya!
            const geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
            if (geocode && geocode.length > 0) {
                districtName = geocode[0].district || geocode[0].city || geocode[0].subregion || "Tidak Diketahui";
            }
        }
        
        const response = await fetch(`${API_URL}/api/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMessage,
                lat: lat,
                lng: lng,
                district: districtName // Kirim nama wilayah asli!
            })
        });
        
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText);
        }
        const data = await response.json();
        
        setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
    } catch (error: any) {
        console.log("Error dari Backend:", error.message);
        setMessages(prev => [...prev, { text: `⚠️ Gagal menghubungi server kita: ${error.message.substring(0, 150)}...`, sender: 'bot' }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70} style={[{ flex: 1 }, styles.container, { backgroundColor: isDark ? '#09090b' : '#fafafa' }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}>
        <View style={[styles.avatarBox, { backgroundColor: isDark ? '#064e3b' : '#e6f7ee' }]}>
            <Text style={styles.avatarEmoji}>👨🏽‍🦳</Text>
        </View>
        <View style={styles.headerText}>
            <Text style={[styles.title, { color: isDark ? '#ffffff' : '#18181b' }]}>Pak RT "KecamapKita"</Text>
            <Text style={[styles.subtitle, { color: isDark ? '#34d399' : '#0b8247' }]}>Asisten AI Tetangga • Online</Text>
        </View>
      </View>

      <ScrollView style={styles.chatArea} contentContainerStyle={{ padding: 20 }}>
        {messages.map((msg, idx) => (
            <View key={idx} style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : [styles.botBubble, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]]}>
                <Text style={[styles.messageText, msg.sender === 'user' ? styles.userText : { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
                    {msg.text}
                </Text>
            </View>
        ))}
        {isLoading && (
             <View style={[styles.messageBubble, styles.botBubble, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                 <Text style={[styles.messageText, { color: isDark ? '#a1a1aa' : '#a1a1aa' }]}>Mengetik...</Text>
             </View>
        )}
      </ScrollView>

      <View style={[styles.inputArea, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderTopColor: isDark ? '#27272a' : '#f4f4f5' }]}>
        <TextInput 
            style={[styles.input, { backgroundColor: isDark ? '#27272a' : '#f4f4f5', color: isDark ? '#ffffff' : '#18181b' }]}
            placeholder="Tanya rekomendasi spot..."
            value={input}
            onChangeText={setInput}
            placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
        />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: isDark ? '#ffffff' : '#18181b' }]} onPress={handleSend}>
            <FontAwesome5 name="arrow-up" size={14} color={isDark ? '#18181b' : '#ffffff'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
  },
  avatarBox: {
    width: 44,
    height: 44,
    backgroundColor: '#e6f7ee',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  headerText: {
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#18181b',
  },
  subtitle: {
    fontSize: 10,
    color: '#0b8247',
    marginTop: 2,
    fontWeight: '600',
  },
  chatArea: {
    flex: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#18181b',
    borderTopRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f4f4f5',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 12,
    lineHeight: 18,
  },
  userText: {
    color: '#ffffff',
  },
  botText: {
    color: '#3f3f46',
  },
  inputArea: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f4f4f5',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f4f4f5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    fontSize: 13,
    color: '#18181b',
  },
  sendBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#18181b',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  }
});
