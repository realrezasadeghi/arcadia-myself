"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/modules/shared/ui/components/ui/breadcrumb";
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
  Home,
  PanelBottom,
  PanelLeft,
  PanelRight,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { resolveDiagramLayer } from "../../helpers/diagram";
import {
  type PanelVisibility,
  useWorkbenchStore,
} from "../../stores/workbench";
import type {
  ClassDiagramData,
  ClassElementData,
} from "../../types/class-diagram";
import type { Diagram } from "../../types/diagram";
import type { Element } from "../../types/element";
import type { LayerValue } from "../../types/layer";
import type { Model } from "../../types/model";
import { ArcadiaInfoModal } from "../arcadia-info-modal";
import { EditorArea } from "./editor-area";
import { ExplorerPanel } from "./explorer-panel";
import { LayerSwitcher } from "./layer-switcher";
import { OutlinePanel } from "./outline-panel";
import { PalettePanel } from "./palette-panel";
import { PropertiesPanel } from "./properties-panel";
import { SemanticBrowserPanel } from "./semantic-browser-panel";
import { ValidationPanel } from "./validation-panel";

export type WorkbenchModelData = {
  model: Model;
  /** Merged arch + class elements (backward-compatible) */
  elements: Element[];
  /** Merged arch + class diagrams (backward-compatible) */
  diagrams: Diagram[];
  /** Architecture-only elements */
  archElements: Element[];
  /** Class diagram elements (raw ClassElementData) */
  classElements: ClassElementData[];
  /** Architecture-only diagrams */
  archDiagrams: Diagram[];
  /** Scenario diagrams (OIS, SS, LS, PS) */
  scenarioDiagrams: Diagram[];
  /** Class diagrams (CDB) */
  classDiagrams: Diagram[];
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
  const openTab = useWorkbenchStore((s) => s.openTab);
  const resetForProject = useWorkbenchStore((s) => s.resetForProject);
  const currentLayer = useWorkbenchStore((s) => s.currentLayer);
  const setCurrentLayer = useWorkbenchStore((s) => s.setCurrentLayer);

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
          layer: resolveDiagramLayer(diagram.type, model.layer),
        });

        break;
      }
    }
  }, [deepLinkDiagramId, modelData, openTab]);

  const handleLayerChange = (layer: LayerValue, modelId: string) => {
    setCurrentLayer(layer);

    const layerData = modelData.find((d) => d.model.layer === layer);
    if (layerData && layerData.diagrams.length > 0) {
      const diagram = layerData.diagrams[0];
      openTab({
        diagramId: diagram.id,
        modelId: layerData.model.id,
        name: diagram.name,
        type: diagram.type,
        layer: resolveDiagramLayer(diagram.type, layerData.model.layer),
      });
    }
  };

  const allModels = modelData.map((d) => d.model);

  const refreshTree = () => router.refresh();

  const showRightDock = panels.outline || panels.semantic || panels.validation;

  return (
    <ReactFlowProvider>
      <div className="flex h-full min-h-0 flex-col bg-background">
        <WorkbenchMenuBar projectName={projectName} />

        <LayerSwitcher
          models={allModels}
          currentLayer={currentLayer}
          onLayerChange={handleLayerChange}
        />

        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-0 flex-1"
        >
          {panels.explorer && (
            <>
              <ResizablePanel
                id="explorer"
                defaultSize={300}
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
                    minSize={100}
                    maxSize={400}
                    defaultSize={300}
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
                    minSize={100}
                    maxSize={400}
                    defaultSize={200}
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
  const openPanels: Array<"outline" | "semantic" | "validation"> = [];
  if (panels.outline) openPanels.push("outline");
  if (panels.semantic) openPanels.push("semantic");
  if (panels.validation) openPanels.push("validation");

  if (openPanels.length === 0) return null;

  if (openPanels.length === 1) {
    if (openPanels[0] === "outline") return <OutlinePanel />;
    if (openPanels[0] === "semantic") return <SemanticBrowserPanel />;
    return <ValidationPanel />;
  }

  return (
    <ResizablePanelGroup orientation="vertical">
      {openPanels.includes("outline") && (
        <ResizablePanel id="outline" defaultSize={500}>
          <OutlinePanel />
        </ResizablePanel>
      )}

      {openPanels.includes("outline") &&
        (openPanels.includes("semantic") ||
          openPanels.includes("validation")) && <ResizeHandle />}

      {openPanels.includes("semantic") && (
        <ResizablePanel id="semantic">
          <SemanticBrowserPanel />
        </ResizablePanel>
      )}

      {openPanels.includes("semantic") && openPanels.includes("validation") && (
        <ResizeHandle />
      )}

      {openPanels.includes("validation") && (
        <ResizablePanel id="validation">
          <ValidationPanel />
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  );
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
  const projectId = useWorkbenchStore((s) => s.projectId);
  const togglePanel = useWorkbenchStore((s) => s.togglePanel);

  const toggles: {
    key: keyof PanelVisibility;
    label: string;
    icon: typeof PanelLeft;
  }[] = [
    { key: "explorer", label: "Project Explorer", icon: PanelLeft },
    { key: "properties", label: "Properties", icon: PanelBottom },
    { key: "outline", label: "Outline", icon: PanelRight },
    { key: "semantic", label: "Semantic Browser", icon: Workflow },
    { key: "validation", label: "Validation", icon: ShieldCheck },
  ];

  return (
    <div className="flex h-9 shrink-0 items-center gap-2 border-b bg-muted/40 px-3">
      <Breadcrumb className="flex-1 min-w-0">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/project">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/dashboard/project/${projectId}`}>
                {projectName}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-1">
        <ArcadiaInfoModal />
        <div className="w-px h-4 bg-border mx-1" />
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
