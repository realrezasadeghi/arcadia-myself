"use client";

import type { Project } from "../types/project";
import { ProjectCard } from "./project-card";
import { RemoveProjectDialog } from "./remove-project-dialog";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

const ProjectFormDialog = dynamic(() =>
  import("./project-form-dialog").then((mod) => mod.ProjectFormDialog),
);

type ProjectCardWrapperProps = {
  project: Project;
};

export function ProjectCardWrapper({ project }: ProjectCardWrapperProps) {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const handleEdit = useCallback(() => {
    setFormDialogOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    setRemoveDialogOpen(true);
  }, []);

  return (
    <>
      <ProjectCard
        project={project}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProjectFormDialog
        open={formDialogOpen}
        project={project}
        onOpenChange={setFormDialogOpen}
      />

      <RemoveProjectDialog
        open={removeDialogOpen}
        project={project}
        onOpenChange={setRemoveDialogOpen}
      />
    </>
  );
}
