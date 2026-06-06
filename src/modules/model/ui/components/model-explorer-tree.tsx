"use client";

import { cn } from "@/modules/shared/ui/libs/cn";
import {
  ChevronDown,
  ChevronLeft,
  HardDrive,
  LayoutDashboard,
  Monitor,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { getElementTypeInfo, getElementVisual } from "../helpers/element";
import { getLayerInfo } from "../helpers/layer";
import type { Diagram } from "../types/diagram";
import type { Element, ElementTypeValue } from "../types/element";
import type { LayerValue } from "../types/layer";
import type { Model } from "../types/model";

// ─── Types ──────────────────────────────────────────────────────────────────

type ModelDataItem = {
  model: Model;
  elements: Element[];
  diagrams: Diagram[];
};

type ModelExplorerTreeProps = {
  modelData: ModelDataItem[];
  currentDiagramId?: string;
  projectId: string;
};

// ─── Element icon map ───────────────────────────────────────────────────────

const ELEMENT_ICONS: Partial<Record<ElementTypeValue, LucideIcon>> = {
  Mission: Monitor,
  OperationalEntity: Users,
  OperationalActor: User,
  System: Monitor,
  SystemActor: User,
  LogicalActor: User,
  PhysicalActor: User,
  PhysicalNode: HardDrive,
  PhysicalComponent: HardDrive,
};

function getElemIcon(type: ElementTypeValue): LucideIcon {
  return ELEMENT_ICONS[type] ?? Monitor;
}

// ─── Element tree builder ───────────────────────────────────────────────────

type ElementTreeNode = {
  id: string;
  name: string;
  type: ElementTypeValue;
  children: ElementTreeNode[];
};

function buildElementTree(elements: Element[]): ElementTreeNode[] {
  const map = new Map<string, ElementTreeNode>();
  const roots: ElementTreeNode[] = [];

  for (const el of elements) {
    map.set(el.id, { id: el.id, name: el.name, type: el.type, children: [] });
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

// ─── Layer fold colors ──────────────────────────────────────────────────────

const LAYER_COLORS: Record<LayerValue, string> = {
  OA: "#2E86C1",
  SA: "#CA6F1E",
  LA: "#1E8449",
  PA: "#6C3483",
};

const LAYER_BG_COLORS: Record<LayerValue, string> = {
  OA: "hover:bg-blue-50 dark:hover:bg-blue-950/30",
  SA: "hover:bg-amber-50 dark:hover:bg-amber-950/30",
  LA: "hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
  PA: "hover:bg-purple-50 dark:hover:bg-purple-950/30",
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function ElementTreeItem({
  node,
  depth,
  projectId,
}: {
  node: ElementTreeNode;
  depth: number;
  projectId: string;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children.length > 0;

  const ElementIcon = getElemIcon(node.type);
  const visual = getElementVisual(node.type);
  const typeInfo = getElementTypeInfo(node.type);

  return (
    <div>
      <button
        type="button"
        onClick={() => hasChildren && setOpen(!open)}
        className={cn(
          "flex w-full items-center gap-1 rounded-sm px-2 py-1 text-xs text-left transition-colors hover:bg-muted",
        )}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
      >
        <span className="shrink-0 size-3.5 flex items-center justify-center">
          {hasChildren ? (
            open ? (
              <ChevronDown className="size-3 text-muted-foreground" />
            ) : (
              <ChevronLeft className="size-3 text-muted-foreground" />
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
        <span className="text-[9px] text-muted-foreground shrink-0">
          {typeInfo.label}
        </span>
      </button>
      {hasChildren && open && (
        <div>
          {node.children.map((child) => (
            <ElementTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              projectId={projectId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DiagramTreeItem({
  diagram,
  projectId,
  isCurrent,
}: {
  diagram: Diagram;
  projectId: string;
  isCurrent: boolean;
}) {
  return (
    <Link
      href={`/dashboard/project/${projectId}/diagram/${diagram.id}`}
      className={cn(
        "flex w-full items-center gap-1 rounded-sm px-2 py-1 text-xs text-left transition-colors",
        "hover:bg-muted",
        isCurrent && "bg-muted font-medium text-primary",
      )}
      style={{ paddingLeft: "26px" }}
    >
      <LayoutDashboard className="size-3 shrink-0 text-muted-foreground" />
      <span className="truncate flex-1 text-left">{diagram.name}</span>
      <span className="text-[9px] text-muted-foreground shrink-0">
        {diagram.type}
      </span>
    </Link>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export function ModelExplorerTree({
  modelData,
  currentDiagramId,
  projectId,
}: ModelExplorerTreeProps) {
  const [openModels, setOpenModels] = useState<Set<string>>(
    () => new Set(modelData.map((m) => m.model.id)),
  );

  const [openElements, setOpenElements] = useState(true);
  const [openDiagrams, setOpenDiagrams] = useState(true);

  const toggleModel = useCallback((id: string) => {
    setOpenModels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const sorted = [...modelData].sort(
    (a, b) => getLayerInfo(a.model.layer).order - getLayerInfo(b.model.layer).order,
  );

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-2 px-4 py-8 text-muted-foreground">
        <Monitor className="size-8 opacity-30" />
        <p className="text-xs">No models defined</p>
      </div>
    );
  }

  return (
    <div className="py-1">
      {sorted.map(({ model, elements, diagrams }) => {
        const layerInfo = getLayerInfo(model.layer);
        const color = LAYER_COLORS[model.layer];
        const hoverBg = LAYER_BG_COLORS[model.layer];
        const isOpen = openModels.has(model.id);
        const tree = buildElementTree(elements);

        return (
          <div key={model.id} className="mb-0.5">
            <button
              type="button"
              onClick={() => toggleModel(model.id)}
              className={cn(
                "flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs font-medium text-left transition-colors",
                hoverBg,
              )}
            >
              <span className="shrink-0 size-4 flex items-center justify-center">
                {isOpen ? (
                  <ChevronDown className="size-3.5" />
                ) : (
                  <ChevronLeft className="size-3.5" />
                )}
              </span>
              <span
                className="size-2 shrink-0 rounded-sm"
                style={{ backgroundColor: color }}
              />
              <span className="truncate flex-1 text-left">
                {layerInfo.label}
              </span>
              <span className="text-[10px] text-muted-foreground shrink-0">
                {model.layer}
              </span>
            </button>

            {isOpen && (
              <div className="ml-2">
                {/* Elements section */}
                {tree.length > 0 && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setOpenElements(!openElements)}
                      className={cn(
                        "flex w-full items-center gap-1 rounded-sm px-2 py-1 text-[10px] text-muted-foreground text-left transition-colors hover:bg-muted",
                      )}
                      style={{ paddingLeft: "26px" }}
                    >
                      {openElements ? (
                        <ChevronDown className="size-2.5 shrink-0" />
                      ) : (
                        <ChevronLeft className="size-2.5 shrink-0" />
                      )}
                      <Users className="size-3 shrink-0" />
                      <span>Elements ({tree.length})</span>
                    </button>
                    {openElements && (
                      <div>
                        {tree.map((node) => (
                          <ElementTreeItem
                            key={node.id}
                            node={node}
                            depth={1}
                            projectId={projectId}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Diagrams section */}
                {diagrams.length > 0 && (
                  <div className="mt-0.5">
                    <button
                      type="button"
                      onClick={() => setOpenDiagrams(!openDiagrams)}
                      className={cn(
                        "flex w-full items-center gap-1 rounded-sm px-2 py-1 text-[10px] text-muted-foreground text-left transition-colors hover:bg-muted",
                      )}
                      style={{ paddingLeft: "26px" }}
                    >
                      {openDiagrams ? (
                        <ChevronDown className="size-2.5 shrink-0" />
                      ) : (
                        <ChevronLeft className="size-2.5 shrink-0" />
                      )}
                      <LayoutDashboard className="size-3 shrink-0" />
                      <span>Diagrams ({diagrams.length})</span>
                    </button>
                    {openDiagrams && (
                      <div>
                        {diagrams.map((diagram) => (
                          <DiagramTreeItem
                            key={diagram.id}
                            diagram={diagram}
                            projectId={projectId}
                            isCurrent={diagram.id === currentDiagramId}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
