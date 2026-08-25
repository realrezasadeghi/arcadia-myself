"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useTransitionLayer } from "../../../clients/transition-layer";
import { getLayerInfo } from "../../../helpers/layer";
import type { Element, ElementTypeValue } from "../../../types/element";
import type { LayerValue } from "../../../types/layer";
import type { Model } from "../../../types/model";

const TARGET_TYPE_MAP: Record<
  LayerValue,
  Partial<Record<ElementTypeValue, ElementTypeValue>>
> = {
  OA: {
    OperationalEntity: "SystemActor",
    OperationalActor: "SystemActor",
    OperationalCapability: "SystemCapability",
    OperationalActivity: "SystemFunction",
  },
  SA: {
    SystemActor: "LogicalActor",
    SystemComponent: "LogicalComponent",
    SystemFunction: "LogicalFunction",
  },
  LA: {
    LogicalActor: "PhysicalActor",
    LogicalComponent: "PhysicalComponent",
    LogicalFunction: "PhysicalFunction",
  },
  PA: {},
  // Legacy layer — no transitions offered in the UI.
  EPBS: {},
};

const NEXT_LAYER: Record<LayerValue, LayerValue | null> = {
  OA: "SA",
  SA: "LA",
  LA: "PA",
  PA: null,
  EPBS: null,
};

export type RowState = {
  include: boolean;
  targetName: string;
  targetType: ElementTypeValue;
};

type UseTransitionWizardParams = {
  projectId: string;
  sourceModel: Model;
  sourceElements: Element[];
  onCompleted: () => void;
  onOpenChange: (open: boolean) => void;
};

export function useTransitionWizard({
  projectId,
  sourceModel,
  sourceElements,
  onCompleted,
  onOpenChange,
}: UseTransitionWizardParams) {
  const transition = useTransitionLayer();
  const sourceLayer = sourceModel.layer;
  const targetLayer = NEXT_LAYER[sourceLayer];
  const typeMap = TARGET_TYPE_MAP[sourceLayer];

  const transitionable = useMemo(
    () =>
      sourceElements.filter(
        (el) => el.status !== "DEPRECATED" && typeMap[el.type],
      ),
    [sourceElements, typeMap],
  );

  const components = useMemo(
    () =>
      transitionable.filter((el) => !typeMap[el.type]?.endsWith("Function")),
    [transitionable, typeMap],
  );

  const functions = useMemo(
    () => transitionable.filter((el) => typeMap[el.type]?.endsWith("Function")),
    [transitionable, typeMap],
  );

  const [step, setStep] = useState(0);
  const [targetModelName, setTargetModelName] = useState("");
  const [rows, setRows] = useState<Record<string, RowState>>(() =>
    Object.fromEntries(
      transitionable.map((el) => [
        el.id,
        {
          include: true,
          targetName: el.name,
          targetType: typeMap[el.type] as ElementTypeValue,
        },
      ]),
    ),
  );

  const updateRow = (id: string, patch: Partial<RowState>) =>
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const setManyInclude = (ids: string[], value: boolean) =>
    setRows((prev) => {
      const next = { ...prev };
      for (const id of ids) next[id] = { ...next[id], include: value };
      return next;
    });

  const includedIn = (els: Element[]) =>
    els.filter((el) => rows[el.id]?.include).length;

  const includedCount = Object.values(rows).filter((r) => r.include).length;

  const handleConfirm = () => {
    const mappings = transitionable
      .filter((el) => rows[el.id]?.include)
      .map((el) => ({
        sourceElementId: el.id,
        targetType: rows[el.id].targetType,
        targetName: rows[el.id].targetName.trim() || el.name,
        traceType: "Realization" as const,
      }));

    transition.mutate(
      {
        projectId,
        sourceModelId: sourceModel.id,
        sourceLayer,
        targetLayer: targetLayer!,
        targetModelName:
          targetModelName.trim() || getLayerInfo(targetLayer!).label,
        mappings,
      },
      {
        onSuccess: ({ data }) => {
          const info = getLayerInfo(targetLayer!);
          toast.success(
            `Transitioned to ${info.label}: ${data.createdElements} elements created with realization links.`,
            {
              description: `Create a ${targetLayer} diagram in the Explorer tree to visualize these elements.`,
              duration: 5000,
            },
          );
          onCompleted();
        },
        onError: ({ message }) =>
          toast.error(message || "Error during transition"),
      },
    );
  };

  return {
    step,
    setStep,
    targetModelName,
    setTargetModelName,
    rows,
    updateRow,
    setManyInclude,
    includedIn,
    includedCount,
    handleConfirm,
    transitionable,
    components,
    functions,
    sourceLayer,
    targetLayer,
    transition,
  };
}
