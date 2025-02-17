import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { LeadListItem } from '@/components/ui/lead-list-item';
import { LeadForm } from '@/components/ui/lead-form';
import { LeadTransferForm } from '@/components/ui/lead-transfer-form';
import type { Lead, LeadStatus } from '@/types/lead';
import { AntDesign } from '@expo/vector-icons';

// API functions (replace with actual API calls)
const api = {
  fetchLeads: async (): Promise<Lead[]> => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_LEADS), 1000);
    });
  },
  createLead: async (lead: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLead: Lead = {
          ...lead,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        resolve(newLead);
      }, 1000);
    });
  },
  updateLead: async (lead: Lead): Promise<Lead> => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(lead), 1000);
    });
  },
  deleteLead: async (id: string): Promise<void> => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  },
  transferLead: async (transfer: { leadId: string; amount: number; expectedCloseDate: string }): Promise<void> => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  },
};

// Mock data
const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+49 234567890',
    status: 'New',
    dealRole: 'Buy',
    notes: [
      { id: '1', content: 'Initial contact made', timestamp: '2024-01-15T10:00:00Z' },
    ],
    createdAt: '2024-01-15T10:00:00Z',
  },
  // Add more mock leads as needed
];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const fetchedLeads = await api.fetchLeads();
      setLeads(fetchedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.includes(searchQuery)
  );

  const handleAddLead = async (data: Omit<Lead, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      const newLead = await api.createLead(data);
      setLeads(prev => [newLead, ...prev]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLead = async (data: Omit<Lead, 'id' | 'createdAt'>) => {
    if (!editingLead) return;
    setIsLoading(true);
    try {
      const updatedLead = await api.updateLead({ ...editingLead, ...data });
      setLeads(prev => prev.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      ));
      setEditingLead(null);
    } catch (error) {
      console.error('Error updating lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    setIsLoading(true);
    try {
      await api.deleteLead(id);
      setLeads(prev => prev.filter(lead => lead.id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async (data: { leadId: string; amount: number; expectedCloseDate: string }) => {
    setIsLoading(true);
    try {
      await api.transferLead(data);
      // You might want to update the lead status or add a note about the transfer
      console.log('Lead transferred successfully');
      setShowTransferModal(false);
      setSelectedLeadId(null);
    } catch (error) {
      console.error('Error transferring lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    setIsLoading(true);
    try {
      const leadToUpdate = leads.find(lead => lead.id === id);
      if (leadToUpdate) {
        const updatedLead = await api.updateLead({ ...leadToUpdate, status: newStatus });
        setLeads(prev => prev.map(lead => 
          lead.id === updatedLead.id ? updatedLead : lead
        ));
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leads</Text>
        <Button style={{backgroundColor: '#5932EA11'}} variant='outline' size='md' onPress={() => setShowAddModal(true)}>
          <View style={styles.addButton}>
            <AntDesign name="adduser" size={20} color="#5932EA" />
            <Text style={styles.buttonText}>Add Lead</Text>
          </View> 
        </Button>
      </View>

      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search leads..."
      />

      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeadListItem
            lead={item}
            onEdit={() => setEditingLead(item)}
            onDelete={() => handleDeleteLead(item.id)}
            onTransfer={() => {
              setSelectedLeadId(item.id);
              setShowTransferModal(true);
            }}
            onStatusChange={handleStatusChange}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={fetchLeads}
      />

      <Modal
        visible={showAddModal || editingLead !== null}
        animationType="slide"
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LeadForm
              initialData={editingLead || undefined}
              onSubmit={editingLead ? handleUpdateLead : handleAddLead}
              onCancel={() => {
                setShowAddModal(false);
                setEditingLead(null);
              }}
              isLoading={isLoading}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showTransferModal}
        animationType="slide"
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LeadTransferForm
              leadId={selectedLeadId!}
              onSubmit={handleTransfer}
              onCancel={() => {
                setShowTransferModal(false);
                setSelectedLeadId(null);
              }}
              isLoading={isLoading}
            />
          </View>
        </View>
      </Modal>
    </View>
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
    padding: 20,
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
    maxHeight: '80%',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#5932EA',
    fontWeight: '500',
    marginLeft: 6,
    fontSize: 16,
  },
});

