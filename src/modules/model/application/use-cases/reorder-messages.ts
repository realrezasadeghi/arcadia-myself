import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IMessageRepository } from "../ports/sequence-message";

export type ReorderMessagesPayload = {
  payload: {
    scenarioId: string;
    messageOrders: Array<{ id: string; executionOrder: number }>;
  };
  context: {
    token: string;
  };
};

export type ReorderMessagesResponse = void;

export class ReorderMessagesUseCase
  implements IUseCase<ReorderMessagesPayload, ReorderMessagesResponse>
{
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute({
    payload,
  }: ReorderMessagesPayload): Promise<ReorderMessagesResponse> {
    try {
      await this.messageRepository.reorder({
        scenarioId: payload.scenarioId,
        messageOrders: payload.messageOrders,
      });
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in reorder messages"));
    }
  }
}
