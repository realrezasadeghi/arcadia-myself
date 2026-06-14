import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getDiagramById } from "../../presentation/server-actions/get-diagram-by-id";

export const getDiagramByIdKey = (id: string) => ["get-diagram-by-id", id];

export function useGetDiagramById(id?: string) {
  return useServerQuery({
    enabled: !!id,
    queryKey: getDiagramByIdKey(String(id)),
    queryFn: () => getDiagramById(id as string),
  });
}
