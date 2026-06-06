import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string; diagramId: string }>;
};

/**
 * Deep-link compatibility route.
 *
 * The diagram editor now lives inside the tabbed Workbench at the project
 * route. Any old `/diagram/:diagramId` link redirects into the Workbench with
 * that diagram opened as a tab (`?diagram=<id>`).
 */
export default async function DiagramPage({ params }: Props) {
  const { id, diagramId } = await params;
  redirect(`/dashboard/project/${id}?diagram=${diagramId}`);
}
