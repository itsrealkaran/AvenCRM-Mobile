import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/auth-context';
import Svg, { SvgProps, Path } from "react-native-svg"

interface HeaderProps {
  toggleDrawer: () => void;
}

export default function Header({ toggleDrawer }: HeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12}]}>
      <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
        <Svg width={24} height={17} viewBox="0 0 24 17" fill="none">
          <Path d="M1 8.33333H12.9014M1 1H23M1 15.6667H23" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </TouchableOpacity>
      <Text style={styles.title}>Dashboard</Text>
      <View>
        <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdown}>
            <TouchableOpacity 
              style={styles.dropdownItem} 
              onPress={() => {
                setShowDropdown(false);
                router.push('/(dashboard)/settings' as never);
              }}
            >
              <Ionicons name="settings-outline" size={18} color="#333" style={styles.menuIcon} />
              <Text style={styles.dropdownText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#333" style={styles.menuIcon} />
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5932EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 150,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  menuIcon: {
    marginRight: 8,
  },
});

