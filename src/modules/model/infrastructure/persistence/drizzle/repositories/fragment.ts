import type {
  CreateFragmentPayload,
  FindFragmentByIdQuery,
  FindFragmentsByScenarioIdQuery,
  IFragmentRepository,
  RemoveFragmentPayload,
  UpdateFragmentPayload,
  UpdateFragmentPositionPayload,
} from "@/modules/model/application/ports/fragment";
import { Fragment } from "@/modules/model/domain/entities/fragment";
import { eq, asc } from "drizzle-orm";
import { db } from "../client";
import { scenarioFragments } from "../schemas/fragment";

type FragmentRow = typeof scenarioFragments.$inferSelect;

function toEntity(row: FragmentRow): Fragment {
  return Fragment.reconstitute({
    id: row.id,
    scenarioId: row.scenarioId,
    name: row.name,
    operator: row.operator,
    guard: row.guard ?? "",
    rowIndex: row.rowIndex,
    columnIndex: row.columnIndex,
    spanColumns: row.spanColumns,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

export class DrizzleFragmentRepository implements IFragmentRepository {
  async findById(query: FindFragmentByIdQuery): Promise<Fragment | null> {
    const row = await db.query.scenarioFragments.findFirst({
      where: eq(scenarioFragments.id, query.id),
    });
    return row ? toEntity(row) : null;
  }

  async findByScenarioId(
    query: FindFragmentsByScenarioIdQuery,
  ): Promise<Fragment[]> {
    const rows = await db
      .select()
      .from(scenarioFragments)
      .where(eq(scenarioFragments.scenarioId, query.scenarioId))
      .orderBy(
        asc(scenarioFragments.rowIndex),
        asc(scenarioFragments.columnIndex),
      );
    return rows.map(toEntity);
  }

  async create(payload: CreateFragmentPayload): Promise<Fragment> {
    const response = await db
      .insert(scenarioFragments)
      .values({
        scenarioId: payload.scenarioId,
        name: payload.name,
        operator: payload.operator.value,
        guard: payload.guard ?? "",
        rowIndex: payload.rowIndex,
        columnIndex: payload.columnIndex,
        spanColumns: payload.spanColumns ?? 1,
      })
      .returning();

    const [row] = response;
    if (!row) throw new Error("Failed to create fragment");
    return toEntity(row);
  }

  async update(payload: UpdateFragmentPayload): Promise<Fragment> {
    const now = new Date();
    const updateData: Record<string, unknown> = {
      name: payload.name,
      updatedAt: now,
    };
    if (payload.guard !== undefined) {
      updateData.guard = payload.guard;
    }

    const response = await db
      .update(scenarioFragments)
      .set(updateData)
      .where(eq(scenarioFragments.id, payload.id))
      .returning();

    const [updated] = response;
    if (!updated) throw new Error(`Fragment not found with id: ${payload.id}`);
    return toEntity(updated);
  }

  async updatePosition(
    payload: UpdateFragmentPositionPayload,
  ): Promise<Fragment> {
    const now = new Date();
    const updateData: Record<string, unknown> = {
      rowIndex: payload.rowIndex,
      columnIndex: payload.columnIndex,
      updatedAt: now,
    };
    if (payload.spanColumns !== undefined) {
      updateData.spanColumns = payload.spanColumns;
    }

    const response = await db
      .update(scenarioFragments)
      .set(updateData)
      .where(eq(scenarioFragments.id, payload.id))
      .returning();

    const [updated] = response;
    if (!updated) throw new Error(`Fragment not found with id: ${payload.id}`);
    return toEntity(updated);
  }

  async remove(payload: RemoveFragmentPayload): Promise<boolean> {
    const result = await db
      .delete(scenarioFragments)
      .where(eq(scenarioFragments.id, payload.id));
    return (result?.rowCount ?? 0) > 0;
  }
}
