"use client";

import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Pencil,
  Plus,
  Puzzle,
  Split,
  SquareDashedBottom,
  Trash2,
  Waypoints,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/modules/shared/ui/components/ui/context-menu";

type ScenarioContextMenuProps = {
  children: ReactNode;
  onAddLifeline?: () => void;
  onAddMessage?: () => void;
  onAddFragment?: () => void;
  onAddEnvironment?: () => void;
  onDeleteSelected?: () => void;
  onRenameSelected?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddBranch?: () => void;
  hasSelection?: boolean;
  selectedType?: "lifeline" | "message" | "fragment";
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  canAddBranch?: boolean;
};

export function ScenarioContextMenu({
  children,
  onAddLifeline,
  onAddMessage,
  onAddFragment,
  onAddEnvironment,
  onDeleteSelected,
  onRenameSelected,
  onMoveUp,
  onMoveDown,
  onAddBranch,
  hasSelection,
  selectedType,
  canMoveUp = false,
  canMoveDown = false,
  canAddBranch = false,
}: ScenarioContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Plus className="size-3.5 mr-2" />
            Add
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={onAddLifeline}>
              <Waypoints className="size-3.5 mr-2" />
              Add Lifeline
            </ContextMenuItem>
            <ContextMenuItem onClick={onAddMessage}>
              <MessageSquare className="size-3.5 mr-2" />
              Add Message
            </ContextMenuItem>
            <ContextMenuItem onClick={onAddFragment}>
              <Puzzle className="size-3.5 mr-2" />
              Add Fragment
            </ContextMenuItem>
            <ContextMenuItem onClick={onAddEnvironment}>
              <SquareDashedBottom className="size-3.5 mr-2" />
              Add Environment
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {hasSelection && (
          <>
            <ContextMenuSeparator />

            <ContextMenuItem onClick={onRenameSelected}>
              <Pencil className="size-3.5 mr-2" />
              Rename {selectedType ?? "Selected"}
            </ContextMenuItem>

            {selectedType === "message" && (
              <>
                <ContextMenuItem onClick={onMoveUp} disabled={!canMoveUp}>
                  <ChevronUp className="size-3.5 mr-2" />
                  Move Up
                </ContextMenuItem>
                <ContextMenuItem onClick={onMoveDown} disabled={!canMoveDown}>
                  <ChevronDown className="size-3.5 mr-2" />
                  Move Down
                </ContextMenuItem>
              </>
            )}

            {selectedType === "lifeline" && (
              <>
                <ContextMenuItem onClick={onMoveUp} disabled={!canMoveUp}>
                  <ArrowUp className="size-3.5 mr-2" />
                  Move Left
                </ContextMenuItem>
                <ContextMenuItem onClick={onMoveDown} disabled={!canMoveDown}>
                  <ArrowDown className="size-3.5 mr-2" />
                  Move Right
                </ContextMenuItem>
              </>
            )}

            {selectedType === "fragment" && (
              <ContextMenuItem onClick={onAddBranch} disabled={!canAddBranch}>
                <Split className="size-3.5 mr-2" />
                Add Branch
              </ContextMenuItem>
            )}

            <ContextMenuSeparator />

            <ContextMenuItem
              onClick={onDeleteSelected}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-3.5 mr-2" />
              Delete {selectedType ?? "Selected"}
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
