import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  ScenarioLifelineRepository,
  ScenarioMessageRepository,
} from "@/modules/model/application/ports/scenario";

export type DeleteScenarioLifelinePayload = {
  payload: {
    lifelineId: string;
  };
  context: {
    token: string;
  };
};

export type DeleteScenarioLifelineResponse = {
  deleted: boolean;
};

export class DeleteScenarioLifelineUseCase
  implements
    IUseCase<DeleteScenarioLifelinePayload, DeleteScenarioLifelineResponse>
{
  constructor(
    private readonly lifelineRepository: ScenarioLifelineRepository,
    private readonly messageRepository: ScenarioMessageRepository,
  ) {}

  async execute(
    payload: DeleteScenarioLifelinePayload,
  ): Promise<DeleteScenarioLifelineResponse> {
    try {
      const lifeline = await this.lifelineRepository.findById(
        payload.payload.lifelineId,
      );

      if (!lifeline)
        throw new Error(
          `Lifeline not found: ${payload.payload.lifelineId}`,
        );

      // Delete all messages involving this lifeline
      const messages = await this.messageRepository.findByLifelineId(
        payload.payload.lifelineId,
      );
      for (const message of messages) {
        await this.messageRepository.delete(message.id);
      }

      // Delete the lifeline
      await this.lifelineRepository.delete(payload.payload.lifelineId);

      return { deleted: true };
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error deleting scenario lifeline"),
      );
    }
  }
}
