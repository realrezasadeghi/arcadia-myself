"use client";

import {
  ArrowRight,
  Box,
  ChevronDown,
  ChevronRight,
  HardDrive,
  Layers,
  MessageSquare,
  Monitor,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useGetFragmentsByScenarioId } from "../../clients/get-fragments-by-scenario-id";
import { useGetLifelinesByScenarioId } from "../../clients/get-lifelines-by-scenario-id";
import { useGetMessagesByScenarioId } from "../../clients/get-messages-by-scenario-id";

type ScenarioDiagramChildrenProps = {
  diagramId: string;
};

type LifelineData = {
  id: string;
  name: string;
  representedElementType: string;
};

type MessageData = {
  id: string;
  name: string;
  kind: string;
};

type FragmentData = {
  id: string;
  name: string;
  operator: string;
  guard: string;
};

const LIFELINE_ICON_MAP: Record<string, typeof User> = {
  ACTOR: User,
  FUNCTION: Monitor,
  COMPONENT: HardDrive,
  CLASS_ELEMENT: Box,
  EXTERNAL: Users,
};

function getLifelineIcon(type: string) {
  return LIFELINE_ICON_MAP[type] ?? Monitor;
}

function LifelineItem({
  lifeline,
  depth,
}: {
  lifeline: LifelineData;
  depth: number;
}) {
  const Icon = getLifelineIcon(lifeline.representedElementType);
  return (
    <div
      className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-left hover:bg-muted"
      style={{ paddingLeft: `${12 + depth * 14}px` }}
    >
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate flex-1">{lifeline.name}</span>
      <span className="text-[9px] text-muted-foreground shrink-0">
        {lifeline.representedElementType}
      </span>
    </div>
  );
}

function MessageItem({
  message,
  depth,
}: {
  message: MessageData;
  depth: number;
}) {
  return (
    <div
      className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-left hover:bg-muted"
      style={{ paddingLeft: `${12 + depth * 14}px` }}
    >
      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate flex-1">{message.name}</span>
      <span className="text-[9px] text-muted-foreground shrink-0">
        {message.kind}
      </span>
    </div>
  );
}

function FragmentItem({
  fragment,
  depth,
}: {
  fragment: FragmentData;
  depth: number;
}) {
  return (
    <div
      className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-left hover:bg-muted"
      style={{ paddingLeft: `${12 + depth * 14}px` }}
    >
      <Layers className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate flex-1">{fragment.name}</span>
      <span className="text-[9px] text-muted-foreground shrink-0">
        [{fragment.operator}]
      </span>
    </div>
  );
}

export function ScenarioDiagramChildren({
  diagramId,
}: ScenarioDiagramChildrenProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["lifelines", "messages"]),
  );

  const { data: lifelinesData, isLoading: lifelinesLoading } =
    useGetLifelinesByScenarioId(diagramId);
  const { data: messagesData, isLoading: messagesLoading } =
    useGetMessagesByScenarioId(diagramId);
  const { data: fragmentsData, isLoading: fragmentsLoading } =
    useGetFragmentsByScenarioId(diagramId);

  const lifelines = (lifelinesData ?? []) as LifelineData[];
  const messages = (messagesData ?? []) as MessageData[];
  const fragments = (fragmentsData ?? []) as FragmentData[];

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const isLoading = lifelinesLoading || messagesLoading || fragmentsLoading;

  if (isLoading) {
    return (
      <div className="pl-8 py-1 text-[10px] text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="ml-2">
      {/* Lifelines */}
      {lifelines.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => toggleSection("lifelines")}
            className="flex w-full items-center gap-1 rounded-sm px-2 py-1 text-[10px] text-muted-foreground text-left transition-colors hover:bg-muted"
            style={{ paddingLeft: "26px" }}
          >
            {openSections.has("lifelines") ? (
              <ChevronDown className="size-2.5 shrink-0" />
            ) : (
              <ChevronRight className="size-2.5 shrink-0" />
            )}
            <Users className="size-3 shrink-0" />
            <span>Lifelines ({lifelines.length})</span>
          </button>
          {openSections.has("lifelines") && (
            <div>
              {lifelines.map((lifeline) => (
                <LifelineItem key={lifeline.id} lifeline={lifeline} depth={2} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="mt-0.5">
          <button
            type="button"
            onClick={() => toggleSection("messages")}
            className="flex w-full items-center gap-1 rounded-sm px-2 py-1 text-[10px] text-muted-foreground text-left transition-colors hover:bg-muted"
            style={{ paddingLeft: "26px" }}
          >
            {openSections.has("messages") ? (
              <ChevronDown className="size-2.5 shrink-0" />
            ) : (
              <ChevronRight className="size-2.5 shrink-0" />
            )}
            <MessageSquare className="size-3 shrink-0" />
            <span>Messages ({messages.length})</span>
          </button>
          {openSections.has("messages") && (
            <div>
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} depth={2} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fragments */}
      {fragments.length > 0 && (
        <div className="mt-0.5">
          <button
            type="button"
            onClick={() => toggleSection("fragments")}
            className="flex w-full items-center gap-1 rounded-sm px-2 py-1 text-[10px] text-muted-foreground text-left transition-colors hover:bg-muted"
            style={{ paddingLeft: "26px" }}
          >
            {openSections.has("fragments") ? (
              <ChevronDown className="size-2.5 shrink-0" />
            ) : (
              <ChevronRight className="size-2.5 shrink-0" />
            )}
            <Layers className="size-3 shrink-0" />
            <span>Fragments ({fragments.length})</span>
          </button>
          {openSections.has("fragments") && (
            <div>
              {fragments.map((fragment) => (
                <FragmentItem key={fragment.id} fragment={fragment} depth={2} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {lifelines.length === 0 &&
        messages.length === 0 &&
        fragments.length === 0 && (
          <div className="pl-8 py-1 text-[10px] text-muted-foreground">
            No elements yet
          </div>
        )}
    </div>
  );
}
