import {
  ElementType,
  type ElementTypeValue,
} from "../value-objects/element-type";
import { Layer, type LayerValue } from "../value-objects/layer";

export type ValidationSeverity = "error" | "warning" | "info";

export type ValidationIssue = {
  id: string;
  severity: ValidationSeverity;
  rule: string;
  message: string;
  elementId?: string;
  elementName?: string;
  elementType?: string;
  layer?: LayerValue;
};

type ValidationContext = {
  elements: Array<{
    id: string;
    modelId: string;
    layer: string;
    type: string;
    name: string;
    parentId: string | null;
    status: string;
  }>;
  traceLinks: Array<{
    id: string;
    sourceElementId: string;
    targetElementId: string;
    sourceLayer: string;
    targetLayer: string;
    type: string;
  }>;
  relationships: Array<{
    id: string;
    sourceElementId: string;
    targetElementId: string;
    type: string;
  }>;
};

function elementKey(el: { id: string; layer: string; type: string }) {
  return `${el.layer}:${el.type}:${el.id}`;
}

/**
 * ValidationPolicy
 *
 * Runs structural validation rules against a model's elements, trace links,
 * and relationships. Returns a list of issues categorized by severity.
 */
export class ValidationPolicy {
  static validate(ctx: ValidationContext): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    let issueCounter = 0;

    const nextId = () => `val-${++issueCounter}`;

    const elementsByLayer = new Map<string, typeof ctx.elements>();
    for (const el of ctx.elements) {
      const arr = elementsByLayer.get(el.layer) ?? [];
      arr.push(el);
      elementsByLayer.set(el.layer, arr);
    }

    // ── Rule 1: Orphan elements (no relationships AND no trace links) ─────
    const elementsWithRels = new Set<string>();
    for (const r of ctx.relationships) {
      elementsWithRels.add(r.sourceElementId);
      elementsWithRels.add(r.targetElementId);
    }
    for (const t of ctx.traceLinks) {
      elementsWithRels.add(t.sourceElementId);
      elementsWithRels.add(t.targetElementId);
    }

    for (const el of ctx.elements) {
      if (!elementsWithRels.has(el.id) && el.parentId === null) {
        issues.push({
          id: nextId(),
          severity: "warning",
          rule: "orphan-element",
          message: `No relationships, trace links, or child decomposition`,
          elementId: el.id,
          elementName: el.name,
          elementType: el.type,
          layer: el.layer as LayerValue,
        });
      }
    }

    // ── Rule 2: Elements with empty names ──────────────────────────────────
    for (const el of ctx.elements) {
      if (!el.name.trim()) {
        issues.push({
          id: nextId(),
          severity: "error",
          rule: "empty-name",
          message: `Name is required`,
          elementId: el.id,
          elementName: el.name,
          elementType: el.type,
          layer: el.layer as LayerValue,
        });
      }
    }

    // ── Rule 3: Cross-layer trace link validation ──────────────────────────
    for (const trace of ctx.traceLinks) {
      const src = ctx.elements.find((e) => e.id === trace.sourceElementId);
      const tgt = ctx.elements.find((e) => e.id === trace.targetElementId);
      if (!src || !tgt) {
        issues.push({
          id: nextId(),
          severity: "error",
          rule: "dangling-trace",
          message: `References missing element`,
          elementId: src?.id ?? tgt?.id,
          elementName: src?.name ?? tgt?.name,
          elementType: src?.type ?? tgt?.type,
          layer: trace.sourceLayer as LayerValue,
        });
        continue;
      }

      const srcLayer = Layer.from(trace.sourceLayer);
      const tgtLayer = Layer.from(trace.targetLayer);

      if (trace.type === "Realization") {
        if (tgtLayer.order >= srcLayer.order) {
          issues.push({
            id: nextId(),
            severity: "error",
            rule: "realization-direction",
            message: `Realization must go from lower to higher abstraction`,
            elementId: src.id,
            elementName: src.name,
            elementType: src.type,
            layer: trace.sourceLayer as LayerValue,
          });
        }

        if (Math.abs(srcLayer.order - tgtLayer.order) !== 1) {
          issues.push({
            id: nextId(),
            severity: "warning",
            rule: "non-adjacent-realization",
            message: `Realization skips layers`,
            elementId: src.id,
            elementName: src.name,
            elementType: src.type,
            layer: trace.sourceLayer as LayerValue,
          });
        }
      }
    }

    // ── Rule 4: Layer completeness — SA should have at least one System ────
    const saElements = elementsByLayer.get("SA") ?? [];
    if (saElements.length > 0) {
      const hasSystem = saElements.some((e) => e.type === "System");
      if (!hasSystem) {
        issues.push({
          id: nextId(),
          severity: "info",
          rule: "missing-system",
          message: "System Analysis layer has no System element",
          layer: "SA",
        });
      }
    }

    // ── Rule 4b: EPBS should have at least one EPBSComponent ──────────────
    const epbsElements = elementsByLayer.get("EPBS") ?? [];
    if (epbsElements.length > 0) {
      const hasEPBSComponent = epbsElements.some(
        (e) => e.type === "EPBSComponent",
      );
      if (!hasEPBSComponent) {
        issues.push({
          id: nextId(),
          severity: "info",
          rule: "missing-epbs-component",
          message: "EPBS layer has no EPBS Component element",
          layer: "EPBS",
        });
      }
    }

    // ── Rule 5: Parent-child consistency ───────────────────────────────────
    const elementById = new Map(ctx.elements.map((e) => [e.id, e]));
    for (const el of ctx.elements) {
      if (el.parentId) {
        const parent = elementById.get(el.parentId);
        if (!parent) {
          issues.push({
            id: nextId(),
            severity: "error",
            rule: "missing-parent",
            message: `Parent does not exist`,
            elementId: el.id,
            elementName: el.name,
            elementType: el.type,
            layer: el.layer as LayerValue,
          });
        } else if (parent.layer !== el.layer) {
          issues.push({
            id: nextId(),
            severity: "error",
            rule: "cross-layer-parent",
            message: `Parent "${parent.name}" is in a different layer`,
            elementId: el.id,
            elementName: el.name,
            elementType: el.type,
            layer: el.layer as LayerValue,
          });
        }
      }
    }

    // ── Rule 6: Duplicate element names within same model+layer ────────────
    const namesSeen = new Map<string, string[]>();
    for (const el of ctx.elements) {
      const key = `${el.modelId}:${el.layer}:${el.name.toLowerCase()}`;
      const arr = namesSeen.get(key) ?? [];
      arr.push(el.id);
      namesSeen.set(key, arr);
    }
    for (const [, ids] of Array.from(namesSeen)) {
      if (ids.length > 1) {
        for (const id of ids) {
          const el = elementById.get(id);
          if (el) {
            issues.push({
              id: nextId(),
              severity: "warning",
              rule: "duplicate-name",
              message: `Duplicate name in this layer`,
              elementId: el.id,
              elementName: el.name,
              elementType: el.type,
              layer: el.layer as LayerValue,
            });
          }
        }
      }
    }

    return issues;
  }
}
