import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/card';

export default function Monitoring() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>System Monitoring</Text>
      </View>
      <View style={styles.grid}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>System Status</Text>
          <Text style={styles.statusText}>All Systems Operational</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Active Users</Text>
          <Text style={styles.cardValue}>1,234</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Response Time</Text>
          <Text style={styles.cardValue}>45ms</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  grid: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  card: {
    width: '30%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    minWidth: 200,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
});

