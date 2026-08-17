import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IMessageRepository } from "../ports/sequence-message";

export type GetMessagesByScenarioIdPayload = {
  payload: {
    scenarioId: string;
  };
  context: {
    token: string;
  };
};

export type GetMessagesByScenarioIdResponse = Array<{
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
}>;

export class GetMessagesByScenarioIdUseCase
  implements
    IUseCase<GetMessagesByScenarioIdPayload, GetMessagesByScenarioIdResponse>
{
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute({
    payload,
  }: GetMessagesByScenarioIdPayload): Promise<GetMessagesByScenarioIdResponse> {
    try {
      const messages = await this.messageRepository.findByScenarioId({
        scenarioId: payload.scenarioId,
      });
      return messages.map((m) => m.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in get messages by scenario id"),
      );
    }
  }
}
