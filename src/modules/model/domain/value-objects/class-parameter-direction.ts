import { ValueObject } from "@/modules/shared/domain/value-object";

export type ClassParameterDirectionValue = "IN" | "OUT" | "INOUT" | "RETURN";

interface ClassParameterDirectionProps {
  value: ClassParameterDirectionValue;
}

const ALL_DIRECTIONS: ClassParameterDirectionValue[] = [
  "IN",
  "OUT",
  "INOUT",
  "RETURN",
];

export class ClassParameterDirection extends ValueObject<ClassParameterDirectionProps> {
  static readonly IN = new ClassParameterDirection({ value: "IN" });
  static readonly OUT = new ClassParameterDirection({ value: "OUT" });
  static readonly INOUT = new ClassParameterDirection({ value: "INOUT" });
  static readonly RETURN = new ClassParameterDirection({ value: "RETURN" });

  private static readonly ALL: ClassParameterDirection[] = [
    ClassParameterDirection.IN,
    ClassParameterDirection.OUT,
    ClassParameterDirection.INOUT,
    ClassParameterDirection.RETURN,
  ];

  protected validate(props: ClassParameterDirectionProps): void {
    if (!ALL_DIRECTIONS.includes(props.value)) {
      throw new Error(`Invalid parameter direction: ${props.value}`);
    }
  }

  static from(value: string): ClassParameterDirection {
    const found = ClassParameterDirection.ALL.find((d) => d.value === value);
    if (!found) throw new Error(`Invalid parameter direction: ${value}`);
    return found;
  }

  static all(): ClassParameterDirection[] {
    return [...ClassParameterDirection.ALL];
  }

  get value(): ClassParameterDirectionValue {
    return this.props.value;
  }

  toString(): string {
    return this.props.value;
  }
}
