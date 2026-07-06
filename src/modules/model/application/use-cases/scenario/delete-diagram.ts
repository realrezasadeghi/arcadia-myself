import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  ScenarioDiagramRepository,
  ScenarioLifelineRepository,
  ScenarioMessageRepository,
  ScenarioFragmentRepository,
} from "@/modules/model/application/ports/scenario";

export type DeleteScenarioDiagramPayload = {
  payload: {
    diagramId: string;
  };
  context: {
    token: string;
  };
};

export type DeleteScenarioDiagramResponse = {
  deleted: boolean;
};

export class DeleteScenarioDiagramUseCase
  implements
    IUseCase<DeleteScenarioDiagramPayload, DeleteScenarioDiagramResponse>
{
  constructor(
    private readonly diagramRepository: ScenarioDiagramRepository,
    private readonly lifelineRepository: ScenarioLifelineRepository,
    private readonly messageRepository: ScenarioMessageRepository,
    private readonly fragmentRepository: ScenarioFragmentRepository,
  ) {}

  async execute(
    payload: DeleteScenarioDiagramPayload,
  ): Promise<DeleteScenarioDiagramResponse> {
    try {
      const diagram = await this.diagramRepository.findById(
        payload.payload.diagramId,
      );

      if (!diagram)
        throw new Error(
          `Scenario diagram not found: ${payload.payload.diagramId}`,
        );

      // Delete all messages
      const messages = await this.messageRepository.findByDiagramId(
        payload.payload.diagramId,
      );
      for (const message of messages) {
        await this.messageRepository.delete(message.id);
      }

      // Delete all fragments
      const fragments = await this.fragmentRepository.findByDiagramId(
        payload.payload.diagramId,
      );
      for (const fragment of fragments) {
        await this.fragmentRepository.delete(fragment.id);
      }

      // Delete all lifelines
      const lifelines = await this.lifelineRepository.findByDiagramId(
        payload.payload.diagramId,
      );
      for (const lifeline of lifelines) {
        await this.lifelineRepository.delete(lifeline.id);
      }

      // Delete the diagram
      await this.diagramRepository.delete(payload.payload.diagramId);

      return { deleted: true };
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error deleting scenario diagram"),
      );
    }
  }
}
