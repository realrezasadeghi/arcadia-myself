"use client";

import { Badge } from "@/modules/shared/ui/components/ui/badge";
import { Button } from "@/modules/shared/ui/components/ui/button";
import { Input } from "@/modules/shared/ui/components/ui/input";
import { Label } from "@/modules/shared/ui/components/ui/label";
import { Separator } from "@/modules/shared/ui/components/ui/separator";
import { Textarea } from "@/modules/shared/ui/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/shared/ui/components/ui/tooltip";
import {
  ArrowUp,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCreateClassEnumerationLiteral } from "../clients/create-class-enumeration-literal";
import { useCreateClassOperation } from "../clients/create-class-operation";
import { useCreateClassProperty } from "../clients/create-class-property";
import { useRemoveClassEnumerationLiteral } from "../clients/remove-class-enumeration-literal";
import { useRemoveClassOperation } from "../clients/remove-class-operation";
import { useRemoveClassProperty } from "../clients/remove-class-property";
import { useUpdateClassElement } from "../clients/update-class-element";
import { useUpdateClassRelationship } from "../clients/update-class-relationship";
import {
  CLASS_VISIBILITY_INFO,
  formatMultiplicity,
  getClassElementTypeInfo,
  getClassRelationshipTypeInfo,
} from "../constants/class-diagram";
import type {
  CanvasEdge,
  CanvasNode,
  ClassEdgeData,
  ClassNodeData,
} from "../stores/canvas";

// Simplified types matching the canvas store's ClassNodeData shape
type PropertyData = NonNullable<ClassNodeData["properties"]>[number];
type OperationData = NonNullable<ClassNodeData["operations"]>[number];
type LiteralData = NonNullable<ClassNodeData["enumerationLiterals"]>[number];

import { useCanvasStore } from "../stores/canvas";

type ClassNodePropertiesProps = {
  node: CanvasNode;
};

type ClassEdgePropertiesProps = {
  edge: CanvasEdge;
};

const STATUS_LABELS = {
  DRAFT: "Draft",
  VALIDATED: "Validated",
  DEPRECATED: "Deprecated",
} as const;

const STATUS_VARIANTS = {
  DRAFT: "secondary",
  VALIDATED: "default",
  DEPRECATED: "destructive",
} as const;

// ─── Class Node Properties ───────────────────────────────────────────────────

