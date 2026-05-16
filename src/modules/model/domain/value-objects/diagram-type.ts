import { ValueObject } from "@/modules/shared/domain/value-object";
import { Layer } from "./layer";

export type DiagramTypeValue =
  | "OEB"
  | "OAB"
  | "OPD"
  | "OCD"
  | "OIS"
  | "SAB"
  | "SDFB"
  | "SCD"
  | "SS"
  | "LAB"
  | "LDFB"
  | "LCB"
  | "LS"
  | "PAB"
  | "PDFB"
  | "PCB"
  | "PS";

interface DiagramTypeMeta {
  label: string;
  labelFa: string;
  layer: Layer;
  description: string;
}

const META: Record<DiagramTypeValue, DiagramTypeMeta> = {
  OEB: {
    label: "Operational Entity Breakdown",
    labelFa: "تجزیه موجودیت عملیاتی",
    layer: Layer.OA,
    description: "سلسله‌مراتب موجودیت‌های عملیاتی",
  },
  OAB: {
    label: "Operational Activity Breakdown",
    labelFa: "تجزیه فعالیت عملیاتی",
    layer: Layer.OA,
    description: "ساختار تجزیه فعالیت‌های عملیاتی",
  },
  OPD: {
    label: "Operational Process Description",
    labelFa: "توصیف فرایند عملیاتی",
    layer: Layer.OA,
    description: "توالی فعالیت‌های عملیاتی",
  },
  OCD: {
    label: "Operational Capability Diagram",
    labelFa: "دیاگرام قابلیت عملیاتی",
    layer: Layer.OA,
    description: "قابلیت‌های عملیاتی",
  },
  OIS: {
    label: "Operational Interaction Scenario",
    labelFa: "سناریو تعامل عملیاتی",
    layer: Layer.OA,
    description: "سناریوی توالی عملیاتی",
  },
  SAB: {
    label: "System Architecture Blank",
    labelFa: "معماری سیستم",
    layer: Layer.SA,
    description: "دیاگرام اصلی معماری سیستم",
  },
  SDFB: {
    label: "System Data Flow Blank",
    labelFa: "جریان داده سیستم",
    layer: Layer.SA,
    description: "جریان داده در سطح سیستم",
  },
  SCD: {
    label: "System Capability Diagram",
    labelFa: "دیاگرام قابلیت سیستم",
    layer: Layer.SA,
    description: "قابلیت‌های سیستم",
  },
  SS: {
    label: "System Scenario",
    labelFa: "سناریو سیستم",
    layer: Layer.SA,
    description: "سناریوی رفتاری سیستم",
  },
  LAB: {
    label: "Logical Architecture Blank",
    labelFa: "معماری منطقی",
    layer: Layer.LA,
    description: "دیاگرام اصلی معماری منطقی",
  },
  LDFB: {
    label: "Logical Data Flow Blank",
    labelFa: "جریان داده منطقی",
    layer: Layer.LA,
    description: "جریان داده در سطح منطقی",
  },
  LCB: {
    label: "Logical Component Breakdown",
    labelFa: "تجزیه مؤلفه منطقی",
    layer: Layer.LA,
    description: "سلسله‌مراتب مؤلفه‌های منطقی",
  },
  LS: {
    label: "Logical Scenario",
    labelFa: "سناریو منطقی",
    layer: Layer.LA,
    description: "سناریوی رفتاری منطقی",
  },
  PAB: {
    label: "Physical Architecture Blank",
    labelFa: "معماری فیزیکی",
    layer: Layer.PA,
    description: "دیاگرام اصلی معماری فیزیکی",
  },
  PDFB: {
    label: "Physical Data Flow Blank",
    labelFa: "جریان داده فیزیکی",
    layer: Layer.PA,
    description: "جریان داده در سطح فیزیکی",
  },
  PCB: {
    label: "Physical Component Breakdown",
    labelFa: "تجزیه مؤلفه فیزیکی",
    layer: Layer.PA,
    description: "سلسله‌مراتب مؤلفه‌های فیزیکی",
  },
  PS: {
    label: "Physical Scenario",
    labelFa: "سناریو فیزیکی",
    layer: Layer.PA,
    description: "سناریوی رفتاری فیزیکی",
  },
};

const ALL_VALUES = Object.keys(META) as DiagramTypeValue[];

interface DiagramTypeProps {
  value: DiagramTypeValue;
}

export class DiagramType extends ValueObject<DiagramTypeProps> {
  protected validate(props: DiagramTypeProps): void {
    if (!ALL_VALUES.includes(props.value))
      throw new Error(`Diagram type is invalid : ${props.value}`);
  }

  static from(value: string): DiagramType {
    if (!ALL_VALUES.includes(value as DiagramTypeValue))
      throw new Error(`Diagram type is invalid : ${value}`);
    return new DiagramType({ value: value as DiagramTypeValue });
  }

  static allForLayer(layer: Layer): DiagramType[] {
    return ALL_VALUES.filter((v) => META[v].layer.equals(layer)).map(
      (v) => new DiagramType({ value: v }),
    );
  }

  get value(): DiagramTypeValue {
    return this.props.value;
  }
  get layer(): Layer {
    return META[this.props.value].layer;
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

  isScenario(): boolean {
    return this.props.value.endsWith("S") || this.props.value.endsWith("IS");
  }

  isBreakdown(): boolean {
    return this.props.value.endsWith("B") || this.props.value.endsWith("CB");
  }

  toString(): string {
    return this.props.value;
  }
}
