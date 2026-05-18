"use client";

import { cn } from "@/modules/shared/ui/libs/cn";
import { AlertCircle, Check, Cloud, Loader2 } from "lucide-react";
import { useModelStore } from "../stores/model";

const STATUS_CONFIG = {
  saved: { icon: Check, text: "ذخیره شد", className: "text-muted-foreground" },
  saving: {
    icon: Loader2,
    text: "در حال ذخیره...",
    className: "text-primary animate-pulse",
  },
  dirty: {
    icon: Cloud,
    text: "تغییرات ذخیره‌نشده",
    className: "text-muted-foreground",
  },
  error: {
    icon: AlertCircle,
    text: "خطا در ذخیره",
    className: "text-destructive",
  },
} as const;

export function SaveStatusIndicator() {
  const { saveStatus, pendingChanges } = useModelStore();
  const config = STATUS_CONFIG[saveStatus];
  const Icon = config.icon;

  return (
    <div
      className={cn("flex items-center gap-1.5 text-xs px-2", config.className)}
    >
      <Icon
        className={cn(
          "size-3.5",
          saveStatus === "saving" && "animate-spin",
          saveStatus === "saved" && "text-green-500",
        )}
      />
      <span className="hidden sm:inline">
        {saveStatus === "dirty" && pendingChanges > 0
          ? `${pendingChanges} تغییر`
          : config.text}
      </span>
    </div>
  );
}
