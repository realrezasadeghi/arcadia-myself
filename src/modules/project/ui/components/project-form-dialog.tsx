"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
  const isPending = create.isPending || update.isPending;
  const router = useRouter();

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
        label: "Project Name *",
        type: "text",
        placeholder: "e.g. IFE System",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Brief description of the project purpose...",
      },
      {
        name: "isSeed",
        label: "Pre-populate with IFE example model",
        type: "checkbox",
        visible: !isEdit,
      },
    ],
    [isEdit],
  );

  const ife = useIFEProject();

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
              router.refresh();
            },
          },
        );
      } else {
        create.mutate(payload, {
          onError: (error) => {
            toast.error(error.message);
          },
          onSuccess: ({ data, message }) => {
            onOpenChange(false);
            toast.success(message);
            router.refresh();
            if (values.isSeed) {
              ife.mutate(String(data.id));
            }
          },
        });
      }
    },
    [project, isEdit, update, create, onOpenChange, ife, router],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Project" : "New Project"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edit the project details"
              : "Create a new architecture project"}
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
                Cancel
              </Button>
              <Button type="submit" loading={isPending}>
                {isEdit ? "Save Changes" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
