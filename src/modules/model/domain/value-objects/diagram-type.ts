import { ValueObject } from "@/modules/shared/domain/value-object";
import { Layer } from "./layer";

export type DiagramTypeValue =
  | "OEB"
  | "OCD"
  | "OAB"
  | "OPD"
  | "OIS"
  | "OAAB"
  | "CSA"
  | "SCD"
  | "SFB"
  | "SDFB"
  | "SAB"
  | "SS"
  | "LCB"
  | "LFB"
  | "LDFB"
  | "LAB"
  | "LS"
  | "PCB"
  | "PFB"
  | "PDFB"
  | "PAB"
  | "PS"
  | "EAB"
  | "ECB"
  | "EPBB"
  | "CDB";

interface DiagramTypeMeta {
  label: string;
  labelFa: string;
  layer: Layer;
  /** If set, diagram type is available in these layers (transverse, e.g. CDB). */
  layers?: Layer[];
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
    label: "Operational Activity Diagram",
    labelFa: "دیاگرام فعالیت عملیاتی",
    layer: Layer.OA,
    description: "ساختار تجزیه فعالیت‌های عملیاتی",
  },
  OPD: {
    label: "Operational Activity Interaction Blank",
    labelFa: "بوم تعامل فعالیت عملیاتی",
    layer: Layer.OA,
    description: "تعامل میان فعالیت‌های عملیاتی",
  },
  OCD: {
    label: "Operational Capability Blank",
    labelFa: "بوم قابلیت عملیاتی",
    layer: Layer.OA,
    description: "قابلیت‌های عملیاتی و موجودیت‌های درگیر",
  },
  OIS: {
    label: "Operational Activity Scenario",
    labelFa: "سناریوی فعالیت عملیاتی",
    layer: Layer.OA,
    description: "سناریوی توالی عملیاتی",
  },
  OAAB: {
    label: "Operational Architecture Blank",
    labelFa: "بوم معماری عملیاتی",
    layer: Layer.OA,
    description: "نمای کلی معماری عملیاتی",
  },
  CSA: {
    label: "Context System Actors",
    labelFa: "زمینه بازیگران سیستم",
    layer: Layer.SA,
    description: "سیستم تحت مطالعه و بازیگران پیرامون آن",
  },
  SCD: {
    label: "Mission Capability Blank",
    labelFa: "بوم قابلیت مأموریت",
    layer: Layer.SA,
    description: "قابلیت‌های مأموریتی سیستم",
  },
  SFB: {
    label: "System Function Breakdown",
    labelFa: "تجزیه کارکرد سیستم",
    layer: Layer.SA,
    description: "ساختار تجزیه کارکردهای سیستم",
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
  SS: {
    label: "Functional Scenario",
    labelFa: "سناریوی کارکردی",
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
    label: "Logical Dataflow Breakdown",
    labelFa: "تجزیه جریان داده منطقی",
    layer: Layer.LA,
    description: "جریان داده در سطح منطقی",
  },
  LCB: {
    label: "Logical Component Breakdown",
    labelFa: "تجزیه مؤلفه منطقی",
    layer: Layer.LA,
    description: "سلسله‌مراتب مؤلفه‌های منطقی",
  },
  LFB: {
    label: "Logical Function Breakdown",
    labelFa: "تجزیه کارکرد منطقی",
    layer: Layer.LA,
    description: "ساختار تجزیه کارکردهای منطقی",
  },
  LS: {
    label: "Functional Scenario",
    labelFa: "سناریوی کارکردی",
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
    label: "Physical Dataflow Blank",
    labelFa: "بوم جریان داده فیزیکی",
    layer: Layer.PA,
    description: "جریان داده در سطح فیزیکی",
  },
  PCB: {
    label: "Physical Component Breakdown",
    labelFa: "تجزیه مؤلفه فیزیکی",
    layer: Layer.PA,
    description: "سلسله‌مراتب مؤلفه‌های فیزیکی",
  },
  PFB: {
    label: "Physical Function Breakdown",
    labelFa: "تجزیه کارکرد فیزیکی",
    layer: Layer.PA,
    description: "ساختار تجزیه کارکردهای فیزیکی",
  },
  PS: {
    label: "Functional Scenario Diagram",
    labelFa: "دیاگرام سناریوی کارکردی",
    layer: Layer.PA,
    description: "سناریوی رفتاری فیزیکی",
  },
  EPBB: {
    label: "EPBS Breakdown",
    labelFa: "تجزیه محصول نهایی",
    layer: Layer.EPBS,
    description: "سلسله‌مراتب مؤلفه‌های محصول نهایی",
  },
  EAB: {
    label: "EPBS Architecture Blank",
    labelFa: "معماری محصول نهایی",
    layer: Layer.EPBS,
    description: "دیاگرام اصلی معماری محصول نهایی",
  },
  ECB: {
    label: "EPBS Context/Interface Diagram",
    labelFa: "دیاگرام زمینه/رابط محصول نهایی",
    layer: Layer.EPBS,
    description: "موجودیت‌های پیکربندی و رابط‌های بین آن‌ها",
  },
  CDB: {
    label: "Class Diagram",
    labelFa: "دیاگرام کلاس",
    layer: Layer.SA,
    layers: [Layer.OA, Layer.SA, Layer.LA, Layer.PA, Layer.EPBS],
    description: "دیاگرام کلاس UML برای مدل‌سازی ساختار داده",
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
    return ALL_VALUES.filter((v) => {
      const meta = META[v];
      if (meta.layers) return meta.layers.some((l) => l.equals(layer));
      return meta.layer.equals(layer);
    }).map((v) => new DiagramType({ value: v }));
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
