import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  ClassDiagramData,
  IClassDiagramRepository,
} from "../../ports/class-diagram";

export type GetClassDiagramDataPayload = {
  query: { modelId: string };
  context: { token: string };
};

export type GetClassDiagramDataResponse = ClassDiagramData;

export class GetClassDiagramDataUseCase
  implements IUseCase<GetClassDiagramDataPayload, GetClassDiagramDataResponse>
{
  constructor(private readonly classDiagramRepo: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassDiagramDataPayload): Promise<GetClassDiagramDataResponse> {
    try {
      return await this.classDiagramRepo.getClassDiagramData(query.modelId);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error getting class diagram data"),
      );
    }
  }
}
