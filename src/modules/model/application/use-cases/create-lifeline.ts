import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { LifelineType } from "../../domain/value-objects/lifeline-type";
import type { ILifelineRepository } from "../ports/lifeline";
import type { IScenarioRepository } from "../ports/scenario";

export type CreateLifelinePayload = {
  payload: {
    scenarioId: string;
    name: string;
    representedElementType: string;
    representedElementId?: string;
    representedElementExternalId?: string;
    columnIndex: number;
  };
  context: {
    token: string;
  };
};

export type CreateLifelineResponse = {
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

export class CreateLifelineUseCase
  implements IUseCase<CreateLifelinePayload, CreateLifelineResponse>
{
  constructor(
    private readonly lifelineRepository: ILifelineRepository,
    private readonly scenarioRepository: IScenarioRepository,
  ) {}

  async execute({
    payload,
  }: CreateLifelinePayload): Promise<CreateLifelineResponse> {
    try {
      const scenario = await this.scenarioRepository.findById({
        id: payload.scenarioId,
      });
      if (!scenario)
        throw new Error(`Scenario not found with id: ${payload.scenarioId}`);

      const lifelineType = LifelineType.from(payload.representedElementType);

      const lifeline = await this.lifelineRepository.create({
        scenarioId: payload.scenarioId,
        name: payload.name,
        representedElementType: lifelineType,
        representedElementId: payload.representedElementId,
        representedElementExternalId: payload.representedElementExternalId,
        columnIndex: payload.columnIndex,
      });

      return lifeline.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in create lifeline"));
    }
  }
}
