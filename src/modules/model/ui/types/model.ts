import type { LayerValue } from "./layer";

export type Model = {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  updatedAt: string;
  createdAt: string;
  layer: LayerValue;
};
