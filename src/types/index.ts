export interface User {
  id: number;
  username: string;
  password: string;
  created_at: Date;
}

export interface File {
  id: number;
  user_id: number;
  filename: string;
  content: string;
  created_at: Date;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}