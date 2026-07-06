import { notFound } from "next/navigation";
import { getScenarioData } from "@/modules/model/presentation/server-actions/scenario/get-data";
import { ScenarioCanvas } from "./scenario-canvas";

export type ScenarioCanvasPageProps = {
  params: Promise<{ id: string; diagramId: string }>;
};

export async function ScenarioCanvasPage({ params }: ScenarioCanvasPageProps) {
  const { diagramId } = await params;

  if (!diagramId) {
    notFound();
  }

  const result = await getScenarioData({ diagramId });

  if (!result.success || !result.data) {
    notFound();
  }

  const { diagram, lifelines, messages, fragments } = result.data;

  if (!diagram) {
    notFound();
  }

  return (
    <ScenarioCanvas
      diagram={diagram}
      lifelines={lifelines}
      messages={messages}
      fragments={fragments}
    />
  );
}