import type { VisibilityValue } from "../../../domain/value-objects/visibility";

export type CreateClassAttributeDTOProps = {
  classElementId: string;
  name: string;
  type: string;
  visibility?: VisibilityValue;
  isStatic?: boolean;
  isReadOnly?: boolean;
  isOptional?: boolean;
  defaultValue?: string | null;
  description?: string | null;
  multiplicityLower?: number;
  multiplicityUpper?: number | null;
};

export class CreateClassAttributeDTO {
  public readonly classElementId: string;
  public readonly name: string;
  public readonly type: string;
  public readonly visibility: VisibilityValue;
  public readonly isStatic: boolean;
  public readonly isReadOnly: boolean;
  public readonly isOptional: boolean;
  public readonly defaultValue: string | null;
  public readonly description: string | null;
  public readonly multiplicityLower: number;
  public readonly multiplicityUpper: number | null;

  private constructor(props: CreateClassAttributeDTOProps) {
    this.classElementId = props.classElementId;
    this.name = props.name;
    this.type = props.type;
    this.visibility = props.visibility ?? "public";
    this.isStatic = props.isStatic ?? false;
    this.isReadOnly = props.isReadOnly ?? false;
    this.isOptional = props.isOptional ?? false;
    this.defaultValue = props.defaultValue ?? null;
    this.description = props.description ?? null;
    this.multiplicityLower = props.multiplicityLower ?? 1;
    this.multiplicityUpper = props.multiplicityUpper ?? null;
  }

  static create(props: CreateClassAttributeDTOProps): CreateClassAttributeDTO {
    if (!props.classElementId?.trim()) {
      throw new Error("Class element ID is required");
    }
    if (!props.name?.trim()) {
      throw new Error("Attribute name is required");
    }
    if (!props.type?.trim()) {
      throw new Error("Attribute type is required");
    }
    if (props.multiplicityLower !== undefined && props.multiplicityLower < 0) {
      throw new Error("Multiplicity lower bound cannot be negative");
    }
    if (
      props.multiplicityUpper !== undefined &&
      props.multiplicityUpper !== null &&
      props.multiplicityUpper < (props.multiplicityLower ?? 1)
    ) {
      throw new Error(
        "Multiplicity upper bound cannot be less than lower bound",
      );
    }

    return new CreateClassAttributeDTO({
      classElementId: props.classElementId.trim(),
      name: props.name.trim(),
      type: props.type.trim(),
      visibility: props.visibility ?? "public",
      isStatic: props.isStatic ?? false,
      isReadOnly: props.isReadOnly ?? false,
      isOptional: props.isOptional ?? false,
      defaultValue: props.defaultValue ?? null,
      description: props.description ?? null,
      multiplicityLower: props.multiplicityLower ?? 1,
      multiplicityUpper: props.multiplicityUpper ?? null,
    });
  }
}

export type UpdateClassAttributeDTOProps = {
  id: string;
  name?: string;
  type?: string;
  visibility?: VisibilityValue;
  isStatic?: boolean;
  isReadOnly?: boolean;
  isOptional?: boolean;
  defaultValue?: string | null;
  description?: string | null;
  multiplicityLower?: number;
  multiplicityUpper?: number | null;
  order?: number;
};

export class UpdateClassAttributeDTO {
  public readonly id: string;
  public readonly name?: string;
  public readonly type?: string;
  public readonly visibility?: VisibilityValue;
  public readonly isStatic?: boolean;
  public readonly isReadOnly?: boolean;
  public readonly isOptional?: boolean;
  public readonly defaultValue?: string | null;
  public readonly description?: string | null;
  public readonly multiplicityLower?: number;
  public readonly multiplicityUpper?: number | null;
  public readonly order?: number;

  private constructor(props: UpdateClassAttributeDTOProps) {
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
    this.visibility = props.visibility;
    this.isStatic = props.isStatic;
    this.isReadOnly = props.isReadOnly;
    this.isOptional = props.isOptional;
    this.defaultValue = props.defaultValue;
    this.description = props.description;
    this.multiplicityLower = props.multiplicityLower;
    this.multiplicityUpper = props.multiplicityUpper;
    this.order = props.order;
  }

  static create(props: UpdateClassAttributeDTOProps): UpdateClassAttributeDTO {
    if (!props.id?.trim()) {
      throw new Error("Attribute ID is required");
    }
    return new UpdateClassAttributeDTO({ ...props, id: props.id.trim() });
  }
}
