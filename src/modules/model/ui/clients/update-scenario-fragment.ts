import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScenarioFragment } from "@/modules/model/presentation/server-actions/scenario/update-fragment";
import { toast } from "sonner";

export function useUpdateScenarioFragment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateScenarioFragment,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["get-scenario-data"] });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error updating fragment");
    },
  });
}