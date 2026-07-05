import { Entity } from "@/modules/shared/domain/entity";
import { RelationshipType } from "../value-objects/relationship-type";

export type ClassAssociationType =
  | "ClassAssociation"
  | "ClassAggregation"
  | "ClassComposition"
  | "ClassGeneralization"
  | "ClassDependency"
  | "ClassRealization";

interface ClassAssociationProps {
  modelId: string;
  type: ClassAssociationType;
  sourceClassId: string;
  targetClassId: string;
  sourceMultiplicityLower: number;
  sourceMultiplicityUpper: number | null;
  targetMultiplicityLower: number;
  targetMultiplicityUpper: number | null;
  sourceRole: string | null;
  targetRole: string | null;
  name: string | null;
  description: string | null;
  isNavigable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ClassAssociation — Entity
 *
 * An association between two class elements in a class diagram.
 */
export class ClassAssociation extends Entity<string> {
  private readonly _modelId: string;
  private readonly _type: ClassAssociationType;
  private readonly _sourceClassId: string;
  private readonly _targetClassId: string;
  private _sourceMultiplicityLower: number;
  private _sourceMultiplicityUpper: number | null;
  private _targetMultiplicityLower: number;
  private _targetMultiplicityUpper: number | null;
  private _sourceRole: string | null;
  private _targetRole: string | null;
  private _name: string | null;
  private _description: string | null;
  private _isNavigable: boolean;
  private _updatedAt: Date;
  readonly createdAt: Date;

  private constructor(id: string, props: ClassAssociationProps) {
    super(id);
    this._modelId = props.modelId;
    this._type = props.type;
    this._sourceClassId = props.sourceClassId;
    this._targetClassId = props.targetClassId;
    this._sourceMultiplicityLower = props.sourceMultiplicityLower;
    this._sourceMultiplicityUpper = props.sourceMultiplicityUpper;
    this._targetMultiplicityLower = props.targetMultiplicityLower;
    this._targetMultiplicityUpper = props.targetMultiplicityUpper;
    this._sourceRole = props.sourceRole;
    this._targetRole = props.targetRole;
    this._name = props.name;
    this._description = props.description;
    this._isNavigable = props.isNavigable;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: {
    id: string;
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
  }): ClassAssociation {
    if (props.sourceClassId === props.targetClassId) {
      // Self-association is allowed for some types
      const selfAllowed = [
        "ClassAssociation",
        "ClassAggregation",
        "ClassComposition",
      ];
      if (!selfAllowed.includes(props.type)) {
        throw new Error(`Self-${props.type.toLowerCase()} is not allowed`);
      }
    }

    return new ClassAssociation(props.id, {
      modelId: props.modelId,
      type: props.type,
      sourceClassId: props.sourceClassId,
      targetClassId: props.targetClassId,
      sourceMultiplicityLower: props.sourceMultiplicityLower ?? 1,
      sourceMultiplicityUpper: props.sourceMultiplicityUpper ?? null,
      targetMultiplicityLower: props.targetMultiplicityLower ?? 1,
      targetMultiplicityUpper: props.targetMultiplicityUpper ?? null,
      sourceRole: props.sourceRole ?? null,
      targetRole: props.targetRole ?? null,
      name: props.name ?? null,
      description: props.description ?? null,
      isNavigable: props.isNavigable ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: {
    id: string;
    modelId: string;
    type: ClassAssociationType;
    sourceClassId: string;
    targetClassId: string;
    sourceMultiplicityLower: number;
    sourceMultiplicityUpper: number | null;
    targetMultiplicityLower: number;
    targetMultiplicityUpper: number | null;
    sourceRole: string | null;
    targetRole: string | null;
    name: string | null;
    description: string | null;
    isNavigable: boolean;
    createdAt: string;
    updatedAt: string;
  }): ClassAssociation {
    return new ClassAssociation(props.id, {
      modelId: props.modelId,
      type: props.type,
      sourceClassId: props.sourceClassId,
      targetClassId: props.targetClassId,
      sourceMultiplicityLower: props.sourceMultiplicityLower,
      sourceMultiplicityUpper: props.sourceMultiplicityUpper,
      targetMultiplicityLower: props.targetMultiplicityLower,
      targetMultiplicityUpper: props.targetMultiplicityUpper,
      sourceRole: props.sourceRole,
      targetRole: props.targetRole,
      name: props.name,
      description: props.description,
      isNavigable: props.isNavigable,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get modelId(): string {
    return this._modelId;
  }
  get type(): ClassAssociationType {
    return this._type;
  }
  get sourceClassId(): string {
    return this._sourceClassId;
  }
  get targetClassId(): string {
    return this._targetClassId;
  }
  get sourceMultiplicityLower(): number {
    return this._sourceMultiplicityLower;
  }
  get sourceMultiplicityUpper(): number | null {
    return this._sourceMultiplicityUpper;
  }
  get targetMultiplicityLower(): number {
    return this._targetMultiplicityLower;
  }
  get targetMultiplicityUpper(): number | null {
    return this._targetMultiplicityUpper;
  }
  get sourceRole(): string | null {
    return this._sourceRole;
  }
  get targetRole(): string | null {
    return this._targetRole;
  }
  get name(): string | null {
    return this._name;
  }
  get description(): string | null {
    return this._description;
  }
  get isNavigable(): boolean {
    return this._isNavigable;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /** Get the relationship type value object */
  get relationshipType(): RelationshipType {
    return RelationshipType.from(this._type);
  }

  involves(elementId: string): boolean {
    return (
      this._sourceClassId === elementId || this._targetClassId === elementId
    );
  }

  rename(name: string | null): void {
    this._name = name ? name.trim() : null;
    this._touch();
  }

  updateDescription(description: string | null): void {
    this._description = description;
    this._touch();
  }

  updateSourceMultiplicity(lower: number, upper: number | null): void {
    if (lower < 0) throw new Error("Lower bound cannot be negative");
    if (upper !== null && upper < lower) {
      throw new Error("Upper bound cannot be less than lower bound");
    }
    this._sourceMultiplicityLower = lower;
    this._sourceMultiplicityUpper = upper;
    this._touch();
  }

  updateTargetMultiplicity(lower: number, upper: number | null): void {
    if (lower < 0) throw new Error("Lower bound cannot be negative");
    if (upper !== null && upper < lower) {
      throw new Error("Upper bound cannot be less than lower bound");
    }
    this._targetMultiplicityLower = lower;
    this._targetMultiplicityUpper = upper;
    this._touch();
  }

  updateRoles(sourceRole: string | null, targetRole: string | null): void {
    this._sourceRole = sourceRole ? sourceRole.trim() : null;
    this._targetRole = targetRole ? targetRole.trim() : null;
    this._touch();
  }

  updateNavigable(isNavigable: boolean): void {
    this._isNavigable = isNavigable;
    this._touch();
  }

  toJSON() {
    return {
      id: this._id,
      modelId: this._modelId,
      type: this._type,
      sourceClassId: this._sourceClassId,
      targetClassId: this._targetClassId,
      sourceMultiplicityLower: this._sourceMultiplicityLower,
      sourceMultiplicityUpper: this._sourceMultiplicityUpper,
      targetMultiplicityLower: this._targetMultiplicityLower,
      targetMultiplicityUpper: this._targetMultiplicityUpper,
      sourceRole: this._sourceRole,
      targetRole: this._targetRole,
      name: this._name,
      description: this._description,
      isNavigable: this._isNavigable,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
