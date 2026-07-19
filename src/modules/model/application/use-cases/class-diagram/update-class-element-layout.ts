import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, UpdateClassElementLayoutPayload } from "../../ports/class-diagram";

export type UpdateClassElementLayoutUseCasePayload = {
  payload: UpdateClassElementLayoutPayload;
  context: {
    token: string;
  };
};

export type UpdateClassElementLayoutUseCaseResponse = {
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

export class UpdateClassElementLayoutUseCase
  implements IUseCase<UpdateClassElementLayoutUseCasePayload, UpdateClassElementLayoutUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: UpdateClassElementLayoutUseCasePayload): Promise<UpdateClassElementLayoutUseCaseResponse> {
    try {
      const existing = await this.repository.findElementLayoutById({ id: payload.id });
      if (!existing) {
        throw new Error(`ClassElementLayout not found with id: ${payload.id}`);
      }
      return (await this.repository.updateElementLayout(payload)).toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error updating class element layout"));
    }
  }
}