import { UserMenu } from "@/modules/auth/ui/components/user-menu";
import { ThemeToggle } from "@/modules/shared/ui/components/common/theme-toggle";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background p-6">
        <div className="mr-auto flex items-center gap-1">
          <UserMenu />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
