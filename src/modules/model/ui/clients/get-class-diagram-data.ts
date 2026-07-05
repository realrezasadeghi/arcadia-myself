import { useServerQuery } from "@/modules/shared/ui/hooks/use-query";
import { getClassDiagramData } from "../../presentation/server-actions/class-diagram/get-class-diagram-data";

export const getClassDiagramDataKey = (modelId: string) => [
  "class-diagram-data",
  modelId,
];

export function useGetClassDiagramData(modelId?: string) {
  return useServerQuery({
    enabled: !!modelId,
    queryKey: getClassDiagramDataKey(String(modelId)),
    queryFn: () => getClassDiagramData(modelId as string),
  });
}
