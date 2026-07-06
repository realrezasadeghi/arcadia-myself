import type {
  ScenarioDiagramRepository,
  ScenarioLifelineRepository,
  ScenarioMessageRepository,
} from "@/modules/model/application/ports/scenario";
import {
  MessageSort,
  type MessageSortValue,
} from "@/modules/model/domain/value-objects/message-sort";
import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";

export type CreateScenarioMessagePayload = {
  payload: {
    diagramId: string;
    sourceLifelineId: string;
    targetLifelineId: string;
    sort: MessageSortValue;
    name: string;
    signature?: string;
    arguments?: string;
    fragmentId?: string | null;
    sequenceOrder: number;
  };
  context: {
    token: string;
  };
};

export type CreateScenarioMessageResponse = {
  id: string;
  diagramId: string;
  sourceLifelineId: string;
  targetLifelineId: string;
  sort: MessageSortValue;
  name: string;
  signature?: string;
  arguments?: string;
  fragmentId: string | null;
  layout: { position: { x: number; y: number }; sequenceOrder: number };
  createdAt: string;
  updatedAt: string;
};

export class CreateScenarioMessageUseCase
  implements
    IUseCase<CreateScenarioMessagePayload, CreateScenarioMessageResponse>
{
  constructor(
    private readonly messageRepository: ScenarioMessageRepository,
    private readonly diagramRepository: ScenarioDiagramRepository,
    private readonly lifelineRepository: ScenarioLifelineRepository,
  ) {}

  async execute(
    payload: CreateScenarioMessagePayload,
  ): Promise<CreateScenarioMessageResponse> {
    try {
      const sort = MessageSort.from(payload.payload.sort);

      const diagram = await this.diagramRepository.findById(
        payload.payload.diagramId,
      );

      if (!diagram)
        throw new Error(
          `Scenario diagram not found with id : ${payload.payload.diagramId}`,
        );

      const sourceLifeline = await this.lifelineRepository.findById(
        payload.payload.sourceLifelineId,
      );
      if (!sourceLifeline)
        throw new Error(
          `Source lifeline not found: ${payload.payload.sourceLifelineId}`,
        );

      const targetLifeline = await this.lifelineRepository.findById(
        payload.payload.targetLifelineId,
      );
      if (!targetLifeline)
        throw new Error(
          `Target lifeline not found: ${payload.payload.targetLifelineId}`,
        );

      if (payload.payload.fragmentId) {
        // Fragment validation would go here if we had fragment repository
      }

      const message = await this.messageRepository.create({
        diagramId: payload.payload.diagramId,
        sourceLifelineId: payload.payload.sourceLifelineId,
        targetLifelineId: payload.payload.targetLifelineId,
        sort,
        name: payload.payload.name,
        signature: payload.payload.signature,
        arguments: payload.payload.arguments,
        fragmentId: payload.payload.fragmentId,
        sequenceOrder: payload.payload.sequenceOrder,
      });

      return message.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in create scenario message"),
      );
    }
  }
}
