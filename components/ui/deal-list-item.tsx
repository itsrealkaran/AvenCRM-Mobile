import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Card } from './card';
import { Ionicons } from '@expo/vector-icons';
import { Select } from './select';
import { NotesTimeline } from './notes-timeline';
import type { Deal, DealStatus } from '@/types/deal';
import { format } from 'date-fns';

interface DealListItemProps {
  deal: Deal;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (id: string, status: DealStatus) => void;
  onNoteAdded: (updatedDeal: Deal) => void;
  onViewCoOwners: () => void;
}

export function DealListItem({ 
  deal, 
  onEdit, 
  onDelete, 
  onStatusChange,
  onNoteAdded,
  onViewCoOwners
}: DealListItemProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showNotesTimeline, setShowNotesTimeline] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(deal.id, newStatus as DealStatus);
    setShowStatusDropdown(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{deal.name}</Text>
        <TouchableOpacity
          onPress={() => setShowStatusDropdown(!showStatusDropdown)}
          style={[
            styles.status,
            { backgroundColor: getStatusColor(deal.status) }
          ]}
        >
          <Text style={styles.statusText}>{deal.status}</Text>
        </TouchableOpacity>
      </View>

      {showStatusDropdown && (
        <View style={styles.statusDropdown}>
          <Select
            value={deal.status}
            onValueChange={handleStatusChange}
            options={['NEW', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'WON'].map(status => ({
              label: status,
              value: status,
            }))}
          />
        </View>
      )}

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="mail-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{deal.email}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="call-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{deal.phone}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color="#666" />
          <Text style={styles.detailText}>${deal.dealAmount.toLocaleString()}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="home-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{deal.propertyType}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>Expected: {deal.expectedCloseDate}</Text>
        </View>
        {deal.actualCloseDate && (
          <View style={styles.detailItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#666" />
            <Text style={styles.detailText}>Closed: {formatDate(deal.actualCloseDate)}</Text>
          </View>
        )}
        {deal.commissionRate && (
          <View style={styles.detailItem}>
            <Ionicons name="trending-up-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{deal.commissionRate}% Commission</Text>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={() => setShowNotesTimeline(true)} style={styles.notesSection}>
        <Text style={styles.notesTitle}>Notes ({deal.notes?.length || 0})</Text>
        {deal.notes && deal.notes.length > 0 && (
          <Text style={styles.latestNote} numberOfLines={2}>
            Latest: {deal.notes[deal.notes.length - 1].content}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.date}>
          Created: {formatDate(deal.createdAt)}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            onPress={onViewCoOwners} 
            style={styles.actionButton}
          >
            <Ionicons 
              name="people-outline" 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onEdit} 
            style={styles.actionButton}
          >
            <Ionicons 
              name="create-outline" 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onDelete} 
            style={styles.actionButton}
          >
            <Ionicons 
              name="trash-outline" 
              size={20} 
              color="#FF4B4B" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showNotesTimeline}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotesTimeline(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <NotesTimeline 
              leadId={deal.id}
              notes={deal.notes?.map(n => ({
                id: n.id,
                note: n.content,
                time: n.timestamp
              })) || []} 
              onNoteAdded={(updatedDeal) => {
                if ('source' in updatedDeal) {
                  onNoteAdded(updatedDeal as unknown as Deal);
                }
              }}
              onClose={() => setShowNotesTimeline(false)}
            />
          </View>
        </View>
      </Modal>
    </Card>
  );
}

function getStatusColor(status: Deal['status']): string {
  switch (status) {
    case 'NEW':
      return '#E3F2FD';
    case 'DISCOVERY':
      return '#FFF3E0';
    case 'PROPOSAL':
      return '#E8F5E9';
    case 'NEGOTIATION':
      return '#FFF9C4';
    case 'UNDER_CONTRACT':
      return '#E0F2F1';
    case 'WON':
      return '#E0F2F1';
    default:
      return '#F5F5F5';
  }
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusDropdown: {
    marginBottom: 12,
  },
  details: {
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  notesSection: {
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  latestNote: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
  },
});

