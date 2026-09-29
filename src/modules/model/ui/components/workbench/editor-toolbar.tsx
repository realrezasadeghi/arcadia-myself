"use client";

import type { EditorTab } from "../../stores/workbench";
import { useWorkbenchStore } from "../../stores/workbench";
import { DiagramToolbarActions } from "../diagram-toolbar-actions";

type EditorToolbarProps = {
  tab: EditorTab;
};

/**
 * EditorToolbar
 *
 * نوار ابزار بالای canvas فعال: عنوان دیاگرام فعال + اکشن‌های دیاگرام
 * (undo/redo/delete/export/zoom). مسیر کامل (breadcrumb) در navbar بالای
 * workbench نمایش داده می‌شود.
 */
export function EditorToolbar({ tab }: EditorToolbarProps) {
  const projectName = useWorkbenchStore((s) => s.projectName) ?? "Project";

  return (
    <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
      <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
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
