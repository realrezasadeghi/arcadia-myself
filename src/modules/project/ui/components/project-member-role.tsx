"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/modules/shared/ui/components/ui/badge";
import type { ProjectRoleName } from "../../domain/value-objects/project-role";

const ROLE_I18N_KEYS: Record<ProjectRoleName, string> = {
  project_viewer: "roles.project_viewer",
  oa_viewer: "roles.oa_viewer",
  oa_editor: "roles.oa_editor",
  sa_viewer: "roles.sa_viewer",
  sa_editor: "roles.sa_editor",
  la_viewer: "roles.la_viewer",
  la_editor: "roles.la_editor",
  pa_viewer: "roles.pa_viewer",
  pa_editor: "roles.pa_editor",
  project_inviter: "roles.project_inviter",
  admin: "roles.admin",
};

interface ProjectMemberBadgeProps {
  roles: ProjectRoleName[];
}

export function ProjectMemberBadge({ roles }: ProjectMemberBadgeProps) {
  const t = useTranslations("project");

  if (roles.length === 0) {
    return null;
  }

  return (
    <span className="inline-flex flex-wrap gap-1">
      {roles.map((role) => (
        <Badge key={role} variant="secondary" className="text-xs">
          {t(ROLE_I18N_KEYS[role])}
        </Badge>
      ))}
    </span>
  );
}
