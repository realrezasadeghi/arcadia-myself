import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  IClassDiagramRepository,
  UpdateClassDiagramPayload,
} from "../../ports/class-diagram";

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
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: UpdateClassDiagramUseCasePayload): Promise<UpdateClassDiagramUseCaseResponse> {
    try {
      const diagram = await this.repository.update(payload);
      return diagram.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error updating class diagram"),
      );
    }
  }
}
