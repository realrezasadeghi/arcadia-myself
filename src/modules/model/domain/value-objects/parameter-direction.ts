import { ValueObject } from "@/modules/shared/domain/value-object";

export type ParameterDirectionValue = "in" | "out" | "inout" | "return";

interface ParameterDirectionProps {
  value: ParameterDirectionValue;
}

const LABELS: Record<ParameterDirectionValue, string> = {
  in: "In",
  out: "Out",
  inout: "In/Out",
  return: "Return",
};

const LABELS_FA: Record<ParameterDirectionValue, string> = {
  in: "ورودی",
  out: "خروجی",
  inout: "ورودی/خروجی",
  return: "برگشت",
};

/**
 * ParameterDirection — Value Object
 *
 * Direction of a parameter in a class operation.
 */
export class ParameterDirection extends ValueObject<ParameterDirectionProps> {
  static readonly IN = new ParameterDirection({ value: "in" });
  static readonly OUT = new ParameterDirection({ value: "out" });
  static readonly INOUT = new ParameterDirection({ value: "inout" });
  static readonly RETURN = new ParameterDirection({ value: "return" });

  private static readonly ALL = [
    ParameterDirection.IN,
    ParameterDirection.OUT,
    ParameterDirection.INOUT,
    ParameterDirection.RETURN,
  ];

  protected validate(props: ParameterDirectionProps): void {
    if (!LABELS[props.value]) {
      throw new Error(`Invalid parameter direction: ${props.value}`);
    }
  }

  static from(value: string): ParameterDirection {
    const found = ParameterDirection.ALL.find((v) => v.value === value);
    if (!found) throw new Error(`Invalid parameter direction: ${value}`);
    return found;
  }

  static all(): ParameterDirection[] {
    return [...ParameterDirection.ALL];
  }

  get value(): ParameterDirectionValue {
    return this.props.value;
  }

  get label(): string {
    return LABELS[this.props.value];
  }

  get labelFa(): string {
    return LABELS_FA[this.props.value];
  }

  get isInput(): boolean {
    return this.props.value === "in" || this.props.value === "inout";
  }

  get isOutput(): boolean {
    return this.props.value === "out" || this.props.value === "inout";
  }

  get isReturn(): boolean {
    return this.props.value === "return";
  }

  toString(): string {
    return this.props.value;
  }
}
