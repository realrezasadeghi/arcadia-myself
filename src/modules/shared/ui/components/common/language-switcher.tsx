"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/modules/shared/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/shared/ui/components/ui/dropdown-menu";
import { useLocale } from "next-intl";

const locales = [
  { code: "en", label: "English", flag: "EN" },
  { code: "fa", label: "فارسی", flag: "FA" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = locales.find((l) => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-medium text-muted-foreground gap-1"
        >
          {currentLocale?.flag}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => router.replace(pathname, { locale: l.code })}
            className={locale === l.code ? "bg-muted" : ""}
          >
            <span className="font-medium">{l.flag}</span>
            <span className="text-muted-foreground">{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
