import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/card';

const DUMMY_EMAILS = [
  {
    id: '1',
    subject: 'Property Inquiry',
    sender: 'john@example.com',
    preview: 'I am interested in the property...',
    time: '10:30 AM',
  },
  {
    id: '2',
    subject: 'Meeting Confirmation',
    sender: 'sarah@example.com',
    preview: 'This email confirms our meeting...',
    time: '09:15 AM',
  },
  {
    id: '3',
    subject: 'Contract Draft',
    sender: 'legal@example.com',
    preview: 'Please find attached the draft...',
    time: 'Yesterday',
  },
];

export default function Email() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Email</Text>
      </View>
      <FlatList
        data={DUMMY_EMAILS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.emailCard}>
            <Text style={styles.emailSubject}>{item.subject}</Text>
            <Text style={styles.emailSender}>{item.sender}</Text>
            <Text style={styles.emailPreview} numberOfLines={1}>
              {item.preview}
            </Text>
            <Text style={styles.emailTime}>{item.time}</Text>
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
  emailCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  emailSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emailSender: {
    color: '#666',
    marginBottom: 5,
  },
  emailPreview: {
    color: '#666',
    marginBottom: 5,
  },
  emailTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
});

