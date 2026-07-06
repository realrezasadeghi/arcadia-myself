import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderScenarioMessages } from "@/modules/model/presentation/server-actions/scenario/reorder-messages";
import { toast } from "sonner";

export function useReorderScenarioMessages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderScenarioMessages,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["get-scenario-data"] });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error reordering messages");
    },
  });
}