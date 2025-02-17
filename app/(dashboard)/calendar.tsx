import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Card } from '@/components/ui/card';
import { Calendar as RNCalendar, CalendarUtils } from 'react-native-calendars';
import { EventForm } from '@/components/ui/event-form';
import { DayView } from '@/components/ui/day-view';
import { Button } from '@/components/ui/button';
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import { syncGoogleCalendar, syncOutlookCalendar } from '@/utils/calendar-sync';

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  color: string;
  source: 'local' | 'google' | 'outlook';
}

const EVENT_COLORS = ['#5932EA', '#FF6B6B', '#4CAF50', '#FFA000', '#2196F3'];

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(CalendarUtils.getCalendarDateString(new Date()));
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showDayView, setShowDayView] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentMonth, setCurrentMonth] = useState(CalendarUtils.getCalendarDateString(new Date()));

  useEffect(() => {
    // Load events from local storage or API
    // This is a placeholder for actual data loading
    setEvents([]);
  }, []);

  const handleDayPress = useCallback((day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setShowDayView(true);
  }, []);

  const handleAddEvent = useCallback((event: Omit<Event, 'id' | 'color' | 'source'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      color: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
      source: 'local',
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setShowEventForm(false);
  }, []);

  const handleEditEvent = useCallback((updatedEvent: Event) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
    setShowEventForm(false);
    setEditingEvent(null);
  }, []);

  const handleDeleteEvent = useCallback((eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  }, []);

  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
  };

  const handleSyncCalendar = async (source: 'google' | 'outlook') => {
    try {
      let newEvents: Event[];
      if (source === 'google') {
        newEvents = await syncGoogleCalendar();
      } else {
        newEvents = await syncOutlookCalendar();
      }
      setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      Alert.alert('Success', `Calendar synced with ${source} successfully!`);
    } catch (error) {
      console.error('Error syncing calendar:', error);
      Alert.alert('Error', `Failed to sync with ${source} calendar. Please try again.`);
    }
  };

  const markedDates = events.reduce((acc, event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = CalendarUtils.getCalendarDateString(date);
      if (!acc[dateString]) {
        acc[dateString] = { dots: [], periods: [] };
      }
      acc[dateString].dots.push({ color: event.color });
      acc[dateString].periods.push({
        startingDay: date.getTime() === start.getTime(),
        endingDay: date.getTime() === end.getTime(),
        color: event.color,
      });
    }
    return acc;
  }, {} as { [key: string]: { dots: { color: string }[]; periods: { startingDay: boolean; endingDay: boolean; color: string }[] } });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <Button style={{backgroundColor: '#5932EA11'}} variant='outline' size='md' onPress={() => setShowEventForm(true)}>
          <View style={styles.addButton}>
            <MaterialIcons name="post-add" size={24} color="#5932EA" />
            <Text style={styles.buttonText}>Add Event</Text>
          </View> 
        </Button>
        </View>
        <Card style={styles.calendarCard}>
          <RNCalendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            markingType="multi-period"
            onMonthChange={(month) => handleMonthChange(month.dateString)}
            enableSwipeMonths={true}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#5932EA',
              selectedDayBackgroundColor: '#5932EA',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#5932EA',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#5932EA',
              selectedDotColor: '#ffffff',
              arrowColor: '#5932EA',
              monthTextColor: '#5932EA',
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </Card>
        <View style={styles.syncButtonsContainer}>
          <Button onPress={() => handleSyncCalendar('google')} style={{backgroundColor: '#5932EA22'}} variant='outline'>
            <View style={styles.syncButton}>
              <Ionicons name="logo-google" size={24} color="#5932EA" />
              <Text style={styles.buttonText}>Sync Google Calendar</Text>
            </View>
            
          </Button>
          <Button onPress={() => handleSyncCalendar('outlook')} style={{backgroundColor: '#5932EA22'}} variant='outline'>
            <View style={styles.syncButton}>
              <MaterialCommunityIcons name="microsoft-outlook" size={24} color="#5932EA" />
              <Text style={styles.buttonText}>Sync Outlook Calendar</Text>
            </View>
          </Button>
        </View>
      </ScrollView>

      <Modal visible={showEventForm} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <EventForm
            onSubmit={editingEvent ? handleEditEvent : handleAddEvent}
            onCancel={() => {
              setShowEventForm(false);
              setEditingEvent(null);
            }}
            initialDate={selectedDate}
            editingEvent={editingEvent}
          />
        </View>
      </Modal>

      <Modal visible={showDayView} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <DayView
            date={selectedDate}
            events={events.filter((event) => 
              new Date(event.startDate) <= new Date(selectedDate) && 
              new Date(event.endDate) >= new Date(selectedDate)
            )}
            onClose={() => setShowDayView(false)}
            onEditEvent={(event) => {
              setEditingEvent(event);
              setShowEventForm(true);
              setShowDayView(false);
            }}
            onDeleteEvent={handleDeleteEvent}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#5932EA',
    fontWeight: '500',
    marginLeft: 6,
    fontSize: 16,
  },
  calendarCard: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  syncButtonsContainer: {
    gap: 12,
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 16,
  },
  syncButton: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

