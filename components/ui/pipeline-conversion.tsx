import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface PipelineData {
  stage: string;
  value: number;
}

interface PipelineConversionChartProps {
  data: PipelineData[];
}

export function PipelineConversionChart({ data }: PipelineConversionChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View 
                style={[
                  styles.bar, 
                  { height: `${(item.value / maxValue) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.label}>{item.stage}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
    paddingVertical: 20,
  },
  barContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  barWrapper: {
    height: 150,
    width: 40,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    backgroundColor: '#5932EA',
    position: 'absolute',
    bottom: 0,
    borderRadius: 8,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
  },
  value: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5932EA',
  },
});

