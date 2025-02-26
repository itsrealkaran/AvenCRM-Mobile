interface Agent {
  id: string;
  name: string;
  email: string;
}

export type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type TransactionMethod = 'BANK_TRANSFER' | 'CASH' | 'CHECK' | '' ;

export interface Transaction {
  id: string;
  invoiceNumber: string;
  amount: number;
  totalAmount: number | null;
  commissionRate: number | null;
  status: TransactionStatus;
  isApprovedByTeamLeader: ApprovalStatus;
  transactionMethod: TransactionMethod;
  date: string;
  receiptUrl: string | null;
  agent: Agent;
  agentId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}