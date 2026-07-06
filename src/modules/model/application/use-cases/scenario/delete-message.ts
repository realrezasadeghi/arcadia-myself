import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  ScenarioMessageRepository,
  ScenarioFragmentRepository,
} from "@/modules/model/application/ports/scenario";

export type DeleteScenarioMessagePayload = {
  payload: {
    messageId: string;
  };
  context: {
    token: string;
  };
};

export type DeleteScenarioMessageResponse = {
  deleted: boolean;
};

export class DeleteScenarioMessageUseCase
  implements
    IUseCase<DeleteScenarioMessagePayload, DeleteScenarioMessageResponse>
{
  constructor(
    private readonly messageRepository: ScenarioMessageRepository,
    private readonly fragmentRepository: ScenarioFragmentRepository,
  ) {}

  async execute(
    payload: DeleteScenarioMessagePayload,
  ): Promise<DeleteScenarioMessageResponse> {
    try {
      const message = await this.messageRepository.findById(
        payload.payload.messageId,
      );

      if (!message)
        throw new Error(
          `Message not found: ${payload.payload.messageId}`,
        );

      // If message belongs to a fragment, remove it from the fragment's messageIds
      if (message.fragmentId) {
        const fragment = await this.fragmentRepository.findById(
          message.fragmentId,
        );
        if (fragment) {
          fragment.removeMessage(message.id);
          await this.fragmentRepository.save(fragment);
        }
      }

      // Delete the message
      await this.messageRepository.delete(payload.payload.messageId);

      return { deleted: true };
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error deleting scenario message"),
      );
    }
  }
}
