"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/modules/shared/ui/components/ui/button";

type Props = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function LocaleError({ error, unstable_retry }: Props) {
  useEffect(() => {
    console.error("[route-error]", error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 px-4 py-20 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <div className="flex max-w-sm flex-col gap-1.5">
        <p className="text-base font-semibold">An unexpected error occurred</p>
        <p className="text-sm text-muted-foreground break-words">
          {error.message || "Something went wrong while loading this page."}
          {error.digest ? ` (ref: ${error.digest})` : null}
        </p>
      </div>
      <Button variant="outline" onClick={() => unstable_retry()}>
        Try again
      </Button>
    </div>
  );
}
