import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/auth-context';
import Svg, { Path } from "react-native-svg"

interface HeaderProps {
  toggleDrawer: () => void;
}

export default function Header({ toggleDrawer }: HeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [showDropdown, setShowDropdown] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  };

  return (
    <View 
      style={[styles.header, { paddingTop: insets.top + 12}]}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setHeaderHeight(height);
      }}
    >
      <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
        <Svg width={24} height={17} viewBox="0 0 24 17" fill="none">
          <Path d="M1 8.33333H12.9014M1 1H23M1 15.6667H23" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => setShowDropdown(!showDropdown)} 
        style={styles.profileContainer}
      >
        <View style={styles.avatar}>
          <Image 
            source={{ uri: '/placeholder.svg?height=40&width=40' }}
            style={styles.avatar}
          />
        </View>
        <View>
          <Text style={styles.profileTitle}>Manpreet</Text>
          <Text style={styles.profileSubtitle}>Team Leader</Text>
        </View>
        <Ionicons 
          name={showDropdown ? "caret-up-outline" : "caret-down-outline"} 
          size={14} 
          color="#666" 
        />
      </TouchableOpacity>
      
      {showDropdown && (
        <View style={[styles.dropdown, { top: headerHeight }]}>
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
    borderBottomWidth: 2,
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
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    marginRight: 4,
    borderRadius: 20,
    backgroundColor: '#5932EA66',
  },
  profileTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  profileSubtitle: {
    fontSize: 11,
    color: '#666',
  },
  dropdown: {
    position: 'absolute',
    right: 10,
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

