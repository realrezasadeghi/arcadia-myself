import { cn } from "@/modules/shared/ui/libs/cn";

interface LayerBadgeProps {
  showLabel?: boolean;
  layer: { value: string; label: string };
}

const LAYER_CLASSNAMES = {
  OA: "bg-blue-50 border-blue-200/30 hover:border-blue-300/50 bg-blue-500",
  SA: "bg-amber-50 border-amber-200/30 hover:border-amber-300/50 bg-amber-500",
  LA: "bg-emerald-50 border-emerald-200/30 hover:border-emerald-300/50 bg-emerald-600",
  PA: "bg-purple-50 border-purple-200/30 hover:border-purple-300/50 bg-purple-600",
};

export function LayerBadge({ showLabel = false, layer }: LayerBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium text-white border",
        LAYER_CLASSNAMES[layer.value as keyof typeof LAYER_CLASSNAMES],
      )}
    >
      {showLabel ? `${layer.value} - ${layer.label}` : layer.value}
    </span>
  );
}
