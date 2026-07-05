import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import {
  ClassAssociation,
  type ClassAssociationType,
} from "../../../domain/entities/class-association";
import { AssociationPolicy } from "../../../domain/policies/association";
import type { IClassDiagramRepository } from "../../ports/class-diagram";
import type { IElementRepository } from "../../ports/element";

// ─── Create ───────────────────────────────────────────────────────────────────

export type CreateClassAssociationPayload = {
  payload: {
    modelId: string;
    type: ClassAssociationType;
    sourceClassId: string;
    targetClassId: string;
    sourceMultiplicityLower?: number;
    sourceMultiplicityUpper?: number | null;
    targetMultiplicityLower?: number;
    targetMultiplicityUpper?: number | null;
    sourceRole?: string | null;
    targetRole?: string | null;
    name?: string | null;
    description?: string | null;
    isNavigable?: boolean;
  };
  context: { token: string };
};

export type CreateClassAssociationResponse = ReturnType<
  ClassAssociation["toJSON"]
>;

export class CreateClassAssociationUseCase
  implements
    IUseCase<CreateClassAssociationPayload, CreateClassAssociationResponse>
{
  constructor(
    private readonly classDiagramRepo: IClassDiagramRepository,
    private readonly elementRepo: IElementRepository,
  ) {}

  async execute({
    payload,
  }: CreateClassAssociationPayload): Promise<CreateClassAssociationResponse> {
    try {
      // Validate source and target exist
      const [source, target] = await Promise.all([
        this.elementRepo.findElementById({ id: payload.sourceClassId }),
        this.elementRepo.findElementById({ id: payload.targetClassId }),
      ]);

      if (!source) throw new Error("Source element not found");
      if (!target) throw new Error("Target element not found");

      // Validate via policy
      const validation = AssociationPolicy.validate({
        sourceType: source.type.value,
        targetType: target.type.value,
        associationType: payload.type,
      });

      if (!validation.isValid) {
        throw new Error(validation.errors.join("; "));
      }

      // Check for generalization cycles
      if (payload.type === "ClassGeneralization") {
        const existing = await this.classDiagramRepo.getAssociationsByModelId(
          payload.modelId,
        );
        const generalizations = existing
          .filter((a) => a.type === "ClassGeneralization")
          .map((a) => ({
            sourceClassId: a.sourceClassId,
            targetClassId: a.targetClassId,
          }));

        if (
          AssociationPolicy.wouldCreateCycle(
            payload.sourceClassId,
            payload.targetClassId,
            generalizations,
          )
        ) {
          throw new Error("Generalization would create a cycle");
        }
      }

      const assoc = ClassAssociation.create({
        id: crypto.randomUUID(),
        modelId: payload.modelId,
        type: payload.type,
        sourceClassId: payload.sourceClassId,
        targetClassId: payload.targetClassId,
        sourceMultiplicityLower: payload.sourceMultiplicityLower,
        sourceMultiplicityUpper: payload.sourceMultiplicityUpper,
        targetMultiplicityLower: payload.targetMultiplicityLower,
        targetMultiplicityUpper: payload.targetMultiplicityUpper,
        sourceRole: payload.sourceRole,
        targetRole: payload.targetRole,
        name: payload.name,
        description: payload.description,
        isNavigable: payload.isNavigable,
      });

      const saved = await this.classDiagramRepo.saveAssociation(assoc);
      return saved.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error creating class association"),
      );
    }
  }
}

// ─── Update ───────────────────────────────────────────────────────────────────

export type UpdateClassAssociationPayload = {
  payload: {
    id: string;
    name?: string | null;
    description?: string | null;
    sourceMultiplicityLower?: number;
    sourceMultiplicityUpper?: number | null;
    targetMultiplicityLower?: number;
    targetMultiplicityUpper?: number | null;
    sourceRole?: string | null;
    targetRole?: string | null;
    isNavigable?: boolean;
  };
  context: { token: string };
};

export type UpdateClassAssociationResponse = ReturnType<
  ClassAssociation["toJSON"]
>;

export class UpdateClassAssociationUseCase
  implements
    IUseCase<UpdateClassAssociationPayload, UpdateClassAssociationResponse>
{
  constructor(private readonly classDiagramRepo: IClassDiagramRepository) {}

  async execute({
    payload,
  }: UpdateClassAssociationPayload): Promise<UpdateClassAssociationResponse> {
    try {
      const existing = await this.classDiagramRepo.getAssociationById(
        payload.id,
      );
      if (!existing) throw new Error("Association not found");

      if (payload.name !== undefined) existing.rename(payload.name);
      if (payload.description !== undefined) {
        existing.updateDescription(payload.description);
      }
      if (
        payload.sourceMultiplicityLower !== undefined ||
        payload.sourceMultiplicityUpper !== undefined
      ) {
        existing.updateSourceMultiplicity(
          payload.sourceMultiplicityLower ?? existing.sourceMultiplicityLower,
          payload.sourceMultiplicityUpper ?? existing.sourceMultiplicityUpper,
        );
      }
      if (
        payload.targetMultiplicityLower !== undefined ||
        payload.targetMultiplicityUpper !== undefined
      ) {
        existing.updateTargetMultiplicity(
          payload.targetMultiplicityLower ?? existing.targetMultiplicityLower,
          payload.targetMultiplicityUpper ?? existing.targetMultiplicityUpper,
        );
      }
      if (
        payload.sourceRole !== undefined ||
        payload.targetRole !== undefined
      ) {
        existing.updateRoles(
          payload.sourceRole !== undefined
            ? payload.sourceRole
            : existing.sourceRole,
          payload.targetRole !== undefined
            ? payload.targetRole
            : existing.targetRole,
        );
      }
      if (payload.isNavigable !== undefined) {
        existing.updateNavigable(payload.isNavigable);
      }

      const updated = await this.classDiagramRepo.updateAssociation(existing);
      return updated.toJSON();
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error updating class association"),
      );
    }
  }
}

// ─── Remove ───────────────────────────────────────────────────────────────────

export type RemoveClassAssociationPayload = {
  payload: { id: string };
  context: { token: string };
};

export class RemoveClassAssociationUseCase
  implements IUseCase<RemoveClassAssociationPayload, void>
{
  constructor(private readonly classDiagramRepo: IClassDiagramRepository) {}

  async execute({ payload }: RemoveClassAssociationPayload): Promise<void> {
    try {
      await this.classDiagramRepo.removeAssociation(payload.id);
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error removing class association"),
      );
    }
  }
}
