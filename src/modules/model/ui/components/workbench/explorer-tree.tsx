"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/modules/shared/ui/components/ui/context-menu";
import { cn } from "@/modules/shared/ui/libs/cn";
import {
  Activity,
  Box,
  Boxes,
  ChevronDown,
  ChevronRight,
  FilePlus2,
  Folder,
  GitBranchPlus,
  HardDrive,
  Layers,
  LayoutDashboard,
  Link,
  type LucideIcon,
  Monitor,
  Pencil,
  Plus,
  Target,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { LAYERS } from "../../constants/layer";
import {
  getElementTypesForLayer,
  getElementVisual,
} from "../../helpers/element";
import { getDiagramPalette } from "../../helpers/diagram";
import { getLayerInfo } from "../../helpers/layer";
import { useWorkbenchStore } from "../../stores/workbench";
import type { Diagram } from "../../types/diagram";
import type {
  Element,
  ElementStatus,
  ElementTypeValue,
} from "../../types/element";
import type { LayerValue } from "../../types/layer";
import type { Model } from "../../types/model";

// ─── Element icon map ─────────────────────────────────────────────────────────

const ELEMENT_ICONS: Partial<Record<ElementTypeValue | string, LucideIcon>> = {
  Mission: Monitor,
  OperationalEntity: Users,
  OperationalActor: User,
  System: Monitor,
  SystemActor: User,
  LogicalActor: User,
  PhysicalActor: User,
  PhysicalNode: HardDrive,
  PhysicalComponent: HardDrive,
  EPBSArchitecture: Boxes,
  ConfigurationItem: Boxes,
  ConfigurationItemPart: Box,
  ConfigurationItemInterface: Link,
  // Class diagram types
  CLASS: Box,
  INTERFACE: Link,
  ENUM: Boxes,
  DATA_TYPE: Boxes,
  PRIMITIVE: Boxes,
  COLLECTION: Boxes,
  UNION: Boxes,
  PACKAGE: Folder,
  GROUP: Folder,
};

function getElemIcon(type: ElementTypeValue | string): LucideIcon {
  return ELEMENT_ICONS[type] ?? Monitor;
}

const LAYER_COLORS: Record<LayerValue, string> = {
  OA: "#2E86C1",
  SA: "#CA6F1E",
  LA: "#1E8449",
  PA: "#6C3483",
  EPBS: "#E74C3C",
};

// ─── Element tree builder ───────────────────────────────────────────────────

type ElementTreeNode = {
  id: string;
  name: string;
  type: ElementTypeValue | string;
  status: ElementStatus;
  description?: string;
  children: ElementTreeNode[];
  /** Present when this is a class diagram element */
  modelId?: string;
};

function buildElementTree(elements: Element[]): ElementTreeNode[] {
  const map = new Map<string, ElementTreeNode>();
  const roots: ElementTreeNode[] = [];

  for (const el of elements) {
    map.set(el.id, {
      id: el.id,
      name: el.name,
      type: el.type,
      status: el.status,
      description: el.description,
      modelId: (el as any).modelId,
      children: [],
    });
  }

  for (const el of elements) {
    const node = map.get(el.id)!;
    if (el.status === "DEPRECATED") continue;
    if (el.parentId && map.has(el.parentId)) {
      map.get(el.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots.sort((a, b) => a.name.localeCompare(b.name));
}

// ─── Handlers contract ──────────────────────────────────────────────────────

export type ExplorerHandlers = {
  onOpenDiagram: (model: Model, diagram: Diagram) => void;
  onSelectElement: (elementId: string) => void;
  onNewDiagram: (model: Model) => void;
  onNewElement: (model: Model, type: ElementTypeValue) => void;
  onEditDiagram: (model: Model, diagram: Diagram) => void;
  onDeleteElement: (element: ElementTreeNode) => void;
  onDeleteDiagram: (diagram: Diagram) => void;
  onTransition: (model: Model) => void;
  onAddElementToDiagram: (element: ElementTreeNode, diagram: Diagram) => void;
  diagrams?: Diagram[];
};

type ModelDataItem = {
  model: Model;
  elements: Element[];
  diagrams: Diagram[];
};

type ExplorerTreeProps = {
  modelData: ModelDataItem[];
  handlers: ExplorerHandlers;
  existingLayers: Set<LayerValue>;
  onNewModel: (layer: LayerValue) => void;
};

// ─── Typed folders (Capella-style) ──────────────────────────────────────────

type CategoryFolder = {
  key: string;
  label: string;
  icon: LucideIcon;
  match: (type: ElementTypeValue | string) => boolean;
};

const CATEGORY_FOLDERS: CategoryFolder[] = [
  {
    key: "actors",
    label: "Actors & Entities",
    icon: Users,
    match: (t) => t.endsWith("Actor") || t.endsWith("Entity"),
  },
  {
    key: "functions",
    label: "Functions & Activities",
    icon: Activity,
    match: (t) => t.endsWith("Function") || t.endsWith("Activity"),
  },
  {
    key: "components",
    label: "Components & Nodes",
    icon: Boxes,
    match: (t) =>
      t.endsWith("Component") || t === "System" || t === "PhysicalNode",
  },
  {
    key: "capabilities",
    label: "Capabilities",
    icon: Target,
    match: (t) => t.endsWith("Capability"),
  },
  {
    key: "class-elements",
    label: "Class Diagram Elements",
    icon: Box,
    match: (t) =>
      ["CLASS", "INTERFACE", "ENUM", "DATA_TYPE", "PRIMITIVE", "COLLECTION", "UNION", "PACKAGE", "GROUP"].includes(t),
  },
  // catch-all — Mission, OperationalProcess, FunctionPort, …
  { key: "other", label: "Other", icon: Folder, match: () => true },
];

/** ریشه‌های درخت را به پوشه‌های نوع‌محور (Capella-style) دسته‌بندی می‌کند. */
function categorizeRoots(
  roots: ElementTreeNode[],
): Array<CategoryFolder & { nodes: ElementTreeNode[] }> {
  const buckets = CATEGORY_FOLDERS.map((f) => ({
    ...f,
    nodes: [] as ElementTreeNode[],
  }));
  for (const node of roots) {
    const bucket =
      buckets.find((b) => b.match(node.type)) ?? buckets[buckets.length - 1];
    bucket.nodes.push(node);
  }
  return buckets.filter((b) => b.nodes.length > 0);
}

function FolderSection({
  folder,
  handlers,
}: {
  folder: CategoryFolder & { nodes: ElementTreeNode[] };
  handlers: ExplorerHandlers;
}) {
  const [open, setOpen] = useState(true);
  const Icon = folder.icon;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1 rounded-sm px-2 py-1 text-[10px] text-muted-foreground text-left transition-colors hover:bg-muted"
        style={{ paddingLeft: "26px" }}
      >
        {open ? (
          <ChevronDown className="size-2.5 shrink-0" />
        ) : (
          <ChevronRight className="size-2.5 shrink-0" />
        )}
        <Icon className="size-3 shrink-0" />
        <span>
          {folder.label} ({folder.nodes.length})
        </span>
      </button>
      {open &&
        folder.nodes.map((node) => (
          <ElementTreeItem
            key={node.id}
            node={node}
            depth={2}
            handlers={handlers}
          />
        ))}
    </div>
  );
}

// ─── Element tree item ──────────────────────────────────────────────────────

function ElementTreeItem({
  node,
  depth,
  handlers,
}: {
  node: ElementTreeNode;
  depth: number;
  handlers: ExplorerHandlers;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children.length > 0;
  const selectedElementId = useWorkbenchStore((s) => s.selectedElementId);

  const ElementIcon = getElemIcon(node.type);
  const visual = getElementVisual(node.type);
  const isSelected = selectedElementId === node.id;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/explorer-element", JSON.stringify({
      elementId: node.id,
      elementType: node.type,
      name: node.name,
      status: node.status,
      description: node.description ?? "",
    }));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button
            type="button"
            draggable
            onDragStart={handleDragStart}
            onClick={() => {
              handlers.onSelectElement(node.id);
              if (hasChildren) setOpen((v) => !v);
            }}
            className={cn(
              "flex w-full items-center gap-1 rounded-sm px-2 py-1 text-xs text-left transition-colors hover:bg-muted cursor-grab active:cursor-grabbing",
              isSelected && "bg-primary/10 text-primary",
            )}
            style={{ paddingLeft: `${12 + depth * 14}px` }}
          >
            <span className="shrink-0 size-3.5 flex items-center justify-center">
              {hasChildren ? (
                open ? (
                  <ChevronDown className="size-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="size-3 text-muted-foreground" />
                )
              ) : (
                <span
                  className="size-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: visual.strokeColor }}
                />
              )}
            </span>
            <ElementIcon
              className="size-3.5 shrink-0"
              style={{ color: visual.strokeColor }}
            />
            <span className="truncate flex-1 text-left">{node.name}</span>
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>{node.name}</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Plus className="size-3.5" />
              Add to Diagram
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {handlers.diagrams?.map((diagram) => {
                const palette = getDiagramPalette(diagram.type);
                const isAllowed = palette.elementTypes.includes(node.type);
                return (
                  <ContextMenuItem
                    key={diagram.id}
                    disabled={!isAllowed}
                    onSelect={() =>
                      handlers.onAddElementToDiagram(node, diagram)
                    }
                  >
                    <LayoutDashboard className="size-3.5" />
                    <span className="flex-1">{diagram.name}</span>
                    {!isAllowed && (
                      <span className="text-[9px] text-muted-foreground">
                        {diagram.type}
                      </span>
                    )}
                  </ContextMenuItem>
                );
              })}
              {(!handlers.diagrams || handlers.diagrams.length === 0) && (
                <ContextMenuItem disabled>
                  <span className="text-muted-foreground">
                    No diagrams in this layer
                  </span>
                </ContextMenuItem>
              )}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem
            variant="destructive"
            onSelect={() => handlers.onDeleteElement(node)}
          >
            <Trash2 className="size-3.5" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {hasChildren && open && (
        <div>
          {node.children.map((child) => (
            <ElementTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              handlers={handlers}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Diagram tree item ──────────────────────────────────────────────────────

function DiagramTreeItem({
  model,
  diagram,
  handlers,
}: {
  model: Model;
  diagram: Diagram;
  handlers: ExplorerHandlers;
}) {
  const activeDiagramId = useWorkbenchStore((s) => s.activeDiagramId);
  const isActive = activeDiagramId === diagram.id;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          type="button"
          onDoubleClick={() => handlers.onOpenDiagram(model, diagram)}
          className={cn(
            "flex w-full items-center gap-1 rounded-sm px-2 py-1 text-xs text-left transition-colors hover:bg-muted",
            isActive && "bg-muted font-medium text-primary",
          )}
          style={{ paddingLeft: "26px" }}
        >
          <LayoutDashboard className="size-3 shrink-0 text-muted-foreground" />
          <span className="truncate flex-1 text-left">{diagram.name}</span>
          <span className="text-[9px] text-muted-foreground shrink-0">
            {diagram.type}
          </span>
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>{diagram.name}</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={() => handlers.onOpenDiagram(model, diagram)}
        >
          <LayoutDashboard className="size-3.5" />
          Open
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={() => handlers.onEditDiagram(model, diagram)}
        >
          <Pencil className="size-3.5" />
          Rename / Edit…
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          variant="destructive"
          onSelect={() => handlers.onDeleteDiagram(diagram)}
        >
          <Trash2 className="size-3.5" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

// ─── Model node ─────────────────────────────────────────────────────────────

function ModelNode({
  data,
  handlers,
}: {
  data: ModelDataItem;
  handlers: ExplorerHandlers;
}) {
  const { model, elements, diagrams } = data;
  const [isOpen, setIsOpen] = useState(true);
  const [openDiagrams, setOpenDiagrams] = useState(true);
  const [openClassDiagrams, setOpenClassDiagrams] = useState(true);

  const layerInfo = getLayerInfo(model.layer);
  const color = LAYER_COLORS[model.layer];
  const tree = buildElementTree(elements);
  const folders = categorizeRoots(tree);
  const elementTypes = getElementTypesForLayer(model.layer);
  const canTransition = model.layer !== "EPBS";
  const nextLayerLabel = getNextLayerLabel(model.layer);

  // Separate architecture diagrams from class diagrams
  const archDiagrams = diagrams.filter((d) => d.type !== "CDB");
  const classDiagrams = diagrams.filter((d) => d.type === "CDB");

  return (
    <div className="mb-0.5" data-layer={model.layer}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs font-medium text-left transition-colors hover:bg-muted"
          >
            <span className="shrink-0 size-4 flex items-center justify-center">
              {isOpen ? (
                <ChevronDown className="size-3.5" />
              ) : (
                <ChevronRight className="size-3.5" />
              )}
            </span>
            <span
              className="size-2 shrink-0 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <span className="truncate flex-1 text-left">{layerInfo.label}</span>
            <span className="text-[10px] text-muted-foreground shrink-0">
              {model.layer}
            </span>
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>{layerInfo.label}</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem onSelect={() => handlers.onNewDiagram(model)}>
            <FilePlus2 className="size-3.5" />
            New Diagram…
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Plus className="size-3.5" />
              New Element
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {elementTypes.map((et) => (
                <ContextMenuItem
                  key={et.value}
                  onSelect={() => handlers.onNewElement(model, et.value)}
                >
                  <span
                    className="size-2.5 shrink-0 rounded-sm border"
                    style={{
                      borderColor: getElementVisual(et.value).strokeColor,
                      backgroundColor: getElementVisual(et.value).fillColor,
                    }}
                  />
                  {et.label}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
          {canTransition && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem onSelect={() => handlers.onTransition(model)}>
                <GitBranchPlus className="size-3.5" />
                Transition to {nextLayerLabel}…
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>

      {isOpen && (
        <div className="ml-2">
          {folders.map((folder) => (
            <FolderSection
              key={folder.key}
              folder={folder}
              handlers={handlers}
            />
          ))}

          {/* Architecture Diagrams */}
          {archDiagrams.length > 0 && (
            <div className="mt-0.5">
              <button
                type="button"
                onClick={() => setOpenDiagrams(!openDiagrams)}
                className="flex w-full items-center gap-1 rounded-sm px-2 py-1 text-[10px] text-muted-foreground text-left transition-colors hover:bg-muted"
                style={{ paddingLeft: "26px" }}
              >
                {openDiagrams ? (
                  <ChevronDown className="size-2.5 shrink-0" />
                ) : (
                  <ChevronRight className="size-2.5 shrink-0" />
                )}
                <LayoutDashboard className="size-3 shrink-0" />
                <span>Architecture Diagrams ({archDiagrams.length})</span>
              </button>
              {openDiagrams &&
                archDiagrams.map((diagram) => (
                  <DiagramTreeItem
                    key={diagram.id}
                    model={model}
                    diagram={diagram}
                    handlers={handlers}
                  />
                ))}
            </div>
          )}

          {/* Class Diagrams (CDB) */}
          {classDiagrams.length > 0 && (
            <div className="mt-0.5">
              <button
                type="button"
                onClick={() => setOpenClassDiagrams(!openClassDiagrams)}
                className="flex w-full items-center gap-1 rounded-sm px-2 py-1 text-[10px] text-muted-foreground text-left transition-colors hover:bg-muted"
                style={{ paddingLeft: "26px" }}
              >
                {openClassDiagrams ? (
                  <ChevronDown className="size-2.5 shrink-0" />
                ) : (
                  <ChevronRight className="size-2.5 shrink-0" />
                )}
                <Box className="size-3 shrink-0" />
                <span>Class Diagrams ({classDiagrams.length})</span>
              </button>
              {openClassDiagrams &&
                classDiagrams.map((diagram) => (
                  <DiagramTreeItem
                    key={diagram.id}
                    model={model}
                    diagram={diagram}
                    handlers={handlers}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getNextLayerLabel(layer: LayerValue): string {
  const order: LayerValue[] = ["OA", "SA", "LA", "PA", "EPBS"];
  const idx = order.indexOf(layer);
  const next = order[idx + 1];
  return next ? getLayerInfo(next).label : "";
}

// ─── Tree root ──────────────────────────────────────────────────────────────

export function ExplorerTree({
  modelData,
  handlers,
  existingLayers,
  onNewModel,
}: ExplorerTreeProps) {
  const sorted = [...modelData].sort(
    (a, b) =>
      getLayerInfo(a.model.layer).order - getLayerInfo(b.model.layer).order,
  );

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
        <Layers className="size-8 text-muted-foreground/30" />
        <div className="space-y-1">
          <p className="text-sm font-medium">No models yet</p>
          <p className="text-xs text-muted-foreground">
            Create an analysis layer to start adding diagrams and elements.
          </p>
        </div>
        <div className="flex w-full flex-col gap-1.5 pt-1">
          {LAYERS.map((layer) => (
            <button
              key={layer.value}
              type="button"
              disabled={existingLayers.has(layer.value)}
              onClick={() => onNewModel(layer.value)}
              className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-muted disabled:opacity-50"
            >
              <span
                className="size-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: LAYER_COLORS[layer.value] }}
              />
              <span className="flex-1">{layer.label}</span>
              <Plus className="size-3.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-1">
      {sorted.map((data) => (
        <ModelNode key={data.model.id} data={data} handlers={handlers} />
      ))}
    </div>
  );
}

export type { ElementTreeNode };
