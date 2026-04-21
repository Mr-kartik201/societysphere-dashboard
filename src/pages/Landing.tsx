import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Users,
  Receipt,
  MessageSquareWarning,
  BarChart3,
  CalendarDays,
  Megaphone,
  Shield,
  UserCog,
  Home,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Star,
  Zap,
  Lock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
const testimonials = [
  { name: "Anil Verma", role: "Society Secretary, Green Meadows", quote: "SocietySphere replaced 4 different tools and a WhatsApp group. Our collections improved 38% in the first quarter." },
  { name: "Kavita Joshi", role: "Treasurer, Silver Oaks", quote: "The billing automation alone saves us two full days every month. Residents love the clean payment experience." },
  { name: "Rajiv Menon", role: "Chairman, Palm Heights", quote: "Visitor management is finally sane. Our guards adopted it on day one — that's how intuitive it is." },
];

const features = [
  { icon: Receipt, title: "Maintenance & Billing", desc: "Auto-generate invoices, accept online payments, and track every rupee in real time.", color: "from-primary to-info" },
  { icon: MessageSquareWarning, title: "Complaint Management", desc: "Route, assign and resolve issues with full SLA tracking and audit trails.", color: "from-warning to-destructive" },
  { icon: ShieldCheck, title: "Visitor Management", desc: "Pre-approvals, OTP entry and a live gate log — every entry, every time.", color: "from-info to-primary" },
  { icon: Megaphone, title: "Notices & Announcements", desc: "Reach every resident instantly via app, email and SMS — no more WhatsApp chaos.", color: "from-accent to-success" },
  { icon: BarChart3, title: "Reports & Analytics", desc: "Live dashboards on collections, footfall and complaints — make data-driven decisions.", color: "from-primary to-accent" },
  { icon: CalendarDays, title: "Amenity Booking", desc: "Pool, clubhouse, courts — bookable from any device with conflict-free scheduling.", color: "from-accent to-info" },
];

const roles = [
  {
    icon: UserCog,
    title: "For Admins & Committees",
    color: "bg-primary/10 text-primary",
    points: [
      "Real-time financial dashboards",
      "Automated billing & receipts",
      "Vendor & staff management",
      "AGM-ready reports in one click",
    ],
  },
  {
    icon: Home,
    title: "For Residents",
    color: "bg-accent/10 text-accent",
    points: [
      "Pay maintenance from your phone",
      "Raise complaints, track progress",
      "Pre-approve visitors via OTP",
      "Book amenities in seconds",
    ],
  },
  {
    icon: Shield,
    title: "For Security Staff",
    color: "bg-info/10 text-info",
    points: [
      "Mobile-first gate app",
      "Visitor photo & ID capture",
      "Vehicle & delivery tracking",
      "Emergency SOS broadcasts",
    ],
  },
];

const stats = [
  { v: "1,200+", l: "Societies onboarded" },
  { v: "₹120Cr+", l: "Processed annually" },
  { v: "4.9/5", l: "Average rating" },
  { v: "98%", l: "Customer retention" },
];

