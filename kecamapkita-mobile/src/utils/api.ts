export function getApiUrl(): string {
  // Utamakan environment variable cloud, atau langsung fallback ke server live Hugging Face Spaces
  return process.env.EXPO_PUBLIC_API_URL || 'https://haerulanwar05-kecamapkita-backend.hf.space';
}
