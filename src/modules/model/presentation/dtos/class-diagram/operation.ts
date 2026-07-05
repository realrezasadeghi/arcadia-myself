import type { ParameterDirectionValue } from "../../../domain/value-objects/parameter-direction";
import type { VisibilityValue } from "../../../domain/value-objects/visibility";

export type OperationParameterInput = {
  name: string;
  type: string;
  direction: ParameterDirectionValue;
  description?: string;
};

export type CreateClassOperationDTOProps = {
  classElementId: string;
  name: string;
  returnType?: string;
  visibility?: VisibilityValue;
  isStatic?: boolean;
  isAbstract?: boolean;
  parameters?: OperationParameterInput[];
  description?: string | null;
};

export class CreateClassOperationDTO {
  public readonly classElementId: string;
  public readonly name: string;
  public readonly returnType: string;
  public readonly visibility: VisibilityValue;
  public readonly isStatic: boolean;
  public readonly isAbstract: boolean;
  public readonly parameters: OperationParameterInput[];
  public readonly description: string | null;

  private constructor(props: CreateClassOperationDTOProps) {
    this.classElementId = props.classElementId;
    this.name = props.name;
    this.returnType = props.returnType ?? "void";
    this.visibility = props.visibility ?? "public";
    this.isStatic = props.isStatic ?? false;
    this.isAbstract = props.isAbstract ?? false;
    this.parameters = props.parameters ?? [];
    this.description = props.description ?? null;
  }

  static create(props: CreateClassOperationDTOProps): CreateClassOperationDTO {
    if (!props.classElementId?.trim()) {
      throw new Error("Class element ID is required");
    }
    if (!props.name?.trim()) {
      throw new Error("Operation name is required");
    }
    if (!props.returnType?.trim() && props.returnType !== undefined) {
      throw new Error("Return type cannot be empty");
    }

    return new CreateClassOperationDTO({
      classElementId: props.classElementId.trim(),
      name: props.name.trim(),
      returnType: props.returnType?.trim() ?? "void",
      visibility: props.visibility ?? "public",
      isStatic: props.isStatic ?? false,
      isAbstract: props.isAbstract ?? false,
      parameters: props.parameters ?? [],
      description: props.description ?? null,
    });
  }
}

export type UpdateClassOperationDTOProps = {
  id: string;
  name?: string;
  returnType?: string;
  visibility?: VisibilityValue;
  isStatic?: boolean;
  isAbstract?: boolean;
  parameters?: OperationParameterInput[];
  description?: string | null;
  order?: number;
};

export class UpdateClassOperationDTO {
  public readonly id: string;
  public readonly name?: string;
  public readonly returnType?: string;
  public readonly visibility?: VisibilityValue;
  public readonly isStatic?: boolean;
  public readonly isAbstract?: boolean;
  public readonly parameters?: OperationParameterInput[];
  public readonly description?: string | null;
  public readonly order?: number;

  private constructor(props: UpdateClassOperationDTOProps) {
    this.id = props.id;
    this.name = props.name;
    this.returnType = props.returnType;
    this.visibility = props.visibility;
    this.isStatic = props.isStatic;
    this.isAbstract = props.isAbstract;
    this.parameters = props.parameters;
    this.description = props.description;
    this.order = props.order;
  }

  static create(props: UpdateClassOperationDTOProps): UpdateClassOperationDTO {
    if (!props.id?.trim()) {
      throw new Error("Operation ID is required");
    }
    return new UpdateClassOperationDTO({ ...props, id: props.id.trim() });
  }
}
