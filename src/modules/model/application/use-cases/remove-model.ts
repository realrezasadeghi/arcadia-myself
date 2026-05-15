import { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IModelRepository } from "../ports/model";

export type RemoveModelPayload = {
  payload: {
    modelId: string;
  };
  context: {
    token: string;
  };
};

/**
 * DeleteModelUseCase
 *
 * Business rules:
 * 1. مدل باید وجود داشته باشد
 * 2. حذف مدل، تمام المنت‌ها و روابط داخل آن را نیز حذف می‌کند (cascade — در repository)
 */
export class RemoveModelUseCase
  implements IUseCase<RemoveModelPayload, boolean>
{
  constructor(private readonly modelRepository: IModelRepository) {}

  async execute({ payload }: RemoveModelPayload): Promise<boolean> {
    try {
      const model = await this.modelRepository.findModelById(payload.modelId);

      if (!model)
        throw new Error(`Model not found with id : ${payload.modelId}`);

      return this.modelRepository.deleteModel({
        id: payload.modelId,
      });
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in remove model"));
    }
  }
}
