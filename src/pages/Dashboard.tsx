import { Users, Receipt, MessageSquareWarning, UserCheck, ArrowUpRight, Plus, Calendar, Megaphone, Car } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { stats, revenueData, complaintTrend, categoryData, activities } from "@/lib/dummy-data";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend, PieChart, Pie, Cell,
} from "recharts";

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--info))", "hsl(var(--warning))", "hsl(var(--muted-foreground))"];

const Dashboard = () => (
  <DashboardLayout title="Dashboard" subtitle="Welcome back, Anil — here's what's happening today.">
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Residents" value={stats.residents.toString()} delta="+12 this month" icon={Users} accent="primary" />
        <StatCard label="Pending Dues" value={`₹${(stats.pendingDues/1000).toFixed(1)}K`} delta="-8.4% vs last mo" trend="down" icon={Receipt} accent="warning" />
        <StatCard label="Open Complaints" value={stats.openComplaints.toString()} delta="+3 today" trend="down" icon={MessageSquareWarning} accent="info" />
        <StatCard label="Visitors Today" value={stats.visitorsToday.toString()} delta="+18% vs avg" icon={UserCheck} accent="accent" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 p-6 shadow-elegant">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Maintenance collections</h3>
              <p className="text-sm text-muted-foreground">Last 7 months · ₹ in lakhs</p>
            </div>
            <Button variant="outline" size="sm">View report <ArrowUpRight className="ml-1 h-3 w-3" /></Button>
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
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v)=>`${v/1000}K`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Area type="monotone" dataKey="collected" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#g1)" />
              <Area type="monotone" dataKey="pending" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-border/60 p-6 shadow-elegant">
          <h3 className="mb-1 font-display text-lg font-semibold">Complaints by category</h3>
          <p className="mb-4 text-sm text-muted-foreground">This month</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 p-6 shadow-elegant">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Complaint trend</h3>
              <p className="text-sm text-muted-foreground">Opened vs resolved · this week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={complaintTrend} margin={{ left: -20 }}>
              <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="opened" fill="hsl(var(--info))" radius={[6,6,0,0]} />
              <Bar dataKey="resolved" fill="hsl(var(--accent))" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-border/60 p-6 shadow-elegant">
          <h3 className="mb-1 font-display text-lg font-semibold">Quick actions</h3>
          <p className="mb-4 text-sm text-muted-foreground">Common tasks</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Plus, label: "Add resident", color: "bg-primary/10 text-primary" },
              { icon: Receipt, label: "Generate bills", color: "bg-accent/10 text-accent" },
              { icon: Megaphone, label: "Post notice", color: "bg-info/10 text-info" },
              { icon: Calendar, label: "Book amenity", color: "bg-warning/10 text-warning" },
              { icon: UserCheck, label: "Log visitor", color: "bg-primary/10 text-primary" },
              { icon: Car, label: "Add vehicle", color: "bg-accent/10 text-accent" },
            ].map((a) => (
              <button key={a.label} className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.color}`}><a.icon className="h-4 w-4" /></div>
                <div className="text-xs font-medium">{a.label}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="border-border/60 p-6 shadow-elegant">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">Recent activity</h3>
            <p className="text-sm text-muted-foreground">What's happening across the society</p>
          </div>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
        <ul className="divide-y divide-border">
          {activities.map((a, i) => (
            <li key={i} className="flex items-center gap-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-xs font-semibold text-primary-foreground">
                {a.who.split(" ").map(n=>n[0]).join("").slice(0,2)}
              </div>
              <div className="flex-1 text-sm">
                <span className="font-medium">{a.who}</span>{" "}
                <span className="text-muted-foreground">{a.what}</span>
              </div>
              <div className="text-xs text-muted-foreground">{a.when}</div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </DashboardLayout>
);

export default Dashboard;
