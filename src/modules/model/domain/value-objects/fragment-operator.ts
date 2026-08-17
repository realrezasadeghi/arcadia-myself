import { ValueObject } from "@/modules/shared/domain/value-object";

export type FragmentOperatorValue =
  | "alt"
  | "opt"
  | "loop"
  | "break"
  | "par"
  | "critical"
  | "assert"
  | "neg"
  | "ignore"
  | "consider"
  | "strict"
  | "seq";

interface FragmentOperatorProps {
  value: FragmentOperatorValue;
}

interface FragmentOperatorMeta {
  label: string;
  labelFa: string;
  description: string;
  /** Alt/opt/loop/break have guard conditions */
  hasGuard: boolean;
  /** Alt has multiple operands (if/else) */
  hasMultipleOperands: boolean;
}

const META: Record<FragmentOperatorValue, FragmentOperatorMeta> = {
  alt: {
    label: "Alternative",
    labelFa: "جایگزین",
    description: "Exclusive choice between operands (if/else)",
    hasGuard: true,
    hasMultipleOperands: true,
  },
  opt: {
    label: "Option",
    labelFa: "گزینه",
    description: "Optional execution (if condition)",
    hasGuard: true,
    hasMultipleOperands: false,
  },
  loop: {
    label: "Loop",
    labelFa: "حلقه",
    description: "Repeated execution",
    hasGuard: true,
    hasMultipleOperands: false,
  },
  break: {
    label: "Break",
    labelFa: "شکست",
    description: "Break out of enclosing loop",
    hasGuard: true,
    hasMultipleOperands: false,
  },
  par: {
    label: "Parallel",
    labelFa: "موازی",
    description: "Parallel execution of operands",
    hasGuard: false,
    hasMultipleOperands: true,
  },
  critical: {
    label: "Critical",
    labelFa: "بحرانی",
    description: "Critical region (atomic execution)",
    hasGuard: false,
    hasMultipleOperands: false,
  },
  assert: {
    label: "Assertion",
    labelFa: "اعتقاد",
    description: "Assert condition must be true",
    hasGuard: true,
    hasMultipleOperands: false,
  },
  neg: {
    label: "Negative",
    labelFa: "منفی",
    description: "Messages that should not occur",
    hasGuard: false,
    hasMultipleOperands: false,
  },
  ignore: {
    label: "Ignore",
    labelFa: "نادیده",
    description: "Messages to ignore",
    hasGuard: false,
    hasMultipleOperands: false,
  },
  consider: {
    label: "Consider",
    labelFa: "در نظر",
    description: "Only these messages matter",
    hasGuard: false,
    hasMultipleOperands: false,
  },
  strict: {
    label: "Strict Sequence",
    labelFa: "توالی سخت",
    description: "Strict ordering of operands",
    hasGuard: false,
    hasMultipleOperands: true,
  },
  seq: {
    label: "Weak Sequence",
    labelFa: "توالی ضعیف",
    description: "Weak ordering of operands",
    hasGuard: false,
    hasMultipleOperands: true,
  },
};

const ALL_VALUES = Object.keys(META) as FragmentOperatorValue[];

export class FragmentOperator extends ValueObject<FragmentOperatorProps> {
  protected validate(props: FragmentOperatorProps): void {
    if (!ALL_VALUES.includes(props.value))
      throw new Error(`Invalid fragment operator: ${props.value}`);
  }

  static from(value: string): FragmentOperator {
    if (!ALL_VALUES.includes(value as FragmentOperatorValue))
      throw new Error(`Invalid fragment operator: ${value}`);
    return new FragmentOperator({ value: value as FragmentOperatorValue });
  }

  static all(): FragmentOperator[] {
    return ALL_VALUES.map((v) => new FragmentOperator({ value: v }));
  }

  get value(): FragmentOperatorValue {
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

  get hasGuard(): boolean {
    return META[this.props.value].hasGuard;
  }

  get hasMultipleOperands(): boolean {
    return META[this.props.value].hasMultipleOperands;
  }

  toString(): string {
    return this.props.value;
  }
}
