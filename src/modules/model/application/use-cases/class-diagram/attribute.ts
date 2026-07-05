import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { ClassAttribute } from "../../../domain/entities/class-attribute";
import type { IClassDiagramRepository } from "../../ports/class-diagram";
import type { IElementRepository } from "../../ports/element";

// ─── Create ───────────────────────────────────────────────────────────────────

export type CreateClassAttributePayload = {
  payload: {
    classElementId: string;
    name: string;
    type: string;
    visibility?: string;
    isStatic?: boolean;
    isReadOnly?: boolean;
    isOptional?: boolean;
    defaultValue?: string | null;
    description?: string | null;
    multiplicityLower?: number;
    multiplicityUpper?: number | null;
  };
  context: { token: string };
};

export type CreateClassAttributeResponse = ReturnType<ClassAttribute["toJSON"]>;

export class CreateClassAttributeUseCase
  implements IUseCase<CreateClassAttributePayload, CreateClassAttributeResponse>
{
  constructor(
    private readonly classDiagramRepo: IClassDiagramRepository,
    private readonly elementRepo: IElementRepository,
  ) {}

  async execute({
    payload,
  }: CreateClassAttributePayload): Promise<CreateClassAttributeResponse> {
    try {
      const element = await this.elementRepo.findElementById({
        id: payload.classElementId,
      });
      if (!element) throw new Error("Class element not found");

      const attr = ClassAttribute.create({
        id: crypto.randomUUID(),
        classElementId: payload.classElementId,
        name: payload.name,
        type: payload.type,
        visibility: payload.visibility as
          | "public"
          | "private"
          | "protected"
          | "package",
        isStatic: payload.isStatic,
        isReadOnly: payload.isReadOnly,
        isOptional: payload.isOptional,
        defaultValue: payload.defaultValue,
        description: payload.description,
        multiplicityLower: payload.multiplicityLower,
        multiplicityUpper: payload.multiplicityUpper,
      });

      const saved = await this.classDiagramRepo.saveAttribute(attr);
      return saved.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error creating class attribute"),
      );
    }
  }
}

// ─── Update ───────────────────────────────────────────────────────────────────

export type UpdateClassAttributePayload = {
  payload: {
    id: string;
    name?: string;
    type?: string;
    visibility?: string;
    isStatic?: boolean;
    isReadOnly?: boolean;
    isOptional?: boolean;
    defaultValue?: string | null;
    description?: string | null;
    multiplicityLower?: number;
    multiplicityUpper?: number | null;
    order?: number;
  };
  context: { token: string };
};

export type UpdateClassAttributeResponse = ReturnType<ClassAttribute["toJSON"]>;

export class UpdateClassAttributeUseCase
  implements IUseCase<UpdateClassAttributePayload, UpdateClassAttributeResponse>
{
  constructor(private readonly classDiagramRepo: IClassDiagramRepository) {}

  async execute({
    payload,
  }: UpdateClassAttributePayload): Promise<UpdateClassAttributeResponse> {
    try {
      const existing = await this.classDiagramRepo.getAttributeById(payload.id);
      if (!existing) throw new Error("Attribute not found");

      if (payload.name !== undefined) existing.rename(payload.name);
      if (payload.type !== undefined) existing.updateType(payload.type);
      if (payload.visibility !== undefined) {
        existing.updateVisibility(
          payload.visibility as "public" | "private" | "protected" | "package",
        );
      }
      if (
        payload.isStatic !== undefined ||
        payload.isReadOnly !== undefined ||
        payload.isOptional !== undefined
      ) {
        existing.updateModifiers({
          isStatic: payload.isStatic,
          isReadOnly: payload.isReadOnly,
          isOptional: payload.isOptional,
        });
      }
      if (
        payload.multiplicityLower !== undefined ||
        payload.multiplicityUpper !== undefined
      ) {
        existing.updateMultiplicity(
          payload.multiplicityLower ?? existing.multiplicityLower,
          payload.multiplicityUpper ?? existing.multiplicityUpper,
        );
      }
      if (payload.defaultValue !== undefined)
        existing.updateDefaultValue(payload.defaultValue);
      if (payload.description !== undefined)
        existing.updateDescription(payload.description);
      if (payload.order !== undefined) existing.updateOrder(payload.order);

      const updated = await this.classDiagramRepo.updateAttribute(existing);
      return updated.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error updating class attribute"),
      );
    }
  }
}

// ─── Remove ───────────────────────────────────────────────────────────────────

export type RemoveClassAttributePayload = {
  payload: { id: string };
  context: { token: string };
};

export class RemoveClassAttributeUseCase
  implements IUseCase<RemoveClassAttributePayload, void>
{
  constructor(private readonly classDiagramRepo: IClassDiagramRepository) {}

  async execute({ payload }: RemoveClassAttributePayload): Promise<void> {
    try {
      await this.classDiagramRepo.removeAttribute(payload.id);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error removing class attribute"),
      );
    }
  }
}
