import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './card';
import { Ionicons } from '@expo/vector-icons';
import type { NoteEntry } from '@/types/lead';

interface NotesTimelineProps {
  notes: NoteEntry[];
  onClose: () => void;
}

export function NotesTimeline({ notes, onClose }: NotesTimelineProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes Timeline</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {notes.map((note, index) => (
          <View key={note.id} style={styles.noteContainer}>
            <View style={styles.timelinePoint} />
            {index < notes.length - 1 && <View style={styles.timelineLine} />}
            <View style={styles.noteContent}>
              <Text style={styles.noteTimestamp}>
                {new Date(note.timestamp).toLocaleString()}
              </Text>
              <Text style={styles.noteText}>{note.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flexGrow: 1,
  },
  noteContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelinePoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5932EA',
    marginRight: 16,
    marginTop: 4,
  },
  timelineLine: {
    position: 'absolute',
    left: 5,
    top: 16,
    bottom: -16,
    width: 2,
    backgroundColor: '#E0E0E0',
  },
  noteContent: {
    flex: 1,
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#333',
  },
});

