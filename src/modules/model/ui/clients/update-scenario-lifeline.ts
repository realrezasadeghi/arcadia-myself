import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScenarioLifeline } from "@/modules/model/presentation/server-actions/scenario/update-lifeline";
import { toast } from "sonner";

export function useUpdateScenarioLifeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateScenarioLifeline,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["get-scenario-data"] });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error updating lifeline");
    },
  });
}