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
 * After every canvas change:
 * - increments pendingChanges
 * - if ≥ MAX_PENDING or 2s of silence → sends layout to API
 *
 * On unmount (e.g. switching editor tabs) any pending change is flushed
 * immediately so layout edits are never lost.
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
          toast.error(message || "Error saving diagram");
        },
      },
    );
  }, [diagramId, nodes, setSaveStatus, resetPending, updateDiagramLayout]);

  // نگه‌داشتن آخرین نسخه‌ی flush برای فراخوانی هنگام unmount
  const flushRef = useRef(flush);
  flushRef.current = flush;

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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        // در صورت وجود تغییر معلق هنگام unmount، فوراً ذخیره کن
        flushRef.current();
      }
    };
  }, []);

  return { notifyChange, flush };
}
