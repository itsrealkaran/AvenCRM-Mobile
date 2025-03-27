import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import RNPickerSelect from "react-native-picker-select";

interface CountryCodeDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
}

const countryCodes = [
  { label: "+1", value: "+1", color: "#000" },
  { label: "+44", value: "+44", color: "#000" },
  { label: "+61", value: "+61", color: "#000" },
  { label: "+49", value: "+49", color: "#000" },
  { label: "+33", value: "+33", color: "#000" },
  { label: "+91", value: "+91", color: "#000" },
  { label: "+971", value: "+971", color: "#000" },
];

export function CountryCodeDropdown({
  value,
  onValueChange,
}: CountryCodeDropdownProps) {
  return (
    <View style={styles.container}>
      <RNPickerSelect
        value={value}
        placeholder={{}}
        onValueChange={onValueChange}
        items={countryCodes}
        style={{
          inputIOS: styles.input,
          inputAndroid: styles.input,
        }}
        Icon={() =>
          Platform.OS === "ios" ? (
            <View style={styles.iconContainer}>
              <Feather name="chevron-down" size={24} color="#707070" />
            </View>
          ) : null
        }
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
    width: 120,
  },
  input: {
    height: 50,
    paddingHorizontal: 10,
    paddingRight: 30,
  },
  iconContainer: {
    position: "relative",
    right: 10,
    top: "50%",
  },
});
