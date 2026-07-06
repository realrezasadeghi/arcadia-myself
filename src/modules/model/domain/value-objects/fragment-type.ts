import { ValueObject } from "@/modules/shared/domain/value-object";

export type FragmentTypeValue =
  | "alt"
  | "opt"
  | "loop"
  | "break"
  | "par"
  | "critical"
  | "region"
  | "neg"
  | "assert"
  | "ignore"
  | "consider";

interface FragmentTypeMeta {
  label: string;
  labelFa: string;
  description: string;
  operator: string;
  isCombined: boolean;
  guardRequired: boolean;
}

const META: Record<FragmentTypeValue, FragmentTypeMeta> = {
  alt: {
    label: "Alternative",
    labelFa: "مُتَقَابِل",
    description: "فقط یکی ازOperandها اجرا می‌شود (شرط‌ها متقابل‌اند)",
    operator: "alt",
    isCombined: true,
    guardRequired: true,
  },
  opt: {
    label: "Optional",
    labelFa: "اختیاری",
    description: "Operand اجرا می‌شود یا خیر (شرطی)",
    operator: "opt",
    isCombined: false,
    guardRequired: true,
  },
  loop: {
    label: "Loop",
    labelFa: "حلقه",
    description: "Operand چندین بار اجرا می‌شود (با شرط/min/max)",
    operator: "loop",
    isCombined: false,
    guardRequired: false,
  },
  break: {
    label: "Break",
    labelFa: "شکست",
    description: "شکستِ تکه restante از سناریو (مخالف loop)",
    operator: "break",
    isCombined: false,
    guardRequired: true,
  },
  par: {
    label: "Parallel",
    labelFa: "موازی",
    description: "Operandها به‌صورت موازی/هم‌زمان اجرا می‌شوند",
    operator: "par",
    isCombined: true,
    guardRequired: false,
  },
  critical: {
    label: "Critical Region",
    labelFa: "منطقه بحرانی",
    description: "Operand در ناحیه بحرانی است (بدون وقفه/preemption)",
    operator: "critical",
    isCombined: false,
    guardRequired: false,
  },
  region: {
    label: "Region",
    labelFa: "منطقه",
    description: "منطقه عام (بدون عملگر خاص)",
    operator: "region",
    isCombined: false,
    guardRequired: false,
  },
  neg: {
    label: "Negative",
    labelFa: "منفی",
    description: "Operand یک تکه غيرمعتبر/ممنوعه است",
    operator: "neg",
    isCombined: false,
    guardRequired: false,
  },
  assert: {
    label: "Assert",
    labelFa: "تاکید",
    description: "Operand تنها تکه معتبر است ( بقیه غیرمعتبر)",
    operator: "assert",
    isCombined: false,
    guardRequired: false,
  },
  ignore: {
    label: "Ignore",
    labelFa: "نادیده",
    description: "پیام‌های لیست‌شده نادیده گرفته می‌شوند",
    operator: "ignore",
    isCombined: false,
    guardRequired: false,
  },
  consider: {
    label: "Consider",
    labelFa: "در نظر گرفتن",
    description: "فقط پیام‌های لیست‌شده در نظر گرفته می‌شوند",
    operator: "consider",
    isCombined: false,
    guardRequired: false,
  },
};

const ALL_VALUES = Object.keys(META) as FragmentTypeValue[];

interface FragmentTypeProps {
  value: FragmentTypeValue;
}

export class FragmentType extends ValueObject<FragmentTypeProps> {
  protected validate(props: FragmentTypeProps): void {
    if (!ALL_VALUES.includes(props.value))
      throw new Error(`FragmentType is invalid: ${props.value}`);
  }

  static from(value: string): FragmentType {
    if (!ALL_VALUES.includes(value as FragmentTypeValue))
      throw new Error(`FragmentType is invalid: ${value}`);
    return new FragmentType({ value: value as FragmentTypeValue });
  }

  static all(): FragmentType[] {
    return ALL_VALUES.map((v) => new FragmentType({ value: v }));
  }

  get value(): FragmentTypeValue {
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

  get operator(): string {
    return META[this.props.value].operator;
  }

  get isCombined(): boolean {
    return META[this.props.value].isCombined;
  }

  get guardRequired(): boolean {
    return META[this.props.value].guardRequired;
  }

  toString(): string {
    return this.props.value;
  }
}