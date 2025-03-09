import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/auth-context';
import { CurrencyProvider } from '@/contexts/currency-context';

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <CurrencyProvider>
          <Stack>
            <Stack.Screen 
              name="login" 
            options={{ 
              headerShown: false 
            }} 
            />
            <Stack.Screen 
              name="(dashboard)" 
              options={{ 
                headerShown: false 
              }} 
            />
          </Stack>
        </CurrencyProvider>
      </AuthProvider>
    </>
  );
}

