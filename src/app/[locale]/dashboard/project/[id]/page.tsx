import { WorkbenchView } from "@/modules/model/ui/components/workbench/workbench-view";
import { getProjectById } from "@/modules/project/presentation/server-actions/get-by-id";
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

function WorkbenchLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner />
    </div>
  );
}

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<WorkbenchLoading />}>
      <WorkbenchView params={params} />
    </Suspense>
  );
}
