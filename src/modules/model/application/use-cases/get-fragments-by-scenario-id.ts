import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IFragmentRepository } from "../ports/fragment";

export type GetFragmentsByScenarioIdPayload = {
  payload: {
    scenarioId: string;
  };
  context: {
    token: string;
  };
};

export type GetFragmentsByScenarioIdResponse = Array<{
  id: string;
  scenarioId: string;
  name: string;
  operator: string;
  guard: string;
  rowIndex: number;
  columnIndex: number;
  spanColumns: number;
  createdAt: string;
  updatedAt: string;
}>;

export class GetFragmentsByScenarioIdUseCase
  implements
    IUseCase<GetFragmentsByScenarioIdPayload, GetFragmentsByScenarioIdResponse>
{
  constructor(private readonly fragmentRepository: IFragmentRepository) {}

  async execute({
    payload,
  }: GetFragmentsByScenarioIdPayload): Promise<GetFragmentsByScenarioIdResponse> {
    try {
      const fragments = await this.fragmentRepository.findByScenarioId({
        scenarioId: payload.scenarioId,
      });
      return fragments.map((f) => f.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in get fragments by scenario id"),
      );
    }
  }
}
