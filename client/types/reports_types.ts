enum ReportType {
  POST = "POST",
  USER = "USER",
}

export interface Report {
  id: number;
  reported_id: string;
  reported_type: ReportType;
  user_id: number;
  created_at: string;
  reason: string;
  content: string;
  is_read: boolean;
  is_pinned: boolean;
  is_process: boolean;
}
