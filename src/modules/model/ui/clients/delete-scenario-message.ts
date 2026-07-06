import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteScenarioMessage } from "@/modules/model/presentation/server-actions/scenario/delete-message";
import { toast } from "sonner";

export function useDeleteScenarioMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteScenarioMessage,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["get-scenario-data"] });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting message");
    },
  });
}
