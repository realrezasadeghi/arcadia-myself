import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { getMe } from "@/modules/auth/presentation/server-action/get-me";
import { UserMenu } from "@/modules/auth/ui/components/user-menu";
import { HeaderLogo } from "@/modules/shared/ui/components/common/header-logo";
import { ThemeToggle } from "@/modules/shared/ui/components/common/theme-toggle";
import { Skeleton } from "@/modules/shared/ui/components/ui/skeleton";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Prefetches the session user on the server so the header avatar is part of
 * the first paint instead of appearing after hydration. Deferred to
 * `<Suspense>` because it depends on runtime request data (cookies).
 */
async function UserMenuSection() {
  const result = await getMe();
  return <UserMenu user={result.success ? result.data : undefined} />;
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60 px-4">
        <Suspense fallback={<Skeleton className="w-10 h-5 rounded-lg" />}>
          <HeaderLogo />
        </Suspense>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <div className="w-px h-4 bg-border/60 mx-1" />
          <Suspense fallback={<Skeleton className="size-7 rounded-full" />}>
            <UserMenuSection />
          </Suspense>
        </div>
      </header>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
