"use client";

import { getDiagramTypesForLayer } from "@/modules/model/ui/helpers/diagram";
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
import { useCallback, useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type DiagramFormValues, diagramFormSchema } from "../schemas/diagram";

type CreateDiagramDialogProps = {
  layer: {
    label: string;
    value: LayerValue;
  };
  open: boolean;
  loading: boolean;
  onOpenChange: (value: boolean) => void;
  onSubmit: (values: DiagramFormValues) => void;
};

export function CreateDiagramDialog({
  open,
  layer,
  loading,
  onSubmit,
  onOpenChange,
}: CreateDiagramDialogProps) {
  const form = useForm<DiagramFormValues>({
    resolver: zodResolver(diagramFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const diagramTypeOptions = useMemo(
    () =>
      getDiagramTypesForLayer(layer.value).map((diagram) => ({
        label: diagram.label,
        value: diagram.value,
      })),
    [layer.value],
  );

  const fields = useMemo<FieldDef[]>(
    () => [
      {
        name: "type",
        label: "نوع دیاگرام",
        type: "select",
        options: diagramTypeOptions,
        className: "w-full",
        placeholder: "نوع دیاگرام را انتخاب کنید",
      },
      {
        name: "name",
        label: "نام دیاگرام",
        type: "text",
        placeholder: "کانتکست دیاگرام",
      },
      {
        name: "description",
        label: "توضیحات",
        type: "textarea",
        placeholder: "اختیاری",
      },
    ],
    [diagramTypeOptions],
  );

  const handleSubmit: SubmitHandler<DiagramFormValues> = useCallback(
    (values) => {
      onSubmit(values);
    },
    [onSubmit],
  );
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ایجاد دیاگرام</DialogTitle>
          <DialogDescription>
            یک دیاگرام برای لایه <b className="mx-0.5">{layer.label}</b> بسازید
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldRenderer fields={fields} />
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                انصراف
              </Button>
              <Button loading={loading} type="submit">
                ایجاد و باز کردن
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
