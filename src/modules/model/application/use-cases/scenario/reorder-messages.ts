import type { ScenarioDiagramRepository } from "@/modules/model/application/ports/scenario";
import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";

export type ReorderScenarioMessagesPayload = {
  payload: {
    diagramId: string;
    messageIds: string[];
  };
  context: {
    token: string;
  };
};

export type ReorderScenarioMessagesResponse = {
  messageIds: string[];
};

export class ReorderScenarioMessagesUseCase
  implements
    IUseCase<ReorderScenarioMessagesPayload, ReorderScenarioMessagesResponse>
{
  constructor(private readonly diagramRepository: ScenarioDiagramRepository) {}

  async execute(
    payload: ReorderScenarioMessagesPayload,
  ): Promise<ReorderScenarioMessagesResponse> {
    try {
      const diagram = await this.diagramRepository.findById(
        payload.payload.diagramId,
      );

      if (!diagram)
        throw new Error(
          `Diagram not found with id : ${payload.payload.diagramId}`,
        );

      diagram.reorderMessages(payload.payload.messageIds);

      await this.diagramRepository.save(diagram);

      return { messageIds: diagram.getOrderedMessages().map((msg) => msg.id) };
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in reorder scenario messages"),
      );
    }
  }
}
