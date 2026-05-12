import fonts from "@/modules/shared/ui/helpers/fonts";
import { ThemeProvider } from "@/modules/shared/ui/providers/next-themes";
import { QueryProvider } from "@/modules/shared/ui/providers/react-query";
import type { Metadata } from "next";

import "@/modules/shared/ui/assets/styles/globals.css";
import { DirectionProvider } from "@/modules/shared/ui/components/ui/direction";
import { Toaster } from "@/modules/shared/ui/components/ui/sonner";

export const metadata: Metadata = {
  title: "پلتفرم مدل‌سازی معماری",
  description:
    "پلتفرم مدل‌محور برای طراحی، تحلیل و رهگیری معماری سیستم‌های پیچیده",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fonts.vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <DirectionProvider dir="rtl">
          <ThemeProvider>
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
          <Toaster position="bottom-right" />
        </DirectionProvider>
      </body>
    </html>
  );
}
