import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Modal, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { LeadListItem } from '@/components/ui/lead-list-item';
import { LeadForm } from '@/components/ui/lead-form';
import { LeadTransferForm } from '@/components/ui/lead-transfer-form';
import type { Lead, LeadInput, LeadStatus, LeadTransfer} from '@/types/lead';
import { AntDesign } from '@expo/vector-icons';
import { api } from '@/utils/api-client';

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  useEffect(() => {
    fetchLeads();
  }, [page]); 

  const fetchLeads = async (refresh = false) => {
    try {
      if (refresh) {
        setPage(1);
        setHasMore(true);
      }
      
      if (isLoading) return;
      
      setIsLoading(true);
      const response = await api.getLeads({ 
        page: refresh ? 1 : page, 
        limit: LIMIT 
      });
      
      const newLeads = response.data;
      setTotalLeads(response.meta.total);
      
      if (refresh) {
        setLeads(newLeads);
      } else {
        // Check for duplicates before adding new leads
        setLeads(prev => {
          const existingIds = new Set(prev.map(lead => lead.id));
          const uniqueNewLeads = newLeads.filter(lead => !existingIds.has(lead.id));
          return [...prev, ...uniqueNewLeads];
        });
      }
      setHasMore(newLeads.length === LIMIT);
      
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddLead = async (data: LeadInput) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      const cleanData = {
        ...data,
        expectedDate: data.expectedDate ? new Date(data.expectedDate).toISOString() : undefined,
        budget: data.budget ? parseFloat(data.budget.toString()) : undefined,
        notes: [{note: data.notes, time: new Date().toISOString(), author: 'agent'}] 
      };

      formData.append('data', JSON.stringify(cleanData));

      const newLead = await api.createLead(cleanData);
      setLeads(prev => [newLead, ...prev]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLead = async (data: LeadInput) => {
    if (!editingLead) return;
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      const cleanData = {
        ...data,
        expectedDate: data.expectedDate ? new Date(data.expectedDate).toISOString() : undefined,
        budget: data.budget ? parseFloat(data.budget.toString()) : undefined,
        notes: [{note: data.notes, time: new Date().toISOString(), author: 'agent'}]
      };

      formData.append('data', JSON.stringify(cleanData));

      const updatedLead = await api.updateLead(editingLead.id, cleanData);
      setLeads(prev => prev.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      ));
      setEditingLead(null);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error updating lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      setIsLoading(true);
      await api.deleteLead(id);
      setLeads(prev => prev.filter(lead => lead.id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async (data: LeadTransfer) => {
    try {
      setIsLoading(true);
      console.log(data);
      await api.convertToDeal({
        leadId: data.leadId,
        dealAmount: data.dealAmount,
        expectedCloseDate: data.expectedCloseDate
      });
      console.log(data);
      setLeads(prev => prev.filter(lead => lead.id !== data.leadId));
      setShowTransferModal(false);
      setSelectedLeadId(null);
    } catch (error) {
      console.error('Error transferring lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      setIsLoading(true);
      const updatedLead = await api.updateLeadStatus(id, newStatus);
      if (updatedLead) {
        setLeads(prev => prev.map(lead => 
          lead.id === id ? {
            ...lead,
            status: newStatus
          } : lead
        ));
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.includes(searchQuery) ||
    (lead.location?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeads(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Leads</Text>
          <Text style={styles.subtitle}>
            Found {totalLeads} leads
          </Text>
        </View>
        <Button 
          style={{backgroundColor: '#5932EA11'}} 
          variant='outline' 
          size='md' 
          onPress={() => setShowAddModal(true)}
        >
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
        placeholder="Search leads by name, email, or phone..."
      />

      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeadListItem
            lead={item}
            onEdit={() => setEditingLead(item)}
            onDelete={() => handleDeleteLead(item.id)}
            onNoteAdded={async () => {await fetchLeads()}}
            onTransfer={() => {
              setSelectedLeadId(item.id);
              setShowTransferModal(true);
            }}
            onStatusChange={handleStatusChange}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery 
                ? 'No leads found matching your search'
                : 'No leads found. Add your first lead!'}
            </Text>
          </View>
        }
        ListFooterComponent={
          isLoading && !refreshing ? (
            <ActivityIndicator size="small" color="#5932EA" style={styles.loader} />
          ) : null
        }
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
    alignItems: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#5932EA',
    fontSize: 14,
    fontWeight: '500',
  },
  searchInput: {
    marginHorizontal: 16,
    marginBottom: 16,
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
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
});
