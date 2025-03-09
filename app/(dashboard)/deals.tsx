import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/button';
import { DealListItem } from '@/components/ui/deal-list-item';
import { DealForm } from '@/components/ui/deal-form';
import { api } from '@/utils/api-client';
import type { Deal, DealStatus, DealInput, DealResponse, CoOwner } from '@/types/deal';
import { AntDesign, Ionicons } from '@expo/vector-icons';

interface CoOwnerModalProps {
  visible: boolean;
  coOwners: CoOwner[];
  onClose: () => void;
}

function CoOwnerModal({ visible, coOwners, onClose }: CoOwnerModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { padding: 16 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Co-Owners</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {coOwners.length === 0 ? (
            <Text style={styles.emptyStateText}>No co-owners found</Text>
          ) : (
            <FlatList
              data={coOwners}
              keyExtractor={(item, index) => `${item.email}-${index}`}
              renderItem={({ item }) => (
                <View style={styles.coOwnerItem}>
                  <View style={styles.coOwnerHeader}>
                    <Ionicons name="person-outline" size={20} color="#666" />
                    <Text style={styles.coOwnerName}>{item.name}</Text>
                  </View>
                  <View style={styles.coOwnerDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="mail-outline" size={16} color="#666" />
                      <Text style={styles.detailText}>{item.email}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="call-outline" size={16} color="#666" />
                      <Text style={styles.detailText}>{item.phone}</Text>
                    </View>
                  </View>
                </View>
              )}
              contentContainerStyle={styles.coOwnerList}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [totalDeals, setTotalDeals] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;
  const [selectedCoOwners, setSelectedCoOwners] = useState<CoOwner[]>([]);
  const [showCoOwnerModal, setShowCoOwnerModal] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, [page]); 

  const fetchDeals = async (refresh = false) => {
    try {
      if (refresh) {
        setPage(1);
        setHasMore(true);
      }
      
      if (isLoading) return;
      
      setIsLoading(true);
      const response = await api.getDeals({ 
        page: refresh ? 1 : page, 
        limit: LIMIT 
      });
      
      const newDeals = response.data;
      setTotalDeals(response.meta.total);
      
      if (refresh) {
        setDeals(newDeals);
      } else {
        // Check for duplicates before adding new deals
        setDeals(prev => {
          const existingIds = new Set(prev.map(deal => deal.id));
          const uniqueNewDeals = newDeals.filter(deal => !existingIds.has(deal.id));
          return [...prev, ...uniqueNewDeals];
        });
      }
      setHasMore(newDeals.length === LIMIT);
      
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddDeal = async (data: DealInput) => {
    try {
      setIsLoading(true);
      const cleanData = {
        ...data,
        expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate).toISOString() : undefined,
        actualCloseDate: data.actualCloseDate ? new Date(data.actualCloseDate).toISOString() : undefined,
        dealAmount: parseFloat(data.dealAmount.toString()),
        propertyValue: data.propertyValue ? parseFloat(data.propertyValue.toString()) : undefined,
        commissionRate: data.commissionRate ? parseFloat(data.commissionRate.toString()) : undefined,
      };

      const newDeal = await api.createDeal(cleanData);
      setDeals(prev => [newDeal, ...prev]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding deal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDeal = async (data: DealInput) => {
    if (!editingDeal) return;
    try {
      setIsLoading(true);
      const cleanData = {
        ...data,
        id: editingDeal.id,
        expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate).toISOString() : undefined,
        actualCloseDate: data.actualCloseDate ? new Date(data.actualCloseDate).toISOString() : undefined,
        dealAmount: parseFloat(data.dealAmount.toString()),
        propertyValue: data.propertyValue ? parseFloat(data.propertyValue.toString()) : undefined,
        commissionRate: data.commissionRate ? parseFloat(data.commissionRate.toString()) : undefined,
      };

      const updatedDeal = await api.updateDeal(editingDeal.id, cleanData);
      setDeals(prev => prev.map(deal => 
        deal.id === updatedDeal.id ? updatedDeal : deal
      ));
      setEditingDeal(null);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error updating deal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDeal = async (id: string) => {
    try {
      setIsLoading(true);
      await api.deleteDeal(id);
      setDeals(prev => prev.filter(deal => deal.id !== id));
    } catch (error) {
      console.error('Error deleting deal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: DealStatus) => {
    try {
      setIsLoading(true);
      const updatedDeal = await api.updateDealStatus(id, status);
      setDeals(prev => prev.map(deal => 
        deal.id === id ? {
          ...deal,
          status: status
        } : deal
      ));
    } catch (error) {
      console.error('Error updating deal status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCoOwners = (coOwners: CoOwner[]) => {
    setSelectedCoOwners(coOwners);
    setShowCoOwnerModal(true);
  };

  const filteredDeals = deals.filter(deal => 
    deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.phone.includes(searchQuery) ||
    deal.propertyAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDeals(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Deals</Text>
          <Text style={styles.subtitle}>
            Found {totalDeals} deals
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
            <Text style={styles.buttonText}>Add Deal</Text>
          </View> 
        </Button>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <AntDesign name="search1" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search deals by name, email, phone, or address..."
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <FlatList
        data={filteredDeals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DealListItem
            deal={item}
            onEdit={() => setEditingDeal(item)}
            onDelete={() => handleDeleteDeal(item.id)}
            onStatusChange={handleStatusChange}
            onNoteAdded={(updatedDeal) => {
              setDeals(prev => 
                prev.map(deal => 
                  deal.id === updatedDeal.id ? updatedDeal : deal
                )
              );
            }}
            onViewCoOwners={() => handleViewCoOwners(item.coOwners || [])}
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
                ? 'No deals found matching your search'
                : 'No deals found. Add your first deal!'}
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

      <CoOwnerModal
        visible={showCoOwnerModal}
        coOwners={selectedCoOwners}
        onClose={() => setShowCoOwnerModal(false)}
      />
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  coOwnerList: {
    flexGrow: 1,
  },
  coOwnerItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  coOwnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  coOwnerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  coOwnerDetails: {
    marginLeft: 28,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});