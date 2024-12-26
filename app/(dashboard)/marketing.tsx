import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/card';

export default function Marketing() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketing Dashboard</Text>
      </View>
      <View style={styles.grid}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Active Campaigns</Text>
          <Text style={styles.cardValue}>12</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Total Reach</Text>
          <Text style={styles.cardValue}>45.2K</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Conversion Rate</Text>
          <Text style={styles.cardValue}>2.4%</Text>
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
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

