import type { IModelRepository } from "@/modules/model/application/ports/model";
import type { ScenarioDiagramRepository } from "@/modules/model/application/ports/scenario";
import {
  DiagramType,
  type DiagramTypeValue,
} from "@/modules/model/domain/value-objects/diagram-type";
import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";

export type CreateScenarioDiagramPayload = {
  payload: {
    modelId: string;
    type: DiagramTypeValue;
    name: string;
    description?: string;
  };
  context: {
    token: string;
  };
};

export type CreateScenarioDiagramResponse = {
  id: string;
  modelId: string;
  type: DiagramTypeValue;
  name: string;
  description?: string;
  viewport: { x: number; y: number; zoom: number; timeScale: number };
  layoutConfig: {
    lifelineSpacing: number;
    messageHeight: number;
    fragmentPadding: number;
    headHeight: number;
    activationWidth: number;
  };
  lifelines: any[];
  messages: any[];
  fragments: any[];
  createdAt: string;
  updatedAt: string;
};

export class CreateScenarioDiagramUseCase
  implements
    IUseCase<CreateScenarioDiagramPayload, CreateScenarioDiagramResponse>
{
  constructor(
    private readonly diagramRepository: ScenarioDiagramRepository,
    private readonly modelRepository: IModelRepository,
  ) {}

  async execute(
    payload: CreateScenarioDiagramPayload,
  ): Promise<CreateScenarioDiagramResponse> {
    try {
      const diagramType = DiagramType.from(payload.payload.type);

      const model = await this.modelRepository.findModelById(
        payload.payload.modelId,
      );

      if (!model)
        throw new Error(`Model not found with id : ${payload.payload.modelId}`);

      if (!diagramType.layer.equals(model.layer)) {
        throw new Error(
          `Diagram type "${diagramType.label}" belongs to layer "${diagramType.layer.label}", not "${model.layer.label}".`,
        );
      }

      if (!diagramType.isScenario()) {
        throw new Error(
          `Diagram type "${diagramType.value}" is not a scenario type`,
        );
      }

      const diagram = await this.diagramRepository.create({
        modelId: payload.payload.modelId,
        type: diagramType.toString(),
        name: payload.payload.name,
        description: payload.payload.description,
      });

      return diagram.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in create scenario diagram"),
      );
    }
  }
}
