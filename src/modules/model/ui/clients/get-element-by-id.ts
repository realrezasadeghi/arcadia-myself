import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getElementById } from "../../presentation/server-actions/get-element-by-id";

export const getElementByIdKey = (id: string) => ["get-element-by-id", id];

export function useGetElementById(id?: string) {
  return useServerQuery({
    enabled: !!id,
    queryKey: getElementByIdKey(String(id)),
    queryFn: () => getElementById(id as string),
  });
}
