"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import type { Project } from "../types/project";
import { ProjectCard } from "./project-card";

const ProjectFormDialog = dynamic(() =>
  import("./project-form-dialog").then((mod) => mod.ProjectFormDialog),
);

const RemoveProjectDialog = dynamic(() =>
  import("./remove-project-dialog").then((mod) => mod.RemoveProjectDialog),
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
