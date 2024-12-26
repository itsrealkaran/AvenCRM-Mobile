import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/auth-context';

export default function RootLayout() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

