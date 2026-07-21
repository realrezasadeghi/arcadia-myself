import { ValueObject } from "@/modules/shared/domain/value-object";

export type ClassElementTypeValue =
  | "CLASS"
  | "INTERFACE"
  | "ENUM"
  | "DATA_TYPE"
  | "PRIMITIVE"
  | "COLLECTION"
  | "UNION"
  | "PACKAGE"
  | "GROUP";

interface ClassElementTypeProps {
  value: ClassElementTypeValue;
}

interface ClassElementTypeMeta {
  label: string;
  labelFa: string;
}

const META: Record<ClassElementTypeValue, ClassElementTypeMeta> = {
  CLASS: { label: "Class", labelFa: "کلاس" },
  INTERFACE: { label: "Interface", labelFa: "رابط" },
  ENUM: { label: "Enumeration", labelFa: "شمارش" },
  DATA_TYPE: { label: "Data Type", labelFa: "نوع داده" },
  PRIMITIVE: { label: "Primitive", labelFa: "ابتدایی" },
  COLLECTION: { label: "Collection", labelFa: "مجموعه" },
  UNION: { label: "Union", labelFa: "اتحاد" },
  PACKAGE: { label: "Package", labelFa: "پکیج" },
  GROUP: { label: "Group", labelFa: "گروه" },
};

const ALL_VALUES = Object.keys(META) as ClassElementTypeValue[];

export class ClassElementType extends ValueObject<ClassElementTypeProps> {
  static readonly CLASS = new ClassElementType({ value: "CLASS" });
  static readonly INTERFACE = new ClassElementType({ value: "INTERFACE" });
  static readonly ENUM = new ClassElementType({ value: "ENUM" });
  static readonly DATA_TYPE = new ClassElementType({ value: "DATA_TYPE" });
  static readonly PRIMITIVE = new ClassElementType({ value: "PRIMITIVE" });
  static readonly COLLECTION = new ClassElementType({ value: "COLLECTION" });
  static readonly UNION = new ClassElementType({ value: "UNION" });
  static readonly PACKAGE = new ClassElementType({ value: "PACKAGE" });
  static readonly GROUP = new ClassElementType({ value: "GROUP" });

  private static readonly ALL: ClassElementType[] = [
    ClassElementType.CLASS,
    ClassElementType.INTERFACE,
    ClassElementType.ENUM,
    ClassElementType.DATA_TYPE,
    ClassElementType.PRIMITIVE,
    ClassElementType.COLLECTION,
    ClassElementType.UNION,
    ClassElementType.PACKAGE,
    ClassElementType.GROUP,
  ];

  protected validate(props: ClassElementTypeProps): void {
    if (!ALL_VALUES.includes(props.value)) {
      throw new Error(`Invalid class element type: ${props.value}`);
    }
  }

  static from(value: string): ClassElementType {
    const found = ClassElementType.ALL.find((t) => t.value === value);
    if (!found) throw new Error(`Invalid class element type: ${value}`);
    return found;
  }

  static all(): ClassElementType[] {
    return [...ClassElementType.ALL];
  }

  get value(): ClassElementTypeValue {
    return this.props.value;
  }
  get label(): string {
    return META[this.props.value].label;
  }
  get labelFa(): string {
    return META[this.props.value].labelFa;
  }

  isClass(): boolean {
    return this.props.value === "CLASS";
  }
  isInterface(): boolean {
    return this.props.value === "INTERFACE";
  }
  isEnum(): boolean {
    return this.props.value === "ENUM";
  }
  isDataType(): boolean {
    return this.props.value === "DATA_TYPE" || this.props.value === "PRIMITIVE";
  }
  isCollection(): boolean {
    return this.props.value === "COLLECTION";
  }
  isUnion(): boolean {
    return this.props.value === "UNION";
  }
  isPackage(): boolean {
    return this.props.value === "PACKAGE" || this.props.value === "GROUP";
  }

  toString(): string {
    return this.props.value;
  }
}