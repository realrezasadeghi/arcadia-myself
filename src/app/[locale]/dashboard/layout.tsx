import type { ReactNode } from "react";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/modules/shared/ui/components/common/language-switcher";
import { ThemeToggle } from "@/modules/shared/ui/components/common/theme-toggle";
import { UserMenu } from "@/modules/auth/ui/components/user-menu";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground/5 border border-border/50">
              <span className="text-[10px] font-bold">A</span>
            </div>
            <span className="text-xs font-medium hidden sm:inline">Arcadia</span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <Suspense>
            <LanguageSwitcher />
          </Suspense>
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
