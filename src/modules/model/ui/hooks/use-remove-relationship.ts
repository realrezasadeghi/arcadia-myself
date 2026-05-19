import { useCallback } from "react";
import { toast } from "sonner";
import { useRemoveRelationship } from "../clients/remove-relationship";
import { useCanvasStore } from "../stores/canvas";

export function useRemoveRelationshipSync() {
  const modelId = useCanvasStore((s) => s.modelId);
  const pushHistory = useCanvasStore((s) => s.pushHistory);
  const removeEdge = useCanvasStore((s) => s.removeEdge);
  const { mutate: removeRelationship, isPending } = useRemoveRelationship();

  const remove = useCallback(
    (edgeId: string) => {
      if (!modelId || !edgeId) {
        return;
      }

      pushHistory();

      removeRelationship(
        { modelId: modelId, relationshipId: edgeId },
        {
          onSuccess: () => {
            removeEdge(edgeId);
          },
          onError: ({ message }) => {
            toast.error(message || "خطا در حذف رابطه");
          },
        },
      );
    },
    [modelId, pushHistory, removeEdge, removeRelationship],
  );

  return { removeRelationship: remove, isPending };
}
