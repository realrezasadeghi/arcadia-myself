import {
  ArrowLeft,
  ChevronLeft,
  GitMerge,
  Layers,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/modules/shared/ui/components/common/theme-toggle";
import { Badge } from "@/modules/shared/ui/components/ui/badge";
import { Button } from "@/modules/shared/ui/components/ui/button";

const LAYERS = [
  {
    code: "OA",
    name: "تحلیل عملیاتی",
    desc: "نیازها و فعالیت‌های عملیاتی سازمان",
    color: "oa",
  },
  {
    code: "SA",
    name: "تحلیل سیستم",
    desc: "مرزها، توابع و تبادلات سیستم",
    color: "sa",
  },
  {
    code: "LA",
    name: "معماری منطقی",
    desc: "مؤلفه‌های منطقی و رابط‌های بینشان",
    color: "la",
  },
  {
    code: "PA",
    name: "معماری فیزیکی",
    desc: "پیاده‌سازی واقعی و استقرار سخت‌افزار",
    color: "pa",
  },
];

const FEATURES = [
  {
    icon: <Layers className="h-5 w-5" />,
    title: "۴ لایه Arcadia",
    desc: "پشتیبانی کامل از متدولوژی Arcadia — از تحلیل عملیاتی تا معماری فیزیکی با نمایش بصری مطابق Capella",
  },
  {
    icon: <GitMerge className="h-5 w-5" />,
    title: "Traceability کامل",
    desc: "ردیابی الزامات از لایه OA تا PA با ماتریس پیوندها — Realization، Allocation، Deployment",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "اعتبارسنجی هوشمند",
    desc: "قوانین Connection و Trace از پیش تعریف‌شده — هیچ اتصال نامعتبری در دیاگرام ایجاد نمی‌شود",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "همکاری تیمی",
    desc: "مدیریت نقش OWNER، EDITOR، VIEWER برای هر پروژه — اشتراک‌گذاری ساختاریافته مدل‌ها",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-lg font-black text-primary">ن</span>
            </div>
            <span className="font-bold text-lg">نقطه</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mr-1">
              بتا
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">ورود</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">شروع رایگان</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="mx-auto max-w-3xl flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            متدولوژی Arcadia، به زبان فارسی
          </div>

          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            معماری سیستم‌های پیچیده
            <br />
            <span className="text-primary">مدل‌محور و ساختاریافته</span>
          </h1>

          <p className="max-w-xl text-base text-muted-foreground md:text-lg leading-relaxed">
            نقطه یک پلتفرم MBSE فارسی است که متدولوژی Arcadia را با تجربه کاربری
            مدرن، ابزارهای بصری قدرتمند و همکاری تیمی یکپارچه ترکیب می‌کند.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="gap-2 h-11 px-6" asChild>
              <Link href="/register">
                شروع رایگان
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 h-11 px-6"
              asChild
            >
              <Link href="/login">ورود به حساب</Link>
            </Button>
          </div>

          {/* Demo hint */}
          <p className="text-xs text-muted-foreground">
            برای دمو:{" "}
            <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
              demo@noqte.ir
            </span>
            {" / "}
            <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
              demo1234
            </span>
          </p>
        </div>
      </section>

      {/* Arcadia Layers */}
      <section className="border-y border-border/60 bg-muted/20 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">زنجیره معماری Arcadia</h2>
            <p className="text-muted-foreground text-sm">
              از نیاز عملیاتی تا پیاده‌سازی فیزیکی — همه در یک مکان
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LAYERS.map((layer, i) => (
              <div
                key={layer.code}
                className="group relative rounded-xl border p-5 transition-shadow hover:shadow-md"
                style={{
                  borderColor: `hsl(var(--layer-${layer.color}))`,
                  background: `hsl(var(--layer-${layer.color}-muted))`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="rounded-md px-2 py-0.5 text-xs font-bold"
                    style={{
                      background: `hsl(var(--layer-${layer.color}))`,
                      color: "#fff",
                    }}
                  >
                    {layer.code}
                  </span>
                </div>
                <p className="font-semibold text-sm mb-1">{layer.name}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {layer.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">چرا نقطه؟</h2>
            <p className="text-muted-foreground text-sm">
              قابلیت‌های کلیدی که کار تیم‌های مهندسی سیستم را ساده‌تر می‌کند
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 rounded-xl border border-border bg-card p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold mb-1">{f.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-primary/5 px-4 py-16">
        <div className="mx-auto max-w-xl text-center flex flex-col items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <span className="text-3xl font-black text-primary">ن</span>
          </div>
          <h2 className="text-2xl font-bold">همین حالا شروع کنید</h2>
          <p className="text-muted-foreground text-sm">
            بدون نصب، بدون پیکربندی — مستقیم در مرورگر طراحی کنید
          </p>
          <Button size="lg" className="gap-2 h-11 px-8" asChild>
            <Link href="/register">
              ساخت حساب رایگان
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 px-4 py-5">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-xs text-muted-foreground">
          <span>نقطه — پلتفرم MBSE فارسی</span>
          <span>ساخته‌شده بر پایه متدولوژی Arcadia</span>
        </div>
      </footer>
    </div>
  );
}
