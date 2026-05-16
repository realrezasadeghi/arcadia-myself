import { ErrorBoundary } from "@/modules/shared/ui/components/common/error-boundary";
import { TooltipProvider } from "@/modules/shared/ui/components/ui/tooltip";

type Props = {
  params: Promise<{ id: string; diagramId: string }>;
};
export default function Page({ params }: Props) {
  return (
    <ErrorBoundary>
      <TooltipProvider delayDuration={300}>
        <div className="min-h-screen flex flex-col overflow-hidden"></div>
      </TooltipProvider>
    </ErrorBoundary>
  );
}
