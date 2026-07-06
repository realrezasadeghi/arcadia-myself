import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteScenarioDiagram } from "@/modules/model/presentation/server-actions/scenario/delete-diagram";
import { toast } from "sonner";

export function useDeleteScenarioDiagram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteScenarioDiagram,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["get-scenario-data"] });
        queryClient.invalidateQueries({ queryKey: ["get-scenario-diagrams-by-model-id"] });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting scenario diagram");
    },
  });
}
