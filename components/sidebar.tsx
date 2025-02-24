import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Defs, G } from 'react-native-svg';

interface MenuItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const MENU_ITEMS: MenuItem[] = [
  { name: 'Dashboard', icon: 'home-outline' },
  { name: 'Property', icon: 'business-outline' },
  // { name: 'Marketing', icon: 'megaphone-outline' },
  // { name: 'Page Builder', icon: 'construct-outline' },
  { name: 'Leads', icon: 'people-outline' },
  { name: 'Deals', icon: 'briefcase-outline' },
  { name: 'Transaction', icon: 'card-outline' },
  // { name: 'Monitoring', icon: 'analytics-outline' },
  { name: 'Calendar', icon: 'calendar-outline' },
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
            <Svg width="32" height="32" viewBox="0 0 1729.67 1729.67">
              <G transform="translate(165, 240) scale(0.8)" id="Layer_2">
                <Path
                  strokeMiterlimit={10}
                  strokeWidth={60}
                  fill="#5932EA"
                  stroke="#5932EA"
                  d="M1229.28,632.22c-25.17,43.65-86.07,149.19-129.26,224A163.24,163.24,0,0,1,958.9,937.83L1136.17,632.3a40.29,40.29,0,0,0,0-40.4c-22.88-39.52-76-131.29-129.26-223.21-39.9-68.82-79.84-137.79-107.15-185-15.54-26.78-54.17-26.74-69.67,0C757.49,309.62,592.54,595.23,547.4,673.42a40.31,40.31,0,0,1-34.89,20.12h-.08c-31,0-50.34-33.55-34.88-60.4L830,21.19c15.5-26.89,54.28-26.93,69.78,0L1229.28,592A40.23,40.23,0,0,1,1229.28,632.22Z"
                />
                <Path
                  strokeMiterlimit={10}
                  strokeWidth={60}
                  fill="#5932EA"
                  stroke="#5932EA"
                  d="M1688.33,1507.86l-659.2.07a40.31,40.31,0,0,1-34.89-20.16L864.45,1262.84a161.49,161.49,0,0,1,0-161.47l.38-.69,176.43,305.65a40.24,40.24,0,0,0,34.89,20.16l472.78-.08c31,0,50.38-33.62,34.85-60.44L1300.51,876.32a40.11,40.11,0,0,1-.19-40c15.37-27.13,54.35-27.28,69.92-.31l353,611.41C1738.71,1474.27,1719.35,1507.86,1688.33,1507.86Z"
                />
                <Path
                  strokeMiterlimit={10}
                  strokeWidth={60}
                  fill="#5932EA"
                  stroke="#5932EA"
                  d="M748.16,1507.93H41.34c-31,0-50.38-33.58-34.89-60.44L336,876.51a40.35,40.35,0,0,1,34.92-20.16H629.72a163.11,163.11,0,0,1,141.16,81.44H418A40.29,40.29,0,0,0,383.1,958L147.53,1366c-15.53,26.86,3.86,60.44,34.85,60.44l565.28.08a40.33,40.33,0,0,1,34.93,20.16l.49.88C798.54,1474.38,779.14,1507.93,748.16,1507.93Z"
                />
              </G>
            </Svg>
            <Text style={styles.linkTitle}>AvenCRM</Text>
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
                  color={isActive ? '#fff' : '#374151'} 
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
                color={isActive ? '#fff' : '#374151'}
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
    gap: '2px',
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
    backgroundColor: '#7c3aed',
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
    color: '#374151',
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
    paddingTop: 8,
    paddingBottom: 16,
  },
  linkTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5932EA',
  },
});

