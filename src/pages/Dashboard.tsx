import { useState, useEffect } from "react";
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
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/client";
import { useAuth } from "@/contexts/AuthContext";
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
} from "recharts";
import { toast } from "sonner";

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--info))",
  "hsl(var(--warning))",
  "hsl(var(--muted-foreground))",
];

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    residents: 0,
    openComplaints: 0,
    maintCollected: 0,
    pendingDues: 0,
    activeVisitors: 0,
    staffOnDuty: 0
  });

  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);
  const [recentNotices, setRecentNotices] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  
  const supabase = createClient();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Counts
      const { count: resCount } = await supabase.from("residents").select("*", { count: "exact", head: true });
      const { count: compCount } = await supabase.from("complaints").select("*", { count: "exact", head: true }).neq("status", "Resolved");
      const { count: visitorCount } = await supabase.from("visitors").select("*", { count: "exact", head: true }).is("exit_time", null).eq("status", "Approved");
      const { count: staffCount } = await supabase.from("staff").select("*", { count: "exact", head: true }).eq("status", "On Duty");

      // 2. Billing Stats
      const { data: billsData } = await supabase.from("bills").select("amount, status");
      const maintCollected = billsData?.filter(b => b.status === "Paid").reduce((acc, b) => acc + b.amount, 0) || 0;
      const pendingDues = billsData?.filter(b => b.status === "Unpaid").reduce((acc, b) => acc + b.amount, 0) || 0;

      setStats({
        residents: resCount || 0,
        openComplaints: compCount || 0,
        maintCollected,
        pendingDues,
        activeVisitors: visitorCount || 0,
        staffOnDuty: staffCount || 0
      });

      // 3. Recent Feeds
      const { data: qComp } = await supabase.from("complaints").select("*, residents(flat_number)").order("created_at", { ascending: false }).limit(5);
      const { data: qVis } = await supabase.from("visitors").select("*, residents(flat_number)").order("created_at", { ascending: false }).limit(5);
      const { data: qNot } = await supabase.from("notices").select("*").order("created_at", { ascending: false }).limit(4);

      setRecentComplaints(qComp || []);
      setRecentVisitors(qVis || []);
      setRecentNotices(qNot || []);

      // 4. Chart Data (Complaints by Category)
      const { data: allComplaints } = await supabase.from("complaints").select("category");
      const counts = allComplaints?.reduce((acc: any, c) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
      }, {});
      
      const pieData = Object.entries(counts || {}).map(([name, value]) => ({ name, value }));
      setCategoryData(pieData.slice(0, 5));

    } catch (error: any) {
      toast.error("Error loading dashboard: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const revenueData = [
    { month: "Jan", collected: 42000, pending: 12000 },
    { month: "Feb", collected: 45000, pending: 15000 },
    { month: "Mar", collected: 51000, pending: 10000 },
    { month: "Apr", collected: stats.maintCollected, pending: stats.pendingDues },
  ];

  return (
    <DashboardLayout title="Dashboard Overview" subtitle="Real-time pulse of your society operations.">
      <div className="space-y-6">
        {/* Header strip */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Welcome, {user?.email?.split('@')[0] || "Admin"} 👋
            </h2>
            <p className="text-sm text-muted-foreground">Monitoring Green Meadows Society management systems.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={fetchDashboardData}>
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Clock className="h-3.5 w-3.5" />} 
              Refresh Pulse
            </Button>
            <Button size="sm" className="gradient-primary text-primary-foreground hover:opacity-90" asChild>
              <Link to="/residents">
                <Plus className="mr-1 h-4 w-4" /> Quick enrollment
              </Link>
            </Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Total Residents" value={stats.residents.toString()} icon={Users} accent="primary" />
          <StatCard label="Open Complaints" value={stats.openComplaints.toString()} trend="down" icon={MessageSquareWarning} accent="info" />
          <StatCard label="Maint. Income" value={`₹${(stats.maintCollected / 1000).toFixed(1)}K`} icon={Receipt} accent="success" />
          <StatCard label="Overdue Dues" value={`₹${(stats.pendingDues / 1000).toFixed(1)}K`} trend="up" icon={AlertCircle} accent="warning" />
          <StatCard label="Inside Society" value={stats.activeVisitors.toString()} icon={UserCheck} accent="info" />
          <StatCard label="Staff On Duty" value={stats.staffOnDuty.toString()} icon={HardHat} accent="primary" />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border/60 p-6 shadow-sm bg-card/60 backdrop-blur-sm">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Financial Pulse</h3>
                <p className="text-sm text-muted-foreground">Recent maintenance collection trends</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/reports">Detailed View <ArrowUpRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData} margin={{ left: -10 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Area type="monotone" dataKey="collected" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="border-border/60 p-6 shadow-sm bg-card/60 backdrop-blur-sm">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Incident Breakdown</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/complaints"><ArrowUpRight className="h-3 w-3" /></Link>
              </Button>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Total categories reported</p>
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" innerRadius={45} outerRadius={65} paddingAngle={4} stroke="none">
                      {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {categoryData.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-2 text-xs">
                      <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-muted-foreground truncate">{c.name}</span>
                      <span className="ml-auto font-bold">{c.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">No incidents logged yet.</div>
            )}
          </Card>
        </div>

        {/* Latest complaints + Visitors */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/60 p-5 shadow-sm bg-card/40">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold">Latest Complaints</h3>
                <p className="text-xs text-muted-foreground">Urgent issues requiring attention</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs" asChild>
                <Link to="/complaints">Browse All <ChevronRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {recentComplaints.length === 0 ? (
                 <div className="py-10 text-center text-xs text-muted-foreground">No recent complaints.</div>
              ) : (
                recentComplaints.map((c) => (
                  <div key={c.id} className="flex items-center gap-4 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
                      <MessageSquareWarning className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-bold uppercase">{c.title}</span>
                        <StatusBadge status={c.priority} />
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {c.residents?.flat_number || "G-00"} · {c.category}
                      </div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="border-border/60 p-5 shadow-sm bg-card/40">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold">Recent Gate Log</h3>
                <p className="text-xs text-muted-foreground">Live visitor activity</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs" asChild>
                <Link to="/visitors">View Log <ChevronRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {recentVisitors.length === 0 ? (
                <div className="py-10 text-center text-xs text-muted-foreground">No visitor activity.</div>
              ) : (
                recentVisitors.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                      {v.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold">{v.name}</div>
                      <div className="text-[10px] text-muted-foreground">{v.visitor_type} · {v.residents?.flat_number || "Unknown"}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={v.status} />
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                        <Clock className="h-2 w-2" /> {new Date(v.entry_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Latest Notices */}
        <Card className="border-border/60 p-6 shadow-sm bg-card/40">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold">Notice Board Highlights</h3>
              <p className="text-sm text-muted-foreground">Latest announcements for residents</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/notices">Open Board <ChevronRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {recentNotices.length === 0 ? (
              <div className="col-span-full py-10 text-center text-xs text-muted-foreground">No active notices.</div>
            ) : (
              recentNotices.map((n) => (
                <div
                  key={n.id}
                  className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-bold uppercase py-0.5 px-1.5 rounded bg-secondary text-muted-foreground">{n.category}</span>
                    <span className="text-[9px] text-muted-foreground">{new Date(n.created_at).toLocaleDateString([], {month:'short', day:'numeric'})}</span>
                  </div>
                  <h4 className="text-xs font-bold line-clamp-1 mt-1">{n.title}</h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{n.body}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
