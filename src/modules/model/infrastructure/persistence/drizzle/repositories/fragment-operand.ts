import { asc, eq } from "drizzle-orm";
import type {
  CreateFragmentOperandPayload,
  FindFragmentOperandsByFragmentIdQuery,
  IFragmentOperandRepository,
  RemoveFragmentOperandPayload,
  SetFragmentOperandsPayload,
  UpdateFragmentOperandPayload,
} from "@/modules/model/application/ports/fragment-operand";
import { FragmentOperand } from "@/modules/model/domain/entities/fragment-operand";
import { db } from "../client";
import { scenarioFragmentOperands } from "../schemas/fragment-operand";

type FragmentOperandRow = typeof scenarioFragmentOperands.$inferSelect;

function toEntity(row: FragmentOperandRow): FragmentOperand {
  return FragmentOperand.reconstitute({
    id: row.id,
    fragmentId: row.fragmentId,
    position: row.position,
    guard: row.guard ?? "",
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

export class DrizzleFragmentOperandRepository
  implements IFragmentOperandRepository
{
  async findByFragmentId(
    query: FindFragmentOperandsByFragmentIdQuery,
  ): Promise<FragmentOperand[]> {
    const rows = await db
      .select()
      .from(scenarioFragmentOperands)
      .where(eq(scenarioFragmentOperands.fragmentId, query.fragmentId))
      .orderBy(asc(scenarioFragmentOperands.position));
    return rows.map(toEntity);
  }

  async create(
    payload: CreateFragmentOperandPayload,
  ): Promise<FragmentOperand> {
    const response = await db
      .insert(scenarioFragmentOperands)
      .values({
        fragmentId: payload.fragmentId,
        position: payload.position,
        guard: payload.guard ?? "",
      })
      .returning();
    const [row] = response;
    if (!row) throw new Error("Failed to create fragment operand");
    return toEntity(row);
  }

  async update(
    payload: UpdateFragmentOperandPayload,
  ): Promise<FragmentOperand> {
    const now = new Date();
    const updates: Record<string, unknown> = { updatedAt: now };
    if (payload.position !== undefined) updates.position = payload.position;
    if (payload.guard !== undefined) updates.guard = payload.guard;

    const response = await db
      .update(scenarioFragmentOperands)
      .set(updates)
      .where(eq(scenarioFragmentOperands.id, payload.id))
      .returning();
    const [updated] = response;
    if (!updated)
      throw new Error(`Fragment operand not found with id: ${payload.id}`);
    return toEntity(updated);
  }

  async setAll(
    payload: SetFragmentOperandsPayload,
  ): Promise<FragmentOperand[]> {
    await db
      .delete(scenarioFragmentOperands)
      .where(eq(scenarioFragmentOperands.fragmentId, payload.fragmentId));

    if (payload.operands.length === 0) return [];

    const response = await db
      .insert(scenarioFragmentOperands)
      .values(
        payload.operands.map((op) => ({
          fragmentId: payload.fragmentId,
          position: op.position,
          guard: op.guard,
        })),
      )
      .returning();

    return response.map(toEntity);
  }

  async remove(payload: RemoveFragmentOperandPayload): Promise<boolean> {
    const result = await db
      .delete(scenarioFragmentOperands)
      .where(eq(scenarioFragmentOperands.id, payload.id));
    return (result?.rowCount ?? 0) > 0;
  }

  async removeByFragmentId(fragmentId: string): Promise<boolean> {
    const result = await db
      .delete(scenarioFragmentOperands)
      .where(eq(scenarioFragmentOperands.fragmentId, fragmentId));
    return (result?.rowCount ?? 0) > 0;
  }
}
