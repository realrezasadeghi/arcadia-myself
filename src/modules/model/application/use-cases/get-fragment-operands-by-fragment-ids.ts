import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { IFragmentOperandRepository } from "../ports/fragment-operand";

export type GetFragmentOperandsByFragmentIdsQuery = {
  fragmentIds: string[];
};

export type FragmentOperandDTO = {
  id: string;
  fragmentId: string;
  position: number;
  guard: string;
  createdAt: string;
  updatedAt: string;
};

export type GetFragmentOperandsByFragmentIdsResponse = FragmentOperandDTO[];

export class GetFragmentOperandsByFragmentIdsUseCase
  implements
    IUseCase<
      {
        payload: GetFragmentOperandsByFragmentIdsQuery;
        context: { token: string };
      },
      GetFragmentOperandsByFragmentIdsResponse
    >
{
  constructor(
    private readonly fragmentOperandRepository: IFragmentOperandRepository,
  ) {}

  async execute({
    payload,
  }: {
    payload: GetFragmentOperandsByFragmentIdsQuery;
    context: { token: string };
  }): Promise<GetFragmentOperandsByFragmentIdsResponse> {
    try {
      const allOperands = await Promise.all(
        payload.fragmentIds.map((fragmentId) =>
          this.fragmentOperandRepository.findByFragmentId({ fragmentId }),
        ),
      );
      return allOperands.flat().map((op) => op.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error fetching fragment operands"),
      );
    }
  }
}
