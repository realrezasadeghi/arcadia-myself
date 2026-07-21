import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getClassRelationshipsByDiagramId } from "../../presentation/server-actions/get-class-relationships-by-diagram-id";

export function useClassRelationshipsByDiagramId(diagramId: string) {
  return useServerQuery({
    queryKey: ["class-relationships-by-diagram", diagramId],
    queryFn: () => getClassRelationshipsByDiagramId(diagramId),
    enabled: !!diagramId,
  });
}
