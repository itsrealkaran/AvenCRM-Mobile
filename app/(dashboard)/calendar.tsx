import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Card } from '@/components/ui/card';
import { Calendar as RNCalendar, CalendarUtils } from 'react-native-calendars';
import { EventForm } from '@/components/ui/event-form';
import { Button } from '@/components/ui/button';
import { Ionicons, MaterialIcons} from '@expo/vector-icons';
import { api } from '@/utils/api-client';
import { Event } from '@/types/event';

export const eventColors = [
  {
    id: 'blue',
    name: 'Blue',
    backgroundColor: '#3182ce',
    textColor: 'white',
  },
  {
    id: 'green',
    name: 'Green',
    backgroundColor: '#34A853',
    textColor: 'white',
  },
  {
    id: 'red',
    name: 'Red',
    backgroundColor: '#E53E3E',
    textColor: 'white',
  },
  {
    id: 'purple',
    name: 'Purple',
    backgroundColor: '#805AD5',
    textColor: 'white',
  },
  {
    id: 'orange',
    name: 'Orange',
    backgroundColor: '#ED8936',
    textColor: 'white',
  },
];

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(CalendarUtils.getCalendarDateString(new Date()));
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentMonth, setCurrentMonth] = useState(CalendarUtils.getCalendarDateString(new Date()));
  const [isLoading, setIsLoading] = useState(false);

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiEvents = await api.getCalendarEvents();
      
      // Transform API events to our Event format
      const formattedEvents = apiEvents.map((event: any) => ({
        id: event.id || String(Date.now()),
        title: event.title,
        description: event.description || '',
        start: event.start,
        end: event.end,
        color: event.color || eventColors[Math.floor(Math.random() * eventColors.length)].id,
        source: event.source || 'local',
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to load calendar events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDayPress = useCallback((day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  }, []);

  const handleDeleteEvent = useCallback(async (eventId: string) => {
    try {
      setIsLoading(true);
      await api.deleteCalendarEvent(eventId);
      
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      Alert.alert('Error', 'Failed to delete event');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
  };

  const getColorForEvent = (colorId: string) => {
    const color = eventColors.find(c => c.id === colorId);
    return color ? color.backgroundColor : '#3182ce'; // Default to blue if not found
  };

  const markedDates = events.reduce((acc, event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const eventColor = getColorForEvent(event.color || '');
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = CalendarUtils.getCalendarDateString(date);
      if (!acc[dateString]) {
        acc[dateString] = { dots: [], periods: [] };
      }
      acc[dateString].dots.push({ color: eventColor });
      acc[dateString].periods.push({
        startingDay: date.getTime() === start.getTime(),
        endingDay: date.getTime() === end.getTime(),
        color: eventColor,
      });
    }
    return acc;
  }, {} as { [key: string]: { dots: { color: string }[]; periods: { startingDay: boolean; endingDay: boolean; color: string }[] } });

  const selectedDateEvents = events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const selected = new Date(selectedDate);
    
    // Reset hours to compare dates only
    eventStart.setHours(0, 0, 0, 0);
    eventEnd.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    
    return eventStart <= selected && eventEnd >= selected;
  });

  // Format time to display in 12-hour format with AM/PM
  const formatTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <Button style={styles.addEventBtn} variant='outline' size='md' onPress={() => setShowEventForm(true)}>
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
            onMonthChange={(month: { dateString: string }) => handleMonthChange(month.dateString)}
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
        
        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>
            Events for {new Date(selectedDate).toDateString()}
          </Text>
          
          {selectedDateEvents.length === 0 ? (
            <View>
              <Card style={styles.emptyStateCard}>
                <Text style={styles.emptyStateText}>No events scheduled for this day</Text>
              </Card>
              <Button 
                style={styles.loadEventsButton} 
                onPress={fetchEvents}
                disabled={isLoading}
              >
                <View style={styles.loadButtonContent}>
                  <Ionicons name="refresh" size={20} color="#FFFFFF" style={styles.refreshIcon} />
                  <Text style={styles.loadButtonText}>
                    {isLoading ? 'Loading...' : 'Refresh Events'}
                  </Text>
                </View>
              </Button>
            </View>
          ) : (
            <View style={styles.eventsContainer}>
              <ScrollView 
                style={styles.eventsList}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.eventsListContent}
              >
                {selectedDateEvents.map((event) => (
                  <Card key={event.id} style={[styles.eventCard, { borderLeftColor: getColorForEvent(event.color || ''), borderLeftWidth: 4 }]}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <View style={styles.eventActions}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onPress={() => {
                            setEditingEvent(event);
                            setShowEventForm(true);
                          }}
                          style={styles.actionButton}
                        >
                          <Ionicons name="create-outline" size={20} color="#5932EA" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onPress={() => handleDeleteEvent(event.id)}
                          style={styles.actionButton}
                        >
                          <Ionicons name="trash-outline" size={20} color="#FF4B4B" />
                        </Button>
                      </View>
                    </View>
                    
                    <View style={styles.eventTimeContainer}>
                      <Ionicons name="time-outline" size={16} color="#666" style={styles.eventTimeIcon} />
                      <Text style={styles.eventTime}>
                        {formatTime(event.start)} - {formatTime(event.end)}
                      </Text>
                    </View>
                    
                    <Text style={styles.eventDescription}>{event.description}</Text>
                    
                    <View style={styles.eventSource}>
                      <Ionicons 
                        name={event.location === 'google' ? 'logo-google' : event.location === 'outlook' ? 'mail-outline' : 'calendar-outline'} 
                        size={16} 
                        color="#666" 
                      />
                      <Text style={styles.eventSourceText}>{event.location || 'local'}</Text>
                    </View>
                  </Card>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={showEventForm} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <EventForm
            onSubmit={async (eventData) => {
              try {
                setIsLoading(true);
                const apiEventData = {
                  title: eventData.title,
                  description: eventData.description || '',
                  start: new Date(eventData.start).toISOString(),
                  end: new Date(eventData.end).toISOString(),
                  color: editingEvent?.color || eventColors[Math.floor(Math.random() * eventColors.length)].id
                };
                
                if (editingEvent) {
                  await api.updateCalendarEvent(editingEvent.id, apiEventData);
                } else {
                  await api.createCalendarEvent(apiEventData);
                }
                setShowEventForm(false);
                setEditingEvent(null);
                fetchEvents(); // Refresh events after adding/editing
              } catch (error) {
                console.error('Error saving event:', error);
                Alert.alert('Error', 'Failed to save event');
              } finally {
                setIsLoading(false);
              }
            }}
            onCancel={() => {
              setShowEventForm(false);
              setEditingEvent(null);
            }}
            initialDate={selectedDate}
            editingEvent={editingEvent}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  addEventBtn: {
    backgroundColor: '#f0eafb',
    borderColor: '#5932EA',
    borderWidth: 1,
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  eventsSection: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  eventsContainer: {
    maxHeight: 300,
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventsList: {
    width: '100%',
  },
  eventsListContent: {
    paddingVertical: 8,
  },
  eventCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  eventActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 4,
    borderRadius: 20,
  },
  eventTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    padding: 6,
    borderRadius: 6,
  },
  eventTimeIcon: {
    marginRight: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
  },
  eventDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  eventSource: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  eventSourceText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  emptyStateCard: {
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  emptyStateText: {
    color: '#666',
    marginBottom: 16,
    fontSize: 16,
  },
  loadEventsButton: {
    backgroundColor: '#5932EA',
    marginTop: 12,
    borderRadius: 8,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  loadButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    marginRight: 8,
  },
  loadButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
  addEventButton: {
    backgroundColor: '#5932EA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  syncSection: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  syncButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  syncButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#4285F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  outlookButton: {
    backgroundColor: '#0078D4',
    marginRight: 0,
    marginLeft: 8,
  },
  syncIcon: {
    marginRight: 8,
  },
  syncButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
});
