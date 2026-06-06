import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ElementLayout, Viewport } from "../../domain/entities/diagram";
import {
  DiagramType,
  type DiagramTypeValue,
} from "../../domain/value-objects/diagram-type";
import type { IDiagramRepository } from "../ports/diagram";
import type { IModelRepository } from "../ports/model";

export type CreateDiagramPayload = {
  payload: {
    type: DiagramTypeValue;
    name: string;
    modelId: string;
    description?: string;
  };
  context: {
    token: string;
  };
};

export type CreateDiagramResponse = {
  id: string;
  modelId: string;
  type: DiagramTypeValue;
  viewport: Viewport;
  name: string;
  description?: string;
  updatedAt: string;
  createdAt: string;
  elementLayouts: ElementLayout[];
};

export class CreateDiagramUseCase
  implements IUseCase<CreateDiagramPayload, CreateDiagramResponse>
{
  constructor(
    private readonly diagramRepository: IDiagramRepository,
    private readonly modelRepository: IModelRepository,
  ) {}

  async execute({
    payload,
  }: CreateDiagramPayload): Promise<CreateDiagramResponse> {
    try {
      const diagramType = DiagramType.from(payload.type);

      const model = await this.modelRepository.findModelById(payload.modelId);

      if (!model)
        throw new Error(`Model not found with id : ${payload.modelId}`);

      if (!diagramType.layer.equals(model.layer)) {
        // DiagramType باید با Layer مدل مطابقت داشته باشد
        throw new Error(
          `Diagram type "${diagramType.label}" belongs to layer "${diagramType.layer.label}", not "${model.layer.label}".`,
        );
      }

      const response = await this.diagramRepository.create({
        modelId: payload.modelId,
        type: diagramType,
        name: payload.name,
        description: payload.description,
      });

      return response.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in create diagram"));
    }
  }
}
