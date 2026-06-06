"use client";

import { useCreateDiagram } from "@/modules/model/ui/clients/create-diagram";
import { useCreateModel } from "@/modules/model/ui/clients/create-model";
import {
  getDiagramsByModelIdKey,
  useGetDiagramsByModelId,
} from "@/modules/model/ui/clients/get-diagrams-by-model-id";
import { useRemoveDiagram } from "@/modules/model/ui/clients/remove-diagram";
import { useUpdateDiagram } from "@/modules/model/ui/clients/update-diagram";
import type { Diagram } from "@/modules/model/ui/types/diagram";
import type { LayerValue } from "@/modules/model/ui/types/layer";
import type { Model } from "@/modules/model/ui/types/model";
import { Button } from "@/modules/shared/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/modules/shared/ui/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/modules/shared/ui/components/ui/empty";
import { Skeleton } from "@/modules/shared/ui/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/shared/ui/components/ui/tooltip";
import { useConfirm } from "@/modules/shared/ui/hooks/use-confirm";
import { useQueryClient } from "@tanstack/react-query";
import { FileBarChart2, LayoutDashboard, Pencil, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SyntheticEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import type { DiagramFormValues } from "../schemas/diagram";
import { LayerBadge } from "./layer-badge";

const DiagramFormDialog = dynamic(() =>
  import("./diagram-form-dialog").then((mod) => mod.DiagramFormDialog),
);

export type LayerCardProps = {
  layer: {
    label: string;
    value: LayerValue;
  };
  projectId: string;
  model: Model | null;
};

export function LayerCard({ model, layer, projectId }: LayerCardProps) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const createModel = useCreateModel();

  const queryClient = useQueryClient();

  const createDiagram = useCreateDiagram();

  const handleCreateDiagram = useCallback(
    (values: DiagramFormValues, modelId: string) => {
      if (!modelId) {
        return;
      }

      createDiagram.mutate(
        {
          modelId,
          type: values.type,
          name: values.name,
          description: values.description,
        },
        {
          onError({ message }) {
            toast.error(message || "Error in create diagram");
          },
          onSuccess({ data }) {
            setOpen(false);
            queryClient.invalidateQueries({
              queryKey: getDiagramsByModelIdKey(modelId),
            });
            router.push(`/dashboard/project/${projectId}/diagram/${data.id}`);
          },
        },
      );
    },
    [createDiagram, router, queryClient, projectId],
  );

  const handleSubmit = useCallback(
    (values: DiagramFormValues) => {
      if (!model) {
        createModel.mutate(
          {
            projectId,
            name: layer.label,
            layer: layer.value,
          },
          {
            onSuccess: ({ success, data }) => {
              if (!success) return;
              handleCreateDiagram(values, data.id);
            },
            onError: ({ message }) => {
              toast.error(message || "Error in create model");
            },
          },
        );
        return;
      }

      handleCreateDiagram(values, model.id);
    },
    [model, projectId, createModel, handleCreateDiagram, layer],
  );

  return (
    <>
      <Card className="border-r-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayerBadge layer={layer} />
              <span className="text-sm font-medium">{layer.label}</span>
            </div>
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => setOpen(true)}
            >
              New Diagram
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DiagramList
            modelId={model?.id}
            projectId={projectId}
            layer={layer}
          />
        </CardContent>
      </Card>
      <DiagramFormDialog
        open={open}
        layer={layer}
        diagram={null}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        loading={createModel.isPending || createDiagram.isPending}
      />
    </>
  );
}

function DiagramListEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant={"icon"}>
          <LayoutDashboard className="size-8 text-muted-foreground/40" />
        </EmptyMedia>
        <EmptyTitle className="text-sm">
          No diagrams yet. Create your first one!
        </EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}

function DiagramListSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton
          key={index.toString()}
          className="h-5 w-full bg-gray-100 rounded-sm"
        />
      ))}
    </div>
  );
}

type DiagramListProps = {
  modelId?: string;
  projectId: string;
  layer: { label: string; value: LayerValue };
};

type DiagramSelected = Pick<Diagram, "name" | "description" | "type" | "id">;

function DiagramList({ modelId, projectId, layer }: DiagramListProps) {
  const [open, setOpen] = useState(false);

  const [diagramSelected, setDiagramSelected] =
    useState<DiagramSelected | null>(null);

  const confirm = useConfirm();

  const queryClient = useQueryClient();

  const removeDiagram = useRemoveDiagram();

  const updateDiagram = useUpdateDiagram();

  const { data: diagrams, isLoading } = useGetDiagramsByModelId(modelId);

  const handleRemoveDiagram = useCallback(
    (event: SyntheticEvent, diagram: { id: string; name: string }) => {
      event.preventDefault();

      if (!modelId || !diagram?.id) return;

      confirm({
        tone: "danger",
        title: "Delete Diagram",
        cancelText: "Cancel",
        confirmText: "Delete",
        description: `Are you sure you want to delete "${diagram?.name}"?`,
        onConfirm: () => {
          removeDiagram.mutate(diagram.id, {
            onSuccess: () => {
              toast.success("Diagram deleted successfully");
              queryClient.invalidateQueries({
                queryKey: getDiagramsByModelIdKey(modelId),
              });
            },
            onError: ({ message }) => {
              toast.error(message || "Error deleting diagram");
            },
          });
        },
      });
    },
    [confirm, modelId, removeDiagram, queryClient],
  );

  const handleUpdate = useCallback((diagram: DiagramSelected) => {
    setOpen(true);
    setDiagramSelected(diagram);
  }, []);

  const handleSubmit = useCallback(
    (values: DiagramFormValues) => {
      if (!modelId || !diagramSelected) return;

      updateDiagram.mutate(
        {
          id: diagramSelected?.id,
          name: values?.name,
          description: values?.description,
        },
        {
          onSuccess: () => {
            setOpen(false);
            setDiagramSelected(null);
            toast.success("Diagram updated successfully");
            queryClient.invalidateQueries({
              queryKey: getDiagramsByModelIdKey(modelId),
            });
          },
          onError: ({ message }) => {
            toast.error(message || "Error updating diagram");
          },
        },
      );
    },
    [updateDiagram, diagramSelected, modelId, queryClient],
  );

  if (isLoading) {
    return <DiagramListSkeleton />;
  }

  if (!diagrams?.length) {
    return <DiagramListEmpty />;
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        {diagrams.map((diagram) => (
          <div
            key={diagram.id}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors group"
          >
            <Link
              href={`/dashboard/project/${projectId}/diagram/${diagram.id}`}
              className="flex items-center gap-2 flex-1 min-w-0"
            >
              <FileBarChart2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{diagram.name}</span>
              <span className="font-mono text-xs text-muted-foreground shrink-0">
                {diagram.type}
              </span>
            </Link>

            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    onClick={() =>
                      handleUpdate({
                        id: diagram.id,
                        name: diagram.name,
                        type: diagram.type,
                        description: diagram.description,
                      })
                    }
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit diagram</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 text-destructive hover:text-destructive"
                    onClick={(event) =>
                      handleRemoveDiagram(event, {
                        id: diagram.id,
                        name: diagram.name,
                      })
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete diagram</TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
      <DiagramFormDialog
        open={open}
        layer={layer}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        diagram={
          diagramSelected
            ? {
                name: diagramSelected?.name,
                type: diagramSelected.type,
                description: diagramSelected.description,
              }
            : null
        }
        loading={updateDiagram.isPending}
      />
    </>
  );
}
