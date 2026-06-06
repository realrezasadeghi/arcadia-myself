import { ThemeToggle } from "@/modules/shared/ui/components/common/theme-toggle";
import { Button } from "@/modules/shared/ui/components/ui/button";
import { cn } from "@/modules/shared/ui/libs/cn";
import { ArrowRight, GitMerge, Layers, Shield, Users } from "lucide-react";
import Link from "next/link";

const LAYERS = [
  {
    code: "OA",
    name: "Operational Analysis",
    desc: "Organizational needs, missions, and operational activities",
    container: "bg-blue-50 border-blue-200/30 hover:border-blue-300/50",
    badge: "bg-blue-500 text-white",
    text: "text-blue-800",
  },
  {
    code: "SA",
    name: "System Analysis",
    desc: "System boundaries, functions, and exchanges with actors",
    container: "bg-amber-50 border-amber-200/30 hover:border-amber-300/50",
    badge: "bg-amber-500 text-white",
    text: "text-amber-800",
  },
  {
    code: "LA",
    name: "Logical Architecture",
    desc: "Logical components, their interfaces and allocations",
    container:
      "bg-emerald-50 border-emerald-200/30 hover:border-emerald-300/50",
    badge: "bg-emerald-600 text-white",
    text: "text-emerald-800",
  },
  {
    code: "PA",
    name: "Physical Architecture",
    desc: "Physical implementation, hardware nodes and deployment",
    container: "bg-purple-50 border-purple-200/30 hover:border-purple-300/50",
    badge: "bg-purple-600 text-white",
    text: "text-purple-800",
  },
];

const FEATURES = [
  {
    icon: <Layers className="h-5 w-5" />,
    title: "4 ARCADIA Layers",
    desc: "Full ARCADIA method support — from Operational Analysis to Physical Architecture with Capella-compliant visual diagrams",
  },
  {
    icon: <GitMerge className="h-5 w-5" />,
    title: "Full Traceability",
    desc: "Requirement tracing from OA to PA with link matrices — Realization, Allocation, Deployment, and more",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Smart Validation",
    desc: "Pre-defined Connection and Trace rules — no invalid connections allowed in diagrams",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Team Collaboration",
    desc: "Role management with OWNER, EDITOR, VIEWER per project — structured model sharing",
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
              <span className="text-lg font-black text-primary">A</span>
            </div>
            <span className="font-bold text-lg">Arcadia</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="mx-auto max-w-3xl flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            ARCADIA Methodology — Web-Based
          </div>

          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            Model-Based Systems
            <br />
            <span className="text-primary">Engineering Platform</span>
          </h1>

          <p className="max-w-xl text-base text-muted-foreground md:text-lg leading-relaxed">
            A web-based MBSE platform that combines the ARCADIA methodology with
            modern UX, powerful visual tools, and seamless team collaboration.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="gap-2 h-11 px-6" asChild>
              <Link href="/register">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 h-11 px-6"
              asChild
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Arcadia Layers */}
      <section className="border-y border-border/60 bg-muted/20 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">ARCADIA Architecture Chain</h2>
            <p className="text-muted-foreground text-sm">
              From operational needs to physical implementation — all in one place
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LAYERS.map((layer) => (
              <div
                key={layer.code}
                className={cn(
                  "group relative rounded-xl border p-5 transition-shadow hover:shadow-md",
                  layer.container,
                )}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-xs font-bold",
                      layer.badge,
                    )}
                  >
                    {layer.code}
                  </span>
                </div>
                <p className={cn("font-semibold text-sm mb-1", layer.text)}>
                  {layer.name}
                </p>
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
            <h2 className="text-2xl font-bold mb-2">Why Arcadia</h2>
            <p className="text-muted-foreground text-sm">
              Key capabilities that simplify systems engineering teams&apos; work
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
            <span className="text-3xl font-black text-primary">A</span>
          </div>
          <h2 className="text-2xl font-bold">Get Started Today</h2>
          <p className="text-muted-foreground text-sm">
            No installation, no configuration — design directly in your browser
          </p>
          <Button size="lg" className="gap-2 h-11 px-8" asChild>
            <Link href="/register">
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 px-4 py-5">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-xs text-muted-foreground">
          <span>Arcadia — Web-Based MBSE Platform</span>
          <span>Built on the ARCADIA Methodology</span>
        </div>
      </footer>
    </div>
  );
}
