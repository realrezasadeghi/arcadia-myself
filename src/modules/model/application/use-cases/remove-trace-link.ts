import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { ITraceLinkRepository } from "../ports/trace-link";

export type RemoveTraceLinkPayload = {
  payload: {
    id: string;
  };
  context: {
    token: string;
  };
};

/**
 * DeleteTraceLinkUseCase
 *
 * Business rules:
 * 1. Trace Link باید وجود داشته باشد
 */
export class RemoveTraceLinkUseCase
  implements IUseCase<RemoveTraceLinkPayload, boolean>
{
  constructor(private readonly traceLinkRepository: ITraceLinkRepository) {}

  async execute({ payload }: RemoveTraceLinkPayload): Promise<boolean> {
    try {
      const link = await this.traceLinkRepository.findById({ id: payload.id });
      if (!link)
        throw new Error(`Trace link not found with id : ${payload.id}`);
      return this.traceLinkRepository.remove(payload);
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in remove trace link"));
    }
  }
}
