export type DealStatus = 'New' | 'Discovery' | 'Proposal' | 'Negotiation' | 'Won';
export type DealRole = 'Sale' | 'Buy' | 'Rent';

export interface NoteEntry {
  id: string;
  content: string;
  timestamp: string;
}

export interface Deal {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: DealStatus;
  dealRole: DealRole;
  amount: number;
  propertyType: string;
  expectedCloseDate: string;
  notes: NoteEntry[];
  createdAt: string;
}

