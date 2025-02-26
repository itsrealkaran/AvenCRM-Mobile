import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { PropertyCard } from '@/components/ui/property-card';
import type { Property } from '@/types/property';
import { api } from '@/utils/api-client';

export default function Property() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('my');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.getProperties();
      console.log('[Property Screen] Fetched properties:', response);
      setAllProperties((response.allProperty || []).filter(p => p.isVerified));
      setMyProperties((response.myProperty || []).filter(p => p.isVerified));
    } catch (err) {
      console.error('[Property Screen] Error fetching properties:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#5932EA" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const displayProperties = activeTab === 'all' ? allProperties : myProperties;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Properties</Text>
        <Text style={styles.subtitle}>Found {displayProperties.length} properties</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'my' && styles.activeTab]}
            onPress={() => setActiveTab('my')}
          >
            <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
              My Properties ({myProperties.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All Properties ({allProperties.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content}>
        {displayProperties.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No properties found in {activeTab === 'all' ? 'all properties' : 'my properties'}
            </Text>
          </View>
        ) : (
          displayProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#F4F6FA',
  },
  activeTab: {
    backgroundColor: '#5932EA',
  },
  tabText: {
    textAlign: 'center',
    color: '#374151',
    fontSize: 14,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  content: {
    padding: 2,
    paddingHorizontal: 26,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});
