"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/modules/shared/ui/components/ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/shared/ui/components/ui/tooltip";
import { cn } from "@/modules/shared/ui/libs/cn";
import { ReactFlowProvider } from "@xyflow/react";
import {
  Columns2,
  PanelBottom,
  PanelLeft,
  PanelRight,
  Workflow,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { getDiagramLayer } from "../../helpers/diagram";
import {
  type PanelVisibility,
  useWorkbenchStore,
} from "../../stores/workbench";
import type { Diagram } from "../../types/diagram";
import type { Element } from "../../types/element";
import type { Model } from "../../types/model";
import { EditorArea } from "./editor-area";
import { ExplorerPanel } from "./explorer-panel";
import { OutlinePanel } from "./outline-panel";
import { PalettePanel } from "./palette-panel";
import { PropertiesPanel } from "./properties-panel";
import { SemanticBrowserPanel } from "./semantic-browser-panel";

export type WorkbenchModelData = {
  model: Model;
  elements: Element[];
  diagrams: Diagram[];
};

export type WorkbenchProps = {
  projectId: string;
  projectName: string;
  modelData: WorkbenchModelData[];
};

export function Workbench({
  projectId,
  projectName,
  modelData,
}: WorkbenchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const panels = useWorkbenchStore((s) => s.panels);
  const currentProjectId = useWorkbenchStore((s) => s.projectId);
  const resetForProject = useWorkbenchStore((s) => s.resetForProject);
  const openTab = useWorkbenchStore((s) => s.openTab);

  useEffect(() => {
    if (currentProjectId !== projectId) {
      resetForProject(projectId, projectName);
    }
  }, [projectId, projectName, currentProjectId, resetForProject]);

  const deepLinkDiagramId = searchParams.get("diagram");
  const openedDeepLinkRef = useRef<string | null>(null);

  useEffect(() => {
    if (!deepLinkDiagramId) return;
    if (openedDeepLinkRef.current === deepLinkDiagramId) return;

    for (const { model, diagrams } of modelData) {
      const diagram = diagrams.find((d) => d.id === deepLinkDiagramId);

      if (diagram) {
        openedDeepLinkRef.current = deepLinkDiagramId;

        openTab({
          diagramId: diagram.id,
          modelId: model.id,
          name: diagram.name,
          type: diagram.type,
          layer: getDiagramLayer(diagram.type),
        });

        break;
      }
    }
  }, [deepLinkDiagramId, modelData, openTab]);

  const refreshTree = () => router.refresh();

  const showRightDock = panels.outline || panels.semantic;

  return (
    <ReactFlowProvider>
      <div className="flex h-full min-h-0 flex-col bg-background">
        <WorkbenchMenuBar projectName={projectName} />

        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-0 flex-1"
        >
          {panels.explorer && (
            <>
              <ResizablePanel
                id="explorer"
                defaultSize={100}
                minSize={100}
                maxSize={400}
                collapsible
                className="min-w-0"
              >
                <ExplorerPanel
                  projectId={projectId}
                  modelData={modelData}
                  onTreeChanged={refreshTree}
                />
              </ResizablePanel>

              <ResizeHandle />
            </>
          )}

          <ResizablePanel id="center" minSize={30} className="min-w-0">
            <ResizablePanelGroup orientation="vertical" className="min-h-0">
              <ResizablePanel id="editor-row" minSize={30} className="min-h-0">
                <ResizablePanelGroup
                  orientation="horizontal"
                  className="min-h-0"
                >
                  <ResizablePanel id="canvas" minSize={40} className="min-w-0">
                    <EditorArea />
                  </ResizablePanel>

                  <ResizeHandle />

                  <ResizablePanel
                    id="palette"
                    defaultSize={100}
                    minSize={100}
                    maxSize={300}
                    className="min-w-0"
                  >
                    <PalettePanel />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>

              {panels.properties && (
                <>
                  <ResizeHandle />

                  <ResizablePanel
                    id="properties"
                    defaultSize={100}
                    minSize={100}
                    maxSize={400}
                    collapsible
                    className="min-h-0"
                  >
                    <PropertiesPanel projectId={projectId} />
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>

          {showRightDock && (
            <>
              <ResizeHandle />

              <ResizablePanel
                id="right-dock"
                defaultSize={100}
                minSize={100}
                maxSize={300}
                collapsible
                className="min-w-0"
              >
                <RightDock panels={panels} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </ReactFlowProvider>
  );
}

function RightDock({ panels }: { panels: PanelVisibility }) {
  if (panels.outline && panels.semantic) {
    return (
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel id="outline" minSize={20}>
          <OutlinePanel />
        </ResizablePanel>

        <ResizeHandle />

        <ResizablePanel id="semantic" minSize={20}>
          <SemanticBrowserPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  if (panels.outline) {
    return <OutlinePanel />;
  }

  return <SemanticBrowserPanel />;
}

function ResizeHandle({ className }: { className?: string }) {
  return (
    <ResizableHandle
      withHandle
      className={cn(
        "bg-border transition-colors hover:bg-primary/40 data-resize-handle-active:bg-primary",
        className,
      )}
    />
  );
}

function WorkbenchMenuBar({ projectName }: { projectName: string }) {
  const panels = useWorkbenchStore((s) => s.panels);
  const togglePanel = useWorkbenchStore((s) => s.togglePanel);

  const toggles: Array<{
    key: keyof PanelVisibility;
    label: string;
    icon: typeof PanelLeft;
  }> = [
    { key: "explorer", label: "Project Explorer", icon: PanelLeft },
    { key: "properties", label: "Properties", icon: PanelBottom },
    { key: "outline", label: "Outline", icon: PanelRight },
    { key: "semantic", label: "Semantic Browser", icon: Workflow },
  ];

  return (
    <div className="flex h-9 shrink-0 items-center gap-2 border-b bg-muted/40 px-3">
      <Columns2 className="size-4 text-primary" />

      <span className="text-xs font-semibold tracking-wide text-foreground">
        {projectName}
      </span>

      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        Capella Workbench
      </span>

      <div className="ms-auto flex items-center gap-0.5">
        {toggles.map(({ key, label, icon: Icon }) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => togglePanel(key)}
                className={cn(
                  "flex size-7 items-center justify-center rounded-md transition-colors",
                  panels[key]
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted",
                )}
                aria-pressed={panels[key]}
                aria-label={`Toggle ${label}`}
              >
                <Icon className="size-4" />
              </button>
            </TooltipTrigger>

            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
