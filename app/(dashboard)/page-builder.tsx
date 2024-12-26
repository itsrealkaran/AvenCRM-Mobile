import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/card';

export default function PageBuilder() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Page Builder</Text>
      </View>
      <View style={styles.content}>
        <Card style={styles.templateCard}>
          <Text style={styles.templateTitle}>Landing Page</Text>
          <Text style={styles.templateDescription}>Create a new landing page from scratch</Text>
        </Card>
        <Card style={styles.templateCard}>
          <Text style={styles.templateTitle}>Property Listing</Text>
          <Text style={styles.templateDescription}>Create a property listing page</Text>
        </Card>
        <Card style={styles.templateCard}>
          <Text style={styles.templateTitle}>Contact Form</Text>
          <Text style={styles.templateDescription}>Create a contact form page</Text>
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
  content: {
    padding: 20,
  },
  templateCard: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  templateDescription: {
    fontSize: 14,
    color: '#666',
  },
});

