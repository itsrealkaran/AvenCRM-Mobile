import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './card';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  changeDirection?: 'up' | 'down';
  info?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  changeDirection,
  info = true,
}: MetricCardProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {info && (
          <Ionicons name="information-circle-outline" size={20} color="#666" />
        )}
      </View>
      <Text style={styles.value}>{value}</Text>
      {subtitle && (
        <View style={styles.subtitleContainer}>
          {changeDirection && (
            <Ionicons
              name={changeDirection === 'up' ? 'arrow-up' : 'arrow-down'}
              size={16}
              color={changeDirection === 'up' ? '#00B69B' : '#FF0000'}
              style={styles.changeIcon}
            />
          )}
          <Text style={[
            styles.subtitle,
            changeDirection && (changeDirection === 'up' ? styles.positiveChange : styles.negativeChange)
          ]}>
            {subtitle}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    height: 140,
    justifyContent: 'space-around',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeIcon: {
    marginRight: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  positiveChange: {
    color: '#00B69B',
  },
  negativeChange: {
    color: '#FF0000',
  },
});

