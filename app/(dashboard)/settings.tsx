import React, { useState } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Card } from '../../components/ui/card';

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar style="auto" />
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Settings</Text>
        <Card style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Account Settings</Text>
          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#666' }}>Profile Information</Text>
            <Text style={{ fontSize: 18 }}>John Doe</Text>
          </View>
          <View>
            <Text style={{ color: '#666' }}>Email</Text>
            <Text style={{ fontSize: 18 }}>john@example.com</Text>
          </View>
        </Card>
        <Card>
          <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Preferences</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 18 }}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>
          <View>
            <Text style={{ color: '#666' }}>Language</Text>
            <Text style={{ fontSize: 18 }}>English</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

