"use client";

import { createContext } from "react";

/**
 * Options passed to confirm()
 */
export type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: "default" | "danger";
  hideCancel?: boolean;
  onConfirm?: () => Promise<void> | void;
};

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

export type ConfirmState = {
  open: boolean;
  isProcessing: boolean;
  options: Required<
    Pick<
      ConfirmOptions,
      | "title"
      | "description"
      | "confirmText"
      | "cancelText"
      | "tone"
      | "hideCancel"
    >
  >;
};

export const ConfirmContext = createContext<ConfirmFn | null>(null);
