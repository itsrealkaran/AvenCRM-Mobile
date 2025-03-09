export type DealStatus = 'NEW' | 'DISCOVERY' | 'PROPOSAL' | 'NEGOTIATION' | 'UNDER_CONTRACT' | 'WON';
export type DealRole = 'Sale' | 'Buy' | 'Rent';
export type PropertyType = 'RESIDENTIAL' | 'LAND' | 'COMMERCIAL';

export interface NoteEntry {
  author: string;
  note: string;
  time: string;
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
  notes?: NoteEntry[];
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
  notes?: NoteEntry[];
  coOwners?: CoOwner[];
}

export interface DealResponse {
  data: Deal[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

