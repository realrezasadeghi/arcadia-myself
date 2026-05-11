export interface ITokenService {
  save(token: string): Promise<boolean>;
  get(): Promise<string | undefined>;
  delete(): Promise<boolean>;
}
