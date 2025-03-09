export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'NEGOTIATION' | 'FOLLOWUP' | 'LOST' | 'WON';
export type DealRole = 'Sale' | 'Buy' | 'Rent';
export type PropertyType = 'RESIDENTIAL' | 'COMMERCIAL';

export interface Agent {
  id: string;
  name: string;
  email: string;
}

export interface NoteEntry {
  author: string;
  note: string;
  time: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  notes: NoteEntry[];
  agent: Agent;
  agentId: string;
  budget: number | null;
  companyId: string;
  expectedDate: string | null;
  lastContactDate: string | null;
  leadAmount: number | null;
  location: string | null;
  propertyType: PropertyType;
  createdAt: string;
  updatedAt: string;
}

// Request/Response types for API endpoints
export interface LeadResponse {
  data: Lead[];
  meta: {
    total: number;
  };
}

export interface LeadInput {
  name: string;
  email: string;
  phone: string;
  location?: string;
  budget?: number | null;
  propertyType: PropertyType;
  source: string;
  notes: string;
  expectedDate?: string | undefined;
  agentId?: string;
}

export interface LeadTransfer {
  leadId: string;
  dealAmount: number;
  expectedCloseDate?: string;
}

export interface LeadInputPayload extends Omit<LeadInput, 'notes'> {
  notes: NoteEntry[];
}

// Add new type for form data conversion
export interface LeadFormData extends FormData {
  append(name: keyof LeadInput, value: string | Blob, fileName?: string): void;
}