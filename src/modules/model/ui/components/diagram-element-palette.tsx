import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/shared/ui/components/ui/tooltip";
import { getDiagramById } from "../../presentation/server-actions/get-diagram-by-id";
import { getDiagramLayer } from "../helpers/diagram";
import { getElementTypesForLayer } from "../helpers/element";
import { getLayerInfo } from "../helpers/layer";
import { ElementShape } from "./element-shape";

type DiagramElementPaletteProps = {
  params: Promise<{ diagramId: string }>;
};

export async function DiagramElementPalette({
  params,
}: DiagramElementPaletteProps) {
  const { diagramId } = await params;

  const { data: diagram } = await getDiagramById(diagramId);

  const layer = getLayerInfo(getDiagramLayer(diagram.type));

  const elementTypes = getElementTypesForLayer(layer.value);

  return (
    <aside className="flex w-48 shrink-0 flex-col border-l bg-card overflow-y-auto">
      <div className="sticky top-0 z-10 bg-card border-b px-3 py-2.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          المنت‌ها
        </p>
      </div>

      <div className="flex flex-col gap-1 p-2">
        {elementTypes.map((element) => {
          return (
            <Tooltip key={element.value}>
              <TooltipTrigger asChild>
                <ElementShape label={element.label} type={element.value} />
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                <p className="font-medium">{element.label}</p>
                <p className="text-muted-foreground">{element.labelFa}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </aside>
  );
}
