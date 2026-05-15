import { getProjectById } from "@/modules/project/presentation/server-actions/get-by-id";
import { LayerBadge } from "@/modules/project/ui/components/layer";
import { ProjectDetailsToolbar } from "@/modules/project/ui/components/project-details-toolbar";

type Props = {
  params: Promise<{ id: string }>;
};

const LAYERS = [
  {
    value: "OA",
    label: "تحلیل عملیاتی",
  },
  {
    value: "SA",
    label: "تحلیل سیستمی",
  },
  {
    value: "LA",
    label: "معماری منطقی",
  },
  {
    value: "PA",
    label: "معماری فیزیکی",
  },
];

export default async function Page({ params }: Props) {
  const { id } = await params;

  const { data: project } = await getProjectById(Number(id));

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <ProjectDetailsToolbar project={project} />
      <div className="flex items-center gap-2 overflow-x-auto">
        {LAYERS.map((layer) => (
          <LayerBadge key={layer.value} layer={layer} />
        ))}
      </div>
    </div>
  );
}
