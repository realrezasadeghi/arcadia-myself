export interface IUseCase<TPayload, TResponse> {
  execute(payload: TPayload): Promise<TResponse>;
}
