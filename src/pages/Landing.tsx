import { Link } from "react-router-dom";
import { ArrowRight, Building2, CheckCircle2, ShieldCheck, Sparkles, Users, Receipt, MessageSquareWarning, BarChart3, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { testimonials } from "@/lib/dummy-data";

const features = [
  { icon: Users, title: "Resident Directory", desc: "Owners, tenants, contacts and documents — all searchable in one place." },
  { icon: Receipt, title: "Maintenance & Billing", desc: "Auto-generate invoices, track dues, and accept online payments." },
  { icon: MessageSquareWarning, title: "Complaint Tracking", desc: "Route, assign, and resolve issues with full audit trails." },
  { icon: ShieldCheck, title: "Visitor Management", desc: "Pre-approvals, OTP entry, and a real-time gate log." },
  { icon: CalendarDays, title: "Amenity Booking", desc: "Pool, clubhouse, courts — bookable from any device." },
  { icon: BarChart3, title: "Reports & Analytics", desc: "Live dashboards on collections, complaints and footfall." },
];

const Landing = () => (
  <div className="min-h-screen bg-background">
    {/* Nav */}
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#preview" className="hover:text-foreground">Product</a>
          <a href="#testimonials" className="hover:text-foreground">Customers</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild><Link to="/login">Sign in</Link></Button>
          <Button asChild className="gradient-primary text-primary-foreground hover:opacity-90">
            <Link to="/register">Get started</Link>
          </Button>
        </div>
      </div>
    </header>

    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="container relative py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Trusted by 1,200+ housing societies
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Run your society like a <span className="text-gradient">modern company.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            SocietySphere is the all-in-one operating system for residential communities — billing,
            complaints, visitors, amenities and reports, beautifully unified.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="h-12 gradient-primary px-8 text-base text-primary-foreground shadow-glow hover:opacity-90">
              <Link to="/register">Start free trial <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
              <Link to="/dashboard">View live demo</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {["No credit card required", "14-day free trial", "Setup in 10 minutes"].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-accent" /> {t}</span>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div id="preview" className="relative mx-auto mt-20 max-w-6xl">
          <div className="absolute -inset-4 gradient-primary rounded-3xl opacity-20 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
            <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="ml-3 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">app.societysphere.com/dashboard</div>
            </div>
            <div className="grid grid-cols-12 gap-4 p-4 md:p-6">
              <div className="col-span-12 md:col-span-3 space-y-3">
                {["Dashboard","Residents","Billing","Complaints","Visitors","Amenities"].map((s,i)=>(
                  <div key={s} className={`rounded-lg px-3 py-2 text-sm ${i===0?"bg-primary/10 text-primary font-medium":"text-muted-foreground"}`}>{s}</div>
                ))}
              </div>
              <div className="col-span-12 md:col-span-9 space-y-4">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    {l:"Residents",v:"842",c:"text-primary"},
                    {l:"Collections",v:"₹5.45L",c:"text-accent"},
                    {l:"Open issues",v:"17",c:"text-warning"},
                    {l:"Visitors",v:"46",c:"text-info"},
                  ].map(s=>(
                    <div key={s.l} className="rounded-xl border border-border bg-background p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                      <div className={`mt-1 font-display text-xl font-bold ${s.c}`}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold">Revenue · Last 7 months</div>
                    <div className="text-xs text-muted-foreground">+18.4%</div>
                  </div>
                  <div className="flex h-32 items-end gap-2">
                    {[55,68,62,75,82,88,95].map((h,i)=>(
                      <div key={i} className="flex-1 rounded-t-md gradient-primary" style={{height:`${h}%`}} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section id="features" className="container py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Features</div>
        <h2 className="font-display text-3xl font-bold md:text-5xl">Everything your community needs</h2>
        <p className="mt-4 text-muted-foreground">From the front gate to the AGM — one platform, zero spreadsheets.</p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="group border-border/60 p-6 shadow-elegant transition-all hover:-translate-y-1 hover:shadow-elevated">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:gradient-primary group-hover:text-primary-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section id="testimonials" className="bg-secondary/40 py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">Loved by committees</div>
          <h2 className="font-display text-3xl font-bold md:text-5xl">Communities that switched, never went back</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border/60 p-6 shadow-elegant">
              <div className="mb-4 flex gap-0.5 text-warning">{"★★★★★"}</div>
              <p className="text-sm leading-relaxed text-foreground">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-sm font-semibold text-primary-foreground">
                  {t.name.split(" ").map(n=>n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="container py-20">
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-10 text-center shadow-glow md:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-5xl">Ready to modernize your society?</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">Join 1,200+ communities already running on SocietySphere.</p>
          <Button size="lg" variant="secondary" asChild className="mt-8 h-12 px-8 text-base">
            <Link to="/register">Start your free trial <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border bg-background">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground">The operating system for modern residential communities.</p>
          </div>
          {[
            { title: "Product", items: ["Features","Pricing","Integrations","Changelog"] },
            { title: "Company", items: ["About","Customers","Careers","Contact"] },
            { title: "Resources", items: ["Help center","Guides","API docs","Status"] },
          ].map((c) => (
            <div key={c.title}>
              <div className="mb-3 text-sm font-semibold">{c.title}</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {c.items.map((i) => <li key={i}><a href="#" className="hover:text-foreground">{i}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <div>© 2025 SocietySphere. All rights reserved.</div>
          <div className="flex gap-4"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Security</a></div>
        </div>
      </div>
    </footer>
  </div>
);

export default Landing;
