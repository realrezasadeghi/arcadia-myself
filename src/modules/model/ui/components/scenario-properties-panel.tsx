"use client";

import {
  MessageSquare,
  MousePointerClick,
  Puzzle,
  Waypoints,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/modules/shared/ui/components/ui/button";
import { Input } from "@/modules/shared/ui/components/ui/input";
import { Label } from "@/modules/shared/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/ui/components/ui/select";
import { Separator } from "@/modules/shared/ui/components/ui/separator";
import { useGetLifelinesByScenarioId } from "../clients/get-lifelines-by-scenario-id";
import { useWorkbenchStore } from "../stores/workbench";

type ScenarioPropertiesPanelProps = {
  scenarioId: string;
  selectedLifeline?: {
    id: string;
    name: string;
    representedElementType: string;
    lifelineId: string;
  } | null;
  selectedMessage?: {
    id: string;
    name: string;
    kind: string;
    sourceLifelineId: string;
    targetLifelineId: string;
    executionOrder: number;
    messageId: string;
  } | null;
  selectedFragment?: {
    id: string;
    name: string;
    operator: string;
    guard: string;
  } | null;
  onUpdateLifeline?: (data: { id: string; name: string }) => void;
  onUpdateMessage?: (data: { id: string; name: string; kind: string }) => void;
  onUpdateFragment?: (data: {
    id: string;
    name: string;
    guard: string;
  }) => void;
};

export function ScenarioPropertiesPanel({
  scenarioId,
  selectedLifeline,
  selectedMessage,
  selectedFragment,
  onUpdateLifeline,
  onUpdateMessage,
  onUpdateFragment,
}: ScenarioPropertiesPanelProps) {
  const setPanel = useWorkbenchStore((s) => s.setPanel);

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-card">
      <div className="sticky top-0 z-10 flex h-8 shrink-0 items-center justify-between border-b bg-muted/30 px-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Properties
        </p>
        <Button
          size="icon"
          variant="ghost"
          className="size-6"
          onClick={() => setPanel("properties", false)}
          aria-label="Close Properties"
        >
          <X className="size-3.5" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {selectedLifeline && (
          <LifelineProperties
            lifeline={selectedLifeline}
            onUpdate={onUpdateLifeline}
          />
        )}
        {selectedMessage && (
          <MessageProperties
            message={selectedMessage}
            scenarioId={scenarioId}
            onUpdate={onUpdateMessage}
          />
        )}
        {selectedFragment && (
          <FragmentProperties
            fragment={selectedFragment}
            onUpdate={onUpdateFragment}
          />
        )}

        {!selectedLifeline && !selectedMessage && !selectedFragment && (
          <div className="flex flex-col items-center justify-center text-center gap-3 text-muted-foreground">
            <MousePointerClick className="size-8 opacity-30" />
            <p className="text-xs leading-relaxed max-w-45">
              Select a lifeline, message, or fragment on the canvas
              <br />
              to view its details
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

function LifelineProperties({
  lifeline,
  onUpdate,
}: {
  lifeline: { id: string; name: string; representedElementType: string };
  onUpdate?: (data: { id: string; name: string }) => void;
}) {
  const [name, setName] = useState(lifeline.name);

  useEffect(() => {
    setName(lifeline.name);
  }, [lifeline.name]);

  const handleSave = useCallback(() => {
    if (name.trim() && name !== lifeline.name) {
      onUpdate?.({ id: lifeline.id, name: name.trim() });
    }
  }, [name, lifeline, onUpdate]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Waypoints className="size-4 text-muted-foreground" />
        <p className="text-sm font-medium">Lifeline</p>
      </div>
      <Separator />
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Type</Label>
        <p className="text-xs text-muted-foreground">
          {lifeline.representedElementType}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs" htmlFor="lifeline-name">
          Name
        </Label>
        <Input
          id="lifeline-name"
          value={name}
          onBlur={handleSave}
          className="h-8 text-sm"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      </div>
    </div>
  );
}

function MessageProperties({
  message,
  scenarioId,
  onUpdate,
}: {
  message: {
    id: string;
    name: string;
    kind: string;
    sourceLifelineId: string;
    targetLifelineId: string;
  };
  scenarioId: string;
  onUpdate?: (data: { id: string; name: string; kind: string }) => void;
}) {
  const [name, setName] = useState(message.name);
  const [kind, setKind] = useState(message.kind);
  const { data: lifelines } = useGetLifelinesByScenarioId(scenarioId);

  useEffect(() => {
    setName(message.name);
    setKind(message.kind);
  }, [message.name, message.kind]);

  const handleSave = useCallback(() => {
    onUpdate?.({ id: message.id, name: name.trim(), kind });
  }, [name, kind, message.id, onUpdate]);

  const sourceLifeline = lifelines?.find(
    (l) => l.id === message.sourceLifelineId,
  );
  const targetLifeline = lifelines?.find(
    (l) => l.id === message.targetLifelineId,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-4 text-muted-foreground" />
        <p className="text-sm font-medium">Message</p>
      </div>
      <Separator />
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Source</Label>
        <p className="text-xs text-muted-foreground">
          {sourceLifeline?.name ?? "Unknown"}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Target</Label>
        <p className="text-xs text-muted-foreground">
          {targetLifeline?.name ?? "Unknown"}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Kind</Label>
        <Select
          value={kind}
          onValueChange={(v) => {
            setKind(v);
          }}
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CALL">Synchronous Call</SelectItem>
            <SelectItem value="CREATE">Create</SelectItem>
            <SelectItem value="DELETE">Delete</SelectItem>
            <SelectItem value="RETURN">Return</SelectItem>
            <SelectItem value="REPLY">Reply</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs" htmlFor="message-name">
          Name
        </Label>
        <Input
          id="message-name"
          value={name}
          onBlur={handleSave}
          className="h-8 text-sm"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      </div>
    </div>
  );
}

function FragmentProperties({
  fragment,
  onUpdate,
}: {
  fragment: { id: string; name: string; operator: string; guard: string };
  onUpdate?: (data: { id: string; name: string; guard: string }) => void;
}) {
  const [name, setName] = useState(fragment.name);
  const [guard, setGuard] = useState(fragment.guard);

  useEffect(() => {
    setName(fragment.name);
    setGuard(fragment.guard);
  }, [fragment.name, fragment.guard]);

  const handleSave = useCallback(() => {
    onUpdate?.({ id: fragment.id, name: name.trim(), guard: guard.trim() });
  }, [name, guard, fragment.id, onUpdate]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Puzzle className="size-4 text-muted-foreground" />
        <p className="text-sm font-medium">Fragment</p>
      </div>
      <Separator />
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Operator</Label>
        <p className="text-xs text-muted-foreground font-mono font-bold uppercase">
          {fragment.operator}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs" htmlFor="fragment-name">
          Name
        </Label>
        <Input
          id="fragment-name"
          value={name}
          onBlur={handleSave}
          className="h-8 text-sm"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs" htmlFor="fragment-guard">
          Guard Condition
        </Label>
        <Input
          id="fragment-guard"
          value={guard}
          onBlur={handleSave}
          className="h-8 text-sm"
          placeholder="[condition]"
          onChange={(e) => setGuard(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      </div>
    </div>
  );
}
