import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@/components/ui/card';
import { Svg, G, Text as SvgText, Line, Rect } from 'react-native-svg';

interface PerformanceData {
  month: string;
  leads: number;
  deals: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const graphHeight = chartHeight - padding.top - padding.bottom;

  const currentMonth = new Date().getMonth();
  const currentMonthData = data.find(item => MONTHS.indexOf(item.month) === currentMonth);

  const barWidth = 30;
  const gapWidth = 15;
  const groupWidth = (barWidth * 2) + gapWidth;
  const contentWidth = groupWidth * MONTHS.length;

  const maxValue = Math.max(...data.flatMap(item => [item.leads, item.deals]));
  const yAxisValues = Array.from({ length: 5 }, (_, i) => Math.round(maxValue * (i / 4)));

  useEffect(() => {
    if (scrollViewWidth > 0 && scrollViewRef.current) {
      const scrollToX = (currentMonth * groupWidth) - (scrollViewWidth / 2) + (groupWidth / 2);
      scrollViewRef.current.scrollTo({ x: scrollToX, animated: true });
    }
  }, [scrollViewWidth, currentMonth]);

  const renderBar = (value: number, index: number, x: number, color: string) => {
    const barHeight = (value / maxValue) * graphHeight;
    return (
      <Rect
        key={`bar-${index}`}
        x={x}
        y={chartHeight - padding.bottom - barHeight}
        width={barWidth}
        height={barHeight}
        fill={color}
        rx={4}
      />
    );
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Performance Overview</Text>
      <Text style={styles.subtitle}>Your monthly leads and deals</Text>
      
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        onLayout={(event) => {
          setScrollViewWidth(event.nativeEvent.layout.width);
        }}
      >
        <Svg width={contentWidth} height={chartHeight}>
          {/* Y-axis lines and labels */}
          {yAxisValues.reverse().map((value, index) => (
            <G key={`y-${index}`}>
              <Line
                x1={padding.left}
                y1={padding.top + (index * graphHeight) / 4}
                x2={contentWidth}
                y2={padding.top + (index * graphHeight) / 4}
                stroke="#E0E0E0"
                strokeWidth="1"
              />
              <SvgText
                x={padding.left - 10}
                y={padding.top + (index * graphHeight) / 4}
                fontSize="10"
                textAnchor="end"
                fill="#666"
              >
                {value}
              </SvgText>
            </G>
          ))}

          {/* Bars and labels */}
          {MONTHS.map((month, index) => {
            const monthData = data.find(item => item.month === month) || { leads: 0, deals: 0 };
            const x = padding.left + (index * groupWidth);
            const isCurrentMonth = index === currentMonth;
            return (
              <G key={month}>
                {renderBar(monthData.leads, index * 2, x, isCurrentMonth ? '#6C5CE7' : '#4CAF50')}
                {renderBar(monthData.deals, index * 2 + 1, x + barWidth + gapWidth, isCurrentMonth ? '#8E7BFF' : '#2196F3')}
                <SvgText
                  x={x + barWidth + gapWidth / 2}
                  y={chartHeight - padding.bottom + 20}
                  fontSize="10"
                  textAnchor="middle"
                  fill={isCurrentMonth ? '#6C5CE7' : '#666'}
                  fontWeight={isCurrentMonth ? 'bold' : 'normal'}
                >
                  {month}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </ScrollView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Leads</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.legendText}>Deals</Text>
        </View>
      </View>

      {currentMonthData && (
        <View style={styles.currentMonthStats}>
          <Text style={styles.currentMonthTitle}>Current Month ({MONTHS[currentMonth]})</Text>
          <Text style={styles.currentMonthText}>Leads: {currentMonthData.leads}</Text>
          <Text style={styles.currentMonthText}>Deals: {currentMonthData.deals}</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  currentMonthStats: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  currentMonthTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  currentMonthText: {
    fontSize: 12,
    color: '#333',
  },
});

