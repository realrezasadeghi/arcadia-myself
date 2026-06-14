"use client";

import { DiagramPropertiesPanel } from "../diagram-properties-panel";

/**
 * PropertiesPanel
 *
 * بسته‌بندی پنل خصوصیات برای داک پایین Workbench.
 * منطق اصلی در DiagramPropertiesPanel است (انتخاب node/edge از canvas store).
 */
export function PropertiesPanel({ projectId }: { projectId: string }) {
  return <DiagramPropertiesPanel projectId={projectId} />;
}
