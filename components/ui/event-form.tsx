import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from './button';
import { Card } from './card';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import type { Event } from '@/app/(dashboard)/calendar';

interface EventFormProps {
  onSubmit: (event: Omit<Event, 'id' | 'color' | 'source'>) => void;
  onCancel: () => void;
  initialDate: string;
  editingEvent?: Event | null;
}

export function EventForm({ onSubmit, onCancel, initialDate, editingEvent }: EventFormProps) {
  const [title, setTitle] = useState(editingEvent?.title || '');
  const [description, setDescription] = useState(editingEvent?.description || '');
  const [startDate, setStartDate] = useState(new Date(editingEvent?.startDate || initialDate));
  const [endDate, setEndDate] = useState(new Date(editingEvent?.endDate || initialDate));
  const [startTime, setStartTime] = useState(new Date(editingEvent?.startTime || startDate));
  const [endTime, setEndTime] = useState(new Date(editingEvent?.endTime || startDate));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });
  };

  return (
    <Card style={styles.card}>
      <ScrollView>
        {/* <Text style={styles.header}>{editingEvent ? 'Edit Event' : 'Add Event'}</Text> */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Event Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Event Description"
            value={description}
            onChangeText={setDescription}
            multiline
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowStartDatePicker(true)}>
            <Ionicons name="calendar-outline" size={24} color="#5932EA" />
            <Text style={styles.dateTimeText}>Start Date: {startDate.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowStartTimePicker(true)}>
            <Ionicons name="time-outline" size={24} color="#5932EA" />
            <Text style={styles.dateTimeText}>Start Time: {startTime.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowEndDatePicker(true)}>
            <Ionicons name="calendar-outline" size={24} color="#5932EA" />
            <Text style={styles.dateTimeText}>End Date: {endDate.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowEndTimePicker(true)}>
            <Ionicons name="time-outline" size={24} color="#5932EA" />
            <Text style={styles.dateTimeText}>End Time: {endTime.toLocaleTimeString()}</Text>
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
        <View style={styles.buttonContainer}>
          <Button variant="outline" onPress={onCancel} style={styles.button}>
            Cancel
          </Button>
          <Button onPress={handleSubmit} style={styles.button}>
            {editingEvent ? 'Update' : 'Add'} Event
          </Button>
        </View>
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '90%',
    maxHeight: '80%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333333',
  },
  form: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
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
    marginTop: 16,
  },
  button: {
    minWidth: 100,
    marginLeft: 8,
  },
});

