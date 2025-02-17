import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { MetricCard } from '@/components/ui/metric-card';
import { PerformanceChart } from '@/components/ui/performance-chart';
import { TaskList } from '@/components/ui/task-list';
import { useAuth } from '@/contexts/auth-context';

const dashboardData = {
  metrics: [
    { 
      id: '1', 
      title: "My Leads", 
      value: "4", 
      subtitle: "Active leads assigned",
      icon: 'people-outline' as const,
      color: '#4318FF'
    },
    { 
      id: '2', 
      title: "My Deals", 
      value: "3", 
      subtitle: "Deals in progress",
      icon: 'document-text-outline' as const,
      color: '#05CD99'
    },
    { 
      id: '3', 
      title: "Pending Tasks", 
      value: "2", 
      subtitle: "Tasks to complete",
      icon: 'checkmark-circle-outline' as const,
      color: '#6C5DD3'
    },
    { 
      id: '4', 
      title: "My Revenue", 
      value: "$0", 
      subtitle: "Total revenue generated",
      icon: 'cash-outline' as const,
      color: '#FFB547'
    },
  ],
  performanceData: [
    { month: 'Jan', leads: 4, deals: 2 },
    { month: 'Feb', leads: 6, deals: 3 },
    { month: 'Mar', leads: 8, deals: 5 },
    { month: 'Apr', leads: 6, deals: 4 },
    { month: 'May', leads: 12, deals: 8 },
    { month: 'Jun', leads: 8, deals: 6 },
    { month: 'Jul', leads: 10, deals: 7 },
    { month: 'Aug', leads: 9, deals: 5 },
    { month: 'Sep', leads: 11, deals: 8 },
    { month: 'Oct', leads: 13, deals: 9 },
    { month: 'Nov', leads: 15, deals: 11 },
    { month: 'Dec', leads: 14, deals: 10 },
  ],
  upcomingTasks: [
    { id: '1', type: 'Property Viewing', time: 'Today at 2:00 PM', icon: 'home-outline' as const },
    { id: '2', type: 'Client Meeting', time: 'Tomorrow at 10:00 AM', icon: 'people-outline' as const },
    { id: '3', type: 'Follow-up Call', time: 'Friday at 3:30 PM', icon: 'call-outline' as const },
  ],
};

const screenWidth = Dimensions.get('window').width;

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <View style={styles.scrollView}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.name || 'User'}!</Text>
      </View>
      <ScrollView>
        <View style={styles.metricsContainer}>
          {dashboardData.metrics.map((metric) => (
            <View key={metric.id} style={styles.metricCardWrapper}>
              <MetricCard
                title={metric.title}
                value={metric.value}
                subtitle={metric.subtitle}
                icon={metric.icon}
                color={metric.color}
              />
            </View>
          ))}
        </View>

        <View style={styles.content}>
          <PerformanceChart
            data={dashboardData.performanceData}
          />
          <TaskList
            title="Upcoming Tasks"
            subtitle="Your scheduled activities"
            tasks={dashboardData.upcomingTasks}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  metricCardWrapper: {
    width: (screenWidth - 48) / 2,
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
});

