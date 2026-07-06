"use client";

import { LayoutTemplate } from "lucide-react";
import { useWorkbenchStore } from "../../stores/workbench";
import { isScenarioDiagramType } from "../../helpers/diagram";
import { DiagramCanvasClient } from "../diagram-canvas-client";
import { ScenarioCanvasClient } from "../scenario-canvas-client";
import { ScenarioToolbar } from "../scenario-toolbar";
import { EditorTabs } from "./editor-tabs";
import { EditorToolbar } from "./editor-toolbar";

/**
 * EditorArea
 *
 * ناحیه مرکزی Workbench: نوار ابزار + تب‌ها + canvas دیاگرام فعال.
 * فقط تب فعال mount می‌شود؛ تعویض تب باعث flush ذخیره معلق می‌شود
 * (از طریق useSaveManager در DiagramCanvasInner).
 */
export function EditorArea() {
  const tabs = useWorkbenchStore((s) => s.tabs);
  const activeDiagramId = useWorkbenchStore((s) => s.activeDiagramId);

  const activeTab = tabs.find((t) => t.diagramId === activeDiagramId) ?? null;
  const isScenario = activeTab ? isScenarioDiagramType(activeTab.type) : false;

  return (
    <div className="flex h-full min-h-0 flex-col bg-muted/20">
      {activeTab && (
        isScenario ? <ScenarioToolbar /> : <EditorToolbar tab={activeTab} />
      )}
      <EditorTabs />

      <div className="relative min-h-0 flex-1">
        {activeTab ? (
          isScenario ? (
            <ScenarioCanvasClient
              key={activeTab.diagramId}
              diagramId={activeTab.diagramId}
              modelId={activeTab.modelId}
            />
          ) : (
            <DiagramCanvasClient
              key={activeTab.diagramId}
              diagramId={activeTab.diagramId}
              modelId={activeTab.modelId}
            />
          )
        ) : (
          <EditorEmptyState />
        )}
      </div>
    </div>
  );
}

function EditorEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
      <LayoutTemplate className="size-12 opacity-20" />
      <div className="text-center">
        <p className="text-sm font-medium">No diagram open</p>
        <p className="text-xs text-muted-foreground/70">
          Double-click a diagram in the Project Explorer to open it
        </p>
      </div>
    </div>
  );
}
