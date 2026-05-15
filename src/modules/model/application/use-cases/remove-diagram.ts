import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IDiagramRepository } from "../ports/diagram";

export type RemoveDiagramPayload = {
  payload: {
    id: string;
  };
  context: {
    token: string;
  };
};

/**
 * DeleteDiagramUseCase
 *
 * Business rules:
 * 1. دیاگرام باید وجود داشته باشد
 * نکته: حذف دیاگرام فقط layout را حذف می‌کند —
 *       المنت‌های مدل پابرجا می‌مانند.
 */
export class RemoveDiagramUseCase
  implements IUseCase<RemoveDiagramPayload, boolean>
{
  constructor(private readonly diagramRepository: IDiagramRepository) {}

  async execute({ payload }: RemoveDiagramPayload): Promise<boolean> {
    try {
      const diagram = await this.diagramRepository.findById(payload);

      if (!diagram)
        throw new Error(`Diagram not found with id : ${payload.id}`);

      return this.diagramRepository.remove(payload);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in remove diagram by id"),
      );
    }
  }
}
