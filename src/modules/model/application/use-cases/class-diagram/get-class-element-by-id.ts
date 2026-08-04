import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  IClassDiagramRepository,
  FindClassElementByIdQuery,
} from "../../ports/class-diagram";

export type GetClassElementByIdUseCasePayload = {
  query: FindClassElementByIdQuery;
  context: {
    token: string;
  };
};

export type GetClassElementByIdUseCaseResponse = {
  id: string;
  modelId: string;
  layer: string;
  name: string;
  description: string;
  visibility: string;
  elementType: string;
  isAbstract: boolean;
  isStatic: boolean;
  parentId: string | null;
  ordering: number;
  status: string;
  extensionProperties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
} | null;

export class GetClassElementByIdUseCase
  implements
    IUseCase<
      GetClassElementByIdUseCasePayload,
      GetClassElementByIdUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassElementByIdUseCasePayload): Promise<GetClassElementByIdUseCaseResponse> {
    try {
      const element = await this.repository.findElementById(query);
      return element ? element.toJSON() : null;
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error getting class element"),
      );
    }
  }
}
