import Constants from 'expo-constants';

export function getApiUrl(): string {
  // Coba ambil dari hostUri Metro Bundler Expo (otomatis mendeteksi IP Wi-Fi laptop saat ini)
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost || (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:8000`;
    }
  }
  
  // Jika tidak terdeteksi via hostUri, gunakan environment variable atau fallback default
  return process.env.EXPO_PUBLIC_API_URL || 'http://192.168.206.107:8000';
}
