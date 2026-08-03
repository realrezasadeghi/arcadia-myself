import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, FindClassElementByIdQuery } from "../../ports/class-diagram";

export type GetClassElementLayoutByIdUseCasePayload = {
  query: FindClassElementByIdQuery;
  context: {
    token: string;
  };
};

export type GetClassElementLayoutByIdUseCaseResponse = {
  id: string;
  classDiagramId: string;
  classElementId: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
} | null;

export class GetClassElementLayoutByIdUseCase
  implements IUseCase<GetClassElementLayoutByIdUseCasePayload, GetClassElementLayoutByIdUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassElementLayoutByIdUseCasePayload): Promise<GetClassElementLayoutByIdUseCaseResponse> {
    try {
      const layout = await this.repository.findElementLayoutById(query);
      return layout ? layout.toJSON() : null;
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error getting class element layout"));
    }
  }
}