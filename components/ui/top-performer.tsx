import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AgentData {
  name: string;
  performance: number;
}

interface TopPerformingAgentsProps {
  data: AgentData[];
}

export function TopPerformingAgents({ data }: TopPerformingAgentsProps) {
  const maxPerformance = Math.max(...data.map(agent => agent.performance));

  return (
    <View style={styles.container}>
      {data.map((agent, index) => (
        <View key={index} style={styles.agentRow}>
          <Text style={styles.agentName}>{agent.name}</Text>
          <View style={styles.barContainer}>
            <View 
              style={[
                styles.bar, 
                { width: `${(agent.performance / maxPerformance) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.performanceText}>{agent.performance}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  agentName: {
    width: 100,
    fontSize: 14,
    color: '#333',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#5932EA',
    borderRadius: 4,
  },
  performanceText: {
    width: 40,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5932EA',
    textAlign: 'right',
  },
});

