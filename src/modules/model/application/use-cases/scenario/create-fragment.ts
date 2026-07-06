import type {
  ScenarioDiagramRepository,
  ScenarioFragmentRepository,
} from "@/modules/model/application/ports/scenario";
import {
  FragmentType,
  type FragmentTypeValue,
} from "@/modules/model/domain/value-objects/fragment-type";
import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";

export type CreateScenarioFragmentPayload = {
  payload: {
    diagramId: string;
    type: FragmentTypeValue;
    guard?: string;
    parentFragmentId?: string | null;
    minSequenceOrder: number;
    maxSequenceOrder: number;
  };
  context: {
    token: string;
  };
};

export type CreateScenarioFragmentResponse = {
  id: string;
  diagramId: string;
  type: FragmentTypeValue;
  guard?: string;
  parentFragmentId: string | null;
  childFragmentIds: string[];
  messageIds: string[];
  layout: {
    position: { x: number; y: number };
    size: { width: number; height: number };
    minSequenceOrder: number;
    maxSequenceOrder: number;
  };
  createdAt: string;
  updatedAt: string;
};

export class CreateScenarioFragmentUseCase
  implements
    IUseCase<CreateScenarioFragmentPayload, CreateScenarioFragmentResponse>
{
  constructor(
    private readonly fragmentRepository: ScenarioFragmentRepository,
    private readonly diagramRepository: ScenarioDiagramRepository,
  ) {}

  async execute(
    payload: CreateScenarioFragmentPayload,
  ): Promise<CreateScenarioFragmentResponse> {
    try {
      const type = FragmentType.from(payload.payload.type);

      const diagram = await this.diagramRepository.findById(
        payload.payload.diagramId,
      );

      if (!diagram)
        throw new Error(
          `Scenario diagram not found with id : ${payload.payload.diagramId}`,
        );

      if (payload.payload.parentFragmentId) {
        const parent = await this.fragmentRepository.findById(
          payload.payload.parentFragmentId,
        );
        if (!parent)
          throw new Error(
            `Parent fragment not found: ${payload.payload.parentFragmentId}`,
          );
        if (!parent.type.isCombined)
          throw new Error(
            `Parent fragment type "${parent.type.value}" cannot have children`,
          );
      }

      if (type.guardRequired && !payload.payload.guard) {
        throw new Error(`Fragment type "${type.value}" requires a guard`);
      }

      const fragment = await this.fragmentRepository.create({
        diagramId: payload.payload.diagramId,
        type,
        guard: payload.payload.guard,
        parentFragmentId: payload.payload.parentFragmentId,
        minSequenceOrder: payload.payload.minSequenceOrder,
        maxSequenceOrder: payload.payload.maxSequenceOrder,
      });

      // If there's a parent fragment, update it to include this child
      if (payload.payload.parentFragmentId) {
        const parent = await this.fragmentRepository.findById(
          payload.payload.parentFragmentId,
        );
        if (parent) {
          parent.addChildFragment(fragment.id);
          await this.fragmentRepository.save(parent);
        }
      }

      return fragment.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in create scenario fragment"),
      );
    }
  }
}
