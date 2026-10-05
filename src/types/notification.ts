export type NotificationType = 'budget_warning' | 'budget_exceeded' | 'debt_due' | 'receivable_due' | 'recurring_upcoming' | 'saving_milestone' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  link?: string;
}
