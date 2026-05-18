import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getTraceLinksByElementsId } from "../../presentation/server-actions/get-trace-links-by-element-id";

export const GET_TRACE_LINKS_BY_ELEMENT_ID = "GET_TRACE_LINKS_BY_ELEMENT_ID";
export function useGetTraceLinksByElementId(elementId: string) {
  return useServerQuery({
    enabled: !!elementId,
    queryFn: () => getTraceLinksByElementsId(elementId),
    queryKey: [GET_TRACE_LINKS_BY_ELEMENT_ID, elementId],
  });
}
