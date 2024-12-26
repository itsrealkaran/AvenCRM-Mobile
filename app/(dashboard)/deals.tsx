import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/card';

const DUMMY_DEALS = [
  { id: '1', title: 'Luxury Apartment Sale', value: '$450,000', stage: 'Negotiation' },
  { id: '2', title: 'Commercial Space Lease', value: '$12,000/mo', stage: 'Contract' },
  { id: '3', title: 'Residential Property', value: '$320,000', stage: 'Closed' },
];

export default function Deals() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Deals Pipeline</Text>
      </View>
      <FlatList
        data={DUMMY_DEALS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.dealCard}>
            <Text style={styles.dealTitle}>{item.title}</Text>
            <View style={styles.dealDetails}>
              <Text style={styles.dealValue}>{item.value}</Text>
              <Text style={styles.dealStage}>{item.stage}</Text>
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
  dealCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dealDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  dealValue: {
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  dealStage: {
    color: '#666',
  },
});

