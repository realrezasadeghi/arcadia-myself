export interface ITokenService {
  save(token: string): Promise<void>;
  get(): Promise<string | null>;
  delete(): Promise<void>;
}
