"use client";

import { Button } from "@/modules/shared/ui/components/ui/button";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

const ProjectFormDialog = dynamic(() =>
  import("./project-form-dialog").then((mod) => mod.ProjectFormDialog),
);

export function NewProjectButton() {
  const [open, setOpen] = useState(false);

  const handleOpenChange = useCallback((value: boolean) => {
    setOpen(value);
  }, []);

  return (
    <>
      <Button className="gap-2" onClick={() => handleOpenChange(true)}>
        <Plus className="h-4 w-4" />
        New Project
      </Button>

      <ProjectFormDialog
        open={open}
        project={null}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
