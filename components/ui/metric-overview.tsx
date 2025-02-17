import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MetricCard } from '@/components/ui/metric-card';
import { Users, DollarSign, TrendingUp, PieChart } from 'lucide-react-native';

interface MetricsOverviewProps {
  totalAgents: number;
  totalRevenue: number;
  averageDealSize: number;
  conversionRate: number;
  agentGrowth: number;
  revenueGrowth: number;
  conversionRateChange: number;
}

export function MetricsOverview({
  totalAgents,
  totalRevenue,
  averageDealSize,
  conversionRate,
  agentGrowth,
  revenueGrowth,
  conversionRateChange,
}: MetricsOverviewProps) {
  return (
    <View style={styles.container}>
      <MetricCard
        title="Total Agents"
        value={totalAgents}
        subtitle={`${agentGrowth > 0 ? '+' : ''}${agentGrowth}% from last month`}
        changeDirection={agentGrowth >= 0 ? 'up' : 'down'}
        // icon={<Users size={24} color="#5932EA" />}
      />
      <MetricCard
        title="Total Revenue"
        value={`$${(totalRevenue / 1000000).toFixed(1)}M`}
        subtitle={`${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}% from last month`}
        changeDirection={revenueGrowth >= 0 ? 'up' : 'down'}
        // icon={<DollarSign size={24} color="#5932EA" />}
      />
      <MetricCard
        title="Average Deal Size"
        value={`$${(averageDealSize / 1000).toFixed(0)}K`}
        // icon={<TrendingUp size={24} color="#5932EA" />}
      />
      <MetricCard
        title="Conversion Rate"
        value={`${conversionRate.toFixed(1)}%`}
        subtitle={`${conversionRateChange > 0 ? '+' : ''}${conversionRateChange}% from last month`}
        changeDirection={conversionRateChange >= 0 ? 'up' : 'down'}
        // icon={<PieChart size={24} color="#5932EA" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});

