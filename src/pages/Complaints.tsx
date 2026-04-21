import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { complaints } from "@/lib/dummy-data";
import { StatCard } from "@/components/StatCard";
import { MessageSquareWarning, CheckCircle2, Clock, Plus } from "lucide-react";

const Complaints = () => (
  <DashboardLayout title="Complaints" subtitle="Track, assign and resolve resident issues.">
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Open" value="9" icon={MessageSquareWarning} accent="info" />
        <StatCard label="In progress" value="6" icon={Clock} accent="warning" />
        <StatCard label="Resolved (mo)" value="48" delta="+12" icon={CheckCircle2} accent="accent" />
        <StatCard label="Avg. resolution" value="1.8d" delta="-0.4d" icon={Clock} accent="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {["Open","In Progress","Resolved"].map((col) => (
          <Card key={col} className="border-border/60 p-5 shadow-elegant">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display font-semibold">{col}</h3>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">{complaints.filter(c=>c.status===col).length}</span>
            </div>
            <div className="space-y-3">
              {complaints.filter(c=>c.status===col).map((c) => (
                <div key={c.id} className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="text-xs font-mono text-muted-foreground">{c.id}</div>
                    <StatusBadge status={c.priority} />
                  </div>
                  <div className="mt-2 text-sm font-medium">{c.title}</div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{c.flat} · {c.category}</span>
                    <span>{c.date}</span>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground"><Plus className="mr-1 h-4 w-4" />Add</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default Complaints;
