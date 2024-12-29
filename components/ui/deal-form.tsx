import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from './button';
import { Card } from './card';
import { Select } from './select';
import { CountryCodeDropdown } from './country-code-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import type { Deal, DealStatus, NoteEntry } from '@/types/deal';

interface DealFormProps {
  initialData?: Partial<Deal>;
  onSubmit: (data: Omit<Deal, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS: DealStatus[] = ['New', 'Discovery', 'Proposal', 'Negotiation', 'Won'];

export function DealForm({ initialData, onSubmit, onCancel, isLoading }: DealFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    countryCode: initialData?.phone?.split(' ')[0] || '+1',
    phone: initialData?.phone?.split(' ')[1] || '',
    status: initialData?.status || 'New' as DealStatus,
    amount: initialData?.amount?.toString() || '',
    propertyType: initialData?.propertyType || '',
    expectedCloseDate: initialData?.expectedCloseDate ? new Date(initialData.expectedCloseDate) : new Date(),
    notes: initialData?.notes || [],
  });
  const [newNote, setNewNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    const updatedNotes: NoteEntry[] = newNote
      ? [...formData.notes, { id: Date.now().toString(), content: newNote, timestamp: new Date().toISOString() }]
      : formData.notes;
    onSubmit({
      ...formData,
      phone: `${formData.countryCode} ${formData.phone}`,
      amount: parseFloat(formData.amount),
      expectedCloseDate: formData.expectedCloseDate.toISOString(),
      notes: updatedNotes,
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || formData.expectedCloseDate;
    setShowDatePicker(false);
    setFormData(prev => ({ ...prev, expectedCloseDate: currentDate }));
  };

  return (
    <Card style={styles.card}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
            placeholder="Enter name"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone</Text>
          <View style={styles.phoneContainer}>
            <CountryCodeDropdown
              value={formData.countryCode}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, countryCode: value }))}
            />
            <TextInput
              style={[styles.input, styles.phoneInput]}
              value={formData.phone}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, phone: text }))}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Deal Amount</Text>
          <TextInput
            style={styles.input}
            value={formData.amount}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, amount: text }))}
            placeholder="Enter deal amount"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Property Type</Text>
          <TextInput
            style={styles.input}
            value={formData.propertyType}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, propertyType: text }))}
            placeholder="Enter property type"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Expected Close Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerButtonText}>
              {formData.expectedCloseDate.toLocaleDateString()}
            </Text>
            <Ionicons name="calendar-outline" size={24} color="#5932EA" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={formData.expectedCloseDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Status</Text>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as DealStatus }))}
            options={STATUS_OPTIONS.map((status) => ({
              label: status,
              value: status,
            }))}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Add Note</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={newNote}
            onChangeText={setNewNote}
            placeholder="Enter new note"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.actions}>
          <Button 
            variant="outline" 
            onPress={onCancel}
            style={styles.button}
          >
            Cancel
          </Button>
          <Button 
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.button}
          >
            {initialData ? 'Update' : 'Create'} Deal
          </Button>
        </View>
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  scrollView: {
    maxHeight: '80%',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  button: {
    minWidth: 100,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInput: {
    flex: 1,
    marginLeft: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

