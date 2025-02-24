import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { api } from '@/utils/api-client';
import { notificationService } from '@/utils/notification-service';
import type { Notification } from '@/types/notification';

export function NotificationListener() {
  const navigation = useNavigation();
  const [lastCheckedTime, setLastCheckedTime] = useState<Date>(new Date());
  const notificationCache = useRef<Set<string>>(new Set());

  const handleNewNotification = async (notification: Notification) => {
    // Check if we've already shown this notification
    if (notificationCache.current.has(notification.id)) {
      return;
    }

    // Check if this is a new notification
    const notificationTime = new Date(notification.createdAt);
    if (notificationTime > lastCheckedTime) {
      await notificationService.showNotification(notification);
      notificationCache.current.add(notification.id);
      console.log('[Notification] Showing new notification:', notification.title);
    }
  };

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const { notifications } = await api.getNotifications();
        const unreadNotifications = notifications.filter(n => !n.read);
        
        // Process each unread notification
        for (const notification of unreadNotifications) {
          await handleNewNotification(notification);
        }
        
        // Update last checked time
        setLastCheckedTime(new Date());
        
        // Update badge count
        await notificationService.setBadgeCount(unreadNotifications.length);
        
        console.log('[Notifications] Checked at:', new Date().toISOString());
        console.log('[Notifications] Unread count:', unreadNotifications.length);
      } catch (error) {
        console.error('[Notifications] Error checking notifications:', error);
      }
    };

    // Request permissions on mount
    notificationService.requestPermissions();

    // Check notifications immediately
    checkNotifications();

    // Set up periodic checks (every 30 seconds)
    const intervalId = setInterval(checkNotifications, 30000);

    // Check on route change
    const unsubscribe = navigation.addListener('state', checkNotifications);

    return () => {
      clearInterval(intervalId);
      unsubscribe();
    };
  }, [navigation]);

  return null;
}