import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Card } from './card';
import { Button } from './button';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/utils/api-client';
import type { NoteEntry, Lead } from '@/types/lead';
import type { Deal } from '@/types/deal';
interface NotesTimelineProps {
  leadId: string;
  notes: NoteEntry[];
  addNote: (id: string, note: object) => Promise<Lead | Deal>;
  onClose: () => void;
  onNoteAdded: (updatedLead: Lead | Deal) => void;
}

export function NotesTimeline({ leadId, notes, addNote, onClose, onNoteAdded }: NotesTimelineProps) {
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedNotes, setDisplayedNotes] = useState<NoteEntry[]>(notes);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      setIsLoading(true);
      const newNoteEntry = {
        note: newNote.trim(),
        time: new Date().toISOString(),
        author: 'agent'
      };
      
      // Create a new array with existing notes and the new note
      const updatedNotes = [...displayedNotes, newNoteEntry];
      
      const updatedLead = await addNote(leadId, { 
        note: updatedNotes
      });
      
      // Update the displayed notes with the notes from the response
      if (updatedLead && updatedLead.notes) {
        setDisplayedNotes(updatedLead.notes);
      } else {
        // If the API doesn't return updated notes, update locally
        setDisplayedNotes(updatedNotes);
      }
      
      onNoteAdded(updatedLead);
      setNewNote('');
      setIsAddingNote(false);
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })}`;
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      })}`;
    }

    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Sort notes to show latest first
  const sortedNotes = [...displayedNotes].sort((a, b) => {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes Timeline</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isAddingNote ? (
          <View style={styles.addNoteContainer}>
            <TextInput
              style={styles.noteInput}
              value={newNote}
              onChangeText={setNewNote}
              placeholder="Type your note here..."
              multiline
              numberOfLines={3}
              autoFocus
              placeholderTextColor="#999"
            />
            <View style={styles.noteActions}>
              <Button 
                onPress={() => setIsAddingNote(false)}
                variant="outline"
                style={styles.actionButton}
              >
                Cancel
              </Button>
              <Button
                onPress={handleAddNote}
                disabled={!newNote.trim() || isLoading}
                style={[styles.actionButton, styles.primaryButton]}
              >
                {isLoading ? <ActivityIndicator color="#fff" /> : 'Add Note'}
              </Button>
            </View>
          </View>
        ) : (
          <Button
            onPress={() => setIsAddingNote(true)}
            style={styles.addButton}
            variant="outline"
          >
            <Text style={styles.addButtonText}>Add Note</Text>
          </Button>
        )}
        
        {displayedNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No notes available</Text>
            <Text style={styles.emptyStateSubtext}>Add your first note to keep track of important information</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.notesScrollView}
            contentContainerStyle={styles.notesScrollViewContent}
          >
            {sortedNotes.map((note, index) => (
              <View key={note.time} style={styles.noteContainer}>
                <View style={styles.timelinePoint} />
                {index < sortedNotes.length - 1 && <View style={styles.timelineLine} />}
                <View style={styles.noteContent}>
                  <Text style={styles.noteTimestamp}>
                    {formatDate(note.time)} ({note.author === 'Agent' ? 'Me' : note.author})
                  </Text>
                  <Text style={styles.noteText}>{note.note}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    maxHeight: '50%',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  content: {
    padding: 12,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#f8f9fe',
  },
  addButtonText: {
    color: '#5932EA',
    fontSize: 15,
    fontWeight: '500',
  },
  addNoteContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  noteInput: {
    fontSize: 15,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 100,
    padding: 12,
    lineHeight: 20,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    minWidth: 100,
  },
  primaryButton: {
    backgroundColor: '#5932EA',
  },
  notesScrollView: {
    flex: 1,
    height: 100,
  },
  notesScrollViewContent: {
  },
  noteContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },
  timelinePoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5932EA',
    marginRight: 16,
    marginTop: 4,
    borderWidth: 2,
    borderColor: '#E8E5FF',
  },
  timelineLine: {
    position: 'absolute',
    left: 5,
    top: 16,
    bottom: -20,
    width: 2,
    backgroundColor: '#E8E5FF',
  },
  noteContent: {
    flex: 1,
    backgroundColor: '#F8F9FE',
    borderRadius: 12,
    padding: 16,
  },
  noteTimestamp: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  noteText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  scrollView: {
    flexGrow: 1,
  },
});