const Landing = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    {/* Nav */}
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#roles" className="transition-colors hover:text-foreground">Who it's for</a>
          <a href="#preview" className="transition-colors hover:text-foreground">Product</a>
          <a href="#testimonials" className="transition-colors hover:text-foreground">Customers</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="hidden sm:inline-flex"><Link to="/login">Sign in</Link></Button>
          <Button asChild className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>

    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      <div className="container relative pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
            <span className="flex h-1.5 w-1.5 rounded-full bg-accent">
              <span className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-accent" />
            </span>
            <span className="text-muted-foreground">Now in 1,200+ societies across India</span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1 text-foreground">
              <Sparkles className="h-3 w-3 text-accent" /> v3.0 launched
            </span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            Run your society like a
            <br />
            <span className="text-gradient">modern company.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            SocietySphere is the all-in-one operating system for residential communities —
            billing, complaints, visitors, amenities and analytics, beautifully unified.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="h-12 gradient-primary px-7 text-base text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 hover:opacity-95">
              <Link to="/register">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 border-2 px-7 text-base hover:border-primary/40 hover:bg-primary/5">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {[
              { icon: CheckCircle2, t: "No credit card required" },
              { icon: Zap, t: "Setup in 10 minutes" },
              { icon: Lock, t: "Bank-grade security" },
            ].map((i) => (
              <span key={i.t} className="flex items-center gap-1.5">
                <i.icon className="h-3.5 w-3.5 text-accent" /> {i.t}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div id="preview" className="relative mx-auto mt-16 max-w-6xl md:mt-20">
          <div className="absolute -inset-x-8 -inset-y-6 gradient-primary rounded-[2rem] opacity-20 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-elevated ring-1 ring-black/5">
            <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="ml-3 flex-1 max-w-md rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
                🔒 app.societysphere.com/dashboard
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 p-4 md:p-6">
              <div className="col-span-12 md:col-span-3 space-y-1">
                <div className="px-3 pb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Main</div>
                {[
                  { l: "Dashboard", active: true },
                  { l: "Residents" },
                  { l: "Billing" },
                  { l: "Complaints" },
                  { l: "Visitors" },
                  { l: "Amenities" },
                  { l: "Reports" },
                ].map((s) => (
                  <div key={s.l} className={`rounded-lg px-3 py-2 text-sm ${s.active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"}`}>
                    {s.l}
                  </div>
                ))}
              </div>
              <div className="col-span-12 md:col-span-9 space-y-4">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { l: "Residents", v: "842", c: "text-primary", d: "+12" },
                    { l: "Collections", v: "₹5.45L", c: "text-accent", d: "+18%" },
                    { l: "Open issues", v: "17", c: "text-warning", d: "-3" },
                    { l: "Visitors", v: "46", c: "text-info", d: "+9" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border border-border bg-background p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                      <div className={`mt-1 font-display text-xl font-bold ${s.c}`}>{s.v}</div>
                      <div className="text-[10px] text-success">{s.d}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Revenue · Last 7 months</div>
                      <div className="text-xs text-muted-foreground">Maintenance collections</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-success">
                      <TrendingUp className="h-3 w-3" /> +18.4%
                    </div>
                  </div>
                  <div className="flex h-32 items-end gap-2">
                    {[55, 68, 62, 75, 82, 88, 95].map((h, i) => (
                      <div key={i} className="group relative flex-1 rounded-t-md gradient-primary transition-all hover:opacity-80" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                    {["Jan","Feb","Mar","Apr","May","Jun","Jul"].map(m => <span key={m}>{m}</span>)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-background p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Recent activity</div>
                    <div className="mt-2 space-y-2 text-xs">
                      {["Priya paid ₹4,500","New visitor at A-1204","Notice published"].map(t => (
                        <div key={t} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                          <span className="text-muted-foreground">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Complaints by category</div>
                    <div className="mt-2 space-y-1.5">
                      {[["Plumbing",70,"bg-primary"],["Electrical",55,"bg-accent"],["Cleaning",40,"bg-info"]].map(([l,w,c]) => (
                        <div key={l as string} className="flex items-center gap-2 text-xs">
                          <span className="w-16 text-muted-foreground">{l}</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                            <div className={`h-full ${c}`} style={{ width: `${w}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logos / stats strip */}
        <div className="mt-16 grid grid-cols-2 gap-6 border-t border-border pt-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-2xl font-bold tracking-tight md:text-3xl">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section id="features" className="container py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3 w-3" /> Features
        </div>
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Everything your community needs.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          From the front gate to the AGM — one platform, zero spreadsheets.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card
            key={f.title}
            className="group relative overflow-hidden border-border/60 p-7 shadow-elegant transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated hover:border-primary/30"
          >
            <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${f.color} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`} />
            <div className={`relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-md`}>
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="relative font-display text-lg font-semibold">{f.title}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            <div className="relative mt-5 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Learn more <ArrowRight className="h-3 w-3" />
            </div>
          </Card>
        ))}
      </div>
    </section>

    {/* Roles section */}
    <section id="roles" className="relative overflow-hidden bg-secondary/40 py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.06),transparent_60%)]" />
      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <Users className="h-3 w-3" /> Built for everyone
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            One platform. <span className="text-gradient">Three experiences.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tailored workflows for admins, residents and security — all working in perfect sync.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {roles.map((r, idx) => (
            <Card
              key={r.title}
              className="group relative overflow-hidden border-border/60 bg-card p-8 shadow-elegant transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${r.color}`}>
                <r.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold">{r.title}</h3>
              <ul className="mt-5 space-y-3">
                {r.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 border-t border-border pt-5">
                <div className="text-xs font-medium text-primary group-hover:underline">
                  Explore {idx === 0 ? "admin" : idx === 1 ? "resident" : "security"} tools →
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section id="testimonials" className="container py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-warning">
          <Star className="h-3 w-3 fill-current" /> Loved by committees
        </div>
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Communities that switched, never went back.
        </h2>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Card
            key={t.name}
            className={`relative border-border/60 p-7 shadow-elegant transition-all hover:shadow-elevated ${
              i === 1 ? "md:-mt-6 ring-1 ring-primary/20" : ""
            }`}
          >
            <div className="mb-4 flex gap-0.5 text-warning">
              {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-base leading-relaxed text-foreground">"{t.quote}"</p>
            <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full gradient-primary text-sm font-semibold text-primary-foreground shadow-md">
                {t.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="container pb-24">
      <div className="relative overflow-hidden rounded-[2rem] gradient-primary p-10 text-center shadow-glow md:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative">
          <h2 className="font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl">
            Ready to modernize your society?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/90">
            Join 1,200+ communities already running on SocietySphere. Free for 14 days.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" asChild className="h-12 px-8 text-base">
              <Link to="/register">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" asChild className="h-12 border-2 border-primary-foreground/30 bg-transparent px-8 text-base text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border bg-secondary/30">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The operating system for modern residential communities. Built in India, trusted worldwide.
            </p>
            <div className="mt-6 space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" /> hello@societysphere.com
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" /> +91 80 4567 8900
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" /> Bengaluru, India
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Product", items: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"] },
            { title: "Company", items: ["About", "Customers", "Careers", "Press", "Contact"] },
            { title: "Resources", items: ["Help center", "Guides", "API docs", "Webinars", "Status"] },
            { title: "Legal", items: ["Privacy", "Terms", "Security", "Cookies", "DPA"] },
          ].map((c) => (
            <div key={c.title} className="md:col-span-2">
              <div className="mb-4 text-sm font-semibold">{c.title}</div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {c.items.map((i) => (
                  <li key={i}>
                    <a href="#" className="transition-colors hover:text-foreground">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <div>© 2025 SocietySphere Technologies Pvt. Ltd. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-success" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  </div>
);

export default Landing;
