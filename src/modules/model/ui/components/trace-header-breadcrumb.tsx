import { ArrowLeft, GitMerge } from "lucide-react";
import Link from "next/link";
import { getProjectById } from "@/modules/project/presentation/server-actions/get-by-id";
import { Button } from "@/modules/shared/ui/components/ui/button";
import { getTraceLinksByProjectId } from "../../presentation/server-actions/get-trace-links-by-project-id";

export type TraceHeaderBreadcrumbProps = {
  params: Promise<{ id: string }>;
};
export async function TraceHeaderBreadcrumb({
  params,
}: TraceHeaderBreadcrumbProps) {
  const { id: projectId } = await params;

  const [project, traceLinks] = await Promise.all([
    getProjectById(+projectId),
    getTraceLinksByProjectId(projectId),
  ]);

  return (
    <div className="flex items-start gap-4">
      <Button variant="ghost" size="icon" className="size-4 mt-0.5" asChild>
        <Link href={`/dashboard/project/${projectId}`}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold">Traceability Matrix</h1>
        {project?.data?.name && (
          <p className="mt-1 text-sm text-muted-foreground">
            {project.data.name}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <GitMerge className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {traceLinks?.data?.length ?? 0} links
        </span>
      </div>
    </div>
  );
}
