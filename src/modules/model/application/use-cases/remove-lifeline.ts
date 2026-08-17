import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ILifelineRepository } from "../ports/lifeline";

export type RemoveLifelinePayload = {
  payload: {
    id: string;
  };
  context: {
    token: string;
  };
};

export type RemoveLifelineResponse = boolean;

export class RemoveLifelineUseCase
  implements IUseCase<RemoveLifelinePayload, RemoveLifelineResponse>
{
  constructor(private readonly lifelineRepository: ILifelineRepository) {}

  async execute({
    payload,
  }: RemoveLifelinePayload): Promise<RemoveLifelineResponse> {
    try {
      return await this.lifelineRepository.remove({ id: payload.id });
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in remove lifeline"));
    }
  }
}
