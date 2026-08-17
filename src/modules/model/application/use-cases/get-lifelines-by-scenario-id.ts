import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ILifelineRepository } from "../ports/lifeline";

export type GetLifelinesByScenarioIdPayload = {
  payload: {
    scenarioId: string;
  };
  context: {
    token: string;
  };
};

export type GetLifelinesByScenarioIdResponse = Array<{
  id: string;
  scenarioId: string;
  name: string;
  representedElementType: string;
  representedElementId: string | null;
  representedElementExternalId: string | null;
  columnIndex: number;
  createdAt: string;
  updatedAt: string;
}>;

export class GetLifelinesByScenarioIdUseCase
  implements
    IUseCase<GetLifelinesByScenarioIdPayload, GetLifelinesByScenarioIdResponse>
{
  constructor(private readonly lifelineRepository: ILifelineRepository) {}

  async execute({
    payload,
  }: GetLifelinesByScenarioIdPayload): Promise<GetLifelinesByScenarioIdResponse> {
    try {
      const lifelines = await this.lifelineRepository.findByScenarioId({
        scenarioId: payload.scenarioId,
      });
      return lifelines.map((l) => l.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in get lifelines by scenario id"),
      );
    }
  }
}
