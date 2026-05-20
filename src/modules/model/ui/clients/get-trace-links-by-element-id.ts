import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getTraceLinksByElementsId } from "../../presentation/server-actions/get-trace-links-by-element-id";

export const getTraceLinksByElementIdKey = (...keys: string[]) => [
  "get-trace-links-by-element-id",
  ...keys,
];

export function useGetTraceLinksByElementId(elementId: string) {
  return useServerQuery({
    enabled: !!elementId,
    queryFn: () => getTraceLinksByElementsId(elementId),
    queryKey: getTraceLinksByElementIdKey(elementId),
  });
}
