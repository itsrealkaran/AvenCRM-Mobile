import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder,
}: SelectProps) {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={[styles.picker, Platform.OS === "ios" ? styles.iosPicker : {}]}
        itemStyle={Platform.OS === "ios" ? styles.iosPickerItem : {}}
      >
        {placeholder && <Picker.Item label={placeholder} value="" />}
        {options.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
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
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  iosPicker: {
    height: 150,
    marginTop: -50,
    marginBottom: -50,
  },
  iosPickerItem: {
    fontSize: 16,
    height: 50,
  },
});
