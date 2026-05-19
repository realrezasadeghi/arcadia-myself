"use client";

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
import { useCallback, useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateProject } from "../clients/create";
import { useUpdateProject } from "../clients/update";
import { type ProjectFormValues, projectFormSchema } from "../schemas/project";
import type { Project } from "../types/project";

const projectFields: FieldDef[] = [
  {
    name: "name",
    label: "نام پروژه *",
    type: "text",
    placeholder: "مثال: سیستم IFE هواپیما",
    dir: "rtl",
  },
  {
    name: "description",
    label: "توضیحات",
    type: "textarea",
    placeholder: "توضیح مختصری از هدف این پروژه...",
  },
];

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  project: Project | null;
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
}: ProjectFormDialogProps) {
  const isEdit = !!project;
  const create = useCreateProject();
  const update = useUpdateProject();
  const isPending = create.isPending || update.isPending;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: project?.name ?? "",
        description: project?.description ?? "",
      });
    }
  }, [open, project, form]);

  const handleSubmit: SubmitHandler<ProjectFormValues> = useCallback(
    (values) => {
      const payload = {
        name: values.name,
        description: values.description ?? "",
      };
      if (isEdit && project) {
        update.mutate(
          { id: project.id, ...payload },
          {
            onError: (error) => {
              toast.error(error.message);
            },
            onSuccess: (data) => {
              onOpenChange(false);
              toast.success(data.message);
            },
          },
        );
      } else {
        create.mutate(payload, {
          onError: (error) => {
            toast.error(error.message);
          },
          onSuccess: (data) => {
            onOpenChange(false);
            toast.success(data.message);
          },
        });
      }
    },
    [project, isEdit, update, create, onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "ویرایش پروژه" : "پروژه جدید"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "مشخصات پروژه را ویرایش کنید"
              : "یک پروژه معماری جدید بسازید"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4 py-2"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FieldRenderer fields={projectFields} />

            <DialogFooter className="-mb-6">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
              >
                انصراف
              </Button>
              <Button type="submit" loading={isPending}>
                {isEdit ? "ذخیره تغییرات" : "ایجاد پروژه"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
