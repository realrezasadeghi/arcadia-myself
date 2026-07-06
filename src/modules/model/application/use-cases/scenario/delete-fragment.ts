import type {
  ScenarioFragmentRepository,
  ScenarioMessageRepository,
} from "@/modules/model/application/ports/scenario";
import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";

export type DeleteScenarioFragmentPayload = {
  payload: {
    fragmentId: string;
  };
  context: {
    token: string;
  };
};

export type DeleteScenarioFragmentResponse = {
  deleted: boolean;
};

export class DeleteScenarioFragmentUseCase
  implements
    IUseCase<DeleteScenarioFragmentPayload, DeleteScenarioFragmentResponse>
{
  constructor(
    private readonly fragmentRepository: ScenarioFragmentRepository,
    private readonly messageRepository: ScenarioMessageRepository,
  ) {}

  async execute(
    payload: DeleteScenarioFragmentPayload,
  ): Promise<DeleteScenarioFragmentResponse> {
    try {
      const fragment = await this.fragmentRepository.findById(
        payload.payload.fragmentId,
      );

      if (!fragment)
        throw new Error(`Fragment not found: ${payload.payload.fragmentId}`);

      // Remove this fragment from its parent's childFragmentIds
      if (fragment.parentFragmentId) {
        const parent = await this.fragmentRepository.findById(
          fragment.parentFragmentId,
        );
        if (parent) {
          parent.removeChildFragment(fragment.id);
          await this.fragmentRepository.save(parent);
        }
      }

      // Move child fragments to the parent (or make them root)
      for (const childId of fragment.childFragmentIds) {
        const child = await this.fragmentRepository.findById(childId);
        if (child) {
          child.setParentFragment(fragment.parentFragmentId);
          await this.fragmentRepository.save(child);

          // Update parent's child list
          if (fragment.parentFragmentId) {
            const parent = await this.fragmentRepository.findById(
              fragment.parentFragmentId,
            );
            if (parent) {
              parent.addChildFragment(childId);
              await this.fragmentRepository.save(parent);
            }
          }
        }
      }

      // Unassign messages from this fragment
      const messages = await this.messageRepository.findByFragmentId(
        payload.payload.fragmentId,
      );
      for (const message of messages) {
        message.moveToFragment(null);
        await this.messageRepository.save(message);
      }

      // Delete the fragment
      await this.fragmentRepository.delete(payload.payload.fragmentId);

      return { deleted: true };
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error deleting scenario fragment"),
      );
    }
  }
}
