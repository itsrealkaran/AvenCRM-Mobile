import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Card } from '@/components/ui/card';
import { api } from '@/utils/api-client';
import type { Transaction, TransactionStatus, ApprovalStatus } from '@/types/transactions';
import { AntDesign } from '@expo/vector-icons';

const getTransactionStatus = (status: TransactionStatus, isApprovedByTeamLeader: ApprovalStatus): string => {
  if (status === 'REJECTED' && isApprovedByTeamLeader === 'REJECTED') return 'Rejected';
  if (status === 'APPROVED' && isApprovedByTeamLeader === 'APPROVED') return 'Verified';
  if (isApprovedByTeamLeader === 'APPROVED') return 'Approved';
  if (status === 'PENDING' && isApprovedByTeamLeader === 'PENDING') return 'Pending';
  return 'Pending';
};

interface TransactionItem {
  id: string;
  invoiceNumber: string;
  transaction_method: string;
  amount: string;
  date: string;
  status: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const filtered = transactions.filter(transaction => 
      transaction.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.transaction_method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTransactions(filtered);
  }, [searchQuery, transactions]);

  const fetchTransactions = async (refresh = false) => {
    try {
      setIsLoading(true);
      const response = await api.getTransactions();
      console.log("response:",response);
      if (response) {
        const formattedTransactions = response.map((item: Transaction) => ({
          id: item.id,
          invoiceNumber: item.invoiceNumber,
          transaction_method: item.transactionMethod || 'N/A',
          amount: `$${item.amount.toLocaleString()}`,
          date: new Date(item.date).toLocaleDateString(),
          status: getTransactionStatus(item.status, item.isApprovedByTeamLeader)
        }));
        setTransactions(formattedTransactions);
        setFilteredTransactions(formattedTransactions);
        console.log("formattedTransactions:",formattedTransactions);
      } else {
        setTransactions([]);
        setFilteredTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5932EA" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>
            Found {filteredTransactions.length} transactions
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by invoice number, amount, or status..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
              <View>
                <Text style={styles.invoiceNumber}>{item.invoiceNumber}</Text>
                <Text style={styles.transactionType}>{item.transaction_method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</Text>
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
                  { backgroundColor: 
                    item.status === 'Verified' ? '#E7F6EC' :
                    item.status === 'Approved' ? '#E3F2FD' :
                    item.status === 'Rejected' ? '#FFEBEE' : '#FFF6E5' 
                  }
                ]}>
                  <Text style={[
                    styles.transactionStatus,
                    { color: 
                      item.status === 'Verified' ? '#2E7D32' :
                      item.status === 'Approved' ? '#1976D2' :
                      item.status === 'Rejected' ? '#D32F2F' : '#ED6C02'
                    }
                  ]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        )}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchTransactions(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  list: {
    padding: 16,
  },
  transactionCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '600',
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
    fontWeight: '600',
    color: '#2E7D32',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingVertical: 6,
    borderRadius: 16,
  },
  transactionStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
});
