import { ValueObject } from "@/modules/shared/domain/value-object";

export type ClassRelationshipTypeValue =
  | "ASSOCIATION"
  | "GENERALIZATION"
  | "REALIZATION"
  | "DEPENDENCY";

interface ClassRelationshipTypeProps {
  value: ClassRelationshipTypeValue;
}

interface ClassRelationshipTypeMeta {
  label: string;
  labelFa: string;
  description: string;
}

const META: Record<ClassRelationshipTypeValue, ClassRelationshipTypeMeta> = {
  ASSOCIATION: {
    label: "Association",
    labelFa: "ارتباط",
    description: "A structural relationship between two classes",
  },
  GENERALIZATION: {
    label: "Generalization",
    labelFa: "تعمیم",
    description: "An inheritance/is-a relationship",
  },
  REALIZATION: {
    label: "Realization",
    labelFa: "تحقق",
    description: "An implementation relationship (class implements interface)",
  },
  DEPENDENCY: {
    label: "Dependency",
    labelFa: "وابستگی",
    description: "A uses relationship (one class depends on another)",
  },
};

const ALL_VALUES = Object.keys(META) as ClassRelationshipTypeValue[];

export class ClassRelationshipType extends ValueObject<ClassRelationshipTypeProps> {
  static readonly ASSOCIATION = new ClassRelationshipType({
    value: "ASSOCIATION",
  });
  static readonly GENERALIZATION = new ClassRelationshipType({
    value: "GENERALIZATION",
  });
  static readonly REALIZATION = new ClassRelationshipType({
    value: "REALIZATION",
  });
  static readonly DEPENDENCY = new ClassRelationshipType({
    value: "DEPENDENCY",
  });

  private static readonly ALL: ClassRelationshipType[] = [
    ClassRelationshipType.ASSOCIATION,
    ClassRelationshipType.GENERALIZATION,
    ClassRelationshipType.REALIZATION,
    ClassRelationshipType.DEPENDENCY,
  ];

  protected validate(props: ClassRelationshipTypeProps): void {
    if (!ALL_VALUES.includes(props.value)) {
      throw new Error(`Invalid class relationship type: ${props.value}`);
    }
  }

  static from(value: string): ClassRelationshipType {
    const found = ClassRelationshipType.ALL.find((t) => t.value === value);
    if (!found) throw new Error(`Invalid class relationship type: ${value}`);
    return found;
  }

  static all(): ClassRelationshipType[] {
    return [...ClassRelationshipType.ALL];
  }

  get value(): ClassRelationshipTypeValue {
    return this.props.value;
  }
  get label(): string {
    return META[this.props.value].label;
  }
  get labelFa(): string {
    return META[this.props.value].labelFa;
  }
  get description(): string {
    return META[this.props.value].description;
  }

  isInheritance(): boolean {
    return (
      this.props.value === "GENERALIZATION" || this.props.value === "REALIZATION"
    );
  }

  isStructural(): boolean {
    return this.props.value === "ASSOCIATION";
  }

  isWholePart(): boolean {
    return this.props.value === "ASSOCIATION";
  }

  toString(): string {
    return this.props.value;
  }
}