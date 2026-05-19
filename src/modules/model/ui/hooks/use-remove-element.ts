// hooks/use-delete-node.ts

import { useCallback } from "react";
import { toast } from "sonner";
import { useRemoveElement } from "../clients/remove-element";
import { useCanvasStore } from "../stores/canvas";

export function useRemoveElementSync() {
  const pushHistory = useCanvasStore((s) => s.pushHistory);
  const removeNode = useCanvasStore((s) => s.removeNode);
  const { mutate: removeElement, isPending } = useRemoveElement();

  const remove = useCallback(
    (nodeId: string) => {
      pushHistory();

      removeElement(nodeId, {
        onSuccess: () => {
          removeNode(nodeId);
        },
        onError: ({ message }) => {
          toast.error(message || "خطا در حذف المنت");
        },
      });
    },
    [pushHistory, removeElement, removeNode],
  );

  return { removeElement: remove, isPending };
}
