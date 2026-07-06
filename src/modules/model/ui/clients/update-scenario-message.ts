import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScenarioMessage } from "@/modules/model/presentation/server-actions/scenario/update-message";
import { toast } from "sonner";

export function useUpdateScenarioMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateScenarioMessage,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["get-scenario-data"] });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error updating message");
    },
  });
}