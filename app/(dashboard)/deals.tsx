import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { DealListItem } from '@/components/ui/deal-list-item';
import { DealForm } from '@/components/ui/deal-form';
import type { Deal, DealStatus } from '@/types/deal';

// API functions (replace with actual API calls)
const api = {
  fetchDeals: async (): Promise<Deal[]> => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_DEALS), 1000);
    });
  },
  createDeal: async (deal: Omit<Deal, 'id' | 'createdAt'>): Promise<Deal> => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDeal: Deal = {
          ...deal,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        resolve(newDeal);
      }, 1000);
    });
  },
  updateDeal: async (deal: Deal): Promise<Deal> => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(deal), 1000);
    });
  },
  deleteDeal: async (id: string): Promise<void> => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  },
};

// Mock data
const MOCK_DEALS: Deal[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    status: 'New',
    amount: 500000,
    propertyType: 'Residential',
    expectedCloseDate: '2024-03-15T00:00:00Z',
    notes: [
      { id: '1', content: 'Initial contact made', timestamp: '2024-01-15T10:00:00Z' },
    ],
    createdAt: '2024-01-15T10:00:00Z',
  },
  // Add more mock deals as needed
];

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setIsLoading(true);
    try {
      const fetchedDeals = await api.fetchDeals();
      setDeals(fetchedDeals);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDeals = deals.filter(deal => 
    deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.phone.includes(searchQuery)
  );

  const handleAddDeal = async (data: Omit<Deal, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      const newDeal = await api.createDeal(data);
      setDeals(prev => [newDeal, ...prev]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding deal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDeal = async (data: Omit<Deal, 'id' | 'createdAt'>) => {
    if (!editingDeal) return;
    setIsLoading(true);
    try {
      const updatedDeal = await api.updateDeal({ ...editingDeal, ...data });
      setDeals(prev => prev.map(deal => 
        deal.id === updatedDeal.id ? updatedDeal : deal
      ));
      setEditingDeal(null);
    } catch (error) {
      console.error('Error updating deal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDeal = async (id: string) => {
    setIsLoading(true);
    try {
      await api.deleteDeal(id);
      setDeals(prev => prev.filter(deal => deal.id !== id));
    } catch (error) {
      console.error('Error deleting deal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: DealStatus) => {
    setIsLoading(true);
    try {
      const dealToUpdate = deals.find(deal => deal.id === id);
      if (dealToUpdate) {
        const updatedDeal = await api.updateDeal({ ...dealToUpdate, status: newStatus });
        setDeals(prev => prev.map(deal => 
          deal.id === updatedDeal.id ? updatedDeal : deal
        ));
      }
    } catch (error) {
      console.error('Error updating deal status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Deals</Text>
        <Button onPress={() => setShowAddModal(true)}>Add New Deal</Button>
      </View>

      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search deals..."
      />

      <FlatList
        data={filteredDeals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DealListItem
            deal={item}
            onEdit={() => setEditingDeal(item)}
            onDelete={() => handleDeleteDeal(item.id)}
            onStatusChange={handleStatusChange}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={fetchDeals}
      />

      <Modal
        visible={showAddModal || editingDeal !== null}
        animationType="slide"
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DealForm
              initialData={editingDeal || undefined}
              onSubmit={editingDeal ? handleUpdateDeal : handleAddDeal}
              onCancel={() => {
                setShowAddModal(false);
                setEditingDeal(null);
              }}
              isLoading={isLoading}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchInput: {
    margin: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  list: {
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

