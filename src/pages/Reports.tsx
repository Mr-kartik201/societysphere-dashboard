import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { revenueData, complaintTrend, categoryData } from "@/lib/dummy-data";
import { Users, Receipt, MessageSquareWarning, UserCheck } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--info))", "hsl(var(--warning))", "hsl(var(--muted-foreground))"];

const Reports = () => (
  <DashboardLayout title="Reports & Analytics" subtitle="Society performance at a glance.">
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total revenue (YTD)" value="₹34.2L" delta="+22%" icon={Receipt} accent="accent" />
        <StatCard label="New residents" value="64" delta="+12" icon={Users} accent="primary" />
        <StatCard label="Complaints solved" value="284" delta="+18%" icon={MessageSquareWarning} accent="info" />
        <StatCard label="Visitor footfall" value="3.2K" delta="+9%" icon={UserCheck} accent="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 p-6 shadow-elegant">
          <h3 className="mb-1 font-display text-lg font-semibold">Revenue trend</h3>
          <p className="mb-4 text-sm text-muted-foreground">Collections over time</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData} margin={{ left: -10 }}>
              <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v)=>`${v/1000}K`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Line type="monotone" dataKey="collected" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="pending" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-border/60 p-6 shadow-elegant">
          <h3 className="mb-1 font-display text-lg font-semibold">Complaint volume</h3>
          <p className="mb-4 text-sm text-muted-foreground">This week</p>
          <ResponsiveContainer width="100%" height={260}>
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

        <Card className="border-border/60 p-6 shadow-elegant lg:col-span-2">
          <h3 className="mb-1 font-display text-lg font-semibold">Issue categories</h3>
          <p className="mb-4 text-sm text-muted-foreground">Distribution this month</p>
          <div className="grid items-center gap-6 md:grid-cols-2">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" innerRadius={70} outerRadius={110} paddingAngle={3}>
                  {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {categoryData.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="flex-1 text-sm">{c.name}</span>
                  <span className="text-sm font-semibold">{c.value}</span>
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full" style={{ width: `${c.value}%`, background: PIE_COLORS[i] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  </DashboardLayout>
);

export default Reports;
