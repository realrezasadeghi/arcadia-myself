import { Suspense } from "react";
import { ProjectListSkeleton } from "@/modules/project/ui/components/project-list-skeleton";
import { ProjectView } from "@/modules/project/ui/views/project";

export default async function Page() {
  return (
    <Suspense fallback={<ProjectListSkeleton />}>
      <ProjectView />
    </Suspense>
  );
}
