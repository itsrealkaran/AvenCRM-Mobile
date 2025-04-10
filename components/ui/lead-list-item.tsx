import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Card } from './card';
import { Ionicons } from '@expo/vector-icons';
import { Select } from './select';
import { NotesTimeline } from './notes-timeline';
import type { Lead, LeadStatus } from '@/types/lead';
import { api } from '@/utils/api-client';

interface LeadListItemProps {
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
  onTransfer: () => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
  onNoteAdded: (updatedLead: Lead) => void;
}

export function LeadListItem({ lead, onEdit, onDelete, onTransfer, onStatusChange, onNoteAdded }: LeadListItemProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showNotesTimeline, setShowNotesTimeline] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(lead.id, newStatus as LeadStatus);
    setShowStatusDropdown(false);
  };

  const isWonLead = lead.status === 'WON';

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
          <Text style={styles.name}>{lead.name}</Text>
        <TouchableOpacity
          onPress={() => !isWonLead && setShowStatusDropdown(!showStatusDropdown)}
          style={[styles.status, { backgroundColor: getStatusColor(lead.status) }]}
          disabled={isWonLead}
        >
          <Text style={styles.statusText}>{lead.status}</Text>
        </TouchableOpacity>
      </View>

      {showStatusDropdown && !isWonLead && (
        <View style={styles.statusDropdown}>
          <Select
            value={lead.status}
            onValueChange={handleStatusChange}
            options={['NEW', 'CONTACTED', 'QUALIFIED', 'NEGOTIATION', 'FOLLOWUP', 'LOST', 'WON'].map(status => ({
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
          <TouchableOpacity 
            onPress={onTransfer} 
            style={[
              styles.actionButton, 
              isWonLead && styles.disabledButton
            ]} 
            disabled={isWonLead}
          >
            <Ionicons 
              name="swap-horizontal-outline" 
              size={20} 
              color={isWonLead ? "#ccc" : "#666"} 
            />
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
            <NotesTimeline 
              leadId={lead.id}
              notes={lead.notes.map(n => ({
                author: n.author,
                note: n.note,
                time: n.time
              }))} 
              addNote={(id, note) => api.addNote(id, note)}
              onNoteAdded={(updatedLead) => {
                if (updatedLead) {
                  onNoteAdded(updatedLead as Lead);
                }
              }}
              onClose={() => setShowNotesTimeline(false)}
            />
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
    case 'NEGOTIATION':
      return '#E8F5E9';
    case 'FOLLOWUP':
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  disabledButton: {
    opacity: 0.5,
  },
});
