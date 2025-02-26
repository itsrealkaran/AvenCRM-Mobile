import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/card';

const DUMMY_TRANSACTIONS = [
  { id: '1', invoiceNumber: 'INV-2024-001', transaction_method: 'Sale', amount: '$450,000', date: '2024-01-15', status: 'Completed' },
  { id: '2', invoiceNumber: 'INV-2024-002', transaction_method: 'Lease', amount: '$12,000', date: '2024-01-14', status: 'Pending' },
  { id: '3', invoiceNumber: 'INV-2024-003', transaction_method: 'Deposit', amount: '$5,000', date: '2024-01-13', status: 'Completed' },
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
              <View>
                <Text style={styles.invoiceNumber}>{item.invoiceNumber}</Text>
                <Text style={styles.transactionType}>{item.transaction_method}</Text>
              </View>
              <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Amount</Text>
                <Text style={styles.transactionAmount}>{item.amount}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.transactionDetails}>
              <View style={styles.dateContainer}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={styles.label}>Status</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: item.status === 'Completed' ? '#E7F6EC' : '#FFF6E5' }
                ]}>
                  <Text style={[
                    styles.transactionStatus,
                    { color: item.status === 'Completed' ? '#2E7D32' : '#ED6C02' }
                  ]}>
                    {item.status}
                  </Text>
                </View>
              </View>
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
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  transactionType: {
    fontSize: 14,
    color: '#666',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flex: 1,
  },
  statusContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  transactionStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
});
