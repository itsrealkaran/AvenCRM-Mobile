import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Button } from './button';
import { Card } from './card';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import type { Event } from '@/types/event';

interface EventFormProps {
  onSubmit: (event: Event) => void;
  onCancel: () => void;
  initialDate: string;
  editingEvent?: Event | null;
}

export function EventForm({ onSubmit, onCancel, initialDate, editingEvent }: EventFormProps) {
  // Initialize state with proper date objects
  const [title, setTitle] = useState(editingEvent?.title || '');
  const [description, setDescription] = useState(editingEvent?.description || '');
  
  // Parse dates properly
  const [startDate, setStartDate] = useState(() => {
    if (editingEvent?.start) {
      return new Date(editingEvent.start);
    }
    return new Date(initialDate);
  });
  
  const [endDate, setEndDate] = useState(() => {
    if (editingEvent?.end) {
      return new Date(editingEvent.end);
    }
    return new Date(initialDate);
  });
  
  const [startTime, setStartTime] = useState(() => {
    if (editingEvent?.start) {
      return new Date(editingEvent.start);
    }
    const now = new Date();
    now.setHours(9, 0, 0, 0); // Default to 9:00 AM
    return now;
  });
  
  const [endTime, setEndTime] = useState(() => {
    if (editingEvent?.end) {
      return new Date(editingEvent.end);
    }
    const now = new Date();
    now.setHours(10, 0, 0, 0); // Default to 10:00 AM
    return now;
  });
  
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = () => {
    // Validate form
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }
    
    // Create combined date and time objects
    const startDateTime = new Date(startDate);
    startDateTime.setHours(
      startTime.getHours(),
      startTime.getMinutes(),
      startTime.getSeconds()
    );
    
    const endDateTime = new Date(endDate);
    endDateTime.setHours(
      endTime.getHours(),
      endTime.getMinutes(),
      endTime.getSeconds()
    );
    
    // Validate that end time is after start time
    if (endDateTime <= startDateTime) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    const location = '';
    
    onSubmit({
      id: editingEvent?.id || '',
      title,
      description,
      location,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
    });
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{editingEvent ? 'Edit Event' : 'Add Event'}</Text>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.label}>Event Title*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
          />
          
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter event description"
            value={description}
            onChangeText={setDescription}
            multiline
            placeholderTextColor="#999"
          />
          
          <Text style={styles.sectionTitle}>Date & Time</Text>
          
          <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowStartDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color="#5932EA" />
            <Text style={styles.dateTimeText}>Start Date: {startDate.toDateString()}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowStartTimePicker(true)}>
            <Ionicons name="time-outline" size={20} color="#5932EA" />
            <Text style={styles.dateTimeText}>Start Time: {formatTime(startTime)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowEndDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color="#5932EA" />
            <Text style={styles.dateTimeText}>End Date: {endDate.toDateString()}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowEndTimePicker(true)}>
            <Ionicons name="time-outline" size={20} color="#5932EA" />
            <Text style={styles.dateTimeText}>End Time: {formatTime(endTime)}</Text>
          </TouchableOpacity>
          
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) {
                  setStartDate(selectedDate);
                  if (selectedDate > endDate) {
                    setEndDate(selectedDate);
                  }
                }
              }}
            />
          )}
          
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
              minimumDate={startDate}
            />
          )}
          
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowStartTimePicker(false);
                if (selectedTime) setStartTime(selectedTime);
              }}
            />
          )}
          
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowEndTimePicker(false);
                if (selectedTime) setEndTime(selectedTime);
              }}
            />
          )}
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button variant="outline" onPress={onCancel} style={styles.button}>
          Cancel
        </Button>
        <Button onPress={handleSubmit} style={styles.button}>
          {editingEvent ? 'Update' : 'Add'} Event
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '90%',
    maxHeight: '80%',
    padding: 0,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: '70%',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    minWidth: 100,
    marginLeft: 8,
  },
});

