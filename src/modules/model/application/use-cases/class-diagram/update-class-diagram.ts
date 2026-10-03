import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import {
  duplicateNameMessage,
  isDuplicateName,
} from "../../../domain/policies/uniqueness";
import type {
  IClassDiagramRepository,
  UpdateClassDiagramPayload,
} from "../../ports/class-diagram";
import type { DiagramKindNameService } from "../../services/diagram-kind-names";

export type UpdateClassDiagramUseCasePayload = {
  payload: UpdateClassDiagramPayload;
  context: {
    token: string;
  };
};

export type UpdateClassDiagramUseCaseResponse = {
  id: string;
  modelId: string;
  layer: string;
  name: string;
  description: string | undefined;
  viewport: { x: number; y: number; zoom: number };
  elementLayouts: Array<{
    elementId: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }>;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export class UpdateClassDiagramUseCase
  implements
    IUseCase<
      UpdateClassDiagramUseCasePayload,
      UpdateClassDiagramUseCaseResponse
    >
{
  constructor(
    private readonly repository: IClassDiagramRepository,
    private readonly nameService: DiagramKindNameService,
  ) {}

  async execute({
    payload,
  }: UpdateClassDiagramUseCasePayload): Promise<UpdateClassDiagramUseCaseResponse> {
    try {
      const diagram = await this.repository.findById({ id: payload.id });

      if (!diagram)
        throw new Error(`Class diagram not found with id : ${payload.id}`);

      if (payload.name !== undefined) {
        const siblings = await this.nameService.findSiblings(diagram.modelId);

        if (isDuplicateName(payload.name, siblings, diagram.id)) {
          throw new Error(
            duplicateNameMessage("class diagram", payload.name, "this model"),
          );
        }
      }

      const updated = await this.repository.update(payload);
      return updated.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error updating class diagram"),
      );
    }
  }
}
