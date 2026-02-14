export interface FrontendTask {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  user_id: string;
  created_at: string;
}

export interface AuthModel {
  email: string;
  password?: string;
}
