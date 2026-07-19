import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  CreateClassRelationshipLayoutPayload,
  IClassDiagramRepository,
} from "../../ports/class-diagram";

export type CreateClassRelationshipLayoutUseCasePayload = {
  payload: CreateClassRelationshipLayoutPayload;
  context: {
    token: string;
  };
};

export type CreateClassRelationshipLayoutUseCaseResponse = {
  id: string;
  classDiagramId: string;
  classRelationshipId: string;
  labelX: number | null;
  labelY: number | null;
  waypoints: Array<{ x: number; y: number }>;
  createdAt: string;
  updatedAt: string;
};

export class CreateClassRelationshipLayoutUseCase
  implements
    IUseCase<
      CreateClassRelationshipLayoutUseCasePayload,
      CreateClassRelationshipLayoutUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: CreateClassRelationshipLayoutUseCasePayload): Promise<CreateClassRelationshipLayoutUseCaseResponse> {
    try {
      const layout = await this.repository.createRelationshipLayout(payload);
      return layout.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error creating class relationship layout"),
      );
    }
  }
}
