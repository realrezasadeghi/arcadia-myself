import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IMessageRepository } from "../ports/sequence-message";

export type UpdateMessagePayload = {
  payload: {
    id: string;
    name: string;
  };
  context: {
    token: string;
  };
};

export type UpdateMessageResponse = {
  id: string;
  scenarioId: string;
  name: string;
  kind: string;
  sourceLifelineId: string;
  targetLifelineId: string;
  executionOrder: number;
  exchangedItemId: string | null;
  createdAt: string;
  updatedAt: string;
};

export class UpdateMessageUseCase
  implements IUseCase<UpdateMessagePayload, UpdateMessageResponse>
{
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute({
    payload,
  }: UpdateMessagePayload): Promise<UpdateMessageResponse> {
    try {
      const message = await this.messageRepository.update({
        id: payload.id,
        name: payload.name,
      });
      return message.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in update message"));
    }
  }
}
