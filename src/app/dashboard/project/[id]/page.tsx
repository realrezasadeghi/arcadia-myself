import { Suspense } from "react";
import { ProjectDetailsView } from "@/modules/project/ui/views/project-details";
import { Spinner } from "@/modules/shared/ui/components/ui/spinner";

type Props = {
  params: Promise<{ id: string }>;
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
