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
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &ldquo;{project?.name}&rdquo;
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={removeProject.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={removeProject.isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
