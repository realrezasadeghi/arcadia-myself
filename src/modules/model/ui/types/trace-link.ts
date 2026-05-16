import type { ElementTypeValue } from "./element";
import type { LayerValue } from "./layer";

export type TraceLinkTypeValue =
  | "Realization"
  | "Allocation"
  | "Deployment"
  | "Involvement"
  | "Refinement";

export type TraceLinkTypeInfo = {
  value: TraceLinkTypeValue;
  label: string;
  labelFa: string;
};

export type TraceLink = {
  id: string;
  projectId: string;
  type: TraceLinkTypeValue;
  sourceElementId: string;
  sourceLayer: LayerValue;
  targetElementId: string;
  targetLayer: LayerValue;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type TraceLinkOption = {
  type: TraceLinkTypeValue;
  typeLabelFa: string;
  targetLayer: LayerValue;
  targetLayerLabelFa: string;
  targetTypes: ElementTypeValue[];
};

export type TraceLinkRule = {
  type: TraceLinkTypeValue;
  typeLabelFa: string;
  sourceLayer: LayerValue;
  sourceTypes: ElementTypeValue[];
  targetLayer: LayerValue;
  targetLayerLabelFa: string;
  targetTypes: ElementTypeValue[];
};
