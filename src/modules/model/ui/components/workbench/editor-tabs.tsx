"use client";

import { cn } from "@/modules/shared/ui/libs/cn";
import { LayoutDashboard, X } from "lucide-react";
import { useWorkbenchStore } from "../../stores/workbench";

/**
 * EditorTabs
 *
 * نوار تب‌های مرورگرمانند برای ناحیه ویرایشگر.
 * هر تب یک دیاگرام باز است؛ تنها یک تب در هر زمان فعال است.
 */
export function EditorTabs() {
  const tabs = useWorkbenchStore((s) => s.tabs);
  const activeDiagramId = useWorkbenchStore((s) => s.activeDiagramId);
  const setActiveTab = useWorkbenchStore((s) => s.setActiveTab);
  const closeTab = useWorkbenchStore((s) => s.closeTab);

  if (tabs.length === 0) return null;

  return (
    <div className="flex h-9 shrink-0 items-stretch overflow-x-auto border-b bg-muted/40">
      {tabs.map((tab) => {
        const isActive = tab.diagramId === activeDiagramId;
        return (
          <div
            key={tab.diagramId}
            className={cn(
              "group flex min-w-36 max-w-56 cursor-pointer items-center gap-1.5 border-r px-3 text-xs transition-colors",
              isActive
                ? "bg-background text-foreground border-b-2 border-b-primary"
                : "text-muted-foreground hover:bg-background/60",
            )}
            onClick={() => setActiveTab(tab.diagramId)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setActiveTab(tab.diagramId);
            }}
            role="tab"
            tabIndex={0}
            aria-selected={isActive}
          >
            <LayoutDashboard className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{tab.name}</span>
            <span className="ms-auto text-[9px] uppercase text-muted-foreground/70">
              {tab.type}
            </span>
            <button
              type="button"
              className="ms-1 rounded-sm p-0.5 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.diagramId);
              }}
              aria-label={`Close ${tab.name}`}
            >
              <X className="size-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
