import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { Button } from "./button";
import { Card } from "./card";
import { Select } from "./select";
import { CountryCodeDropdown } from "./country-code-dropdown";
import type { Lead, LeadStatus, PropertyType, LeadInput } from "@/types/lead";

interface LeadFormProps {
  initialData?: Partial<Lead>;
  onSubmit: (data: LeadInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "LOST",
  "WON",
];
const PROPERTY_TYPE_OPTIONS: PropertyType[] = ["RESIDENTIAL", "COMMERCIAL"];

export function LeadForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: LeadFormProps) {
  const splitPhoneNumber = (phone: string = "") => {
    const match = phone.match(/^(\+\d{1,4})?(.*)$/);
    return {
      countryCode: match?.[1] || "+1", // Default to +1 if no country code
      number: match?.[2]?.trim() || "",
    };
  };

  const initialPhone = splitPhoneNumber(initialData?.phone);
  const [formData, setFormData] = useState<LeadInput & { countryCode: string }>(
    {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialPhone.number,
      countryCode: initialPhone.countryCode,
      location: initialData?.location || "",
      budget: initialData?.budget || null,
      propertyType: initialData?.propertyType || "RESIDENTIAL",
      source: initialData?.source || "MANUAL",
      notes: initialData?.notes?.[0]?.note || "",
      expectedDate: initialData?.expectedDate || undefined,
    }
  );

  const handleSubmit = () => {
    const submissionData = {
      ...formData,
      phone: `${formData.countryCode}${formData.phone}`.trim(),
    };
    delete (submissionData as any).countryCode;
    console.log(submissionData);
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
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              placeholder="Enter name"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
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
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, countryCode: value }))
                }
              />
              <TextInput
                style={[styles.input, styles.phoneInput]}
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, phone: text }))
                }
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Property Type *</Text>
            <Select
              value={formData.propertyType}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  propertyType: value as PropertyType,
                }))
              }
              options={PROPERTY_TYPE_OPTIONS.map((type) => ({
                label: type,
                value: type,
              }))}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={formData.location || ""}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, location: text }))
              }
              placeholder="Enter location"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Budget</Text>
            <TextInput
              style={styles.input}
              value={formData.budget?.toString() || ""}
              onChangeText={(text) => {
                const budget = text ? Number(text) : undefined;
                setFormData((prev) => ({ ...prev, budget }));
              }}
              placeholder="Enter budget"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes || ""}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, notes: text }))
              }
              placeholder="Enter notes"
              multiline
              numberOfLines={4}
            />
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <Button variant="outline" onPress={onCancel} style={styles.button}>
            Cancel
          </Button>
          <Button
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.button}
          >
            {initialData ? "Update" : "Create"} Lead
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
    height: "100%",
    flexDirection: "column",
  },
  scrollView: {
    flex: 1,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  button: {
    minWidth: 100,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneInput: {
    flex: 1,
    marginLeft: 8,
  },
});
