"use server";

import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { resolveRelationshipLabel } from "../../domain/relationships/resolve-label";
import type { DiagramTypeValue } from "../../domain/value-objects/diagram-type";
import type { ElementTypeValue } from "../../domain/value-objects/element-type";
import type { LayerValue } from "../../domain/value-objects/layer";
import type { RelationshipTypeValue } from "../../domain/value-objects/relationship-type";
import { getDiagramsByModelId } from "./get-diagrams-by-model-id";
import { getElementById } from "./get-element-by-id";
import { getElementsByModelId } from "./get-elements-by-model-id";
import { getRelationshipsByModelId } from "./get-relationships-by-model-id";
import { getTraceLinksByElementsId } from "./get-trace-links-by-element-id";

export type ElementRelationItem = {
  id: string;
  relationshipType: RelationshipTypeValue;
  direction: "outgoing" | "incoming";
  otherElementId: string;
  otherElementName: string;
  otherElementType: ElementTypeValue;
  displayLabel: string;
};

export type ElementTraceItem = {
  id: string;
  traceType: string;
  direction: "outgoing" | "incoming";
  otherElementId: string;
  otherElementName?: string;
  otherElementType?: ElementTypeValue;
  otherLayer: LayerValue;
  displayLabel: string;
};

export type ElementDiagramRef = {
  id: string;
  name: string;
  type: DiagramTypeValue;
};

export type GetElementRelationsResponse = {
  element: {
    id: string;
    name: string;
    type: ElementTypeValue;
    modelId: string;
  };
  relationships: ElementRelationItem[];
  traceLinks: ElementTraceItem[];
  diagrams: ElementDiagramRef[];
};

/**
 * getElementRelations
 *
 * تمام روابط یک المنت را تجمیع می‌کند: روابط درون‌لایه (FunctionalExchange و …)،
 * trace linkها (Realization/Allocation/…)، و دیاگرام‌هایی که المنت در آن‌ها ظاهر می‌شود.
 *
 * این یک action تجمیع‌کننده‌ی read-only است که روی server actions موجود سوار می‌شود.
 * معادل REST آن: `GET /api/elements/:id/relations`.
 * (در صورت نیاز به کارایی بالاتر، می‌توان آن را به یک use-case اختصاصی منتقل کرد.)
 */
export async function getElementRelations(
  elementId: string,
): Promise<IRes<GetElementRelationsResponse>> {
  try {
    if (!elementId) throw new Error("Element id is required.");

    const elementRes = await getElementById(elementId);
    if (!elementRes.success) throw new Error(elementRes.message);

    const element = elementRes.data;
    const modelId = element.modelId;

    const [elementsRes, relationshipsRes, traceLinksRes, diagramsRes] =
      await Promise.all([
        getElementsByModelId(modelId),
        getRelationshipsByModelId(modelId),
        getTraceLinksByElementsId(elementId),
        getDiagramsByModelId(modelId),
      ]);

    const elementsById = new Map(
      (elementsRes.data ?? []).map((el) => [el.id, el]),
    );

    const relationships: ElementRelationItem[] = (relationshipsRes.data ?? [])
      .filter(
        (rel) =>
          rel.sourceElementId === elementId ||
          rel.targetElementId === elementId,
      )
      .map((rel) => {
        const outgoing = rel.sourceElementId === elementId;
        const otherId = outgoing ? rel.targetElementId : rel.sourceElementId;
        const other = elementsById.get(otherId);
        const otherName = other?.name ?? "Unknown";
        return {
          id: rel.id,
          relationshipType: rel.type,
          direction: outgoing ? "outgoing" : "incoming",
          otherElementId: otherId,
          otherElementName: otherName,
          otherElementType: (other?.type ?? "System") as ElementTypeValue,
          displayLabel: resolveRelationshipLabel({
            sourceName: outgoing ? element.name : otherName,
            targetName: outgoing ? otherName : element.name,
            value: rel.type,
          }),
        };
      });

    // resolve counterpart names for trace links (may live in another model/layer)
    const traceLinksRaw = traceLinksRes.data ?? [];
    const counterpartIds = Array.from(
      new Set(
        traceLinksRaw.map((t) =>
          t.sourceElementId === elementId
            ? t.targetElementId
            : t.sourceElementId,
        ),
      ),
    );
    const counterpartEntries = await Promise.all(
      counterpartIds.map(async (id) => {
        const local = elementsById.get(id);
        if (local) {
          return [id, { name: local.name, type: local.type }] as const;
        }
        const res = await getElementById(id);
        return [
          id,
          res.success
            ? { name: res.data.name, type: res.data.type }
            : undefined,
        ] as const;
      }),
    );
    const counterpartElements = new Map(counterpartEntries);

    const traceLinks: ElementTraceItem[] = traceLinksRaw.map((t) => {
      const outgoing = t.sourceElementId === elementId;
      const otherId = outgoing ? t.targetElementId : t.sourceElementId;
      const otherName = counterpartElements.get(otherId)?.name;
      return {
        id: t.id,
        traceType: t.type,
        direction: outgoing ? "outgoing" : "incoming",
        otherElementId: otherId,
        otherElementName: otherName,
        otherElementType: counterpartElements.get(otherId)?.type as
          | ElementTypeValue
          | undefined,
        otherLayer: outgoing ? t.targetLayer : t.sourceLayer,
        displayLabel: resolveRelationshipLabel({
          sourceName: outgoing ? element.name : (otherName ?? "Unknown"),
          targetName: outgoing ? (otherName ?? "Unknown") : element.name,
          value: t.type,
        }),
      };
    });

    const diagrams: ElementDiagramRef[] = (diagramsRes.data ?? [])
      .filter((d) => d.elementLayouts.some((l) => l.elementId === elementId))
      .map((d) => ({ id: d.id, name: d.name, type: d.type }));

    return ok({
      element: {
        id: element.id,
        name: element.name,
        type: element.type as ElementTypeValue,
        modelId,
      },
      relationships,
      traceLinks,
      diagrams,
    });
  } catch (error) {
    return fail(error);
  }
}
