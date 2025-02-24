export type DealStatus = 'NEW' | 'DISCOVERY' | 'PROPOSAL' | 'NEGOTIATION' | 'UNDER_CONTRACT' | 'WON';
export type DealRole = 'Sale' | 'Buy' | 'Rent';
export type PropertyType = 'RESIDENTIAL' | 'LAND' | 'COMMERCIAL';

export interface NoteEntry {
  id: string;
  content: string;
  timestamp: string;
}

export interface DealNote {
  time: string;
  note: string;
}

export interface CoOwner {
  name: string;
  email: string;
  phone: string;
}

export interface Deal {
  id: string;
  name: string;
  email: string;
  phone: string;
  dealAmount: number;
  status: DealStatus;
  dealRole: DealRole;
  propertyType: PropertyType;
  propertyAddress?: string;
  propertyValue?: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  commissionRate?: number;
  estimatedCommission?: number;
  notes?: DealNote[];
  coOwners?: CoOwner[];
  agent?: {
    id: string;
    name: string;
    email: string;
  };
  agentId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DealInput {
  name: string;
  email: string;
  phone: string;
  dealAmount: number;
  status?: DealStatus;
  propertyType: PropertyType;
  propertyAddress?: string;
  propertyValue?: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  commissionRate?: number;
  estimatedCommission?: number;
  notes?: DealNote[];
  coOwners?: CoOwner[];
}

export interface DealResponse {
  deals: Deal[];
  total: number;
  page: number;
  limit: number;
}

