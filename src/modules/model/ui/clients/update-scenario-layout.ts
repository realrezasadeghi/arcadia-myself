import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScenarioLayout } from "@/modules/model/presentation/server-actions/scenario/update-layout";
import { toast } from "sonner";

export function useUpdateScenarioLayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateScenarioLayout,
    onError: (error) => {
      toast.error(error.message || "Error saving layout");
    },
  });
}
