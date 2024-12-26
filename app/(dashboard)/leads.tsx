import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Card } from '../../components/ui/card';
import { StatusBadge } from '../../components/StatusBadge';

interface Lead {
  id: string;
  name: string;
  status: string;
  date: string;
}

const DUMMY_LEADS = [
  { id: '1', name: 'John Doe', status: 'New', date: '2024-01-15' },
  { id: '2', name: 'Jane Smith', status: 'Contacted', date: '2024-01-14' },
  { id: '3', name: 'Mike Johnson', status: 'Qualified', date: '2024-01-13' },
];

export default function Leads() {
  const renderItem = ({ item }: { item: Lead }) => (
    <Card style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.name}</Text>
        <StatusBadge 
          status={item.status === 'New' ? 'info' : item.status === 'Contacted' ? 'warning' : 'success'} 
          text={item.status} 
        />
      </View>
      <Text style={{ color: '#666', marginTop: 8 }}>{item.date}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar style="auto" />
      <FlatList
        data={DUMMY_LEADS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Leads</Text>
        }
      />
    </SafeAreaView>
  );
}

