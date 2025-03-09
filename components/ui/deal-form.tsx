import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from './button';
import { Card } from './card';
import { Select } from './select';
import { CountryCodeDropdown } from './country-code-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import type { Deal, DealStatus, PropertyType, DealRole, DealInput } from '@/types/deal';
import { format } from 'date-fns';

interface DealFormProps {
  initialData?: Partial<Deal>;
  onSubmit: (data: DealInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS: DealStatus[] = ['NEW', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'UNDER_CONTRACT', 'WON'];
const PROPERTY_TYPE_OPTIONS: PropertyType[] = ['RESIDENTIAL', 'LAND', 'COMMERCIAL'];
const DEAL_ROLE_OPTIONS: DealRole[] = ['Sale', 'Buy', 'Rent'];

export function DealForm({ initialData, onSubmit, onCancel, isLoading }: DealFormProps) {
  const splitPhoneNumber = (phone: string = '') => {
    const match = phone.match(/^(\+\d{1,4})?(.*)$/);
    return {
      countryCode: match?.[1] || '+1',
      number: match?.[2]?.trim() || ''
    };
  };

  const initialPhone = splitPhoneNumber(initialData?.phone);
  const [showExpectedDatePicker, setShowExpectedDatePicker] = useState(false);
  const [showActualDatePicker, setShowActualDatePicker] = useState(false);

  const [formData, setFormData] = useState<DealInput & { countryCode: string }>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialPhone.number,
    countryCode: initialPhone.countryCode,
    dealAmount: initialData?.dealAmount || 0,
    status: initialData?.status || 'NEW',
    propertyType: initialData?.propertyType || 'RESIDENTIAL',
    propertyAddress: initialData?.propertyAddress || '',
    propertyValue: initialData?.propertyValue || 0,
    expectedCloseDate: initialData?.expectedCloseDate || new Date().toISOString(),
    actualCloseDate: initialData?.actualCloseDate,
    estimatedCommission: initialData?.estimatedCommission || 0,
    notes: initialData?.notes || [],
    coOwners: initialData?.coOwners || [],
  });

  const handleSubmit = () => {
    const submissionData = {
      ...formData,
      phone: `${formData.countryCode}${formData.phone}`.trim(),
    };
    delete (submissionData as any).countryCode;
    console.log('Submitting deal:', submissionData);
    onSubmit(submissionData);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.field}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
              placeholder="Enter name"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email *</Text>
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
            <Text style={styles.label}>Deal Amount *</Text>
            <TextInput
              style={styles.input}
              value={formData.dealAmount.toString()}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, dealAmount: parseFloat(text) || 0 }))}
              placeholder="Enter deal amount"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Property Type *</Text>
            <Select
              value={formData.propertyType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, propertyType: value as PropertyType }))}
              options={PROPERTY_TYPE_OPTIONS.map((type) => ({
                label: type,
                value: type,
              }))}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Property Address</Text>
            <TextInput
              style={styles.input}
              value={formData.propertyAddress}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, propertyAddress: text }))}
              placeholder="Enter property address"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Property Value</Text>
            <TextInput
              style={styles.input}
              value={formData.propertyValue?.toString()}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, propertyValue: parseFloat(text) || 0 }))}
              placeholder="Enter property value"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Expected Close Date *</Text>
            <TouchableOpacity
              onPress={() => setShowExpectedDatePicker(true)}
              style={styles.dateButton}
            >
              <Text style={styles.dateButtonText}>
                {formData.expectedCloseDate}
              </Text>
              <Ionicons name="calendar-outline" size={24} color="#5932EA" />
            </TouchableOpacity>
            {showExpectedDatePicker && (
              <DateTimePicker
                value={formData.expectedCloseDate ? new Date(formData.expectedCloseDate) : new Date()}
                mode="date"
                onChange={(event, date) => {
                  setShowExpectedDatePicker(false);
                  if (date) {
                    setFormData(prev => ({ ...prev, expectedCloseDate: date.toISOString() }));
                  }
                }}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Estimated Commission (%)</Text>
            <TextInput
              style={styles.input}
              value={formData.estimatedCommission?.toString()}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, estimatedCommission: parseFloat(text) || 0 }))}
              placeholder="Enter estimated commission"
              keyboardType="numeric"
            />
          </View>
        </ScrollView>

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
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  container: {
    height: '100%',
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
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
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

