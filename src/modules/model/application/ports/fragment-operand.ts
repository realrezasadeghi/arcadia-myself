import type { FragmentOperand } from "../../domain/entities/fragment-operand";

export type FindFragmentOperandsByFragmentIdQuery = { fragmentId: string };

export type CreateFragmentOperandPayload = {
  fragmentId: string;
  position: number;
  guard?: string;
};

export type UpdateFragmentOperandPayload = {
  id: string;
  position?: number;
  guard?: string;
};

export type SetFragmentOperandsPayload = {
  fragmentId: string;
  operands: { position: number; guard: string }[];
};

export type RemoveFragmentOperandPayload = { id: string };

export interface IFragmentOperandRepository {
  findByFragmentId(
    query: FindFragmentOperandsByFragmentIdQuery,
  ): Promise<FragmentOperand[]>;
  create(payload: CreateFragmentOperandPayload): Promise<FragmentOperand>;
  update(payload: UpdateFragmentOperandPayload): Promise<FragmentOperand>;
  setAll(payload: SetFragmentOperandsPayload): Promise<FragmentOperand[]>;
  remove(payload: RemoveFragmentOperandPayload): Promise<boolean>;
  removeByFragmentId(fragmentId: string): Promise<boolean>;
}
