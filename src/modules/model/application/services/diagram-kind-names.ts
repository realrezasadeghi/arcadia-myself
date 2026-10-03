import type { NamedEntity } from "../../domain/policies/uniqueness";
import type { IClassDiagramRepository } from "../ports/class-diagram";
import type { IDiagramRepository } from "../ports/diagram";
import type { IScenarioRepository } from "../ports/scenario";

/**
 * Architecture diagrams, scenarios and class diagrams are rendered as a single
 * list in the explorer and are all created from the same dialog, so their
 * names share one namespace per model.
 *
 * Every diagram-kind use case resolves siblings through this service so the
 * create/rename rules always see the merged list.
 */
export class DiagramKindNameService {
  constructor(
    private readonly diagramRepository: IDiagramRepository,
    private readonly scenarioRepository: IScenarioRepository,
    private readonly classDiagramRepository: IClassDiagramRepository,
  ) {}

  async findSiblings(modelId: string): Promise<NamedEntity[]> {
    const [diagrams, scenarios, classDiagrams] = await Promise.all([
      this.diagramRepository.findByModelId({ modelId }),
      this.scenarioRepository.findByModelId({ modelId }),
      this.classDiagramRepository.findByModelId({ modelId }),
    ]);

    return [
      ...diagrams.map((diagram) => ({ id: diagram.id, name: diagram.name })),
      ...scenarios.map((scenario) => ({
        id: scenario.id,
        name: scenario.name,
      })),
      ...classDiagrams.map((diagram) => ({
        id: diagram.id,
        name: diagram.name,
      })),
    ];
  }
}
