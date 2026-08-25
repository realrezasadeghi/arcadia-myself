import { create } from "zustand";

type ScenarioSelectedLifeline = {
  id: string;
  name: string;
  representedElementType: string;
  lifelineId: string;
};

type ScenarioSelectedMessage = {
  id: string;
  name: string;
  kind: string;
  sourceLifelineId: string;
  targetLifelineId: string;
  executionOrder: number;
  messageId: string;
};

type ScenarioSelectedFragment = {
  id: string;
  name: string;
  operator: string;
  guard: string;
};

interface ScenarioSelectionState {
  selectedLifeline: ScenarioSelectedLifeline | null;
  selectedMessage: ScenarioSelectedMessage | null;
  selectedFragment: ScenarioSelectedFragment | null;
  selectedMessageIds: Set<string>;
  isRenaming: boolean;
  setSelectedLifeline: (lifeline: ScenarioSelectedLifeline | null) => void;
  setSelectedMessage: (message: ScenarioSelectedMessage | null) => void;
  setSelectedFragment: (fragment: ScenarioSelectedFragment | null) => void;
  toggleMessageSelection: (messageId: string) => void;
  selectMultipleMessages: (messageIds: string[]) => void;
  setRenaming: (value: boolean) => void;
  clearSelection: () => void;
}

export const useScenarioSelectionStore = create<ScenarioSelectionState>(
  (set) => ({
    selectedLifeline: null,
    selectedMessage: null,
    selectedFragment: null,
    selectedMessageIds: new Set<string>(),
    isRenaming: false,
    setSelectedLifeline: (lifeline) =>
      set({
        selectedLifeline: lifeline,
        selectedMessage: null,
        selectedFragment: null,
        selectedMessageIds: new Set<string>(),
      }),
    setSelectedMessage: (message) =>
      set({
        selectedMessage: message,
        selectedLifeline: null,
        selectedFragment: null,
        selectedMessageIds: message
          ? new Set<string>([message.messageId])
          : new Set<string>(),
      }),
    setSelectedFragment: (fragment) =>
      set({
        selectedFragment: fragment,
        selectedLifeline: null,
        selectedMessage: null,
        selectedMessageIds: new Set<string>(),
      }),
    toggleMessageSelection: (messageId) =>
      set((state) => {
        const next = new Set(state.selectedMessageIds);
        if (next.has(messageId)) {
          next.delete(messageId);
        } else {
          next.add(messageId);
        }
        return {
          selectedMessageIds: next,
          selectedLifeline: null,
          selectedFragment: null,
          selectedMessage: null,
        };
      }),
    selectMultipleMessages: (messageIds) =>
      set({
        selectedMessageIds: new Set<string>(messageIds),
        selectedLifeline: null,
        selectedFragment: null,
        selectedMessage: null,
      }),
    setRenaming: (value) => set({ isRenaming: value }),
    clearSelection: () =>
      set({
        selectedLifeline: null,
        selectedMessage: null,
        selectedFragment: null,
        selectedMessageIds: new Set<string>(),
        isRenaming: false,
      }),
  }),
);

export type {
  ScenarioSelectedLifeline,
  ScenarioSelectedMessage,
  ScenarioSelectedFragment,
};
