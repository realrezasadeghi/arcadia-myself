import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IMessageRepository } from "../ports/sequence-message";

export type RemoveMessagePayload = {
  payload: {
    id: string;
  };
  context: {
    token: string;
  };
};

export type RemoveMessageResponse = boolean;

export class RemoveMessageUseCase
  implements IUseCase<RemoveMessagePayload, RemoveMessageResponse>
{
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute({
    payload,
  }: RemoveMessagePayload): Promise<RemoveMessageResponse> {
    try {
      return await this.messageRepository.remove({ id: payload.id });
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in remove message"));
    }
  }
}
