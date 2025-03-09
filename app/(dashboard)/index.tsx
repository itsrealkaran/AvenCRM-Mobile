import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { MetricCard } from '@/components/ui/metric-card';
import { PerformanceChart } from '@/components/ui/performance-chart';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/utils/api-client';
import { useCurrency } from '@/contexts/currency-context';

const screenWidth = Dimensions.get('window').width;
interface DashboardData {
  totalLeads: number;
  totalDeals: number;
  pendingTasks: number;
  revenue: {
    myRevenue: number;
  };
  performanceData: Array<{
    month: string;
    grossRevenue: number;
    myRevenue: number;
  }>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { formatPrice } = useCurrency();

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
      value: formatPrice(dashboardData?.revenue?.myRevenue || 0), 
      subtitle: "Total revenue generated",
      icon: 'cash-outline' as const,
      color: '#FFB547'
    },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const performanceData = months.map(month => {
    const apiData = dashboardData?.performanceData?.find(d => d.month === month);
    return {
      month,
      total: apiData?.grossRevenue || 0,
      gross: apiData?.myRevenue || 0
    };
  });

  if (isLoading) {
    return (
      <View style={[styles.scrollView, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4318FF" />
      </View>
    );
  }

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
          {/* <TaskList
            title="Upcoming Tasks"
            subtitle="Your scheduled activities"
            tasks={[]} // You might want to add tasks endpoint and data
          /> */}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
