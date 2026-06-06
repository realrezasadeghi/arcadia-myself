import { ProjectListSkeleton } from "@/modules/project/ui/components/project-list-skeleton";
import { ProjectView } from "@/modules/project/ui/views/project";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function Page() {
  return (
    <Suspense fallback={<ProjectListSkeleton />}>
      <ProjectView />
    </Suspense>
  );
}
