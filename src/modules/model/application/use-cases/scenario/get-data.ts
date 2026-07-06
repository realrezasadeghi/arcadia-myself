import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ScenarioDiagramRepository } from "@/modules/model/application/ports/scenario";
import type { ScenarioLifelineRepository } from "@/modules/model/application/ports/scenario";
import type { ScenarioMessageRepository } from "@/modules/model/application/ports/scenario";
import type { ScenarioFragmentRepository } from "@/modules/model/application/ports/scenario";
import type { ScenarioDiagram } from "@/modules/model/domain/entities/scenario-diagram";
import type { ScenarioLifeline } from "@/modules/model/domain/entities/scenario-lifeline";
import type { ScenarioMessage } from "@/modules/model/domain/entities/scenario-message";
import type { ScenarioFragment } from "@/modules/model/domain/entities/scenario-fragment";

export type GetScenarioDataPayload = {
  payload: {
    diagramId: string;
  };
  context: {
    token: string;
  };
};

export type GetScenarioDataResponse = {
  diagram: ScenarioDiagram | null;
  lifelines: ScenarioLifeline[];
  messages: ScenarioMessage[];
  fragments: ScenarioFragment[];
};

export class GetScenarioDataUseCase implements IUseCase<GetScenarioDataPayload, GetScenarioDataResponse> {
  constructor(
    private readonly diagramRepository: ScenarioDiagramRepository,
    private readonly lifelineRepository: ScenarioLifelineRepository,
    private readonly messageRepository: ScenarioMessageRepository,
    private readonly fragmentRepository: ScenarioFragmentRepository,
  ) {}

  async execute(payload: GetScenarioDataPayload): Promise<GetScenarioDataResponse> {
    try {
      const diagram = await this.diagramRepository.findById(payload.payload.diagramId);

      if (!diagram) {
        return { diagram: null, lifelines: [], messages: [], fragments: [] };
      }

      const [lifelines, messages, fragments] = await Promise.all([
        this.lifelineRepository.findByDiagramId(payload.payload.diagramId),
        this.messageRepository.findByDiagramId(payload.payload.diagramId),
        this.fragmentRepository.findByDiagramId(payload.payload.diagramId),
      ]);

      return { diagram, lifelines, messages, fragments };
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in get scenario data"));
    }
  }
}