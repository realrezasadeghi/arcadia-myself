import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { useUpdateClassDiagramLayout } from "../clients/update-class-diagram-layout";
import { useUpdateDiagramLayout } from "../clients/update-diagram-layout";
import { getClassDiagramByIdKey } from "../clients/get-class-diagram-by-id";
import { getDiagramByIdKey } from "../clients/get-diagram-by-id";
import { isContainerType } from "../helpers/class-diagram";
import { useCanvasStore, type CanvasNode } from "../stores/canvas";

export function useRemoveElementSync() {
  const pushHistory = useCanvasStore((s) => s.pushHistory);
  const removeNode = useCanvasStore((s) => s.removeNode);
  const updateNode = useCanvasStore((s) => s.updateNode);
  const updateClassDiagramLayout = useUpdateClassDiagramLayout();
  const updateDiagramLayout = useUpdateDiagramLayout();
  const queryClient = useQueryClient();

  const remove = useCallback(
    (nodeId: string) => {
      pushHistory();

      const { nodes, diagramId, modelId } = useCanvasStore.getState();
      const node = nodes.find((n) => n.id === nodeId);
      if (!diagramId || !modelId) return;

      const isClassNode =
        node?.type === "class-node" || node?.type === "package-node";

      if (isClassNode) {
        const diagramQuery = queryClient.getQueryData(
          getClassDiagramByIdKey(diagramId),
        ) as any;
        const currentLayouts = diagramQuery?.elementLayouts ?? [];

        // Promote children to root if removing a container
        const isRemovingContainer = isContainerType(node?.data.elementType as any);
        if (isRemovingContainer) {
          const children = nodes.filter((n) => n.parentId === nodeId);
          const nodesById = new Map(nodes.map((n) => [n.id, n]));

          for (const child of children) {
            // Calculate absolute position
            let absX = child.position.x;
            let absY = child.position.y;
            let current = child;
            const visited = new Set<string>([child.id]);

            while (current.parentId && current.parentId !== nodeId) {
              if (visited.has(current.parentId)) break;
              visited.add(current.parentId);
              const parent = nodesById.get(current.parentId);
              if (!parent) break;
              absX += parent.position.x;
              absY += parent.position.y;
              current = parent;
            }

            // Add the removed container's position to get true absolute position
            absX += node!.position.x;
            absY += node!.position.y;

            updateNode(child.id, {
              parentId: undefined,
              extent: undefined,
              position: { x: absX, y: absY },
            });
          }
        }

        // Build layout list: exclude removed node, include promoted children
        const filteredLayouts = currentLayouts
          .filter((l: any) => l.elementId !== nodeId)
          .map((l: any) => ({
            elementId: l.elementId,
            position: l.position,
            size: l.size,
          }));

        // Add promoted children layouts
        if (isRemovingContainer) {
          const promotedChildren = nodes.filter((n) => n.parentId === nodeId);
          const nodesById = new Map(nodes.map((n) => [n.id, n]));

          for (const child of promotedChildren) {
            let absX = child.position.x;
            let absY = child.position.y;
            let current = child;
            const visited = new Set<string>([child.id]);

            while (current.parentId && current.parentId !== nodeId) {
              if (visited.has(current.parentId)) break;
              visited.add(current.parentId);
              const parent = nodesById.get(current.parentId);
              if (!parent) break;
              absX += parent.position.x;
              absY += parent.position.y;
              current = parent;
            }

            absX += node!.position.x;
            absY += node!.position.y;

            filteredLayouts.push({
              elementId: child.id,
              position: { x: absX, y: absY },
              size: { width: child.width ?? 160, height: child.height ?? 60 },
            });
          }
        }

        removeNode(nodeId);

        updateClassDiagramLayout.mutate(
          { id: diagramId, modelId, elementLayouts: filteredLayouts },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: getClassDiagramByIdKey(diagramId),
              });
            },
            onError: ({ message }) => {
              toast.error(message || "Error removing element from diagram");
            },
          },
        );
      } else {
        const diagramQuery = queryClient.getQueryData(
          getDiagramByIdKey(diagramId),
        ) as any;
        const currentLayouts = diagramQuery?.elementLayouts ?? [];
        const filteredLayouts = currentLayouts
          .filter((l: any) => l.elementId !== nodeId)
          .map((l: any) => ({
            elementId: l.elementId,
            position: l.position,
            size: l.size,
          }));

        removeNode(nodeId);

        updateDiagramLayout.mutate(
          { id: diagramId, elementLayouts: filteredLayouts },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: getDiagramByIdKey(diagramId),
              });
            },
            onError: ({ message }) => {
              toast.error(message || "Error removing element from diagram");
            },
          },
        );
      }
    },
    [
      pushHistory,
      updateClassDiagramLayout,
      updateDiagramLayout,
      removeNode,
      updateNode,
      queryClient,
    ],
  );

  return { removeElement: remove, isPending: updateClassDiagramLayout.isPending || updateDiagramLayout.isPending };
}
