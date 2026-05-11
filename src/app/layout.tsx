import fonts from "@/modules/shared/ui/helpers/fonts";
import { ThemeProvider } from "@/modules/shared/ui/providers/next-themes";
import { QueryProvider } from "@/modules/shared/ui/providers/react-query";
import type { Metadata } from "next";

import "@/modules/shared/ui/assets/styles/globals.css";

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
      data-theme="light"
      suppressHydrationWarning
      className={`${fonts.vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
