export interface Lecture {
  id: number;
  name: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
  upload_type: number;
  sequence: number;
  assignment_title?: string;
  assignment?: string;
}
