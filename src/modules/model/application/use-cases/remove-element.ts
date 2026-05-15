import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IElementRepository } from "../ports/element";

export type RemoveElementPayload = {
  payload: {
    id: string;
  };
  context: {
    token: string;
  };
};

/**
 * DeleteElementUseCase
 *
 * Business rules:
 * 1. المنت باید وجود داشته باشد
 * 2. حذف المنت تمام روابطی که به آن متصل هستند را نیز حذف می‌کند (cascade — در repository)
 */
export class RemoveElementUseCase
  implements IUseCase<RemoveElementPayload, boolean>
{
  constructor(private readonly elementRepository: IElementRepository) {}

  async execute({ payload }: RemoveElementPayload): Promise<boolean> {
    try {
      const element = await this.elementRepository.findElementById(payload);

      if (!element) throw new Error(`Element not found with id ${payload.id}`);

      return this.elementRepository.removeElement(payload);
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in remove element"));
    }
  }
}
