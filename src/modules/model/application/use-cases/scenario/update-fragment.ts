import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ScenarioFragmentRepository } from "@/modules/model/application/ports/scenario";

export type UpdateScenarioFragmentPayload = {
  payload: {
    id: string;
    guard?: string;
    layout?: { position?: { x: number; y: number }; size?: { width: number; height: number } };
  };
  context: {
    token: string;
  };
};

export type UpdateScenarioFragmentResponse = {
  id: string;
  diagramId: string;
  type: string;
  guard?: string;
  parentFragmentId: string | null;
  childFragmentIds: string[];
  messageIds: string[];
  layout: { position: { x: number; y: number }; size: { width: number; height: number }; minSequenceOrder: number; maxSequenceOrder: number };
  createdAt: string;
  updatedAt: string;
};

export class UpdateScenarioFragmentUseCase implements IUseCase<UpdateScenarioFragmentPayload, UpdateScenarioFragmentResponse> {
  constructor(private readonly fragmentRepository: ScenarioFragmentRepository) {}

  async execute(payload: UpdateScenarioFragmentPayload): Promise<UpdateScenarioFragmentResponse> {
    try {
      const fragment = await this.fragmentRepository.findById(payload.payload.id);

      if (!fragment)
        throw new Error(`Fragment not found with id : ${payload.payload.id}`);

      if (payload.payload.guard !== undefined) {
        fragment.updateGuard(payload.payload.guard);
      }

      if (payload.payload.layout) {
        fragment.updateLayout(payload.payload.layout);
      }

      await this.fragmentRepository.save(fragment);

      return fragment.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in update scenario fragment"));
    }
  }
}