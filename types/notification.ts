export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export type NotificationType = 
  | 'LEAD_ASSIGNED'
  | 'LEAD_UPDATED'
  | 'LEAD_CONVERTED'
  | 'DEAL_CREATED'
  | 'TASK_ASSIGNED'
  | 'TASK_DUE'
  | 'SYSTEM';

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}
