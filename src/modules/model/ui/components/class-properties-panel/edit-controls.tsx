"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CLASS_VISIBILITY_INFO } from "../../constants/class-diagram";

export function VisibilityDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const options = ["public", "private", "protected", "package"] as const;
  const current =
    CLASS_VISIBILITY_INFO[value as keyof typeof CLASS_VISIBILITY_INFO];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="w-5 h-5 flex items-center justify-center rounded text-[10px] font-mono text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
        title={`Visibility: ${current?.label ?? value}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        {current?.symbol ?? "+"}
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[120px] animate-in fade-in-0 zoom-in-95 duration-150">
          {options.map((opt) => {
            const info = CLASS_VISIBILITY_INFO[opt];
            return (
              <button
                key={opt}
                type="button"
                className={`w-full text-left px-2.5 py-1.5 text-[11px] hover:bg-accent/60 flex items-center gap-2 transition-colors ${
                  value === opt
                    ? "bg-accent/40 text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(opt);
                  setOpen(false);
                }}
              >
                <span className="font-mono w-3.5 text-center text-xs">
                  {info.symbol}
                </span>
                <span>{info.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ToggleButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition-all duration-150 ${
        active
          ? "bg-primary/10 border-primary/30 text-primary"
          : "bg-muted/40 border-transparent text-muted-foreground hover:bg-accent/60 hover:border-border"
      }`}
    >
      {label}
    </button>
  );
}

export function DirectionDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const options = ["IN", "OUT", "INOUT"] as const;
  const labels: Record<string, string> = {
    IN: "in",
    OUT: "out",
    INOUT: "inout",
  };

  const directionColors: Record<string, string> = {
    IN: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    OUT: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    INOUT:
      "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={`h-6 px-2 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all duration-150 flex items-center gap-1 min-w-[52px] justify-center ${
          directionColors[value] ?? directionColors.IN
        } hover:opacity-80`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <span>{labels[value] ?? "in"}</span>
        <ChevronDown className="size-2.5 opacity-60" />
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[90px] animate-in fade-in-0 zoom-in-95 duration-150">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`w-full text-left px-3 py-2 text-[11px] font-medium hover:bg-accent/60 transition-colors flex items-center gap-2 ${
                value === opt
                  ? "bg-accent/40 text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt);
                setOpen(false);
              }}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  opt === "IN"
                    ? "bg-blue-500"
                    : opt === "OUT"
                      ? "bg-amber-500"
                      : "bg-purple-500"
                }`}
              />
              {labels[opt]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
