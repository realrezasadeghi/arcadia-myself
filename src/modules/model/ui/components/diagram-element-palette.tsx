import { Separator } from "@/modules/shared/ui/components/ui/separator";
import { getDiagramById } from "../../presentation/server-actions/get-diagram-by-id";
import { getDiagramLayer } from "../helpers/diagram";
import { getLayerInfo } from "../helpers/layer";
import { ElementShapeList } from "./element-shape-list";

type DiagramElementPaletteProps = {
  params: Promise<{ diagramId: string }>;
};

export async function DiagramElementPalette({
  params,
}: DiagramElementPaletteProps) {
  const { diagramId } = await params;

  const { data: diagram } = await getDiagramById(diagramId);

  const layer = getLayerInfo(getDiagramLayer(diagram.type));

  return (
    <aside className="flex w-48 shrink-0 flex-col border-l bg-card overflow-y-auto">
      <div className="sticky top-0 z-10 bg-card border-b px-3 py-2.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          المنت‌ها
        </p>
      </div>
      <ElementShapeList layer={layer.value} />
      <Separator className="my-1" />
      <div className="px-3 py-2 text-center">
        <p className="text-[10px] text-muted-foreground">
          المنت را به canvas بکشید
        </p>
      </div>
    </aside>
  );
}
