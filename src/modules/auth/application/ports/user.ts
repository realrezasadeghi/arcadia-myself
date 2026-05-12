export type GetMePayload = {
  token: string;
};

export type GetMeResponse = {
  id: number;
  name: string;
  username: string;
  created_at: Date;
  updated_at: Date;
};

export interface IUserRepository {
  getMe(payload: GetMePayload): Promise<GetMeResponse>;
}
