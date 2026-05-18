"use client";

import { Badge } from "@/modules/shared/ui/components/ui/badge";
import { Button } from "@/modules/shared/ui/components/ui/button";
import { Input } from "@/modules/shared/ui/components/ui/input";
import { Label } from "@/modules/shared/ui/components/ui/label";
import { Separator } from "@/modules/shared/ui/components/ui/separator";
import { Textarea } from "@/modules/shared/ui/components/ui/textarea";
import {
  Archive,
  CheckCircle2,
  GitMerge,
  Loader2,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { useGetTraceLinksByElementId } from "../clients/get-trace-links-by-element-id";
import { useRemoveTraceLink } from "../clients/remove-trace-link";
import { useUpdateElement } from "../clients/update-element";
import { getElementTypeInfo } from "../helpers/element";
import { getLayerInfo } from "../helpers/layer";
import {
  getEdgeVisual,
  getRelationshipTypeInfo,
} from "../helpers/relationship";
import { getTraceLinkTypeInfo, getTraceVisual } from "../helpers/trace-link";
import {
  type CanvasEdge,
  type CanvasNode,
  type ElementNodeData,
  useCanvasStore,
} from "../stores/canvas";
import { CreateTraceLinkDialog } from "./create-trace-link-dialog";
import { ElementShape } from "./element-shape";

type DiagramPropertiesPanelProps = {
  params: Promise<{ id: string }>;
};

export function DiagramPropertiesPanel({
  params,
}: DiagramPropertiesPanelProps) {
  const { id: projectId } = use(params);

  const node = useCanvasStore(
    useShallow((state) =>
      state.nodes.find((node) => node.id === state.selectedNodeId),
    ),
  );

  const edge = useCanvasStore(
    useShallow((state) =>
      state.edges.find((edge) => edge.id === state.selectedEdgeId),
    ),
  );

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-card overflow-y-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-card border-b px-3 py-2.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          مشخصات
        </p>
        <Button size="icon" variant="ghost" className="size-6">
          <X className="size-3.5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {node && (
          <>
            <NodeProperties projectId={projectId} node={node} />
            <TraceLinksList elementId={node?.data.elementId} />
          </>
        )}
        {edge && <EdgeProperties edge={edge} />}
      </div>
    </aside>
  );
}

type NodeProperties = {
  projectId: string;
  node: CanvasNode;
};

const ELEMENT_STATUS_LABELS = {
  DRAFT: "پیش‌نویس",
  VALIDATED: "اعتبارسنجی‌شده",
  DEPRECATED: "منسوخ",
} as const;

const ELEMENT_STATUS_VARIANTS = {
  DRAFT: "secondary",
  VALIDATED: "default",
  DEPRECATED: "destructive",
} as const;

