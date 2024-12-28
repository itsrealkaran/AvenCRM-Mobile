import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './card';

interface Task {
  id: string;
  type: string;
  time: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface TaskListProps {
  title: string;
  subtitle: string;
  tasks: Task[];
}

export function TaskList({ title, subtitle, tasks }: TaskListProps) {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.taskList}>
        {tasks.map((task, index) => (
          <View 
            key={task.id} 
            style={[
              styles.taskItem,
              index < tasks.length - 1 && styles.taskItemBorder
            ]}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={task.icon} size={20} color="#5932EA" />
            </View>
            <View style={styles.taskContent}>
              <Text style={styles.taskType}>{task.type}</Text>
              <Text style={styles.taskTime}>{task.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  taskList: {
    gap: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
  },
  taskItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 12,
    color: '#666',
  },
});

