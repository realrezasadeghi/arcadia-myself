import { UserMenu } from "@/modules/auth/ui/components/user-menu";
import { HeaderLogo } from "@/modules/shared/ui/components/common/header-logo";
import { ThemeToggle } from "@/modules/shared/ui/components/common/theme-toggle";
import { Skeleton } from "@/modules/shared/ui/components/ui/skeleton";
import type { ReactNode } from "react";
import { Suspense } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-4">
        <Suspense fallback={<Skeleton className="w-10 h-5 rounded-lg" />}>
          <HeaderLogo />
        </Suspense>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <div className="w-px h-4 bg-border/60 mx-1" />
          <Suspense>
            <UserMenu />
          </Suspense>
        </div>
      </header>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
