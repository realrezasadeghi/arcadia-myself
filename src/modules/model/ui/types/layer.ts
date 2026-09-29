import type { LayerValue as DomainLayerValue } from "../../domain/value-objects/layer";

/**
 * UI layer union — includes legacy "EPBS" so existing DB rows still
 * type-check. EPBS is not offered in layer pickers (menus, palettes,
 * switchers) but it must still resolve to its own metadata.
 */
export type LayerValue = DomainLayerValue;

export interface LayerInfo {
  value: LayerValue;
  label: string;
  labelFa: string;
  sectionTitle: string;
  sectionTitleFa: string;
  description: string;
  descriptionFa: string;
  order: number;
}
