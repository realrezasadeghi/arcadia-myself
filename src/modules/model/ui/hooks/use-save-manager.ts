"use client";

import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useUpdateDiagramLayout } from "../clients/update-diagram-layout";
import { useCanvasStore } from "../stores/canvas";
import { useModelStore } from "../stores/model";

const DEBOUNCE_MS = 2000;
const MAX_PENDING = 5;

/**
 * useSaveManager
 *
 * بعد از هر تغییر در canvas:
 * - pendingChanges را افزایش می‌دهد
 * - اگر ≥ MAX_PENDING یا ۲ ثانیه سکوت → layout را به API ارسال می‌کند
 */
export function useSaveManager() {
  const { diagramId, nodes } = useCanvasStore();

  const updateDiagramLayout = useUpdateDiagramLayout();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { setSaveStatus, incrementPending, resetPending, pendingChanges } =
    useModelStore();

  const flush = useCallback(async () => {
    if (!diagramId) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    setSaveStatus("saving");

    const layouts = nodes.map((n) => ({
      position: n.position,
      elementId: n.data.elementId,
      size: { width: n.width ?? 160, height: n.height ?? 60 },
    }));

    updateDiagramLayout.mutate(
      {
        id: diagramId,
        elementLayouts: layouts,
      },
      {
        onSuccess: () => {
          resetPending();
          setSaveStatus("saved");
        },
        onError: ({ message }) => {
          setSaveStatus("error");
          toast.error(message || "خطا در ذخیره دیاگرام");
        },
      },
    );
  }, [diagramId, nodes, setSaveStatus, resetPending, updateDiagramLayout]);

  const notifyChange = useCallback(() => {
    incrementPending();

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, DEBOUNCE_MS);
  }, [incrementPending, flush]);

  useEffect(() => {
    if (pendingChanges >= MAX_PENDING) {
      flush();
    }
  }, [pendingChanges, flush]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { notifyChange, flush };
}
