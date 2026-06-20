"use client";

import { Badge } from "@/modules/shared/ui/components/ui/badge";
import { Button } from "@/modules/shared/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/shared/ui/components/ui/dialog";
import { ScrollArea } from "@/modules/shared/ui/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/shared/ui/components/ui/tabs";
import { cn } from "@/modules/shared/ui/libs/cn";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Layers,
  Lightbulb,
  Puzzle,
  Shapes,
  Target,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DIAGRAMS_BY_LAYER } from "../constants/diagram";
import { ELEMENT_VISUAL, ELEMENTS_BY_LAYER } from "../constants/element";
import { LAYER_COLORS, LAYERS } from "../constants/layer";
import type { LayerValue } from "../types/layer";

export function ArcadiaInfoModal() {
  const t = useTranslations("arcadiaGuide");

  const [open, setOpen] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<LayerValue | "ALL">("ALL");
  const [activeTab, setActiveTab] = useState<"diagrams" | "elements">(
    "diagrams",
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>{t("title")}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {/* Layer Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={selectedLayer === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLayer("ALL")}
            className="h-7 text-xs"
          >
            {t("allLayers")}
          </Button>
          {LAYERS.map((layer) => {
            const colors = LAYER_COLORS[layer.value];
            return (
              <Button
                key={layer.value}
                variant={selectedLayer === layer.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLayer(layer.value)}
                className={cn(
                  "h-7 text-xs",
                  selectedLayer === layer.value &&
                    `${colors.activeBg} ${colors.text} border ${colors.border}`,
                )}
              >
                {layer.value}
              </Button>
            );
          })}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "diagrams" | "elements")}
        >
          <TabsList className="h-auto p-1 bg-muted/50">
            <TabsTrigger
              value="diagrams"
              className={cn(
                "flex-1 gap-2 h-9 text-sm font-medium transition-all cursor-pointer  data-[state=active]:text-white",
              )}
            >
              <Layers className="h-4 w-4" />
              {t("diagrams")}
            </TabsTrigger>
            <TabsTrigger
              value="elements"
              className={cn(
                "flex-1 gap-2 h-9 text-sm font-medium transition-all cursor-pointer data-[state=active]:text-white",
              )}
            >
              <Shapes className="h-4 w-4" />
              {t("elements")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagrams" className="mt-2 flex-1 w-full">
            <ScrollArea className="h-[50vh]">
              <DiagramList selectedLayer={selectedLayer} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="elements" className="mt-2 flex-1 w-full">
            <ScrollArea className="h-[50vh]">
              <ElementList selectedLayer={selectedLayer} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// ─── Diagram List ──────────────────────────────────────────────────────────────

function DiagramList({ selectedLayer }: { selectedLayer: LayerValue | "ALL" }) {
  const t = useTranslations("arcadiaGuide");
  const layers =
    selectedLayer === "ALL"
      ? LAYERS
      : LAYERS.filter((l) => l.value === selectedLayer);

  return (
    <div className="space-y-6 pr-4">
      {layers.map((layer) => {
        const diagramTypes = DIAGRAMS_BY_LAYER[layer.value];
        const colors = LAYER_COLORS[layer.value];

        return (
          <div key={layer.value} className="space-y-3">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg",
                colors.bg,
              )}
            >
              <Badge
                variant="outline"
                className={cn("text-xs font-bold", colors.text, colors.border)}
              >
                {layer.value}
              </Badge>
              <span className={cn("text-sm font-semibold", colors.text)}>
                {t(`layers.${layer.value}` as never)}
              </span>
            </div>

            <div className="grid gap-3 pl-2">
              {diagramTypes.map((diagramValue) => (
                <DiagramCard key={diagramValue} diagramValue={diagramValue} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DiagramCard({ diagramValue }: { diagramValue: string }) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("arcadiaGuide");
  const layer = LAYERS.find((l) =>
    DIAGRAMS_BY_LAYER[l.value].includes(diagramValue as never),
  );
  const colors = layer ? LAYER_COLORS[layer.value] : LAYER_COLORS.OA;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card overflow-hidden transition-all",
        colors.border,
        expanded && "ring-1 ring-primary/20",
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
          expanded ? "bg-muted/30" : "hover:bg-muted/50",
        )}
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-primary shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {diagramValue}
            </span>
            <span
              className={cn(
                "font-medium text-sm",
                expanded && "text-foreground",
              )}
            >
              {t(`diagramTypes.${diagramValue}.label` as never)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {t(`diagramTypes.${diagramValue}.desc` as never)}
          </p>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t bg-muted/10">
          <div className="pt-3 space-y-2.5">
            <InfoRow
              icon={<Target className="h-3.5 w-3.5" />}
              label={t("purpose")}
              value={t(`diagramTypes.${diagramValue}.purpose` as never)}
            />
            <InfoRow
              icon={<Puzzle className="h-3.5 w-3.5" />}
              label={t("contains")}
              value={t(`diagramTypes.${diagramValue}.contains` as never)}
            />
            <InfoRow
              icon={<Lightbulb className="h-3.5 w-3.5" />}
              label={t("usedFor")}
              value={t(`diagramTypes.${diagramValue}.usedFor` as never)}
            />
            <InfoRow
              icon={<ArrowRight className="h-3.5 w-3.5" />}
              label={t("capellaEquiv")}
              value={t(`diagramTypes.${diagramValue}.capella` as never)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Element List ──────────────────────────────────────────────────────────────

function ElementList({ selectedLayer }: { selectedLayer: LayerValue | "ALL" }) {
  const t = useTranslations("arcadiaGuide");
  const layers =
    selectedLayer === "ALL"
      ? LAYERS
      : LAYERS.filter((l) => l.value === selectedLayer);

  return (
    <div className="space-y-6 pr-4">
      {layers.map((layer) => {
        const elementTypes = ELEMENTS_BY_LAYER[layer.value];
        const colors = LAYER_COLORS[layer.value];

        return (
          <div key={layer.value} className="space-y-3">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg",
                colors.bg,
              )}
            >
              <Badge
                variant="outline"
                className={cn("text-xs font-bold", colors.text, colors.border)}
              >
                {layer.value}
              </Badge>
              <span className={cn("text-sm font-semibold", colors.text)}>
                {t(`layers.${layer.value}` as never)}
              </span>
            </div>

            <div className="grid gap-3 pl-2">
              {elementTypes.map((elementValue) => (
                <ElementCard key={elementValue} elementValue={elementValue} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ElementCard({ elementValue }: { elementValue: string }) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("arcadiaGuide");
  const visual = ELEMENT_VISUAL[elementValue as keyof typeof ELEMENT_VISUAL];

  const layerBadge = elementValue.includes("Operational")
    ? "OA"
    : elementValue.includes("System") || elementValue === "FunctionPort"
      ? "SA"
      : elementValue.includes("Logical")
        ? "LA"
        : "PA";

  return (
    <div
      className={cn(
        "rounded-lg border bg-card overflow-hidden transition-all",
        expanded && "ring-1 ring-primary/20",
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
          expanded ? "bg-muted/30" : "hover:bg-muted/50",
        )}
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-primary shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        )}

        {/* Color preview from ELEMENT_VISUAL */}
        {visual && (
          <div
            className={cn(
              "shrink-0 border-2 transition-transform",
              expanded && "scale-110",
              visual.shape === "ellipse" && "rounded-full w-8 h-8",
              visual.shape === "rounded-rectangle" && "rounded-lg w-8 h-8",
              visual.shape === "rectangle" && "rounded-sm w-8 h-8",
            )}
            style={{
              backgroundColor: visual.fillColor,
              borderColor: visual.strokeColor,
            }}
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-medium text-sm",
                expanded && "text-foreground",
              )}
            >
              {t(`elementTypes.${elementValue}.label` as never)}
            </span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {layerBadge}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {t(`elementTypes.${elementValue}.desc` as never)}
          </p>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t bg-muted/10">
          <div className="pt-3 space-y-2.5">
            <InfoRow
              icon={<Target className="h-3.5 w-3.5" />}
              label={t("purpose")}
              value={t(`elementTypes.${elementValue}.purpose` as never)}
            />
            <InfoRow
              icon={<Lightbulb className="h-3.5 w-3.5" />}
              label={t("example")}
              value={t(`elementTypes.${elementValue}.example` as never)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared ────────────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2.5 text-xs">
      <span className="text-primary shrink-0 mt-0.5">{icon}</span>
      <div>
        <span className="font-semibold text-foreground">{label}</span>
        <span className="text-muted-foreground ml-1">{value}</span>
      </div>
    </div>
  );
}
