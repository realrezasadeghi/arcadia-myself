import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteScenarioFragment } from "@/modules/model/presentation/server-actions/scenario/delete-fragment";
import { toast } from "sonner";

export function useDeleteScenarioFragment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteScenarioFragment,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["get-scenario-data"] });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting fragment");
    },
  });
}
