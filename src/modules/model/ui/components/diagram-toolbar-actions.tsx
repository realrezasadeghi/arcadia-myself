"use client";

import { useReactFlow } from "@xyflow/react";
import {
  Download,
  LayoutGrid,
  Maximize2,
  Redo2,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { Button } from "@/modules/shared/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/shared/ui/components/ui/dropdown-menu";
import { Separator } from "@/modules/shared/ui/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/shared/ui/components/ui/tooltip";
import { getLayerInfo } from "../helpers/layer";
import { useClassDiagramLayout } from "../hooks/use-class-diagram-layout";
import { useDiagramExport } from "../hooks/use-diagram-export";
import { useRemoveElementSync } from "../hooks/use-remove-element";
import { useRemoveRelationshipSync } from "../hooks/use-remove-relationship";
import { useCanvasStore } from "../stores/canvas";
import type { LayerValue } from "../types/layer";
import { SaveStatusIndicator } from "./save-status-indicator";

type DiagramToolbarActionsProps = {
  layer: LayerValue;
  projectName: string;
  diagramName: string;
};

export function DiagramToolbarActions({
  projectName,
  diagramName,
  layer,
}: DiagramToolbarActionsProps) {
  const { selectedNodeId, selectedEdgeId, canUndo, canRedo, undo, redo } =
    useCanvasStore();

  const { removeElement, isPending: isRemoveElementPending } =
    useRemoveElementSync();

  const { removeRelationship, isPending: isRemoveRelationshipPending } =
    useRemoveRelationshipSync();

  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const { applyLayout } = useClassDiagramLayout();

  const { exportHtml, exportJson } = useDiagramExport({
    diagramName,
    projectName,
    layer: getLayerInfo(layer),
  });

  const hasSelection = useMemo(
    () => selectedNodeId || selectedEdgeId,
    [selectedNodeId, selectedEdgeId],
  );

  const handleDelete = useCallback(() => {
    if (selectedNodeId) {
      removeElement(selectedNodeId);
    } else if (selectedEdgeId) {
      removeRelationship(selectedEdgeId);
    }
  }, [selectedNodeId, selectedEdgeId, removeElement, removeRelationship]);

  return (
    <div className="flex items-center gap-2">
      <SaveStatusIndicator />

      <Separator orientation="vertical" className="h-5 w-0.5" />

      {/* Undo */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={undo}
            disabled={!canUndo}
          >
            <Undo2 className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
      </Tooltip>

      {/* Redo */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={redo}
            disabled={!canRedo}
          >
            <Redo2 className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-5 w-0.5" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={handleDelete}
            disabled={!hasSelection}
            loading={isRemoveElementPending || isRemoveRelationshipPending}
          >
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete selected (Delete)</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-5 w-0.5" />

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <Download className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Export</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={exportJson}>
            Download JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportHtml}>Print / PDF</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-5 w-0.5" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => zoomIn()}
          >
            <ZoomIn className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zoom in</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={() => zoomOut()}
          >
            <ZoomOut className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zoom out</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={() => fitView()}
          >
            <Maximize2 className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Fit view</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-5 w-0.5" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={applyLayout}
            title="Auto-arrange class diagram"
          >
            <LayoutGrid className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Auto Layout</TooltipContent>
      </Tooltip>
    </div>
  );
}
