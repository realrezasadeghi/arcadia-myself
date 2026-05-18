"use client";

import { useCreateDiagram } from "@/modules/model/ui/clients/create-diagram";
import { useCreateModel } from "@/modules/model/ui/clients/create-model";
import { useGetDiagramsByModelId } from "@/modules/model/ui/clients/get-diagrams-by-model-id";
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
import { FileBarChart2, LayoutDashboard } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { DiagramFormValues } from "../schemas/diagram";
import { LayerBadge } from "./layer-badge";

const CreateDiagramDialog = dynamic(() =>
  import("./create-diagram-dialog").then((mod) => mod.CreateDiagramDialog),
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

  const createDiagram = useCreateDiagram();

  const handleCreateDiagram = useCallback(
    (values: DiagramFormValues) => {
      createDiagram.mutate(
        {
          type: values.type,
          name: values.name,
          modelId: model?.id as string,
          description: values.description,
        },
        {
          onError({ message }) {
            toast.error(message || "Error in create diagram");
          },
          onSuccess(data) {
            setOpen(false);
            router.push(
              `/dashboard/project/${projectId}/diagram/${data.data.id}`,
            );
          },
        },
      );
    },
    [createDiagram, model, router, projectId],
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
            onSuccess: () => {
              handleCreateDiagram(values);
            },
            onError: ({ message, data }) => {
              console.log("error", data);
              toast.error(message || "Error in create model");
            },
          },
        );
        return;
      }

      handleCreateDiagram(values);
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
              دیاگرام جدید
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DiagramList modelId={model?.id} projectId={projectId} />
        </CardContent>
      </Card>
      <CreateDiagramDialog
        open={open}
        layer={layer}
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
          دیاگرامی وجود نداره میتونی اولین دیاگرام تو بسازی!
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
  projectId?: string;
};

function DiagramList({ modelId, projectId }: DiagramListProps) {
  const { data: diagrams, isLoading } = useGetDiagramsByModelId(modelId);

  if (isLoading) {
    return <DiagramListSkeleton />;
  }

  if (!diagrams?.length) {
    return <DiagramListEmpty />;
  }

  return (
    <div className="flex flex-col gap-1">
      {diagrams.map((diagram) => (
        <Link
          key={diagram.id}
          href={`/dashboard/project/${projectId}/diagram/${diagram.id}`}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors"
        >
          <FileBarChart2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="flex-1 truncate">{diagram.name}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {diagram.type}
          </span>
        </Link>
      ))}
    </div>
  );
}
