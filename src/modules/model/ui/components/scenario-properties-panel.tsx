"use client";

import { Input } from "@/modules/shared/ui/components/ui/input";
import { Label } from "@/modules/shared/ui/components/ui/label";
import { ScrollArea } from "@/modules/shared/ui/components/ui/scroll-area";
import { Separator } from "@/modules/shared/ui/components/ui/separator";
import { Checkbox } from "@/modules/shared/ui/components/ui/checkbox";
import { Settings, MessageSquare, Square, WrapText } from "lucide-react";
import { useCallback } from "react";
import { useScenarioCanvasStore } from "../stores/scenario-canvas";
import { useUpdateScenarioLifeline } from "../clients/update-scenario-lifeline";
import { useUpdateScenarioMessage } from "../clients/update-scenario-message";
import { useUpdateScenarioFragment } from "../clients/update-scenario-fragment";
import { toast } from "sonner";

export function ScenarioPropertiesPanel() {
  const selectedNodeId = useScenarioCanvasStore((s) => s.selectedNodeId);
  const selectedEdgeId = useScenarioCanvasStore((s) => s.selectedEdgeId);
  const nodes = useScenarioCanvasStore((s) => s.nodes);
  const edges = useScenarioCanvasStore((s) => s.edges);

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId)
    : null;
  const selectedEdge = selectedEdgeId
    ? edges.find((e) => e.id === selectedEdgeId)
    : null;

  return (
    <aside className="flex h-full min-h-0 flex-col border-l bg-card">
      <div className="flex h-8 shrink-0 items-center gap-1.5 border-b bg-muted/30 px-3">
        <Settings className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Properties
        </p>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        {selectedNode?.type === "lifeline" ? (
          <LifelineProperties node={selectedNode} />
        ) : selectedNode?.type === "fragment" ? (
          <FragmentProperties node={selectedNode} />
        ) : selectedEdge ? (
          <MessageProperties edge={selectedEdge} />
        ) : (
          <div className="flex flex-1 items-center justify-center p-4 text-center">
            <p className="text-[11px] text-muted-foreground">
              Select an element to view its properties
            </p>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}

function LifelineProperties({ node }: { node: any }) {
  const updateLifeline = useUpdateScenarioLifeline();
  const { lifeline } = node.data;

  const handleSelectorChange = useCallback(
    (value: string) => {
      updateLifeline.mutate(
        {
          id: lifeline.id,
          selector: value || undefined,
        },
        {
          onSuccess: () => {
            toast.success("Lifeline updated");
          },
        },
      );
    },
    [lifeline.id, updateLifeline],
  );

  const handleDecomposedChange = useCallback(
    (checked: boolean) => {
      updateLifeline.mutate(
        {
          id: lifeline.id,
          decomposed: checked,
        },
        {
          onSuccess: () => {
            toast.success("Lifeline updated");
          },
        },
      );
    },
    [lifeline.id, updateLifeline],
  );

  return (
    <div className="p-3 space-y-4">
      <div className="flex items-center gap-2">
        <Square className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Lifeline</h3>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Type</Label>
          <div className="text-sm text-muted-foreground">
            {lifeline.type.label}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lifeline-selector" className="text-xs">
            Selector
          </Label>
          <Input
            id="lifeline-selector"
            value={lifeline.selector ?? ""}
            onChange={(e) => handleSelectorChange(e.target.value)}
            placeholder="e.g. :SystemA"
            className="h-7 text-xs"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="lifeline-decomposed" className="text-xs">
            Decomposed
          </Label>
          <Checkbox
            id="lifeline-decomposed"
            checked={lifeline.decomposed}
            onCheckedChange={(checked) => handleDecomposedChange(checked === true)}
          />
        </div>
      </div>
    </div>
  );
}

function FragmentProperties({ node }: { node: any }) {
  const updateFragment = useUpdateScenarioFragment();
  const { fragment, operator, guard } = node.data;

  const handleGuardChange = useCallback(
    (value: string) => {
      updateFragment.mutate(
        {
          id: fragment.id,
          guard: value || undefined,
        },
        {
          onSuccess: () => {
            toast.success("Fragment updated");
          },
        },
      );
    },
    [fragment.id, updateFragment],
  );

  return (
    <div className="p-3 space-y-4">
      <div className="flex items-center gap-2">
        <WrapText className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Fragment</h3>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Operator</Label>
          <div className="text-sm text-muted-foreground">{operator}</div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Type</Label>
          <div className="text-sm text-muted-foreground">
            {fragment.type.label}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fragment-guard" className="text-xs">
            Guard
          </Label>
          <Input
            id="fragment-guard"
            value={guard ?? ""}
            onChange={(e) => handleGuardChange(e.target.value)}
            placeholder="e.g. x > 0"
            className="h-7 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Child Fragments</Label>
          <div className="text-sm text-muted-foreground">
            {fragment.childFragmentIds.length}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Messages</Label>
          <div className="text-sm text-muted-foreground">
            {fragment.messageIds.length}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageProperties({ edge }: { edge: any }) {
  const updateMessage = useUpdateScenarioMessage();
  const { message, sort, label, signature, sequenceOrder } = edge.data;

  const handleNameChange = useCallback(
    (value: string) => {
      updateMessage.mutate(
        {
          id: message.id,
          name: value,
        },
        {
          onSuccess: () => {
            toast.success("Message updated");
          },
        },
      );
    },
    [message.id, updateMessage],
  );

  const handleSignatureChange = useCallback(
    (value: string) => {
      updateMessage.mutate(
        {
          id: message.id,
          signature: value || undefined,
        },
        {
          onSuccess: () => {
            toast.success("Message updated");
          },
        },
      );
    },
    [message.id, updateMessage],
  );

  const handleSortChange = useCallback(
    (value: string) => {
      // Sort is immutable after creation, but we can show it
      toast.info("Message sort cannot be changed after creation");
    },
    [],
  );

  return (
    <div className="p-3 space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Message</h3>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="message-name" className="text-xs">
            Name
          </Label>
          <Input
            id="message-name"
            value={label ?? ""}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. requestData"
            className="h-7 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Sort</Label>
          <div className="text-sm text-muted-foreground">{sort.label}</div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="message-signature" className="text-xs">
            Signature
          </Label>
          <Input
            id="message-signature"
            value={signature ?? ""}
            onChange={(e) => handleSignatureChange(e.target.value)}
            placeholder="e.g. : Response"
            className="h-7 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Sequence Order</Label>
          <div className="text-sm text-muted-foreground">#{sequenceOrder}</div>
        </div>
      </div>
    </div>
  );
}
