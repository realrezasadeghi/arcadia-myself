import { ValueObject } from "@/modules/shared/domain/value-object";

export type LayerValue = "OA" | "SA" | "LA" | "PA" | "EPBS";

interface LayerProps {
  value: LayerValue;
}

export interface LayerMeta {
  labelFa: string;
  label: string;
  sectionTitleFa: string;
  sectionTitle: string;
  descriptionFa: string;
  description: string;
  order: number;
}

const LAYER_META: Record<LayerValue, LayerMeta> = {
  OA: {
    labelFa: "تحلیل عملیاتی",
    label: "Operational Analysis",
    sectionTitleFa: "تحلیل عملیاتی",
    sectionTitle: "Operational Analysis",
    descriptionFa: "نیازهای ذی‌نفعان و بافت عملیاتی، بدون پیش‌فرض راه‌حل.",
    description:
      "Stakeholder needs and the operational context, analysed without any solution bias.",
    order: 1,
  },
  SA: {
    labelFa: "تحلیل سیستم",
    label: "System Analysis",
    sectionTitleFa: "تحلیل سیستم",
    sectionTitle: "System Analysis",
    descriptionFa:
      "آنچه سیستم مورد نظر باید برای تحقق قابلیت‌های عملیاتی انجام دهد.",
    description:
      "What the system of interest must do to contribute to the operational capabilities.",
    order: 2,
  },
  LA: {
    labelFa: "معماری منطقی",
    label: "Logical Architecture",
    sectionTitleFa: "معماری منطقی",
    sectionTitle: "Logical Architecture",
    descriptionFa:
      "راه‌حل مفهومی، تفکیک‌شده به مؤلفه‌های منطقی و مستقل از پیاده‌سازی.",
    description:
      "The conceptual solution decomposed into logical components, independent of implementation.",
    order: 3,
  },
  PA: {
    labelFa: "معماری فیزیکی",
    label: "Physical Architecture",
    sectionTitleFa: "معماری فیزیکی",
    sectionTitle: "Physical Architecture",
    descriptionFa:
      "انتخاب‌های پیاده‌سازی: مؤلفه‌ها و گره‌های فیزیکی و استقرار آن‌ها.",
    description:
      "The implementation choices: physical components, nodes and their deployment.",
    order: 4,
  },
  EPBS: {
    labelFa: "ساختار محصول نهایی",
    label: "End-Product Breakdown Structure",
    sectionTitleFa: "ساختار محصول نهایی",
    sectionTitle: "End-Product Breakdown Structure",
    descriptionFa: "تفکیک محصول نهایی و نگاشت معماری فیزیکی به موارد پیکربندی.",
    description:
      "The final product breakdown, mapping the physical architecture to configuration items.",
    order: 5,
  },
};

/**
 * Layer — Value Object
 *
 * نمایانگر یکی از لایه‌های پنج‌گانه Arcadia.
 * حاوی business behavior برای مقایسه و بررسی ترتیب لایه‌ها.
 */
export class Layer extends ValueObject<LayerProps> {
  static readonly OA = new Layer({ value: "OA" });
  static readonly SA = new Layer({ value: "SA" });
  static readonly LA = new Layer({ value: "LA" });
  static readonly PA = new Layer({ value: "PA" });
  static readonly EPBS = new Layer({ value: "EPBS" });

  private static readonly ALL: Layer[] = [
    Layer.OA,
    Layer.SA,
    Layer.LA,
    Layer.PA,
    Layer.EPBS,
  ];

  protected validate(props: LayerProps): void {
    if (!["OA", "SA", "LA", "PA", "EPBS"].includes(props.value)) {
      throw new Error(`Invalid layer value : ${props.value}`);
    }
  }

  static from(value: string): Layer {
    const found = Layer.ALL.find((l) => l.value === value);
    if (!found) throw new Error(`Invalid layer value : ${value}`);
    return found;
  }

  static tryFrom(value: string): Layer | null {
    return Layer.ALL.find((l) => l.value === value) ?? null;
  }

  static all(): Layer[] {
    return [...Layer.ALL];
  }

  static meta(value: LayerValue): LayerMeta {
    return LAYER_META[value];
  }

  get value(): LayerValue {
    return this.props.value;
  }
  get order(): number {
    return LAYER_META[this.props.value].order;
  }
  get labelFa(): string {
    return LAYER_META[this.props.value].labelFa;
  }
  get label(): string {
    return LAYER_META[this.props.value].label;
  }
  get sectionTitle(): string {
    return LAYER_META[this.props.value].sectionTitle;
  }
  get sectionTitleFa(): string {
    return LAYER_META[this.props.value].sectionTitleFa;
  }
  get description(): string {
    return LAYER_META[this.props.value].description;
  }
  get descriptionFa(): string {
    return LAYER_META[this.props.value].descriptionFa;
  }

  isHigherAbstractionThan(other: Layer): boolean {
    return this.order < other.order;
  }

  isAdjacentTo(other: Layer): boolean {
    return Math.abs(this.order - other.order) === 1;
  }

  nextLayer(): Layer | null {
    return Layer.ALL.find((l) => l.order === this.order + 1) ?? null;
  }

  previousLayer(): Layer | null {
    return Layer.ALL.find((l) => l.order === this.order - 1) ?? null;
  }

  canBeRealizedBy(candidate: Layer): boolean {
    return candidate.order === this.order + 1;
  }

  toString(): string {
    return this.props.value;
  }
}
