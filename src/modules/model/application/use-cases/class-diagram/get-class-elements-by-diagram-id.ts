import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IClassDiagramRepository, FindClassElementsByModelIdQuery } from "../../ports/class-diagram";

export type GetClassElementsByModelIdUseCasePayload = {
  query: FindClassElementsByModelIdQuery;
  context: {
    token: string;
  };
};

export type GetClassElementsByModelIdUseCaseResponse = {
  id: string;
  modelId: string;
  layer: string;
  name: string;
  elementType: string;
  isAbstract: boolean;
  isStatic: boolean;
  parentId: string | null;
  ordering: number;
  status: string;
  extensionProperties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}[];

export class GetClassElementsByModelIdUseCase
  implements IUseCase<GetClassElementsByModelIdUseCasePayload, GetClassElementsByModelIdUseCaseResponse>
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassElementsByModelIdUseCasePayload): Promise<GetClassElementsByModelIdUseCaseResponse> {
    try {
      const elements = await this.repository.findElementsByModelId(query);
      return elements.map((e) => e.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error getting class elements"),
      );
    }
  }
}