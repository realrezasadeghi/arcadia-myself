"use client";

import { getDiagramTypesForLayer } from "@/modules/model/ui/helpers/diagram";
import type { Diagram } from "@/modules/model/ui/types/diagram";
import type { LayerValue } from "@/modules/model/ui/types/layer";
import {
  type FieldDef,
  FieldRenderer,
} from "@/modules/shared/ui/components/common/field-renderer";
import { Button } from "@/modules/shared/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/ui/components/ui/dialog";
import { Form } from "@/modules/shared/ui/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type DiagramFormValues, diagramFormSchema } from "../schemas/diagram";

interface DiagramFormDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  layer: {
    label: string;
    value: LayerValue;
  };
  onSubmit: (values: DiagramFormValues) => void;
  diagram: Pick<Diagram, "name" | "description" | "type"> | null;
  loading?: boolean;
}

export function DiagramFormDialog({
  open,
  onOpenChange,
  layer,
  onSubmit,
  diagram,
  loading = false,
}: DiagramFormDialogProps) {
  const isEdit = !!diagram;

  const form = useForm<DiagramFormValues>({
    resolver: zodResolver(diagramFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        type: diagram?.type,
        name: diagram?.name ?? "",
        description: diagram?.description ?? "",
      });
    }
  }, [open, diagram, form]);

  const diagramTypeOptions = useMemo(
    () =>
      getDiagramTypesForLayer(layer.value).map((d) => ({
        label: d.label,
        value: d.value,
      })),
    [layer.value],
  );

  const fields = useMemo<FieldDef[]>(
    () => [
      {
        name: "type",
        label: "Diagram Type",
        type: "select",
        disabled: isEdit,
        className: "w-full",
        options: diagramTypeOptions,
        placeholder: "Select diagram type",
      },
      {
        name: "name",
        label: "Diagram Name",
        type: "text",
        placeholder: "Context Diagram",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Optional",
      },
    ],
    [diagramTypeOptions, isEdit],
  );

  const handleSubmit: SubmitHandler<DiagramFormValues> = useCallback(
    (values) => {
      onSubmit(values);
    },
    [onSubmit],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Diagram" : "Create Diagram"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Edit "${diagram?.name}" in ${layer.label} layer`
              : `Create a new diagram in ${layer.label} layer`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4 py-2"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FieldRenderer fields={fields} />

            <DialogFooter className="-mb-6">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                {isEdit ? "Save Changes" : "Create & Open"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
