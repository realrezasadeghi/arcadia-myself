import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getClassElementsByDiagramId } from "../../presentation/server-actions/get-class-elements-by-diagram-id";

export function useClassElementsByDiagramId(diagramId: string) {
  return useServerQuery({
    queryKey: ["class-elements-by-diagram", diagramId],
    queryFn: () => getClassElementsByDiagramId(diagramId),
    enabled: !!diagramId,
  });
}
