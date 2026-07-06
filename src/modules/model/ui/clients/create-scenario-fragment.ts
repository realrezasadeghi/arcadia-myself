import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createScenarioFragment } from "@/modules/model/presentation/server-actions/scenario/create-fragment";
import { toast } from "sonner";

export function useCreateScenarioFragment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createScenarioFragment,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["get-scenario-data"] });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error creating fragment");
    },
  });
}