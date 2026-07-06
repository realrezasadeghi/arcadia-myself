import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createScenarioMessage } from "@/modules/model/presentation/server-actions/scenario/create-message";
import { toast } from "sonner";

export function useCreateScenarioMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createScenarioMessage,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["get-scenario-data"] });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error creating message");
    },
  });
}