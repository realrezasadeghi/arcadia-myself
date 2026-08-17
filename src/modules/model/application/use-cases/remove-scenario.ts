import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IScenarioRepository } from "../ports/scenario";

export type RemoveScenarioPayload = {
  payload: {
    id: string;
  };
  context: {
    token: string;
  };
};

export type RemoveScenarioResponse = boolean;

export class RemoveScenarioUseCase
  implements IUseCase<RemoveScenarioPayload, RemoveScenarioResponse>
{
  constructor(private readonly scenarioRepository: IScenarioRepository) {}

  async execute({
    payload,
  }: RemoveScenarioPayload): Promise<RemoveScenarioResponse> {
    try {
      return await this.scenarioRepository.remove({ id: payload.id });
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in remove scenario"));
    }
  }
}
