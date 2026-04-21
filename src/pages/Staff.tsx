import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { staff } from "@/lib/dummy-data";
import { Plus, Phone } from "lucide-react";

const Staff = () => (
  <DashboardLayout title="Staff" subtitle="Manage security, maintenance and housekeeping staff.">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <div className="font-display text-lg font-semibold">{staff.length} staff members</div>
        <div className="text-sm text-muted-foreground">{staff.filter(s=>s.status==="On Duty").length} currently on duty</div>
      </div>
      <Button className="gradient-primary text-primary-foreground hover:opacity-90"><Plus className="mr-1 h-4 w-4" />Add staff</Button>
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {staff.map((s) => (
        <Card key={s.id} className="border-border/60 p-5 shadow-elegant transition-all hover:shadow-elevated">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-sm font-semibold text-primary-foreground">
              {s.name.split(" ").map(n=>n[0]).join("")}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{s.name}</h3>
                <StatusBadge status={s.status} />
              </div>
              <div className="text-sm text-muted-foreground">{s.role}</div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="text-muted-foreground">{s.shift} shift</span>
                <a href={`tel:${s.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                  <Phone className="h-3 w-3" /> Call
                </a>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </DashboardLayout>
);

export default Staff;
