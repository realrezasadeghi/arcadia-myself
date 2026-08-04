import { ValueObject } from "@/modules/shared/domain/value-object";

export type ClassVisibilityValue =
  | "public"
  | "private"
  | "protected"
  | "package";

interface ClassVisibilityProps {
  value: ClassVisibilityValue;
}

const ALL_VISIBILITIES: ClassVisibilityValue[] = [
  "public",
  "private",
  "protected",
  "package",
];

export class ClassVisibility extends ValueObject<ClassVisibilityProps> {
  static readonly PUBLIC = new ClassVisibility({ value: "public" });
  static readonly PRIVATE = new ClassVisibility({ value: "private" });
  static readonly PROTECTED = new ClassVisibility({ value: "protected" });
  static readonly PACKAGE = new ClassVisibility({ value: "package" });

  private static readonly ALL: ClassVisibility[] = [
    ClassVisibility.PUBLIC,
    ClassVisibility.PRIVATE,
    ClassVisibility.PROTECTED,
    ClassVisibility.PACKAGE,
  ];

  protected validate(props: ClassVisibilityProps): void {
    if (!ALL_VISIBILITIES.includes(props.value)) {
      throw new Error(`Invalid visibility: ${props.value}`);
    }
  }

  static from(value: string): ClassVisibility {
    const found = ClassVisibility.ALL.find((v) => v.value === value);
    if (!found) throw new Error(`Invalid visibility: ${value}`);
    return found;
  }

  get value(): ClassVisibilityValue {
    return this.props.value;
  }
  toString(): string {
    return this.props.value;
  }
}
