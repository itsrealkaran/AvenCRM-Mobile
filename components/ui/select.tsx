import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import RNPickerSelect from "react-native-picker-select";

interface SelectOption {
  label: string;
  value: string;
  color?: string;
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
  // Add color to all options
  const optionsWithColor = options.map(option => ({
    ...option,
    color: option.color || "#000"
  }));

  return (
    <View style={styles.container}>
      <RNPickerSelect
        value={value}
        onValueChange={onValueChange}
        items={optionsWithColor}
        placeholder={{}}
        style={{
          inputIOS: styles.input,
          inputAndroid: styles.input
        }}
        Icon={() => Platform.OS === 'ios' ? (
          <View style={styles.iconContainer}>
            <Feather name="chevron-down" size={24} color="#707070" />
          </View>
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    paddingHorizontal: 10,
    paddingRight: 30,
  },
  iconContainer: {
    position: 'relative',
    right: 10,
    top: '50%',
  }
});
