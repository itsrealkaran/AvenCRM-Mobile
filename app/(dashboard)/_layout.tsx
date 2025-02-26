import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { useAuth } from '@/contexts/auth-context';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { NotificationListener } from '@/components/notification-listener';
export default function DashboardLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
      <>
        <NotificationListener />
        <Drawer
          drawerContent={(props: DrawerContentComponentProps) => <Sidebar {...props} />}
          screenOptions={({ navigation }) => ({
            header: () => <Header toggleDrawer={navigation.toggleDrawer} />,
            drawerStyle: {
              width: 250,
            },
          })}
        >
          <Drawer.Screen name="index" options={{ title: 'Dashboard' }} />
          <Drawer.Screen name="property" options={{ title: 'Property' }} />
          <Drawer.Screen name="marketing" options={{ title: 'Marketing' }} />
          <Drawer.Screen name="page-builder" options={{ title: 'Page Builder' }} />
          <Drawer.Screen name="leads" options={{ title: 'Leads' }} />
          <Drawer.Screen name="deals" options={{ title: 'Deals' }} />
          <Drawer.Screen name="transactions" options={{ title: 'Transaction' }} />
          <Drawer.Screen name="monitoring" options={{ title: 'Monitoring' }} />
          <Drawer.Screen name="calendar" options={{ title: 'Calendar' }} />
          <Drawer.Screen name="settings" options={{ title: 'Settings' }} />
        </Drawer>
        <StatusBar style="dark" backgroundColor="#fff" />
      </>
  );
}

