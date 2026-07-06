import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteScenarioLifeline } from "@/modules/model/presentation/server-actions/scenario/delete-lifeline";
import { getScenarioDataKey } from "./get-scenario-data";
import { toast } from "sonner";

export function useDeleteScenarioLifeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteScenarioLifeline,
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate all scenario data queries
        queryClient.invalidateQueries({ queryKey: ["get-scenario-data"] });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting lifeline");
    },
  });
}
