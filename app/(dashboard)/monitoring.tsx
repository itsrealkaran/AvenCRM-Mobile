import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@/components/ui/card';
import { MetricsOverview } from '@/components/ui/metric-overview';
import { PipelineConversionChart } from '@/components/ui/pipeline-conversion';
import { RevenueTrendChart } from '@/components/ui/revenue-trend';
import { TopPerformingAgents } from '@/components/ui/top-performer';

// Define types for our API response
interface MonitoringData {
  metrics: {
    totalAgents: number;
    totalRevenue: number;
    averageDealSize: number;
    conversionRate: number;
    agentGrowth: number;
    revenueGrowth: number;
    conversionRateChange: number;
  };
  pipelineData: Array<{ stage: string; value: number }>;
  revenueTrend: Array<{ month: string; revenue: number }>;
  topAgents: Array<{ name: string; performance: number }>;
}

// Mock API function (replace with actual API call)
const fetchMonitoringData = async (): Promise<MonitoringData> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    metrics: {
      totalAgents: 45,
      totalRevenue: 2400000,
      averageDealSize: 125000,
      conversionRate: 26.7,
      agentGrowth: 12,
      revenueGrowth: 8,
      conversionRateChange: -2,
    },
    pipelineData: [
      { stage: 'Discovery', value: 80 },
      { stage: 'Proposal', value: 60 },
      { stage: 'Negotiation', value: 40 },
      { stage: 'Won', value: 20 },
    ],
    revenueTrend: [
      { month: 'Jan', revenue: 300000 },
      { month: 'Feb', revenue: 450000 },
      { month: 'Mar', revenue: 400000 },
      { month: 'Apr', revenue: 550000 },
      { month: 'May', revenue: 600000 },
      { month: 'Jun', revenue: 750000 },
    ],
    topAgents: [
      { name: 'John Doe', performance: 95 },
      { name: 'Jane Smith', performance: 88 },
      { name: 'Mike Johnson', performance: 82 },
      { name: 'Emily Brown', performance: 78 },
    ],
  };
};

export default function Monitoring() {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchMonitoringData();
        setData(result);
      } catch (err) {
        setError('Failed to load monitoring data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.container}>
        <Text>{error || 'An unexpected error occurred'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Monitoring Dashboard</Text>
      </View>
      <Card style={styles.card}>
        <MetricsOverview
          totalAgents={data.metrics.totalAgents}
          totalRevenue={data.metrics.totalRevenue}
          averageDealSize={data.metrics.averageDealSize}
          conversionRate={data.metrics.conversionRate}
          agentGrowth={data.metrics.agentGrowth}
          revenueGrowth={data.metrics.revenueGrowth}
          conversionRateChange={data.metrics.conversionRateChange}
        />
      </Card>
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Pipeline Conversion</Text>
        <PipelineConversionChart data={data.pipelineData} />
      </Card>
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Revenue Trend</Text>
        <RevenueTrendChart data={data.revenueTrend} />
      </Card>
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Top Performing Agents</Text>
        <TopPerformingAgents data={data.topAgents} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
});

