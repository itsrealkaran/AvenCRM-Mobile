import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from './card';
import { Button } from './button';
import { Ionicons } from '@expo/vector-icons';
import type { Event } from '@/app/(dashboard)/calendar';

interface DayViewProps {
  date: string;
  events: Event[];
  onClose: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function DayView({ date, events, onClose, onEditEvent, onDeleteEvent }: DayViewProps) {
  const sortedEvents = [...events].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{new Date(date).toDateString()}</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.eventList}>
        {sortedEvents.map((event) => (
          <View key={event.id} style={[styles.eventItem, { borderLeftColor: event.color }]}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventActions}>
                <TouchableOpacity onPress={() => onEditEvent(event)} style={styles.actionButton}>
                  <Ionicons name="create-outline" size={20} color="#5932EA" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDeleteEvent(event.id)} style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={20} color="#FF4B4B" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.eventTime}>
              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
            </Text>
            <Text style={styles.eventTime}>
              {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()}
            </Text>
            <Text style={styles.eventDescription}>{event.description}</Text>
            <View style={styles.eventSource}>
              <Ionicons 
                name={event.source === 'google' ? 'logo-google' : event.source === 'outlook' ? 'mail-outline' : 'calendar-outline'} 
                size={16} 
                color="#666" 
              />
              <Text style={styles.eventSourceText}>{event.source}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {events.length === 0 && (
        <Text style={styles.noEventsText}>No events scheduled for this day.</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '90%',
    maxHeight: '80%',
    padding: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  eventList: {
    marginBottom: 16,
  },
  eventItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  eventActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
  },
  eventTime: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  eventSource: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventSourceText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  noEventsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  closeButton: {
    alignSelf: 'center',
  },
});

