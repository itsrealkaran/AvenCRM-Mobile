import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { MetricCard } from '../../components/ui/metric-card';
import { PerformanceChart } from '../../components/ui/performance-chart';
import { TaskList } from '../../components/ui/task-list';

// Mock data (in the future, this could be fetched from an API)
const dashboardData = {
  metrics: [
    { id: '1', title: "Active Leads", value: "12", subtitle: "4 require follow-up" },
    { id: '2', title: "Deals Closed", value: "4", subtitle: "This month" },
    { id: '3', title: "Commission", value: "$12,234", subtitle: "+8.2% from last month", changeDirection: "up" as const },
    { id: '4', title: "Response Rate", value: "95%", subtitle: "+4% from last month", changeDirection: "up" as const },
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
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, Manpreet!</Text>
      </View>
      <View style={styles.metricsContainer}>
        {dashboardData.metrics.map((metric, index) => (
          <View key={metric.id} style={styles.metricCardWrapper}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              changeDirection={metric.changeDirection}
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
    color: '#5932EA',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  metricCardWrapper: {
    width: (screenWidth - 48) / 2, // 48 = 16 * 2 (horizontal padding) + 16 (gap between cards)
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
});

