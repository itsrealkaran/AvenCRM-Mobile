import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Card } from './card';
import { Ionicons } from '@expo/vector-icons';
import { Select } from './select';
import { NotesTimeline } from './notes-timeline';
import type { Lead, LeadStatus } from '@/types/lead';

interface LeadListItemProps {
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
  onTransfer: () => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
}

export function LeadListItem({ lead, onEdit, onDelete, onTransfer, onStatusChange }: LeadListItemProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showNotesTimeline, setShowNotesTimeline] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(lead.id, newStatus as LeadStatus);
    setShowStatusDropdown(false);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
          <Text style={styles.name}>{lead.name}</Text>
        <TouchableOpacity
          onPress={() => setShowStatusDropdown(!showStatusDropdown)}
          style={[styles.status, { backgroundColor: getStatusColor(lead.status) }]}
        >
          <Text style={styles.statusText}>{lead.status}</Text>
        </TouchableOpacity>
      </View>

      {showStatusDropdown && (
        <View style={styles.statusDropdown}>
          <Select
            value={lead.status}
            onValueChange={handleStatusChange}
            options={['NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'WON'].map(status => ({
              label: status,
              value: status,
            }))}
          />
        </View>
      )}

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="mail-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{lead.email}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="call-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{lead.phone}</Text>
        </View>
        {lead.location && (
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{lead.location}</Text>
          </View>
        )}
        {lead.budget && (
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={16} color="#666" />
            <Text style={styles.detailText}>${lead.budget.toLocaleString()}</Text>
          </View>
        )}
        <View style={styles.detailItem}>
          <Ionicons name="home-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{lead.propertyType}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => setShowNotesTimeline(true)} style={styles.notesSection}>
        <Text style={styles.notesTitle}>Notes ({lead.notes.length})</Text>
        {lead.notes.length > 0 && (
          <Text style={styles.latestNote} numberOfLines={2}>
            Latest: {lead.notes[lead.notes.length - 1].note}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.date}>
          Created: {new Date(lead.createdAt).toLocaleDateString()}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onTransfer} style={styles.actionButton}>
            <Ionicons name="arrow-forward-circle-outline" size={20} color="#5932EA" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <Ionicons name="create-outline" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={20} color="#FF4B4B" />
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
              notes={lead.notes.map(n => ({
                id: n.time,
                note: n.note,
                time: n.time
              }))} 
              onClose={() => setShowNotesTimeline(false)}
            />
          </View>
        </View>
      </Modal>
    </Card>
  );
}

function getStatusColor(status: LeadStatus): string {
  switch (status) {
    case 'NEW':
      return '#E3F2FD';
    case 'CONTACTED':
      return '#FFF3E0';
    case 'QUALIFIED':
      return '#E8F5E9';
    case 'LOST':
      return '#FFEBEE';
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
  agentName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
