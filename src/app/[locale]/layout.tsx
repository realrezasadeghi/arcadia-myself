import { routing } from "@/i18n/routing";
import { DirectionProvider } from "@/modules/shared/ui/components/ui/direction";
import { Toaster } from "@/modules/shared/ui/components/ui/sonner";
import fonts from "@/modules/shared/ui/helpers/fonts";
import { ConfirmProvider } from "@/modules/shared/ui/providers/confirm";
import { ThemeProvider } from "@/modules/shared/ui/providers/next-themes";
import { QueryProvider } from "@/modules/shared/ui/providers/react-query";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import "@/modules/shared/ui/assets/styles/globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return {
    title: messages.metadata?.homeTitle as string,
    description: messages.metadata?.homeDescription as string,
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  const dir = locale === "fa" ? "rtl" : "ltr";
  const fontClass = locale === "fa" ? fonts.vazirmatn.variable : fonts.inter.variable;

  return (
    <html
      dir={dir}
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fontClass} h-full antialiased`}
    >
      <body className="min-h-full">
        <NextIntlClientProvider messages={messages}>
          <DirectionProvider dir={dir}>
            <ThemeProvider>
              <ConfirmProvider>
                <QueryProvider>{children}</QueryProvider>
              </ConfirmProvider>
            </ThemeProvider>
            <Toaster position="bottom-right" />
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
