import { Button } from "@/modules/shared/ui/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/modules/shared/ui/components/ui/empty";
import { FolderOpen, Plus } from "lucide-react";

interface ProjectsEmptyStateProps {
  title: string;
  description: string;
  onProjectCreate?: () => void;
}

export function ProjectListEmpty({
  title,
  description,
  onProjectCreate,
}: ProjectsEmptyStateProps) {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {onProjectCreate && (
        <EmptyContent>
          <Button onClick={onProjectCreate} variant="outline" className="gap-2">
            <Plus className="size-4" />
            ایجاد پروژه
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
