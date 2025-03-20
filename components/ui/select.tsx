import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
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
  // Find the selected option label
  const selectedLabel =
    options.find((option) => option.value === value)?.label ||
    placeholder ||
    "";

  if (Platform.OS === "ios") {
    return (
      <View style={styles.container}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.iosPicker}
          itemStyle={styles.iosPickerItem}
        >
          {placeholder && <Picker.Item label={placeholder} value="" />}
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              color="#000"
            />
          ))}
        </Picker>
      </View>
    );
  }

  // Android version
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor="#000"
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
    width: "100%",
    height: 200,
    backgroundColor: "#fff",
  },
  iosPickerItem: {
    fontSize: 16,
    height: 120,
    color: "#000",
  },
});