export function ClassNodeProperties({ node }: ClassNodePropertiesProps) {
  const data = node.data as ClassNodeData;
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description ?? "");

  const updateClassElement = useUpdateClassElement();
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);

  const typeInfo = getClassElementTypeInfo(data.elementType);

  useEffect(() => {
    setName(data.name);
    setDescription(data.description ?? "");
  }, [data]);

  const handleSave = useCallback(() => {
    updateClassElement.mutate(
      {
        name,
        id: data.elementId,
        modelId: data.modelId,
      },
      {
        onSuccess: () => {
          updateNodeData(data.elementId, {
            ...data,
            name,
            description,
          });
        },
        onError: ({ message }) => {
          toast.error(message || "Error saving changes");
        },
      },
    );
  }, [updateClassElement, name, description, data, updateNodeData]);

  const updateClassElementStatus = useCallback(
    (status: "DRAFT" | "VALIDATED" | "DEPRECATED") => {
      updateClassElement.mutate(
        { id: data.elementId, modelId: data.modelId, name: data.name },
        {
          onError({ message }) {
            toast.error(message || "Error updating status");
          },
        },
      );
    },
    [data, updateClassElement],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Type header */}
      <div className="flex items-center gap-2">
        <span
          className="size-4 shrink-0 rounded-sm border"
          style={{
            borderColor: typeInfo.color,
            backgroundColor: `${typeInfo.color}20`,
          }}
        />
        <span className="text-xs font-medium">{typeInfo.label}</span>
        {data.isAbstract && (
          <Badge variant="outline" className="text-[9px] px-1 py-0 italic">
            abstract
          </Badge>
        )}
        {data.isStatic && (
          <Badge variant="outline" className="text-[9px] px-1 py-0">
            static
          </Badge>
        )}
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Status:</span>
        <Badge
          variant={STATUS_VARIANTS[data.status]}
          className="text-xs px-1.5 py-0"
        >
          {STATUS_LABELS[data.status]}
        </Badge>
      </div>

      <Separator />

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs" htmlFor="class-name">
          Name
        </Label>
        <Input
          id="class-name"
          value={name}
          onBlur={handleSave}
          className="h-8 text-sm"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs" htmlFor="class-desc">
          Description
        </Label>
        <Textarea
          rows={3}
          id="class-desc"
          value={description}
          onBlur={handleSave}
          placeholder="Element description..."
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
        />
      </div>

      <Separator />

      {/* Properties (Attributes) */}
      <ClassPropertiesSection
        properties={data.properties ?? []}
        elementId={data.elementId}
        modelId={data.modelId}
        layer="LA"
        onUpdate={() => {
          // Refresh node data from store
          const current = useCanvasStore
            .getState()
            .nodes.find((n) => n.id === data.elementId);
          if (current) updateNodeData(data.elementId, { ...current.data });
        }}
      />

      {/* Operations */}
      <ClassOperationsSection
        operations={data.operations ?? []}
        elementId={data.elementId}
        modelId={data.modelId}
        layer="LA"
        onUpdate={() => {
          const current = useCanvasStore
            .getState()
            .nodes.find((n) => n.id === data.elementId);
          if (current) updateNodeData(data.elementId, { ...current.data });
        }}
      />

      {/* Enumeration Literals */}
      {data.elementType === "ENUM" && (
        <ClassEnumerationSection
          literals={data.enumerationLiterals ?? []}
          elementId={data.elementId}
          modelId={data.modelId}
          layer="LA"
          onUpdate={() => {
            const current = useCanvasStore
              .getState()
              .nodes.find((n) => n.id === data.elementId);
            if (current) updateNodeData(data.elementId, { ...current.data });
          }}
        />
      )}

      <Separator />

      {/* Quick Actions */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-muted-foreground">Quick Actions</p>
        <div className="flex flex-col gap-1">
          {data.status !== "VALIDATED" && (
            <Button
              size="sm"
              variant="ghost"
              disabled={updateClassElement.isPending}
              className="justify-start gap-2 h-7 text-xs"
              onClick={() => updateClassElementStatus("VALIDATED")}
            >
              {updateClassElement.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              )}
              Validate
            </Button>
          )}
          {data.status !== "DRAFT" && (
            <Button
              variant="ghost"
              size="sm"
              disabled={updateClassElement.isPending}
              className="justify-start gap-2 h-7 text-xs"
              onClick={() => updateClassElementStatus("DRAFT")}
            >
              <RotateCcw className="size-3.5 text-muted-foreground" />
              Revert to Draft
            </Button>
          )}
          {data.status !== "DEPRECATED" && (
            <Button
              size="sm"
              variant="ghost"
              disabled={updateClassElement.isPending}
              onClick={() => updateClassElementStatus("DEPRECATED")}
              className="justify-start gap-2 h-7 text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              Deprecate
            </Button>
          )}
        </div>
      </div>

      {updateClassElement.isPending && (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          Saving...
        </span>
      )}
    </div>
  );
}

// ─── Properties (Attributes) Section ─────────────────────────────────────────

