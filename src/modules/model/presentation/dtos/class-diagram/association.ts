import type { ClassAssociationType } from "../../../domain/entities/class-association";

export type CreateClassAssociationDTOProps = {
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

export class CreateClassAssociationDTO {
  public readonly modelId: string;
  public readonly type: ClassAssociationType;
  public readonly sourceClassId: string;
  public readonly targetClassId: string;
  public readonly sourceMultiplicityLower: number;
  public readonly sourceMultiplicityUpper: number | null;
  public readonly targetMultiplicityLower: number;
  public readonly targetMultiplicityUpper: number | null;
  public readonly sourceRole: string | null;
  public readonly targetRole: string | null;
  public readonly name: string | null;
  public readonly description: string | null;
  public readonly isNavigable: boolean;

  private constructor(props: CreateClassAssociationDTOProps) {
    this.modelId = props.modelId;
    this.type = props.type;
    this.sourceClassId = props.sourceClassId;
    this.targetClassId = props.targetClassId;
    this.sourceMultiplicityLower = props.sourceMultiplicityLower ?? 1;
    this.sourceMultiplicityUpper = props.sourceMultiplicityUpper ?? null;
    this.targetMultiplicityLower = props.targetMultiplicityLower ?? 1;
    this.targetMultiplicityUpper = props.targetMultiplicityUpper ?? null;
    this.sourceRole = props.sourceRole ?? null;
    this.targetRole = props.targetRole ?? null;
    this.name = props.name ?? null;
    this.description = props.description ?? null;
    this.isNavigable = props.isNavigable ?? true;
  }

  static create(
    props: CreateClassAssociationDTOProps,
  ): CreateClassAssociationDTO {
    if (!props.modelId?.trim()) {
      throw new Error("Model ID is required");
    }
    if (!props.sourceClassId?.trim()) {
      throw new Error("Source class ID is required");
    }
    if (!props.targetClassId?.trim()) {
      throw new Error("Target class ID is required");
    }
    if (props.sourceClassId === props.targetClassId) {
      const selfAllowed = [
        "ClassAssociation",
        "ClassAggregation",
        "ClassComposition",
      ];
      if (!selfAllowed.includes(props.type)) {
        throw new Error(`Self-${props.type.toLowerCase()} is not allowed`);
      }
    }

    return new CreateClassAssociationDTO({
      modelId: props.modelId.trim(),
      type: props.type,
      sourceClassId: props.sourceClassId.trim(),
      targetClassId: props.targetClassId.trim(),
      sourceMultiplicityLower: props.sourceMultiplicityLower ?? 1,
      sourceMultiplicityUpper: props.sourceMultiplicityUpper ?? null,
      targetMultiplicityLower: props.targetMultiplicityLower ?? 1,
      targetMultiplicityUpper: props.targetMultiplicityUpper ?? null,
      sourceRole: props.sourceRole ?? null,
      targetRole: props.targetRole ?? null,
      name: props.name ?? null,
      description: props.description ?? null,
      isNavigable: props.isNavigable ?? true,
    });
  }
}

export type UpdateClassAssociationDTOProps = {
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

export class UpdateClassAssociationDTO {
  public readonly id: string;
  public readonly name?: string | null;
  public readonly description?: string | null;
  public readonly sourceMultiplicityLower?: number;
  public readonly sourceMultiplicityUpper?: number | null;
  public readonly targetMultiplicityLower?: number;
  public readonly targetMultiplicityUpper?: number | null;
  public readonly sourceRole?: string | null;
  public readonly targetRole?: string | null;
  public readonly isNavigable?: boolean;

  private constructor(props: UpdateClassAssociationDTOProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.sourceMultiplicityLower = props.sourceMultiplicityLower;
    this.sourceMultiplicityUpper = props.sourceMultiplicityUpper;
    this.targetMultiplicityLower = props.targetMultiplicityLower;
    this.targetMultiplicityUpper = props.targetMultiplicityUpper;
    this.sourceRole = props.sourceRole;
    this.targetRole = props.targetRole;
    this.isNavigable = props.isNavigable;
  }

  static create(
    props: UpdateClassAssociationDTOProps,
  ): UpdateClassAssociationDTO {
    if (!props.id?.trim()) {
      throw new Error("Association ID is required");
    }
    return new UpdateClassAssociationDTO({ ...props, id: props.id.trim() });
  }
}
