"use client";

import { type ReactNode, useCallback, useReducer, useRef } from "react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  ConfirmContext,
  type ConfirmFn,
  type ConfirmOptions,
  type ConfirmState,
} from "../contexts/confirm";

type ConfirmAction =
  | { type: "OPEN"; payload: ConfirmOptions }
  | { type: "START_PROCESSING" }
  | { type: "CLOSE" };

const initialState: ConfirmState = {
  open: false,
  isProcessing: false,
  options: {
    title: "",
    description: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    tone: "default",
    hideCancel: false,
  },
};

function confirmReducer(
  state: ConfirmState,
  action: ConfirmAction,
): ConfirmState {
  switch (action.type) {
    case "OPEN": {
      const { title, description, confirmText, cancelText, tone, hideCancel } =
        action.payload;

      return {
        open: true,
        isProcessing: false,
        options: {
          title: title ?? "",
          tone: tone ?? "default",
          description: description ?? "",
          hideCancel: hideCancel ?? false,
          cancelText: cancelText ?? "Cancel",
          confirmText: confirmText ?? "Confirm",
        },
      };
    }
    case "START_PROCESSING":
      return {
        ...state,
        isProcessing: true,
      };
    case "CLOSE":
      return {
        ...state,
        open: false,
        isProcessing: false,
      };
    default:
      return state;
  }
}

type ConfirmProviderProps = {
  children: ReactNode;
};

export function ConfirmProvider({ children }: ConfirmProviderProps) {
  const [state, dispatch] = useReducer(confirmReducer, initialState);

  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const onConfirmRef = useRef<(() => Promise<void> | void) | null>(null);

  const resolveAndClose = useCallback((result: boolean) => {
    if (resolverRef.current) {
      resolverRef.current(result);
    }
    resolverRef.current = null;
    onConfirmRef.current = null;
    dispatch({ type: "CLOSE" });
  }, []);

  const confirm: ConfirmFn = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      onConfirmRef.current = options.onConfirm ?? null;
      dispatch({ type: "OPEN", payload: options });
    });
  }, []);

  const handleCancel = useCallback(() => {
    if (state.isProcessing) return;
    resolveAndClose(false);
  }, [state.isProcessing, resolveAndClose]);

  const handleConfirmClick = useCallback(async () => {
    if (state.isProcessing) return;

    const fn = onConfirmRef.current;

    if (!fn) {
      resolveAndClose(true);
      return;
    }

    dispatch({ type: "START_PROCESSING" });

    try {
      await fn();
      resolveAndClose(true);
    } catch (error) {
      console.error(error);
      resolveAndClose(false);
    }
  }, [state.isProcessing, resolveAndClose]);

  const { open, isProcessing, options } = state;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            handleCancel();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            {options.title && <DialogTitle>{options.title}</DialogTitle>}
            {options.description && (
              <DialogDescription>{options.description}</DialogDescription>
            )}
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            {!options.hideCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isProcessing}
              >
                {options.cancelText}
              </Button>
            )}

            <Button
              type="button"
              disabled={isProcessing}
              variant={options.tone === "danger" ? "destructive" : "default"}
              onClick={handleConfirmClick}
            >
              {isProcessing ? "Please wait..." : options.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}
