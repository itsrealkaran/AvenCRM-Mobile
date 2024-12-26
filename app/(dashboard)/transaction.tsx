import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/card';

const DUMMY_TRANSACTIONS = [
  { id: '1', type: 'Sale', amount: '$450,000', date: '2024-01-15', status: 'Completed' },
  { id: '2', type: 'Lease', amount: '$12,000', date: '2024-01-14', status: 'Pending' },
  { id: '3', type: 'Deposit', amount: '$5,000', date: '2024-01-13', status: 'Completed' },
];

export default function Transaction() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
      </View>
      <FlatList
        data={DUMMY_TRANSACTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
              <Text style={styles.transactionType}>{item.type}</Text>
              <Text style={styles.transactionAmount}>{item.amount}</Text>
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionDate}>{item.date}</Text>
              <Text style={[
                styles.transactionStatus,
                { color: item.status === 'Completed' ? '#4CAF50' : '#FFC107' }
              ]}>
                {item.status}
              </Text>
            </View>
          </Card>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
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
  list: {
    padding: 20,
  },
  transactionCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionDate: {
    color: '#666',
  },
  transactionStatus: {
    fontWeight: '500',
  },
});

