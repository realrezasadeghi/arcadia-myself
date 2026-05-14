"use client";

import { ProjectList } from "@/modules/project/ui/components/project-list";
import { ProjectToolbar } from "@/modules/project/ui/components/project-toolbar";
import type { Project } from "@/modules/project/ui/types/project";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { ProjectListEmpty } from "../components/project-list-empty";

const ProjectFormDialog = dynamic(() =>
  import("./project-form-dialog").then((mod) => mod.ProjectFormDialog),
);
const RemoveProjectDialog = dynamic(() =>
  import("./remove-project-dialog").then((mod) => mod.RemoveProjectDialog),
);

type Props = {
  projects: Project[];
};

export function ProjectContainer({ projects }: Props) {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleCreate = useCallback(() => {
    setSelectedProject(null);
    setFormDialogOpen(true);
  }, []);

  const handleEdit = useCallback((project: Project) => {
    setSelectedProject(project);
    setFormDialogOpen(true);
  }, []);

  const handleDelete = useCallback((project: Project) => {
    setSelectedProject(project);
    setRemoveDialogOpen(true);
  }, []);

  return (
    <div className="space-y-6">
      <ProjectToolbar onCreate={handleCreate} />

      <div className="p-6">
        {projects.length ? (
          <ProjectList
            projects={projects}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <ProjectListEmpty
            title="پروژه ای یافت نشد"
            description="پروژه ای در حال حاضر یافت نشد می‌توانید پروژه جدیدی ایجاد کنید"
          />
        )}
      </div>

      <ProjectFormDialog
        open={formDialogOpen}
        project={selectedProject}
        onOpenChange={setFormDialogOpen}
      />

      <RemoveProjectDialog
        open={removeDialogOpen}
        project={selectedProject}
        onOpenChange={setRemoveDialogOpen}
      />
    </div>
  );
}
