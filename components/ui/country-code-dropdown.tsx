import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface CountryCodeDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
}

const countryCodes = [
  { label: "+1", value: "+1" },
  { label: "+44", value: "+44" },
  { label: "+61", value: "+61" },
  { label: "+49", value: "+49" },
  { label: "+33", value: "+33" },
  { label: "+91", value: "+91" },
  { label: "+971", value: "+971" },
  // Add more country codes as needed
];

export function CountryCodeDropdown({
  value,
  onValueChange,
}: CountryCodeDropdownProps) {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        {countryCodes.map((country) => (
          <Picker.Item
            key={country.value}
            label={country.label}
            value={country.value}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    width: 110,
  },
  picker: {
    height: 50,
  },
});
