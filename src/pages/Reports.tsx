import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Users, Receipt, MessageSquareWarning, UserCheck, Loader2, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/client";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { toast } from "sonner";

const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--info))", "hsl(var(--warning))", "hsl(var(--muted-foreground))"];

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenueYTD: 0,
    newResidents: 0,
    complaintsSolved: 0,
    visitorFootfall: 0
  });

  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [complaintTrend, setComplaintTrend] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  
  const supabase = createClient();

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // 1. Global KPIs
      const { data: bills } = await supabase.from("bills").select("amount, status, created_at");
      const { count: resCount } = await supabase.from("residents").select("*", { count: 'exact', head: true });
      const { count: solvedCount } = await supabase.from("complaints").select("*", { count: 'exact', head: true }).eq("status", "Resolved");
      const { count: totalVisitors } = await supabase.from("visitors").select("*", { count: 'exact', head: true });

      const paidTotal = bills?.filter(b => b.status === "Paid").reduce((acc, b) => acc + b.amount, 0) || 0;

      setStats({
        revenueYTD: paidTotal,
        newResidents: resCount || 0,
        complaintsSolved: solvedCount || 0,
        visitorFootfall: totalVisitors || 0
      });

      // 2. Revenue Trend (Grouped from bills)
      const monthlyData = bills?.reduce((acc: any, b) => {
        if (!b.billing_month) return acc;
        const month = b.billing_month.substring(0, 3);
        if (!acc[month]) acc[month] = { month, collected: 0, pending: 0 };
        if (b.status === "Paid") acc[month].collected += b.amount;
        else acc[month].pending += b.amount;
        return acc;
      }, {});
      setRevenueTrend(monthlyData ? Object.values(monthlyData) : []);

      // 3. Complaint Trend (Grouped from complaints over last 7 days)
      const { data: allComplaints } = await supabase.from("complaints").select("created_at, status");
      
      const now = new Date();
      const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (6 - i));
        return {
          day: d.toLocaleDateString('default', { weekday: 'short' }),
          dateStr: d.toISOString().split('T')[0],
          opened: 0,
          resolved: 0
        };
      });

      allComplaints?.forEach(c => {
         if (!c.created_at) return;
         const dStr = c.created_at.split('T')[0];
         const match = last7DaysData.find(x => x.dateStr === dStr);
         if (match) {
           if (c.status === "Resolved") match.resolved += 1;
           else match.opened += 1;
         }
      });
      setComplaintTrend(last7DaysData);

      // 4. Issue Categories (Pie chart)
      const { data: qComp } = await supabase.from("complaints").select("category");
      const counts = qComp?.reduce((acc: any, c) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
      }, {});
      
      const pieData = Object.entries(counts || {}).map(([name, value]) => ({ 
        name, 
        value: typeof value === 'number' ? value : 0 
      }));
      setCategoryData(pieData);

    } catch (error: any) {
      toast.error("Failed to generate report: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <DashboardLayout title="Reports & Analytics" subtitle="Society performance and operational insights.">
      <div className="space-y-6">
        {loading ? (
          <div className="flex h-96 items-center justify-center bg-card/40 rounded-3xl border-2 border-dashed border-border">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary/30 mb-4" />
              <p className="text-sm text-muted-foreground animate-pulse">Scanning database and generating analytics...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              <StatCard label="Total revenue (YTD)" value={`₹${(stats.revenueYTD / 1000).toFixed(1)}K`} icon={Receipt} accent="accent" />
              <StatCard label="Total residents" value={stats.newResidents.toString()} icon={Users} accent="primary" />
              <StatCard label="Complaints solved" value={stats.complaintsSolved.toString()} icon={MessageSquareWarning} accent="info" />
              <StatCard label="Visitor footfall" value={stats.visitorFootfall.toString()} icon={UserCheck} accent="warning" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/60 p-6 shadow-sm bg-card/60 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -translate-y-8 translate-x-8 blur-2xl"></div>
                <h3 className="mb-1 font-display text-lg font-bold">Revenue Pulse</h3>
                <p className="mb-6 text-xs text-muted-foreground">Monthly collections vs. pending dues</p>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={revenueTrend} margin={{ left: -10 }}>
                    <CartesianGrid stroke="hsl(var(--border))" vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight={600} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v)=>`${v/1000}K`} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: '12px' }} />
                    <Line type="monotone" dataKey="collected" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                    <Line type="monotone" dataKey="pending" stroke="hsl(var(--accent))" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="border-border/60 p-6 shadow-sm bg-card/60 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-info/5 rounded-bl-full -translate-y-8 translate-x-8 blur-2xl"></div>
                <h3 className="mb-1 font-display text-lg font-bold">Resolution Efficiency</h3>
                <p className="mb-6 text-xs text-muted-foreground">Opened vs. Resolved complaints (Last 7 Days)</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={complaintTrend} margin={{ left: -20 }}>
                    <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight={600} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip cursor={{fill: 'hsl(var(--secondary))', opacity: 0.4}} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                    <Bar dataKey="opened" fill="hsl(var(--primary))" radius={[4,4,0,0]} barSize={12} />
                    <Bar dataKey="resolved" fill="hsl(var(--accent))" radius={[4,4,0,0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="border-border/60 p-8 shadow-sm bg-card/60 backdrop-blur-sm lg:col-span-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                   <div>
                    <h3 className="font-display text-xl font-bold">Community Issue Portfolio</h3>
                    <p className="text-sm text-muted-foreground">Distribution of reported incidents by department</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={fetchReportData}>
                    Regenerate <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid items-center gap-12 md:grid-cols-2">
                  <div className="relative flex justify-center">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={categoryData} dataKey="value" innerRadius={80} outerRadius={120} paddingAngle={5}>
                          {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-bold leading-none">{stats.complaintsSolved + 12}</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Total Issues</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {categoryData.length > 0 ? categoryData.map((c, i) => {
                      const percentage = Math.round((c.value / (categoryData.reduce((prev, curr) => prev + curr.value, 0) || 1)) * 100);
                      return (
                        <div key={c.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2.5">
                              <span className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                              <span className="font-bold text-xs uppercase tracking-tight">{c.name}</span>
                            </div>
                            <div className="flex gap-4">
                               <span className="text-xs font-bold">{c.value}</span>
                               <span className="text-[11px] text-muted-foreground font-medium w-8 text-right">{percentage}%</span>
                            </div>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/50 p-[1px] border border-border/10">
                            <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="text-center py-10 text-xs text-muted-foreground italic border-2 border-dashed rounded-xl">Waiting for incident data...</div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
