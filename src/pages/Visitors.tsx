import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { visitors } from "@/lib/dummy-data";
import { StatCard } from "@/components/StatCard";
import { UserCheck, LogIn, LogOut, Plus, Search } from "lucide-react";

const Visitors = () => (
  <DashboardLayout title="Visitors" subtitle="Live gate log and pre-approvals.">
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Inside society" value="14" icon={LogIn} accent="info" />
        <StatCard label="Today's entries" value="46" delta="+18%" icon={UserCheck} accent="accent" />
        <StatCard label="Today's exits" value="32" icon={LogOut} accent="primary" />
      </div>

      <Card className="border-border/60 p-5 shadow-elegant">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search visitors..." className="bg-secondary pl-9" />
          </div>
          <Button size="sm" className="gradient-primary text-primary-foreground hover:opacity-90"><Plus className="mr-1 h-4 w-4" />Log visitor</Button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>{["ID","Visitor","Purpose","Visiting","Entry","Exit","Status"].map(h=><th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visitors.map((v) => (
                <tr key={v.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3 font-mono text-xs">{v.id}</td>
                  <td className="px-4 py-3 font-medium">{v.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.purpose}</td>
                  <td className="px-4 py-3 font-mono text-xs">{v.flat}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.entry}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.exit}</td>
                  <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </DashboardLayout>
);

export default Visitors;
