import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  IClassDiagramRepository,
  RemoveClassElementLayoutPayload,
} from "../../ports/class-diagram";

export type RemoveClassElementLayoutUseCasePayload = {
  payload: RemoveClassElementLayoutPayload;
  context: {
    token: string;
  };
};

export type RemoveClassElementLayoutUseCaseResponse = boolean;

export class RemoveClassElementLayoutUseCase
  implements
    IUseCase<
      RemoveClassElementLayoutUseCasePayload,
      RemoveClassElementLayoutUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    payload,
  }: RemoveClassElementLayoutUseCasePayload): Promise<RemoveClassElementLayoutUseCaseResponse> {
    try {
      const existing = await this.repository.findElementLayoutById({
        id: payload.id,
      });
      if (!existing) {
        throw new Error(`ClassElementLayout not found with id: ${payload.id}`);
      }
      return await this.repository.removeElementLayout(payload);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error removing class element layout"),
      );
    }
  }
}
