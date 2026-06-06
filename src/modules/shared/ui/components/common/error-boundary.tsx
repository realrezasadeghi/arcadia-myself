"use client";

import { AlertTriangle } from "lucide-react";
import { Component, type ReactNode } from "react";
import { Button } from "../ui/button";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
  showReload?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary
 *
 * Prevents full page crash — shows a friendly error message.
 * Should be placed once in each "danger zone" like canvas or main feature.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center px-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>
        <div className="flex flex-col gap-1.5 max-w-sm">
          <p className="text-base font-semibold">
            {this.props.fallbackMessage ?? "An unexpected error occurred"}
          </p>
          {this.state.error?.message && (
            <p className="text-sm text-muted-foreground">
              {this.state.error.message}
            </p>
          )}
        </div>
        {(this.props.showReload ?? true) && (
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload
          </Button>
        )}
      </div>
    );
  }
}
