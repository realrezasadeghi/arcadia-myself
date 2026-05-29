import { getProjectById } from "@/modules/project/presentation/server-actions/get-by-id";
import { ProjectDetailsView } from "@/modules/project/ui/views/project-details";
import { Spinner } from "@/modules/shared/ui/components/ui/spinner";
import type { Metadata } from "next";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = await params;
  const project = await getProjectById(+id);
  return {
    title: project?.data?.name,
    description: project?.data?.description,
  };
};

function ProjectDetailsLoading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Spinner />
    </div>
  );
}

export default async function Page({ params }: Props) {
  return (
    <Suspense fallback={<ProjectDetailsLoading />}>
      <ProjectDetailsView params={params} />
    </Suspense>
  );
}
