import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { ClassOperation } from "../../../domain/entities/class-operation";
import type { IClassDiagramRepository } from "../../ports/class-diagram";
import type { IElementRepository } from "../../ports/element";

// ─── Create ───────────────────────────────────────────────────────────────────

export type CreateClassOperationPayload = {
  payload: {
    classElementId: string;
    name: string;
    returnType?: string;
    visibility?: string;
    isStatic?: boolean;
    isAbstract?: boolean;
    parameters?: Array<{
      name: string;
      type: string;
      direction: string;
      description?: string;
    }>;
    description?: string | null;
  };
  context: { token: string };
};

export type CreateClassOperationResponse = ReturnType<ClassOperation["toJSON"]>;

export class CreateClassOperationUseCase
  implements IUseCase<CreateClassOperationPayload, CreateClassOperationResponse>
{
  constructor(
    private readonly classDiagramRepo: IClassDiagramRepository,
    private readonly elementRepo: IElementRepository,
  ) {}

  async execute({
    payload,
  }: CreateClassOperationPayload): Promise<CreateClassOperationResponse> {
    try {
      const element = await this.elementRepo.findElementById({
        id: payload.classElementId,
      });
      if (!element) throw new Error("Class element not found");

      const op = ClassOperation.create({
        id: crypto.randomUUID(),
        classElementId: payload.classElementId,
        name: payload.name,
        returnType: payload.returnType,
        visibility: payload.visibility as
          | "public"
          | "private"
          | "protected"
          | "package",
        isStatic: payload.isStatic,
        isAbstract: payload.isAbstract,
        parameters: payload.parameters?.map((p) => ({
          ...p,
          direction: p.direction as "in" | "out" | "inout" | "return",
        })),
        description: payload.description,
      });

      const saved = await this.classDiagramRepo.saveOperation(op);
      return saved.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error creating class operation"),
      );
    }
  }
}

// ─── Update ───────────────────────────────────────────────────────────────────

export type UpdateClassOperationPayload = {
  payload: {
    id: string;
    name?: string;
    returnType?: string;
    visibility?: string;
    isStatic?: boolean;
    isAbstract?: boolean;
    parameters?: Array<{
      name: string;
      type: string;
      direction: string;
      description?: string;
    }>;
    description?: string | null;
    order?: number;
  };
  context: { token: string };
};

export type UpdateClassOperationResponse = ReturnType<ClassOperation["toJSON"]>;

export class UpdateClassOperationUseCase
  implements IUseCase<UpdateClassOperationPayload, UpdateClassOperationResponse>
{
  constructor(private readonly classDiagramRepo: IClassDiagramRepository) {}

  async execute({
    payload,
  }: UpdateClassOperationPayload): Promise<UpdateClassOperationResponse> {
    try {
      const existing = await this.classDiagramRepo.getOperationById(payload.id);
      if (!existing) throw new Error("Operation not found");

      if (payload.name !== undefined) existing.rename(payload.name);
      if (payload.returnType !== undefined)
        existing.updateReturnType(payload.returnType);
      if (payload.visibility !== undefined) {
        existing.updateVisibility(
          payload.visibility as "public" | "private" | "protected" | "package",
        );
      }
      if (payload.isStatic !== undefined || payload.isAbstract !== undefined) {
        existing.updateModifiers({
          isStatic: payload.isStatic,
          isAbstract: payload.isAbstract,
        });
      }
      if (payload.parameters !== undefined) {
        existing.updateParameters(
          payload.parameters.map((p) => ({
            ...p,
            direction: p.direction as "in" | "out" | "inout" | "return",
          })),
        );
      }
      if (payload.description !== undefined)
        existing.updateDescription(payload.description);
      if (payload.order !== undefined) existing.updateOrder(payload.order);

      const updated = await this.classDiagramRepo.updateOperation(existing);
      return updated.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error updating class operation"),
      );
    }
  }
}

// ─── Remove ───────────────────────────────────────────────────────────────────

export type RemoveClassOperationPayload = {
  payload: { id: string };
  context: { token: string };
};

export class RemoveClassOperationUseCase
  implements IUseCase<RemoveClassOperationPayload, void>
{
  constructor(private readonly classDiagramRepo: IClassDiagramRepository) {}

  async execute({ payload }: RemoveClassOperationPayload): Promise<void> {
    try {
      await this.classDiagramRepo.removeOperation(payload.id);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error removing class operation"),
      );
    }
  }
}
