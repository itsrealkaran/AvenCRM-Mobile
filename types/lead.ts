export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Won';
export type DealRole = 'Sale' | 'Buy' | 'Rent';

export interface NoteEntry {
  id: string;
  content: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  dealRole: DealRole;
  status: LeadStatus;
  notes: NoteEntry[];
  createdAt: string;
}

export interface LeadTransfer {
  leadId: string;
  amount: number;
  expectedCloseDate: string;
}

