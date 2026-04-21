import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { bills } from "@/lib/dummy-data";
import { Receipt, TrendingUp, AlertCircle, Wallet, Plus, Download } from "lucide-react";

const Billing = () => (
  <DashboardLayout title="Maintenance & Billing" subtitle="Invoices, dues, and payment history.">
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Collected (Apr)" value="₹5.45L" delta="+8.2%" icon={Wallet} accent="accent" />
        <StatCard label="Pending" value="₹1.84L" delta="-8.4%" trend="down" icon={AlertCircle} accent="warning" />
        <StatCard label="Invoices issued" value="312" icon={Receipt} accent="primary" />
        <StatCard label="Collection rate" value="92%" delta="+3.1%" icon={TrendingUp} accent="info" />
      </div>

      <Card className="border-border/60 p-5 shadow-elegant">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">Recent invoices</h3>
            <p className="text-sm text-muted-foreground">April 2025 maintenance cycle</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4" />Export</Button>
            <Button size="sm" className="gradient-primary text-primary-foreground hover:opacity-90"><Plus className="mr-1 h-4 w-4" />Generate bills</Button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>{["Invoice","Flat","Resident","Amount","Due","Status","Method"].map(h=><th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bills.map((b) => (
                <tr key={b.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3 font-mono text-xs">{b.id}</td>
                  <td className="px-4 py-3 font-mono text-xs">{b.flat}</td>
                  <td className="px-4 py-3 font-medium">{b.resident}</td>
                  <td className="px-4 py-3 font-semibold">₹{b.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.due}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{b.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </DashboardLayout>
);

export default Billing;
