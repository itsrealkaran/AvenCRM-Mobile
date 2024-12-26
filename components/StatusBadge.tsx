import React from 'react';
import { View, Text } from 'react-native';

type StatusBadgeProps = {
  status: 'success' | 'warning' | 'error' | 'info';
  text: string;
};

export function StatusBadge({ status, text }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <View className={`px-2 py-1 rounded-full ${getStatusColor()}`}>
      <Text className="text-xs font-medium">{text}</Text>
    </View>
  );
}

