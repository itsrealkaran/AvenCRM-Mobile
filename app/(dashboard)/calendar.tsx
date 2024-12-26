import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/card';

const DUMMY_EVENTS = [
  { id: '1', title: 'Property Viewing', time: '10:00 AM', date: '2024-01-15' },
  { id: '2', title: 'Client Meeting', time: '2:00 PM', date: '2024-01-15' },
  { id: '3', title: 'Contract Signing', time: '4:30 PM', date: '2024-01-16' },
];

export default function Calendar() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {DUMMY_EVENTS.map((event) => (
          <Card key={event.id} style={styles.eventCard}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.eventDetails}>
              <Text style={styles.eventTime}>{event.time}</Text>
              <Text style={styles.eventDate}>{event.date}</Text>
            </View>
          </Card>
        ))}
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
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  eventCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventTime: {
    color: '#6C5CE7',
  },
  eventDate: {
    color: '#666',
  },
});

