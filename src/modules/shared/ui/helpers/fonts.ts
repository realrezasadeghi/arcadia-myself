import localFont from "next/font/local";

const vazirmatn = localFont({
  src: [
    {
      path: "../../../../../public/fonts/Vazirmatn-Thin.ttf",
      weight: "200",
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-Thin.ttf",
      weight: "100",
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-ExtraLight.ttf",
      weight: "200",
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-Light.ttf",
      weight: "300",
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-Regular.ttf",
      weight: "400",
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-Bold.ttf",
      weight: "700",
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-ExtraBold.ttf",
      weight: "800",
    },
    {
      path: "../../../../../public/fonts/Vazirmatn-Black.ttf",
      weight: "900",
    },
  ],
  display: "swap",
  variable: "--font-vazirmatn",
});

export default {
  vazirmatn,
};