function ClassPropertiesSection({
  properties,
  elementId,
  modelId,
  layer,
  onUpdate,
}: {
  properties: PropertyData[];
  elementId: string;
  modelId: string;
  layer: string;
  onUpdate: () => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const createProperty = useCreateClassProperty();
  const removeProperty = useRemoveClassProperty();

  useEffect(() => {
    if (isAdding) {
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [isAdding]);

  const handleAdd = useCallback(() => {
    if (!newName.trim()) return;
    createProperty.mutate(
      {
        classElementId: elementId,
        modelId,
        layer,
        name: newName.trim(),
        typeLiteral: newType.trim() || "String",
      },
      {
        onSuccess: () => {
          setNewName("");
          setNewType("");
          setIsAdding(false);
          onUpdate();
          toast.success("Attribute added");
        },
        onError: ({ message }) =>
          toast.error(message || "Error adding attribute"),
      },
    );
  }, [newName, newType, elementId, modelId, layer, createProperty, onUpdate]);

  const handleRemove = useCallback(
    (id: string) => {
      removeProperty.mutate(
        { id },
        {
          onSuccess: () => {
            onUpdate();
            toast.success("Attribute removed");
          },
          onError: ({ message }) =>
            toast.error(message || "Error removing attribute"),
        },
      );
    },
    [removeProperty, onUpdate],
  );

  const handleCancel = useCallback(() => {
    setIsAdding(false);
    setNewName("");
    setNewType("");
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Attributes</p>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] px-1.5 gap-1"
            onClick={() => setIsAdding(true)}
          >
            <span className="text-xs leading-none">+</span> Add
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <Label className="text-[10px] text-muted-foreground">Name</Label>
              <Input
                ref={nameInputRef}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="attributeName"
                className="h-7 text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newName.trim()) handleAdd();
                  if (e.key === "Escape") handleCancel();
                }}
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <Label className="text-[10px] text-muted-foreground">Type</Label>
              <Input
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="String"
                className="h-7 text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newName.trim()) handleAdd();
                  if (e.key === "Escape") handleCancel();
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] px-2"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-6 text-[10px] px-3"
              onClick={handleAdd}
              disabled={!newName.trim() || createProperty.isPending}
            >
              {createProperty.isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        {properties.length === 0 && !isAdding && (
          <p className="text-[10px] text-muted-foreground italic text-center py-1">
            No attributes
          </p>
        )}
        {properties.map((prop) => {
          const vis = CLASS_VISIBILITY_INFO[prop.visibility]?.symbol ?? "+";
          const mult = formatMultiplicity(
            prop.multiplicityLower,
            prop.multiplicityUpper,
          );
          return (
            <div
              key={prop.id}
              className="group flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono hover:bg-accent/50"
            >
              <span className="w-3 text-right text-muted-foreground">
                {vis}
              </span>
              {prop.isDerived && (
                <span className="text-muted-foreground/60">/</span>
              )}
              {prop.isStatic && (
                <span className="text-muted-foreground/60 underline">_</span>
              )}
              <span className="flex-1 truncate">{prop.name}</span>
              {prop.typeLiteral && (
                <span className="text-muted-foreground">
                  : {prop.typeLiteral}
                </span>
              )}
              {mult && <span className="text-muted-foreground/70">{mult}</span>}
              <button
                type="button"
                onClick={() => handleRemove(prop.id)}
                className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive transition-opacity"
                title="Remove attribute"
              >
                <Trash2 className="size-2.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Operations Section ──────────────────────────────────────────────────────

function ClassOperationsSection({
  operations,
  elementId,
  modelId,
  layer,
  onUpdate,
}: {
  operations: OperationData[];
  elementId: string;
  modelId: string;
  layer: string;
  onUpdate: () => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newReturnType, setNewReturnType] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const createOperation = useCreateClassOperation();
  const removeOperation = useRemoveClassOperation();

  useEffect(() => {
    if (isAdding) {
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [isAdding]);

  const handleAdd = useCallback(() => {
    if (!newName.trim()) return;
    createOperation.mutate(
      {
        classElementId: elementId,
        modelId,
        layer,
        name: newName.trim(),
        returnTypeLiteral: newReturnType.trim() || "void",
      },
      {
        onSuccess: () => {
          setNewName("");
          setNewReturnType("");
          setIsAdding(false);
          onUpdate();
          toast.success("Operation added");
        },
        onError: ({ message }) =>
          toast.error(message || "Error adding operation"),
      },
    );
  }, [
    newName,
    newReturnType,
    elementId,
    modelId,
    layer,
    createOperation,
    onUpdate,
  ]);

  const handleRemove = useCallback(
    (id: string) => {
      removeOperation.mutate(
        { id },
        {
          onSuccess: () => {
            onUpdate();
            toast.success("Operation removed");
          },
          onError: ({ message }) =>
            toast.error(message || "Error removing operation"),
        },
      );
    },
    [removeOperation, onUpdate],
  );

  const handleCancel = useCallback(() => {
    setIsAdding(false);
    setNewName("");
    setNewReturnType("");
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Operations</p>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] px-1.5 gap-1"
            onClick={() => setIsAdding(true)}
          >
            <span className="text-xs leading-none">+</span> Add
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <Label className="text-[10px] text-muted-foreground">Name</Label>
              <Input
                ref={nameInputRef}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="methodName"
                className="h-7 text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newName.trim()) handleAdd();
                  if (e.key === "Escape") handleCancel();
                }}
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <Label className="text-[10px] text-muted-foreground">Return Type</Label>
              <Input
                value={newReturnType}
                onChange={(e) => setNewReturnType(e.target.value)}
                placeholder="void"
                className="h-7 text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newName.trim()) handleAdd();
                  if (e.key === "Escape") handleCancel();
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] px-2"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-6 text-[10px] px-3"
              onClick={handleAdd}
              disabled={!newName.trim() || createOperation.isPending}
            >
              {createOperation.isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        {operations.length === 0 && !isAdding && (
          <p className="text-[10px] text-muted-foreground italic text-center py-1">
            No operations
          </p>
        )}
        {operations.map((op) => {
          const vis = CLASS_VISIBILITY_INFO[op.visibility]?.symbol ?? "+";
          const params =
            op.parameters
              ?.map((p) => `${p.name}: ${p.typeLiteral || "?"}`)
              .join(", ") ?? "";
          const ret = op.returnTypeLiteral ? `: ${op.returnTypeLiteral}` : "";
          return (
            <div
              key={op.id}
              className="group flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono hover:bg-accent/50"
            >
              <span className="w-3 text-right text-muted-foreground">
                {vis}
              </span>
              {op.isAbstract && (
                <span className="text-muted-foreground/60 italic">a</span>
              )}
              {op.isStatic && (
                <span className="text-muted-foreground/60 underline">_</span>
              )}
              <span className="flex-1 truncate">
                {op.name}({params}){ret}
              </span>
              {op.isQuery && (
                <span className="text-muted-foreground/70" title="Query">
                  ?
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(op.id)}
                className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive transition-opacity"
                title="Remove operation"
              >
                <Trash2 className="size-2.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Enumeration Literals Section ────────────────────────────────────────────

function ClassEnumerationSection({
  literals,
  elementId,
  modelId,
  layer,
  onUpdate,
}: {
  literals: LiteralData[];
  elementId: string;
  modelId: string;
  layer: string;
  onUpdate: () => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const createLiteral = useCreateClassEnumerationLiteral();
  const removeLiteral = useRemoveClassEnumerationLiteral();

  useEffect(() => {
    if (isAdding) {
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [isAdding]);

  const handleAdd = useCallback(() => {
    if (!newName.trim()) return;
    createLiteral.mutate(
      {
        classElementId: elementId,
        modelId,
        layer,
        name: newName.trim(),
      },
      {
        onSuccess: () => {
          setNewName("");
          setIsAdding(false);
          onUpdate();
          toast.success("Literal added");
        },
        onError: ({ message }) =>
          toast.error(message || "Error adding literal"),
      },
    );
  }, [newName, elementId, modelId, layer, createLiteral, onUpdate]);

  const handleRemove = useCallback(
    (id: string) => {
      removeLiteral.mutate(
        { id },
        {
          onSuccess: () => {
            onUpdate();
            toast.success("Literal removed");
          },
          onError: ({ message }) =>
            toast.error(message || "Error removing literal"),
        },
      );
    },
    [removeLiteral, onUpdate],
  );

  const handleCancel = useCallback(() => {
    setIsAdding(false);
    setNewName("");
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          Enumeration Literals
        </p>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] px-1.5 gap-1"
            onClick={() => setIsAdding(true)}
          >
            <span className="text-xs leading-none">+</span> Add
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] text-muted-foreground">Name</Label>
            <Input
              ref={nameInputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="LITERAL_NAME"
              className="h-7 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newName.trim()) handleAdd();
                if (e.key === "Escape") handleCancel();
              }}
            />
          </div>
          <div className="flex justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px] px-2"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-6 text-[10px] px-3"
              onClick={handleAdd}
              disabled={!newName.trim() || createLiteral.isPending}
            >
              {createLiteral.isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        {literals.length === 0 && !isAdding && (
          <p className="text-[10px] text-muted-foreground italic text-center py-1">
            No literals
          </p>
        )}
        {literals.map((lit) => (
          <div
            key={lit.id}
            className="group flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono hover:bg-accent/50"
          >
            <span className="flex-1 truncate">{lit.name}</span>
            {lit.value && (
              <span className="text-muted-foreground">= {lit.value}</span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(lit.id)}
              className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive transition-opacity"
              title="Remove literal"
            >
              <Trash2 className="size-2.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Class Edge Properties ───────────────────────────────────────────────────

export function ClassEdgeProperties({ edge }: ClassEdgePropertiesProps) {
  const data = edge.data as ClassEdgeData;
  const [name, setName] = useState(data.name ?? "");
  const [description, setDescription] = useState(data.description ?? "");
  const [aggregationKind, setAggregationKind] = useState(
    data.aggregationKind ?? "NONE",
  );
  const [sourceMultLower, setSourceMultLower] = useState(
    String(data.sourceMultiplicityLower ?? 1),
  );
  const [sourceMultUpper, setSourceMultUpper] = useState(
    data.sourceMultiplicityUpper ?? "1",
  );
  const [targetMultLower, setTargetMultLower] = useState(
    String(data.targetMultiplicityLower ?? 1),
  );
  const [targetMultUpper, setTargetMultUpper] = useState(
    data.targetMultiplicityUpper ?? "1",
  );
  const [sourceRole, setSourceRole] = useState(data.sourceRole ?? "");
  const [targetRole, setTargetRole] = useState(data.targetRole ?? "");

  const selectNode = useCanvasStore((s) => s.selectNode);
  const updateEdgeData = useCanvasStore((s) => s.updateEdgeData);
  const updateClassRelationship = useUpdateClassRelationship();

  const sourceNode = useCanvasStore((s) =>
    s.nodes.find((n) => n.id === edge.source),
  );
  const targetNode = useCanvasStore((s) =>
    s.nodes.find((n) => n.id === edge.target),
  );

  useEffect(() => {
    setName(data.name ?? "");
    setDescription(data.description ?? "");
    setAggregationKind(data.aggregationKind ?? "NONE");
    setSourceMultLower(String(data.sourceMultiplicityLower ?? 1));
    setSourceMultUpper(data.sourceMultiplicityUpper ?? "1");
    setTargetMultLower(String(data.targetMultiplicityLower ?? 1));
    setTargetMultUpper(data.targetMultiplicityUpper ?? "1");
    setSourceRole(data.sourceRole ?? "");
    setTargetRole(data.targetRole ?? "");
  }, [data]);

  const relTypeInfo = getClassRelationshipTypeInfo(data.relationshipType);
  const isAssociation = data.relationshipType === "ASSOCIATION";

  const handleSave = useCallback(() => {
    const payload: any = {
      modelId: data.modelId,
      id: edge.id,
      name: name?.trim() || undefined,
    };
    if (isAssociation) {
      payload.aggregationKind = aggregationKind;
      payload.sourceMultiplicityLower = Number(sourceMultLower) || 1;
      payload.sourceMultiplicityUpper = sourceMultUpper || "1";
      payload.targetMultiplicityLower = Number(targetMultLower) || 1;
      payload.targetMultiplicityUpper = targetMultUpper || "1";
      payload.sourceRole = sourceRole;
      payload.targetRole = targetRole;
    }
    updateClassRelationship.mutate(payload, {
      onSuccess: () => {
        updateEdgeData(edge.id, {
          name,
          description,
          aggregationKind,
          sourceMultiplicityLower: Number(sourceMultLower) || 1,
          sourceMultiplicityUpper: sourceMultUpper,
          targetMultiplicityLower: Number(targetMultLower) || 1,
          targetMultiplicityUpper: targetMultUpper,
          sourceRole,
          targetRole,
        } as any);
      },
      onError: ({ message }) => {
        toast.error(message || "Error saving relationship");
      },
    });
  }, [
    edge,
    name,
    description,
    data,
    aggregationKind,
    sourceMultLower,
    sourceMultUpper,
    targetMultLower,
    targetMultUpper,
    sourceRole,
    targetRole,
    isAssociation,
    updateClassRelationship,
    updateEdgeData,
  ]);

  return (
    <div className="flex flex-col gap-4">
      {/* Source → Relationship → Target */}
      <div className="flex flex-col items-center gap-1.5 text-xs">
        {sourceNode ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="link" onClick={() => selectNode(sourceNode.id)}>
                {sourceNode.data.name}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Source element</TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-muted-foreground">Unknown source</span>
        )}

        <ArrowUp className="h-3 w-3 shrink-0 text-muted-foreground" />

        <Badge
          variant="outline"
          className="px-1.5 py-0 text-[10px] gap-1 shrink-0"
        >
          <span
            className="h-1.5 w-3 rounded-full"
            style={{ backgroundColor: relTypeInfo.strokeColor }}
          />
          {relTypeInfo.label}
        </Badge>

        <ArrowUp className="h-3 w-3 shrink-0 text-muted-foreground" />

        {targetNode ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="link" onClick={() => selectNode(targetNode.id)}>
                {targetNode.data.name}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Target element</TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-muted-foreground">Unknown target</span>
        )}
      </div>

      <Separator />

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs" htmlFor="class-edge-name">
          Name
        </Label>
        <Input
          id="class-edge-name"
          value={name}
          onBlur={handleSave}
          className="h-8 text-sm"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs" htmlFor="class-edge-desc">
          Description
        </Label>
        <Textarea
          rows={3}
          id="class-edge-desc"
          value={description}
          onBlur={handleSave}
          className="text-sm"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Association-specific fields */}
      {isAssociation && (
        <>
          <Separator />
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground">
              Association Details
            </p>

            {/* Aggregation Kind */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px]">Aggregation</Label>
              <select
                value={aggregationKind}
                onChange={(e) =>
                  setAggregationKind(e.target.value as typeof aggregationKind)
                }
                onBlur={handleSave}
                className="h-7 rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="NONE">None</option>
                <option value="SHARED">Shared (hollow diamond)</option>
                <option value="COMPOSITE">Composite (filled diamond)</option>
              </select>
            </div>

            {/* Multiplicities */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <Label className="text-[10px]">Source [lower]</Label>
                <Input
                  value={sourceMultLower}
                  onChange={(e) => setSourceMultLower(e.target.value)}
                  onBlur={handleSave}
                  className="h-7 text-[10px]"
                  placeholder="1"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[10px]">Source [upper]</Label>
                <Input
                  value={sourceMultUpper}
                  onChange={(e) => setSourceMultUpper(e.target.value)}
                  onBlur={handleSave}
                  className="h-7 text-[10px]"
                  placeholder="1"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[10px]">Target [lower]</Label>
                <Input
                  value={targetMultLower}
                  onChange={(e) => setTargetMultLower(e.target.value)}
                  onBlur={handleSave}
                  className="h-7 text-[10px]"
                  placeholder="1"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[10px]">Target [upper]</Label>
                <Input
                  value={targetMultUpper}
                  onChange={(e) => setTargetMultUpper(e.target.value)}
                  onBlur={handleSave}
                  className="h-7 text-[10px]"
                  placeholder="1"
                />
              </div>
            </div>

            {/* Role Names */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <Label className="text-[10px]">Source role</Label>
                <Input
                  value={sourceRole}
                  onChange={(e) => setSourceRole(e.target.value)}
                  onBlur={handleSave}
                  className="h-7 text-[10px]"
                  placeholder="role name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[10px]">Target role</Label>
                <Input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  onBlur={handleSave}
                  className="h-7 text-[10px]"
                  placeholder="role name"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {updateClassRelationship.isPending && (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          Saving...
        </span>
      )}
    </div>
  );
}
