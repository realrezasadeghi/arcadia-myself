import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IFragmentRepository } from "../ports/fragment";

export type RemoveFragmentPayload = {
  payload: {
    id: string;
  };
  context: {
    token: string;
  };
};

export type RemoveFragmentResponse = boolean;

export class RemoveFragmentUseCase
  implements IUseCase<RemoveFragmentPayload, RemoveFragmentResponse>
{
  constructor(private readonly fragmentRepository: IFragmentRepository) {}

  async execute({
    payload,
  }: RemoveFragmentPayload): Promise<RemoveFragmentResponse> {
    try {
      return await this.fragmentRepository.remove({ id: payload.id });
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in remove fragment"));
    }
  }
}
