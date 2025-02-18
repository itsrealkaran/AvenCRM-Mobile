import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { MetricCard } from '@/components/ui/metric-card';
import { PerformanceChart } from '@/components/ui/performance-chart';
import { TaskList } from '@/components/ui/task-list';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/utils/api-client';

const screenWidth = Dimensions.get('window').width;
interface DashboardData {
  totalLeads: number;
  totalDeals: number;
  pendingTasks: number;
  revenue: number;
  performanceData: Array<{
    month: string;
    deals: number;
  }>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await api.getAgentDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = [
    { 
      id: '1', 
      title: "My Leads", 
      value: dashboardData?.totalLeads.toString() || "0", 
      subtitle: "Active leads assigned",
      icon: 'people-outline' as const,
      color: '#4318FF'
    },
    { 
      id: '2', 
      title: "My Deals", 
      value: dashboardData?.totalDeals.toString() || "0", 
      subtitle: "Deals in progress",
      icon: 'document-text-outline' as const,
      color: '#05CD99'
    },
    { 
      id: '3', 
      title: "Pending Tasks", 
      value: dashboardData?.pendingTasks.toString() || "0", 
      subtitle: "Tasks to complete",
      icon: 'checkmark-circle-outline' as const,
      color: '#6C5DD3'
    },
    { 
      id: '4', 
      title: "My Revenue", 
      value: `$${dashboardData?.revenue.toLocaleString() || "0"}`, 
      subtitle: "Total revenue generated",
      icon: 'cash-outline' as const,
      color: '#FFB547'
    },
  ];
  const performanceData = [
    { month: 'Jan', total: 4, gross: 2 },
    { month: 'Feb', total: 6, gross: 3 },
    { month: 'Mar', total: 8, gross: 5 },
    { month: 'Apr', total: 6, gross: 4 },
    { month: 'May', total: 12, gross: 8 },
    { month: 'Jun', total: 8, gross: 6 },
    { month: 'Jul', total: 10, gross: 7 },
    { month: 'Aug', total: 9, gross: 5 },
    { month: 'Sep', total: 11, gross: 8 },
    { month: 'Oct', total: 13, gross: 9 },
    { month: 'Nov', total: 15, gross: 11 },
    { month: 'Dec', total: 14, gross: 10 },
  ];


  
  return (
    <View style={styles.scrollView}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.name || 'User'}!</Text>
      </View>
      <ScrollView>
        <View style={styles.metricsContainer}>
          {metrics.map((metric) => (
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
            data={performanceData}
          />
          <TaskList
            title="Upcoming Tasks"
            subtitle="Your scheduled activities"
            tasks={[]} // You might want to add tasks endpoint and data
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

