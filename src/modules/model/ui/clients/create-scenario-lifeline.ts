import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createScenarioLifeline } from "@/modules/model/presentation/server-actions/scenario/create-lifeline";
import { getElementRelationsKey } from "@/modules/model/ui/clients/get-element-relations";
import { toast } from "sonner";

export function useCreateScenarioLifeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createScenarioLifeline,
    onSuccess: (result) => {
      if (result.success && result.data) {
        queryClient.invalidateQueries({ queryKey: ["get-scenario-data"] });
        queryClient.invalidateQueries({ queryKey: getElementRelationsKey(result.data.elementId) });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error creating lifeline");
    },
  });
}