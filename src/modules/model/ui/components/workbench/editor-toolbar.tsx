"use client";

import { ChevronRight } from "lucide-react";
import { getLayerInfo } from "../../helpers/layer";
import { useWorkbenchStore } from "../../stores/workbench";
import type { EditorTab } from "../../stores/workbench";
import { DiagramToolbarActions } from "../diagram-toolbar-actions";

type EditorToolbarProps = {
  tab: EditorTab;
};

/**
 * EditorToolbar
 *
 * نوار ابزار بالای canvas فعال: breadcrumb + اکشن‌های دیاگرام
 * (undo/redo/delete/export/zoom). از DiagramToolbarActions موجود استفاده می‌کند.
 */
export function EditorToolbar({ tab }: EditorToolbarProps) {
  const projectName = useWorkbenchStore((s) => s.projectName) ?? "Project";
  const layer = getLayerInfo(tab.layer);

  return (
    <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
      <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
        <span className="truncate font-medium text-foreground">
          {projectName}
        </span>
        <ChevronRight className="size-3 shrink-0" />
        <span className="truncate">{layer.label}</span>
        <ChevronRight className="size-3 shrink-0" />
        <span className="truncate font-medium text-foreground">{tab.name}</span>
      </div>

      <DiagramToolbarActions
        layer={tab.layer}
        projectName={projectName}
        diagramName={tab.name}
      />
    </div>
  );
}
