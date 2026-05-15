import { Button } from "@/modules/shared/ui/components/ui/button";
import { ArrowRight, GitMerge, Users } from "lucide-react";
import Link from "next/link";
import type { Project } from "../types/project";

interface ProjectHeaderProps {
  project: Project;
  onManageMembers?: () => void;
}

export function ProjectDetailsToolbar({
  project,
  onManageMembers,
}: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <Button variant={"link"} className="text-muted-foreground" asChild>
          <Link href={"/dashboard/project"}>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold truncate">{project.name}</h1>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onManageMembers}
          className="h-8 gap-1.5"
        >
          <Users className="h-3.5 w-3.5" />
          {project.members.length} عضو
        </Button>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 shrink-0"
        >
          <Link href={`/dashboard/project/${project.id}/traces`}>
            <GitMerge className="size-3.5" />
            Trace
          </Link>
        </Button>
      </div>
    </div>
  );
}
