"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useIFEProject } from "@/modules/model/ui/clients/ife";
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
import { useCreateProject } from "../clients/create";
import { useUpdateProject } from "../clients/update";
import { type ProjectFormValues, projectFormSchema } from "../schemas/project";
import type { Project } from "../types/project";

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
  const ife = useIFEProject();
  const queryClient = useQueryClient();
  const router = useRouter();
  const isPending = create.isPending || update.isPending || ife.isPending;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { name: "", description: "", isSeed: false },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: project?.name ?? "",
        description: project?.description ?? "",
      });
    }
  }, [open, project, form]);

  const fields = useMemo<FieldDef[]>(
    () => [
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
      {
        name: "isSeed",
        label: "مدل IFE به طور پیشفرض ایجاد شود ؟ ",
        type: "checkbox",
        visible: !isEdit,
      },
    ],
    [isEdit],
  );

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
          onSuccess: ({ data, message }) => {
            if (values.isSeed) {
              ife.mutate(String(data.id), {
                onSuccess({ message: seedMessage }) {
                  onOpenChange(false);
                  toast.success(seedMessage || message);
                  queryClient.invalidateQueries();
                  router.push(`/dashboard/project/${data.id}`);
                },
                onError(error) {
                  toast.error(error.message || "خطا در ایجاد مدل IFE");
                },
              });
              return;
            }
            onOpenChange(false);
            toast.success(message);
            queryClient.invalidateQueries();
          },
        });
      }
    },
    [project, isEdit, update, create, onOpenChange, ife, queryClient, router],
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
            <FieldRenderer fields={fields} />

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
