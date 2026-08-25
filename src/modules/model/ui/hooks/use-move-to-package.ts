"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { getClassDiagramByIdKey } from "../clients/get-class-diagram-by-id";
import { useUpdateClassElement } from "../clients/update-class-element";
import { useCanvasStore } from "../stores/canvas";

/**
 * Hook to move a class element into a Package (set parentId).
 * Provides the core logic shared by context menu and properties panel.
 */
export function useMoveToPackage() {
  const updateClassElement = useUpdateClassElement();
  const queryClient = useQueryClient();

  const moveToPackage = useCallback(
    (
      elementId: string,
      modelId: string,
      packageId: string | null, // null = ungroup (remove from package)
      packageName?: string,
    ) => {
      updateClassElement.mutate(
        {
          id: elementId,
          modelId,
          parentId: packageId,
        },
        {
          onSuccess: () => {
            // Update node data in canvas
            const { updateNodeData, diagramId } = useCanvasStore.getState();
            updateNodeData(elementId, { parentId: packageId } as any);

            // Invalidate queries
            queryClient.invalidateQueries({
              queryKey: ["class-elements", modelId],
            });
            if (diagramId) {
              queryClient.invalidateQueries({
                queryKey: getClassDiagramByIdKey(diagramId),
              });
            }

            if (packageId) {
              toast.success(`Moved to package "${packageName ?? "Package"}"`);
            } else {
              toast.success("Removed from package");
            }
          },
          onError: ({ message }) => {
            toast.error(message || "Error moving element");
          },
        },
      );
    },
    [updateClassElement, queryClient],
  );

  return { moveToPackage, isPending: updateClassElement.isPending };
}
