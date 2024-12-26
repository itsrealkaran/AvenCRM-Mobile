import React from 'react';
import { View, Text } from 'react-native';
import { Card } from './ui/card';

type DashboardCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
};

export function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <Card style={{ flex: 1, minWidth: 150 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#666' }}>{title}</Text>
        {icon}
      </View>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</Text>
    </Card>
  );
}

