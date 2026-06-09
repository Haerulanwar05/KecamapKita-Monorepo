import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';

// Expo Secure Store integration to cache JWT user credentials locally
export const useAuthStore = () => {
    const [jwtToken, setJwtToken] = useState<string | null>(null);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('kecamapkita_jwt_token');
                if (token) setJwtToken(token);
            } catch (error) {
                console.error("Failed to load JWT token from Secure Store", error);
            }
        };
        loadToken();
    }, []);

    const saveToken = async (token: string) => {
        try {
            await SecureStore.setItemAsync('kecamapkita_jwt_token', token);
            setJwtToken(token);
        } catch (error) {
            console.error("Failed to save JWT token", error);
        }
    };

    const clearToken = async () => {
        try {
            await SecureStore.deleteItemAsync('kecamapkita_jwt_token');
            setJwtToken(null);
        } catch (error) {
            console.error("Failed to delete JWT token", error);
        }
    };

    return { jwtToken, saveToken, clearToken };
};
