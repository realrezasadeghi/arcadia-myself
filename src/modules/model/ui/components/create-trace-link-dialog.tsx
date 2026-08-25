// CreateTraceLinkDialog.tsx (JSX Refactored)

"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/modules/shared/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/ui/components/ui/dialog";
import { cn } from "@/modules/shared/ui/libs/cn";
import { TracePolicy } from "../../domain/policies/trace";
import { useCreateTraceLink } from "../clients/create-trace-link";
import { useGetElementsByModelId } from "../clients/get-elements-by-model-id";
import { useGetModelsByProjectId } from "../clients/get-models-by-project-id";
import { getTraceLinksByElementIdKey } from "../clients/get-trace-links-by-element-id";
import { getElementTypeInfo, getElementVisual } from "../helpers/element";
import type { Element, ElementTypeValue } from "../types/element";
import type { LayerValue } from "../types/layer";
import type { Model } from "../types/model";

// ============================================================================
// Subcomponents
// ============================================================================

function TraceOptionList({
  options,
  selectedIndex,
  onSelect,
}: {
  options: ReturnType<typeof TracePolicy.getTraceOptions>;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs">Trace Type</p>
      <div className="flex flex-col gap-1.5">
        {options.map((opt, index) => (
          <button
            key={index.toString()}
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              "w-full rounded-md border px-3 py-2 text-sm text-left transition-colors",
              selectedIndex === index
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background hover:bg-muted",
            )}
          >
            <span className="font-medium">{opt.type.label}</span>
            <span className="text-xs text-muted-foreground block mt-0.5">
              → {opt.targetLayer.label} (
              {opt.targetTypes
                .map((type) => getElementTypeInfo(type).label)
                .join(" / ")}
              )
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Target element picker (step 2) */
function TargetElementPicker({
  targetLayerLabel,
  targetModel,
  elements,
  selectedTargetId,
  onSelectTarget,
}: {
  targetLayerLabel: string;
  targetModel?: Model;
  elements: Element[];
  selectedTargetId: string | null;
  onSelectTarget: (id: string) => void;
}) {
  if (!targetModel) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs">Select target in {targetLayerLabel}</p>
        <p className="text-xs text-muted-foreground">
          No model has been created for {targetLayerLabel} layer yet.
        </p>
      </div>
    );
  }

  if (elements.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs">Select target in {targetLayerLabel}</p>
        <p className="text-xs text-muted-foreground">
          No compatible elements exist in this layer.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs">Select target in {targetLayerLabel}</p>
      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border rounded-md p-1">
        {elements.map((element) => {
          const spec = getElementVisual(element.type);
          const isSelected = selectedTargetId === element.id;
          return (
            <button
              key={element.id}
              type="button"
              onClick={() => onSelectTarget(element.id)}
              className={cn(
                "flex items-center gap-2 rounded px-2 py-1.5 text-sm text-left transition-colors",
                isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted",
              )}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-sm border"
                style={{
                  borderColor: spec.strokeColor,
                  backgroundColor: spec.fillColor,
                }}
              />
              <span className="truncate">{element.name}</span>
              <span className="ml-auto text-[10px] text-muted-foreground shrink-0">
                {getElementTypeInfo(element.type).label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

type CreateTraceLinkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  sourceElementId: string;
  sourceLayerType: LayerValue;
  sourceElementType: ElementTypeValue;
};

export function CreateTraceLinkDialog({
  open,
  onOpenChange,
  sourceElementId,
  sourceElementType,
  sourceLayerType,
  projectId,
}: CreateTraceLinkDialogProps) {
  // State
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null,
  );

  const queryClient = useQueryClient();

  // Data
  const createTrace = useCreateTraceLink();

  const traceOptions = useMemo(
    () => TracePolicy.getTraceOptions(sourceElementType, sourceLayerType),
    [sourceElementType, sourceLayerType],
  );

  const selectedOption = useMemo(() => {
    if (selectedOptionIndex === null) return null;
    return traceOptions[selectedOptionIndex];
  }, [traceOptions, selectedOptionIndex]);

  const { data: models } = useGetModelsByProjectId(projectId);

  const sourceModel = useMemo(
    () => models?.find((model) => model.layer === sourceLayerType),
    [models, sourceLayerType],
  );

  const targetModel = useMemo(
    () =>
      models?.find(
        (model) => model.layer === selectedOption?.targetLayer?.value,
      ),
    [models, selectedOption],
  );

  const { data: targetElements } = useGetElementsByModelId(
    targetModel?.id || "",
  );

  const filteredTargetElements = useMemo(
    () =>
      targetElements
        ?.filter((el) => selectedOption?.targetTypes.includes(el.type))
        .map((element) => ({
          id: element.id,
          name: element.name,
          type: element.type,
          description: element.description,
          modelId: element.modelId,
          parentId: element.parentId,
          status: element.properties.status,
          updatedAt: element.updatedAt,
          createdAt: element.createdAt,
        })) || [],
    [targetElements, selectedOption],
  );

  // Handlers
  const handleReset = useCallback(() => {
    setSelectedOptionIndex(null);
    setSelectedTargetId(null);
  }, []);

  const handleClose = useCallback(() => {
    handleReset();
    onOpenChange(false);
  }, [handleReset, onOpenChange]);

  const handleSelectOption = useCallback((index: number) => {
    setSelectedOptionIndex(index);
    setSelectedTargetId(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedOption || !selectedTargetId || !sourceModel || !targetModel)
      return;
    createTrace.mutate(
      {
        projectId,
        sourceModelId: sourceModel.id,
        targetModelId: targetModel.id,
        sourceElementId,
        sourceLayer: sourceLayerType,
        type: selectedOption.type.value,
        targetElementId: selectedTargetId,
        targetLayer: selectedOption.targetLayer.value,
      },
      {
        onSuccess: () => {
          handleClose();
          queryClient.invalidateQueries({
            queryKey: getTraceLinksByElementIdKey(sourceElementId),
          });

          queryClient.invalidateQueries({
            queryKey: getTraceLinksByElementIdKey(selectedTargetId),
          });
        },
      },
    );
  }, [
    selectedOption,
    selectedTargetId,
    sourceModel,
    targetModel,
    createTrace,
    projectId,
    sourceElementId,
    queryClient,
    handleClose,
    sourceLayerType,
  ]);

  // Render helpers
  const hasNoOptions = traceOptions.length === 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Trace Link</DialogTitle>
          <DialogDescription>
            Select the trace type to link this element to another layer
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          {hasNoOptions ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No trace options are defined for this element.
            </p>
          ) : (
            <>
              <TraceOptionList
                options={traceOptions}
                selectedIndex={selectedOptionIndex}
                onSelect={handleSelectOption}
              />

              {selectedOption && (
                <TargetElementPicker
                  targetModel={targetModel}
                  elements={filteredTargetElements}
                  selectedTargetId={selectedTargetId}
                  onSelectTarget={setSelectedTargetId}
                  targetLayerLabel={selectedOption.targetLayer.label}
                />
              )}
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              !selectedOption || !selectedTargetId || createTrace.isPending
            }
          >
            {createTrace.isPending && (
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
            )}
            Create Trace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
