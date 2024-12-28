import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { DashboardCard } from '../../components/DashboardCard';

export default function Property() {
  return (
      <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#FAFBFF' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Property Management</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          <DashboardCard
            title="Total Properties"
            value={156}
            icon={<Ionicons name="home-outline" size={24} color="#6C5CE7" />}
          />
          <DashboardCard
            title="Available"
            value={43}
            icon={<Ionicons name="business-outline" size={24} color="#6C5CE7" />}
          />
          <DashboardCard
            title="Occupied"
            value={113}
            icon={<Ionicons name="key-outline" size={24} color="#6C5CE7" />}
          />
        </View>
      </ScrollView>
  );
}

