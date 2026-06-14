import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getElementRelations } from "../../presentation/server-actions/get-element-relations";

export const getElementRelationsKey = (id: string) => [
  "get-element-relations",
  id,
];

export function useGetElementRelations(id?: string) {
  return useServerQuery({
    enabled: !!id,
    queryKey: getElementRelationsKey(String(id)),
    queryFn: () => getElementRelations(id as string),
  });
}
