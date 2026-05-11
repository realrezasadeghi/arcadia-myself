type User = {
  id: number;
  name: string;
  username: string;
  created_at: Date;
  updated_at: Date;
};

export type MeResponse = User;

export interface IUserRepository {
  me(): Promise<MeResponse>;
}
