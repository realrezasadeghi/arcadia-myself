type User = {
  id: number;
  name: string;
  username: string;
  created_at: Date;
  updated_at: Date;
};

type Token = string;

type AuthResponse = {
  user: User;
  token: Token;
};

export type LoginPayload = {
  username: string;
  password: string;
};
export type LoginResponse = AuthResponse;

export type RegisterPayload = {
  name: string;
  username: string;
  password: string;
};
export type RegisterResponse = AuthResponse;

export interface IAuthRepository {
  login(payload: LoginPayload): Promise<LoginResponse>;

  register(payload: RegisterPayload): Promise<RegisterResponse>;
}
