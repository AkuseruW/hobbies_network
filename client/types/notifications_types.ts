import { User } from "./user_types";

export interface Notifications {
  id: string;
  message: string;
  created_at: string;
}

export interface Notification {
  id: number;
  sender_id: number;
  title: string;
  content: string;
  is_read: boolean;
  timestamp: string;
  notification_type: string;
  report_id: number;
  user: User;
}

export interface NotificationResponse {
  notifications: Notification[];
  count_new_notifications: number;
  totalPages: number;
}
