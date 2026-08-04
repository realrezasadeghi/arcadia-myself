import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getClassDiagramById } from "../../presentation/server-actions/get-class-diagram-by-id";

export const getClassDiagramByIdKey = (id: string) => [
  "get-class-diagram-by-id",
  id,
];

export function useGetClassDiagramById(id?: string) {
  return useServerQuery({
    enabled: !!id,
    queryKey: getClassDiagramByIdKey(String(id)),
    queryFn: () => getClassDiagramById(id as string),
  });
}
