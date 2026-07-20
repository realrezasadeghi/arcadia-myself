import { ProjectListSection } from "@/modules/project/ui/components/project-list-section";
import { ProjectListSkeleton } from "@/modules/project/ui/components/project-list-skeleton";
import { ProjectToolbar } from "@/modules/project/ui/components/project-toolbar";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Projects",
};

type Props = {
  searchParams: Promise<{ search?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { search } = await searchParams;

  return (
    <div className="min-h-screen bg-background">
      <ProjectToolbar searchQuery={search ?? ""} />

      <div className="p-6">
        <Suspense fallback={<ProjectListSkeleton />}>
          <ProjectListSection searchQuery={search ?? ""} />
        </Suspense>
      </div>
    </div>
  );
}
