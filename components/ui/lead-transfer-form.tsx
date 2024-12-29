import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Button } from './button';
import { Card } from './card';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import type { LeadTransfer } from '@/types/lead';

interface LeadTransferFormProps {
  leadId: string;
  onSubmit: (data: LeadTransfer) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LeadTransferForm({ leadId, onSubmit, onCancel, isLoading }: LeadTransferFormProps) {
  const [amount, setAmount] = useState('');
  const [expectedCloseDate, setExpectedCloseDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    onSubmit({
      leadId,
      amount: parseFloat(amount),
      expectedCloseDate: expectedCloseDate.toISOString(),
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || expectedCloseDate;
    setShowDatePicker(Platform.OS === 'ios');
    setExpectedCloseDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.field}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Expected Close Date</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
          <Text style={styles.datePickerButtonText}>
            {expectedCloseDate.toLocaleDateString()}
          </Text>
          <Ionicons name="calendar-outline" size={24} color="#5932EA" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={expectedCloseDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
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
          Transfer Lead
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  button: {
    minWidth: 100,
  },
});

