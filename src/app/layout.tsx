import fonts from "@/modules/shared/ui/helpers/fonts";
import { ThemeProvider } from "@/modules/shared/ui/providers/next-themes";
import { QueryProvider } from "@/modules/shared/ui/providers/react-query";
import type { Metadata } from "next";

import "@/modules/shared/ui/assets/styles/globals.css";
import { DirectionProvider } from "@/modules/shared/ui/components/ui/direction";
import { Toaster } from "@/modules/shared/ui/components/ui/sonner";
import { ConfirmProvider } from "@/modules/shared/ui/providers/confirm";

export const metadata: Metadata = {
  title: "Arcadia — MBSE Platform",
  description:
    "A model-based systems engineering platform for designing, analyzing, and tracing complex system architectures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fonts.inter.variable} ${fonts}  h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <DirectionProvider dir="ltr">
          <ThemeProvider>
            <ConfirmProvider>
              <QueryProvider>{children}</QueryProvider>
            </ConfirmProvider>
          </ThemeProvider>
          <Toaster position="bottom-right" />
        </DirectionProvider>
      </body>
    </html>
  );
}
