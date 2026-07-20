import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/modules/shared/ui/components/ui/empty";
import { FolderOpen } from "lucide-react";
import dynamic from "next/dynamic";

const NewProjectButton = dynamic(() =>
  import("./new-project-button").then((mod) => mod.NewProjectButton),
);

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
          <NewProjectButton />
        </EmptyContent>
      )}
    </Empty>
  );
}
