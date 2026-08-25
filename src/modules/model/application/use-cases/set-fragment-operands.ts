import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  IFragmentOperandRepository,
  SetFragmentOperandsPayload,
} from "../ports/fragment-operand";

export type SetFragmentOperandsUseCasePayload = {
  payload: SetFragmentOperandsPayload;
  context: { token: string };
};

export type FragmentOperandDTO = {
  id: string;
  fragmentId: string;
  position: number;
  guard: string;
};

export type SetFragmentOperandsUseCaseResponse = FragmentOperandDTO[];

export class SetFragmentOperandsUseCase
  implements
    IUseCase<
      SetFragmentOperandsUseCasePayload,
      SetFragmentOperandsUseCaseResponse
    >
{
  constructor(
    private readonly fragmentOperandRepository: IFragmentOperandRepository,
  ) {}

  async execute({
    payload,
  }: SetFragmentOperandsUseCasePayload): Promise<SetFragmentOperandsUseCaseResponse> {
    try {
      const operands = await this.fragmentOperandRepository.setAll(payload);
      return operands.map((op) => op.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error setting fragment operands"),
      );
    }
  }
}
