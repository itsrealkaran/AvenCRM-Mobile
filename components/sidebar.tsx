import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const MENU_ITEMS: MenuItem[] = [
  { name: 'Dashboard', icon: 'home-outline' },
  { name: 'Property', icon: 'business-outline' },
  { name: 'Marketing', icon: 'megaphone-outline' },
  { name: 'Page Builder', icon: 'construct-outline' },
  { name: 'Leads', icon: 'people-outline' },
  { name: 'Deals', icon: 'briefcase-outline' },
  { name: 'Transaction', icon: 'card-outline' },
  { name: 'Monitoring', icon: 'analytics-outline' },
  { name: 'Calendar', icon: 'calendar-outline' },
  { name: 'Email', icon: 'mail-outline' },
];

export default function Sidebar(props: DrawerContentComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isItemActive = (itemName: string): boolean => {
    if (itemName === 'Dashboard') {
      return pathname === '/(dashboard)' || pathname === '/(dashboard)/index' || pathname === '/';
    }
    return pathname.includes(itemName.toLowerCase().replace(/\s+/g, '-'));
  };

  return (
    <DrawerContentScrollView 
      {...props}
      contentContainerStyle={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.logoContainer}>
        <TouchableOpacity 
          onPress={() => router.push('/(dashboard)' as never)}
          style={styles.linkContainer}
        >
          <View style={styles.logoWrapper}>
            <Ionicons name="layers-outline" size={24} color="#5932ea" />
            <Text style={styles.linkTitle}>AvenCRM</Text>
            <Text style={styles.linkVersion}>v.01</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.menuContainer}>
        {MENU_ITEMS.map((item) => {
          const isActive = isItemActive(item.name);
          return (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.menuItem,
                isActive && styles.activeMenuItem
              ]}
              onPress={() => {
                const route = item.name === 'Dashboard' 
                    ? '/(dashboard)' 
                    : `/(dashboard)/${item.name.toLowerCase().replace(/\s+/g, '-')}`;
                router.push(route as never);
                props.navigation.closeDrawer();
              }}
            >
              <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                <Ionicons 
                  name={item.icon} 
                  size={20} 
                  color={isActive ? '#fff' : '#9197B3'} 
                />
              </View>
              <Text style={[
                styles.menuText,
                isActive && styles.activeMenuText
              ]}>
                {item.name}
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isActive ? '#fff' : '#9197B3'}
                style={styles.chevron}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  logoContainer: {
    height: 60,
    margin: 10,
    marginBottom: 2,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  activeMenuItem: {
    backgroundColor: '#5932ea',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FA',
    marginRight: 12,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuText: {
    fontSize: 12,
    color: '#9197B3',
    flex: 1,
  },
  activeMenuText: {
    color: '#fff',
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 8,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  linkTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5932ea',
  },
  linkVersion: {
    fontSize: 10,
    color: '#838383',
  },
});

