import { Inter } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const vazirmatn = localFont({
  src: [
    {
      path: "../../../../../public/fonts/Vazirmatn-Thin.ttf",
      weight: "100", // Thin is usually 100
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-ExtraLight.ttf",
      weight: "200", // ExtraLight
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-Light.ttf",
      weight: "300", // Light
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-Regular.ttf",
      weight: "400", // Regular (you likely have this file)
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-Medium.ttf",
      weight: "500", // Medium
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-SemiBold.ttf",
      weight: "600", // SemiBold
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-Bold.ttf",
      weight: "700", // Bold
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-ExtraBold.ttf",
      weight: "800", // ExtraBold
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-Black.ttf",
      weight: "900", // Black
    },
  ],
  display: "swap",
  variable: "--font-vazirmatn",
});

export default {
  inter,
  vazirmatn,
};
