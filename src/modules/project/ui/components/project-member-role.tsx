import { Badge } from "@/modules/shared/ui/components/ui/badge";
import type { ProjectMemberRole } from "../types/project";

const ROLE_LABELS: Record<ProjectMemberRole, string> = {
  OWNER: "مالک",
  EDITOR: "ویرایشگر",
  VIEWER: "بیننده",
};

interface ProjectMemberBadgeProps {
  role: ProjectMemberRole;
}

export function ProjectMemberBadge({ role }: ProjectMemberBadgeProps) {
  return (
    <Badge variant="secondary" className="text-xs">
      {ROLE_LABELS[role] ?? role}
    </Badge>
  );
}
