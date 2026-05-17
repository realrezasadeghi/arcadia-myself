"use client";

import { Button } from "@/modules/shared/ui/components/ui/button";
import { X } from "lucide-react";
import { use } from "react";

type DiagramPropertiesPanelProps = {
  params: Promise<{ id: string }>;
};

export function DiagramPropertiesPanel({
  params,
}: DiagramPropertiesPanelProps) {
  const { id: projectId } = use(params);
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-card overflow-y-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-card border-b px-3 py-2.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          مشخصات
        </p>
        <Button size="icon" variant="ghost" className="size-6">
          <X className="size-3.5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-3"></div>
    </aside>
  );
}
