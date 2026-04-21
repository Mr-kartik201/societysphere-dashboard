import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Receipt, AlertCircle, Wallet, Download, Plus, Eye, CreditCard, Send, Loader2 } from "lucide-react";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

interface BillWithResident {
  id: string;
  amount: number;
  billing_month: string;
  billing_year: number;
  due_date: string;
  payment_date: string | null;
  status: "Paid" | "Pending" | "Overdue";
  payment_method: string | null;
  invoice_number: string;
  residents: {
    name: string;
    block_wing: string;
    flat_number: string;
  } | null;
}

const Billing = () => {
  const [bills, setBills] = useState<BillWithResident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<BillWithResident | null>(null);
  const supabase = createClient();

  // Stats
  const [stats, setStats] = useState({
    totalCollected: 0,
    pendingDues: 0,
    overduePayments: 0,
    paidCount: 0
  });

  const fetchBills = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bills")
        .select(`
          *,
          residents (
            name,
            block_wing,
            flat_number
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const typedData = data as BillWithResident[];
      setBills(typedData || []);
      
      if (typedData && typedData.length > 0 && !selectedBill) {
        setSelectedBill(typedData[0]);
      }

      // Calculate Stats
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
      const currentStats = typedData.reduce((acc, bill) => {
        if (bill.status === "Paid") {
          acc.totalCollected += Number(bill.amount);
          acc.paidCount += 1;
        } else if (bill.status === "Pending") {
          acc.pendingDues += Number(bill.amount);
        } else if (bill.status === "Overdue") {
          acc.overduePayments += Number(bill.amount);
        }
        return acc;
      }, { totalCollected: 0, pendingDues: 0, overduePayments: 0, paidCount: 0 });

      setStats(currentStats);

    } catch (error: any) {
      toast.error("Failed to load billing data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Prepare chart data from real records
  const breakdownData = [
    { name: "Paid", value: stats.paidCount, fill: "hsl(var(--success))" },
    { name: "Pending", value: bills.filter(b => b.status === "Pending").length, fill: "hsl(var(--warning))" },
    { name: "Overdue", value: bills.filter(b => b.status === "Overdue").length, fill: "hsl(var(--destructive))" },
  ];

  // Placeholder for monthly trend (In production, this would be a separate aggregate query or processed from historical data)
  const trendData = [
    { month: "Apr", collected: stats.totalCollected, pending: stats.pendingDues },
  ];

  return (
    <DashboardLayout title="Maintenance & Billing" subtitle="Manage society finances, track maintenance dues, and payment history.">
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Total Collected" value={`₹${(stats.totalCollected/100000).toFixed(2)}L`} delta="+0%" icon={Wallet} accent="success" />
          <StatCard label="Pending Dues" value={`₹${(stats.pendingDues/1000).toFixed(1)}K`} delta="+0%" trend="up" icon={AlertCircle} accent="warning" />
          <StatCard label="Overdue Payments" value={`₹${(stats.overduePayments/1000).toFixed(1)}K`} delta="+0%" icon={AlertCircle} accent="destructive" />
          <StatCard label="Paid Bills" value={stats.paidCount.toString()} delta="+0%" icon={Receipt} accent="primary" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="april">
            <SelectTrigger className="w-[120px] bg-card"><SelectValue placeholder="Month" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="april">April</SelectItem>
              <SelectItem value="may">May</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" className="shadow-sm" onClick={fetchBills}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} Refresh
            </Button>
            <Button className="gradient-primary text-primary-foreground shadow-sm"><Plus className="mr-2 h-4 w-4" /> Generate Bills</Button>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-5 border-border bg-card shadow-sm rounded-xl">
            <h3 className="mb-4 font-semibold text-lg">Monthly Collection Trend</h3>
            <div className="h-[250px] w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/30" /></div>
              ) : (
                <ChartContainer config={{ 
                    collected: { label: "Collected", color: "hsl(var(--primary))" },
                    pending: { label: "Pending", color: "hsl(var(--warning))" }
                  }}>
                  <BarChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barGap={2} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                    <YAxis hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="collected" fill="var(--color-collected)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              )}
            </div>
          </Card>
          <Card className="p-5 border-border bg-card shadow-sm rounded-xl flex flex-col">
            <h3 className="mb-4 font-semibold text-lg">Payment Breakdown</h3>
            <div className="flex-1 flex items-center justify-center relative">
              <div className="h-[200px] w-full max-w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={breakdownData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold">{bills.length}</span>
                <span className="text-xs text-muted-foreground">Total Invoices</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-xs"><div className="w-2.5 h-2.5 rounded-full bg-success"></div>Paid</div>
              <div className="flex items-center gap-1.5 text-xs"><div className="w-2.5 h-2.5 rounded-full bg-warning"></div>Pending</div>
              <div className="flex items-center gap-1.5 text-xs"><div className="w-2.5 h-2.5 rounded-full bg-destructive"></div>Overdue</div>
            </div>
          </Card>
        </div>

        {/* Tables & Preview Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border shadow-sm rounded-xl overflow-hidden min-h-[400px]">
             {loading ? (
                <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/30" /></div>
              ) : (
              <Tabs defaultValue="dues" className="w-full">
                <div className="border-b border-border bg-secondary/30 px-5 pt-3">
                  <TabsList className="bg-transparent border-none">
                    <TabsTrigger value="dues" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">Maintenance Dues</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="dues" className="m-0">
                  <div className="overflow-x-auto p-0">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                        <tr>
                          {["Resident", "Flat", "Month", "Amount", "Status", "Actions"].map(h=><th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {bills.length === 0 ? (
                          <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No billing records found.</td></tr>
                        ) : (
                          bills.map((d) => (
                            <tr key={d.id} className="hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => setSelectedBill(d)}>
                              <td className="px-4 py-3 font-medium text-foreground">{d.residents?.name || "Unknown"}</td>
                              <td className="px-4 py-3 text-muted-foreground">{d.residents?.block_wing}-{d.residents?.flat_number}</td>
                              <td className="px-4 py-3 text-muted-foreground">{d.billing_month} {d.billing_year}</td>
                              <td className="px-4 py-3 font-semibold text-foreground">₹{Number(d.amount).toLocaleString()}</td>
                              <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"><Eye className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"><Send className="h-4 w-4" /></Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
             )}
          </Card>

          {selectedBill && (
            <Card className="border-border p-5 shadow-sm rounded-xl flex flex-col relative overflow-hidden bg-gradient-to-br from-card to-card/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-12 blur-2xl"></div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <Receipt className="h-5 w-5 text-primary" /> Invoice Preview
              </h3>
              
              <div className="flex-1 bg-secondary/30 rounded-lg p-5 border border-border/50 text-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="font-bold text-lg text-primary tracking-tight">SocietySphere</div>
                    <div className="text-xs text-muted-foreground mt-1">Maintenance Invoice</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[10px] font-semibold text-muted-foreground uppercase">{selectedBill.invoice_number || selectedBill.id.substring(0,8)}</div>
                    <StatusBadge status={selectedBill.status} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Bill To:</div>
                    <div className="font-medium text-base">{selectedBill.residents?.name}</div>
                    <div className="text-sm">Block {selectedBill.residents?.block_wing}, Flat {selectedBill.residents?.flat_number}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50 my-2">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Billing Period</div>
                      <div className="font-medium text-[12px]">{selectedBill.billing_month} {selectedBill.billing_year}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Due Date</div>
                      <div className="font-medium text-destructive text-[12px]">{selectedBill.due_date}</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Maintenance Fee</span>
                      <span>₹{Number(selectedBill.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-border font-bold text-base mt-2">
                      <span>Total Amount</span>
                      <span className="text-primary">₹{Number(selectedBill.amount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 flex gap-3">
                <Button variant="outline" className="flex-1"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
                <Button className="flex-1 gradient-primary text-primary-foreground"><Send className="mr-2 h-4 w-4" /> Send Reminder</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
