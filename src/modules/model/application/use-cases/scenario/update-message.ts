import type { ScenarioMessageRepository } from "@/modules/model/application/ports/scenario";
import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";

export type UpdateScenarioMessagePayload = {
  payload: {
    id: string;
    name?: string;
    signature?: string;
    arguments?: string;
    fragmentId?: string | null;
    sequenceOrder?: number;
    layout?: { position?: { x: number; y: number } };
  };
  context: {
    token: string;
  };
};

export type UpdateScenarioMessageResponse = {
  id: string;
  diagramId: string;
  sourceLifelineId: string;
  targetLifelineId: string;
  sort: string;
  name: string;
  signature?: string;
  arguments?: string;
  fragmentId: string | null;
  layout: { position: { x: number; y: number }; sequenceOrder: number };
  createdAt: string;
  updatedAt: string;
};

export class UpdateScenarioMessageUseCase
  implements
    IUseCase<UpdateScenarioMessagePayload, UpdateScenarioMessageResponse>
{
  constructor(private readonly messageRepository: ScenarioMessageRepository) {}

  async execute(
    payload: UpdateScenarioMessagePayload,
  ): Promise<UpdateScenarioMessageResponse> {
    try {
      const message = await this.messageRepository.findById(payload.payload.id);

      if (!message)
        throw new Error(`Message not found with id : ${payload.payload.id}`);

      if (payload.payload.name !== undefined) {
        message.rename(payload.payload.name);
      }

      if (payload.payload.signature !== undefined) {
        message.updateSignature(payload.payload.signature);
      }

      if (payload.payload.arguments !== undefined) {
        message.updateArguments(payload.payload.arguments);
      }

      if (payload.payload.fragmentId !== undefined) {
        message.moveToFragment(payload.payload.fragmentId);
      }

      if (payload.payload.sequenceOrder !== undefined) {
        message.reorder(payload.payload.sequenceOrder);
      }

      if (payload.payload.layout?.position) {
        message.updatePosition(payload.payload.layout.position);
      }

      await this.messageRepository.save(message);

      return message.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in update scenario message"),
      );
    }
  }
}
