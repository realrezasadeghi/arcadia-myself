import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  CreateClassDiagramPayload,
  IClassDiagramRepository,
} from "../../ports/class-diagram";

export type CreateClassDiagramUseCasePayload = {
  payload: CreateClassDiagramPayload;
  context: {
    token: string;
  };
};

export type CreateClassDiagramUseCaseResponse = {
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

export class CreateClassDiagramUseCase
  implements
    IUseCase<
      CreateClassDiagramUseCasePayload,
      CreateClassDiagramUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: CreateClassDiagramUseCasePayload): Promise<CreateClassDiagramUseCaseResponse> {
    try {
      const diagram = await this.repository.create(payload);
      return diagram.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error creating class diagram"),
      );
    }
  }
}
