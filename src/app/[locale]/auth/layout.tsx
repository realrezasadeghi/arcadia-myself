import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-muted/30 p-4">
      {children}
    </div>
  );
}
