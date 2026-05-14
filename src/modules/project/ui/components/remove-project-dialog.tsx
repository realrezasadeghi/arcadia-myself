"use client";

import { Button } from "@/modules/shared/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/ui/components/ui/dialog";
import { toast } from "sonner";
import { useRemoveProject } from "../clients/remove";
import type { Project } from "../types/project";

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  project: Project | null;
}

export function RemoveProjectDialog({
  open,
  onOpenChange,
  project,
}: DeleteProjectDialogProps) {
  const removeProject = useRemoveProject();

  function handleConfirm() {
    if (!project) return;
    removeProject.mutate(project.id, {
      onSuccess(data) {
        toast.success(data.message);
        onOpenChange(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>حذف پروژه</DialogTitle>
          <DialogDescription>
            آیا از حذف پروژه{" "}
            <span className="font-semibold text-foreground">
              «{project?.name}»
            </span>
            مطمئن هستید؟ این عمل برگشت‌پذیر نیست.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={removeProject.isPending}
            onClick={() => onOpenChange(false)}
          >
            انصراف
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={removeProject.isPending}
          >
            حذف پروژه
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
