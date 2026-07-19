import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  CreateClassElementLayoutPayload,
  IClassDiagramRepository,
} from "../../ports/class-diagram";

export type CreateClassElementLayoutUseCasePayload = {
  payload: CreateClassElementLayoutPayload;
  context: {
    token: string;
  };
};

export type CreateClassElementLayoutUseCaseResponse = {
  id: string;
  classDiagramId: string;
  classElementId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
};

export class CreateClassElementLayoutUseCase
  implements
    IUseCase<
      CreateClassElementLayoutUseCasePayload,
      CreateClassElementLayoutUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: CreateClassElementLayoutUseCasePayload): Promise<CreateClassElementLayoutUseCaseResponse> {
    try {
      const layout = await this.repository.createElementLayout(payload);
      return layout.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error creating class element layout"),
      );
    }
  }
}
