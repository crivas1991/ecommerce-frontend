export interface User {
  id: number;
  name: string;
  email: string;
  is_active?: boolean;
  created_at?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
