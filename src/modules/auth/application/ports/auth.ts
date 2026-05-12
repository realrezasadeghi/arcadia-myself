type User = {
  id: number;
  name: string;
  username: string;
  created_at: Date;
  updated_at: Date;
};

type Token = string;

export type AuthResponse = {
  user: User;
  token: Token;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  username: string;
  password: string;
};

export interface IAuthRepository {
  login(payload: LoginPayload): Promise<AuthResponse>;

  register(payload: RegisterPayload): Promise<AuthResponse>;
}
