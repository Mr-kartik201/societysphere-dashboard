import {
  Users,
  Receipt,
  MessageSquareWarning,
  UserCheck,
  HardHat,
  AlertCircle,
  ArrowUpRight,
  Plus,
  Calendar,
  Megaphone,
  Car,
  Pin,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  stats,
  revenueData,
  complaintTrend,
  categoryData,
  visitors,
  complaints,
  notices,
} from "@/lib/dummy-data";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--info))",
  "hsl(var(--warning))",
  "hsl(var(--muted-foreground))",
];

const quickActions = [
  { icon: Plus, label: "Add resident", to: "/residents", color: "bg-primary/10 text-primary" },
  { icon: Receipt, label: "Generate bills", to: "/billing", color: "bg-accent/10 text-accent" },
  { icon: Megaphone, label: "Post notice", to: "/notices", color: "bg-info/10 text-info" },
  { icon: Calendar, label: "Book amenity", to: "/amenities", color: "bg-warning/10 text-warning" },
  { icon: UserCheck, label: "Log visitor", to: "/visitors", color: "bg-primary/10 text-primary" },
  { icon: Car, label: "Add vehicle", to: "/vehicles", color: "bg-accent/10 text-accent" },
];

const Dashboard = () => (
  <DashboardLayout title="Dashboard" subtitle="Welcome back, Anil — here's what's happening today.">
    <div className="space-y-6">
      {/* Header strip */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Good morning, Anil 👋</h2>
          <p className="text-sm text-muted-foreground">Here's the pulse of Green Meadows Society today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Apr 21, 2025
          </Button>
          <Button size="sm" className="gradient-primary text-primary-foreground hover:opacity-90">
            <Plus className="mr-1 h-4 w-4" /> Quick add
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Residents" value={stats.residents.toString()} delta="+12 this mo" icon={Users} accent="primary" />
        <StatCard label="Pending Complaints" value={stats.openComplaints.toString()} delta="+3 today" trend="down" icon={MessageSquareWarning} accent="info" />
        <StatCard label="Maint. Collected" value="₹5.45L" delta="+8.2%" icon={Receipt} accent="accent" />
        <StatCard label="Overdue Dues" value={`₹${(stats.pendingDues / 1000).toFixed(1)}K`} delta="-8.4%" trend="down" icon={AlertCircle} accent="warning" />
        <StatCard label="Active Visitors" value="14" delta="+18% vs avg" icon={UserCheck} accent="info" />
        <StatCard label="Staff On Duty" value={stats.staffOnDuty.toString()} delta="3 shifts" icon={HardHat} accent="primary" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 p-6 shadow-elegant">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Monthly maintenance collections</h3>
              <p className="text-sm text-muted-foreground">Last 7 months · ₹ in lakhs</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-primary" /> Collected
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-accent" /> Pending
              </div>
              <Button variant="outline" size="sm" className="ml-2" asChild>
                <Link to="/reports">Report <ArrowUpRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData} margin={{ left: -10 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Area type="monotone" dataKey="collected" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#g1)" />
              <Area type="monotone" dataKey="pending" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-border/60 p-6 shadow-elegant">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Complaint status</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/complaints"><ArrowUpRight className="h-3 w-3" /></Link>
            </Button>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">By category · this month</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="ml-auto font-semibold">{c.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions + Latest complaints */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 p-6 shadow-elegant">
          <h3 className="font-display text-lg font-semibold">Quick actions</h3>
          <p className="mb-4 text-sm text-muted-foreground">Common tasks</p>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.color}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="text-xs font-medium">{a.label}</div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="border-border/60 p-6 shadow-elegant lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Latest complaints</h3>
              <p className="text-sm text-muted-foreground">Most recent issues raised</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/complaints">View all <ChevronRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {complaints.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center gap-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                  <MessageSquareWarning className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{c.title}</span>
                    <StatusBadge status={c.priority} />
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {c.id} · {c.flat} · {c.category}
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent visitors + Latest notices */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 p-6 shadow-elegant">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Recent visitor entries</h3>
              <p className="text-sm text-muted-foreground">Live gate log</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/visitors">View all <ChevronRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {visitors.slice(0, 5).map((v) => (
              <div key={v.id} className="flex items-center gap-3 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-accent text-xs font-semibold text-accent-foreground">
                  {v.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.purpose} · {v.flat}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={v.status} />
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" /> {v.entry}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border/60 p-6 shadow-elegant">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Latest notices</h3>
              <p className="text-sm text-muted-foreground">From the notice board</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/notices">View all <ChevronRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="space-y-3">
            {notices.slice(0, 4).map((n) => (
              <div
                key={n.id}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{n.title}</span>
                    {n.pinned && <Pin className="h-3 w-3 shrink-0 text-primary" />}
                  </div>
                  <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{n.body}</div>
                </div>
                <div className="text-[10px] text-muted-foreground">{n.date.slice(5)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  </DashboardLayout>
);

export default Dashboard;
