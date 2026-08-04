import { ValueObject } from "@/modules/shared/domain/value-object";

export type ClassCollectionKindValue =
  | "NONE"
  | "SET"
  | "BAG"
  | "SEQUENCE"
  | "ORDERED_SET";

interface ClassCollectionKindProps {
  value: ClassCollectionKindValue;
}

const ALL_KINDS: ClassCollectionKindValue[] = [
  "NONE",
  "SET",
  "BAG",
  "SEQUENCE",
  "ORDERED_SET",
];

export class ClassCollectionKind extends ValueObject<ClassCollectionKindProps> {
  static readonly NONE = new ClassCollectionKind({ value: "NONE" });
  static readonly SET = new ClassCollectionKind({ value: "SET" });
  static readonly BAG = new ClassCollectionKind({ value: "BAG" });
  static readonly SEQUENCE = new ClassCollectionKind({ value: "SEQUENCE" });
  static readonly ORDERED_SET = new ClassCollectionKind({
    value: "ORDERED_SET",
  });

  private static readonly ALL: ClassCollectionKind[] = [
    ClassCollectionKind.NONE,
    ClassCollectionKind.SET,
    ClassCollectionKind.BAG,
    ClassCollectionKind.SEQUENCE,
    ClassCollectionKind.ORDERED_SET,
  ];

  protected validate(props: ClassCollectionKindProps): void {
    if (!ALL_KINDS.includes(props.value)) {
      throw new Error(`Invalid collection kind: ${props.value}`);
    }
  }

  static from(value: string): ClassCollectionKind {
    const found = ClassCollectionKind.ALL.find((k) => k.value === value);
    if (!found) throw new Error(`Invalid collection kind: ${value}`);
    return found;
  }

  static all(): ClassCollectionKind[] {
    return [...ClassCollectionKind.ALL];
  }

  get value(): ClassCollectionKindValue {
    return this.props.value;
  }

  isCollection(): boolean {
    return this.props.value !== "NONE";
  }

  toString(): string {
    return this.props.value;
  }
}
