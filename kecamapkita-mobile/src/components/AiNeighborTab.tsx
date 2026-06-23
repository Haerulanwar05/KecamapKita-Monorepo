import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function AiNeighborTab({ isDark }: { isDark: boolean }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Halo tetangga! Saya Pak RT. Saya sudah terhubung dengan sistem AI (Gemini). Coba tanya saya sesuatu!", sender: 'bot' }
  ]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
        const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "MASUKKAN_API_KEY_ANDA_DI_SINI"; 
        // Peringatan: Menulis API Key langsung di kode frontend (hardcode) sebenarnya tidak aman untuk rilis publik (Production),
        // namun ini sangat cocok untuk tahap demo lokal (tanpa perlu menyalakan backend Python).
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `System: Kamu adalah "Pak RT" dari KecamapKita. Jawab dengan ramah, peduli tetangga, gaya santai/slang, dan berikan rekomendasi wisata. \nUser: ${userMessage}` }]
                }]
            })
        });
        
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText);
        }
        const data = await response.json();
        
        // Ekstraksi jawaban dari format JSON Gemini REST API
        const aiReply = data.candidates[0].content.parts[0].text;
        
        setMessages(prev => [...prev, { text: aiReply, sender: 'bot' }]);
    } catch (error: any) {
        console.log("Error dari Google:", error.message);
        setMessages(prev => [...prev, { text: `⚠️ Gagal (API Error): ${error.message.substring(0, 150)}...`, sender: 'bot' }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70} style={[styles.container, { backgroundColor: isDark ? '#09090b' : '#fafafa' }]}>
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
