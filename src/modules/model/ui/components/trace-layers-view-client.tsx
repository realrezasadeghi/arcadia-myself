"use client";

import { TraceLayersView } from "./trace-layers-view";

interface TraceLayersViewClientProps {
  layers: Record<string, any[]>;
  traceLinks: any[];
}

export function TraceLayersViewClient({ layers, traceLinks }: TraceLayersViewClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">نقشه ردیابی لایه‌ها</h2>
        <p className="text-muted-foreground">
          مشاهده چگونگی اتصال عناصر در لایه‌های مختلف Arcadia
        </p>
      </div>
      <TraceLayersView layers={layers} traceLinks={traceLinks} />
    </div>
  );
}
