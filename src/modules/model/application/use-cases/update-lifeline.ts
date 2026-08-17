import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ILifelineRepository } from "../ports/lifeline";

export type UpdateLifelinePayload = {
  payload: {
    id: string;
    name: string;
  };
  context: {
    token: string;
  };
};

export type UpdateLifelineResponse = {
  id: string;
  scenarioId: string;
  name: string;
  representedElementType: string;
  representedElementId: string | null;
  representedElementExternalId: string | null;
  columnIndex: number;
  createdAt: string;
  updatedAt: string;
};

export class UpdateLifelineUseCase
  implements IUseCase<UpdateLifelinePayload, UpdateLifelineResponse>
{
  constructor(private readonly lifelineRepository: ILifelineRepository) {}

  async execute({
    payload,
  }: UpdateLifelinePayload): Promise<UpdateLifelineResponse> {
    try {
      const lifeline = await this.lifelineRepository.update({
        id: payload.id,
        name: payload.name,
      });
      return lifeline.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in update lifeline"));
    }
  }
}