function NodeProperties({ projectId, node }: NodeProperties) {
  const [name, setName] = useState(node?.data.name);
  const [description, setDescription] = useState(node?.data.description);
  const [traceDialogOpen, setTraceDialogOpen] = useState(false);

  const updateElement = useUpdateElement();

  const elementType = useMemo(
    () => getElementTypeInfo(node.data.elementType),
    [node.data.elementType],
  );

  useEffect(() => {
    setName(node.data.name);
    setDescription(node.data.description);
  }, [node.data]);

  const updateNodeData = useCanvasStore((state) => state.updateNodeData);

  const updateElementStatus = useCallback(
    (status: ElementNodeData["status"]) => {
      updateElement.mutate(
        {
          name: node.data.name,
          id: node.data.elementId,
          properties: { status },
        },
        {
          onError({ message }) {
            toast.error(message || "خطا در بروزرسانی وضعیت المنت");
          },
        },
      );
    },
    [node.data, updateElement],
  );

  const handleSave = useCallback(() => {
    updateElement.mutate(
      {
        name,
        description,
        id: node.data.elementId,
      },
      {
        onSuccess: ({ data }) => {
          updateNodeData(data.id, {
            ...node.data,
            name: data.name,
            description: data.description,
          });
        },
        onError: ({ message }) => {
          toast.error(message || "خطا در ذخیره تغییرات");
        },
      },
    );
  }, [updateElement, name, description, updateNodeData, node.data]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <ElementShape label={elementType.labelFa} type={elementType.value} />

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">وضعیت:</span>
          <Badge
            className="text-xs px-1.5 py-0"
            variant={ELEMENT_STATUS_VARIANTS[node.data.status]}
          >
            {ELEMENT_STATUS_LABELS[node.data.status]}
          </Badge>
        </div>

        <Separator />

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs" htmlFor="name">
            نام
          </Label>
          <Input
            value={name}
            onBlur={handleSave}
            className="h-8 text-sm"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description" className="text-xs">
            توضیحات
          </Label>
          <Textarea
            rows={3}
            value={description}
            onBlur={handleSave}
            placeholder="توضیح المنت ..."
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
          />
        </div>

        <Separator />

        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-muted-foreground">عملیات سریع</p>
          <div className="flex flex-col gap-1">
            {node.data.status !== "VALIDATED" && (
              <Button
                size="sm"
                variant="ghost"
                disabled={updateElement.isPending}
                className="justify-start gap-2 h-7 text-xs"
                onClick={() => updateElementStatus("VALIDATED")}
              >
                {updateElement.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                )}
                اعتبارسنجی
              </Button>
            )}
            {node.data.status !== "DRAFT" && (
              <Button
                variant="ghost"
                size="sm"
                disabled={updateElement.isPending}
                className="justify-start gap-2 h-7 text-xs"
                onClick={() => updateElementStatus("DRAFT")}
              >
                <RotateCcw className="size-3.5 text-muted-foreground" />
                بازگشت به پیش‌نویس
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="justify-start gap-2 h-7 text-xs"
              onClick={() => setTraceDialogOpen(true)}
            >
              <GitMerge className="size-3.5 text-primary" />
              افزودن Trace Link
            </Button>
            {node.data.status !== "DEPRECATED" && (
              <Button
                size="sm"
                variant="ghost"
                disabled={updateElement.isPending}
                onClick={() => updateElementStatus("DEPRECATED")}
                className="justify-start gap-2 h-7 text-xs text-destructive hover:text-destructive"
              >
                <Archive className="size-3.5" />
                منسوخ کردن
              </Button>
            )}
          </div>
        </div>

        <Separator />
      </div>
      <CreateTraceLinkDialog
        open={traceDialogOpen}
        onOpenChange={setTraceDialogOpen}
        projectId={projectId}
        sourceElementId={node.data.elementId}
        sourceElementType={node.data.elementType}
        sourceLayerType={getElementTypeInfo(node.data.elementType).layer}
      />
    </>
  );
}

type EdgeProperties = {
  edge: CanvasEdge;
};

function EdgeProperties({ edge }: EdgeProperties) {
  const relType = getRelationshipTypeInfo(
    edge?.data?.relationshipType as string,
  );

  const spec = getEdgeVisual(relType.value);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className="h-1 w-6 rounded-full"
          style={{ backgroundColor: spec.strokeColor }}
        />
        <span className="text-xs text-muted-foreground">{relType.labelFa}</span>
      </div>
      {edge?.data?.name && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">نام</p>
          <p className="text-sm font-medium">{edge.data.name}</p>
        </div>
      )}
    </div>
  );
}

export type TraceLinksListProps = {
  elementId: string;
};

export const TraceLinksList = ({ elementId }: TraceLinksListProps) => {
  const { data: traceLinks, isLoading: isGetTraceLinksLoading } =
    useGetTraceLinksByElementId(elementId);

  const removeTraceLink = useRemoveTraceLink();

  const handleDelete = useCallback(
    (payload: {
      id: string;
      sourceElementId: string;
      targetElementId: string;
    }) => {
      removeTraceLink.mutate(payload, {
        onError: ({ message }) => {
          toast.error(message || "خطا در حذف Trace Link");
        },
      });
    },
    [removeTraceLink],
  );

  if (isGetTraceLinksLoading) {
    return (
      <div className="flex justify-center py-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!traceLinks?.length) {
    return (
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          هیچ trace ای تعریف نشده است.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground">Trace Links</p>

      <div className="flex flex-col gap-1.5">
        {traceLinks.map((trace) => {
          const isSource = trace.sourceElementId === elementId;
          const traceSpec = getTraceVisual(trace.type);
          const traceInfo = getTraceLinkTypeInfo(trace.type);
          const otherLayer = getLayerInfo(
            isSource ? trace.targetLayer : trace.sourceLayer,
          );

          return (
            <div
              key={trace.id}
              className="flex items-start gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1.5"
            >
              <span
                className="mt-0.5 size-2 shrink-0 rounded-full"
                style={{ backgroundColor: traceSpec.strokeColor }}
              />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-xs font-medium">{traceInfo.labelFa}</p>
                <p className="text-[10px] text-muted-foreground">
                  {isSource ? "→" : "←"} {otherLayer.labelFa}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                loading={removeTraceLink.isPending}
                onClick={() =>
                  handleDelete({
                    id: trace.id,
                    sourceElementId: trace.sourceElementId,
                    targetElementId: trace.targetElementId,
                  })
                }
                className="size-5 shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
