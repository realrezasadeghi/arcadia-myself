/**
 * UI layer union — includes legacy "EPBS" so existing DB rows still
 * type-check. EPBS is NOT offered anywhere in the UI (menus, palettes,
 * switchers); it only survives for legacy-data rendering.
 */
export type LayerValue = "OA" | "SA" | "LA" | "PA" | "EPBS";

export interface LayerInfo {
  value: LayerValue;
  label: string;
  labelFa: string;
  order: number;
}
