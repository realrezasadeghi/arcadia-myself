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
import Link from "next/link";

interface ProjectListEmptyProps {
  title: string;
  description: string;
  showCreateButton?: boolean;
}

export function ProjectListEmpty({
  title,
  description,
  showCreateButton,
}: ProjectListEmptyProps) {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {showCreateButton && (
        <EmptyContent>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard/project/new">
              <Plus className="size-4" />
              Create Project
            </Link>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
