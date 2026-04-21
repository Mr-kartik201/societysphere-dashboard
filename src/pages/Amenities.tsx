import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { amenities } from "@/lib/dummy-data";
import { Users } from "lucide-react";

const Amenities = () => (
  <DashboardLayout title="Amenities" subtitle="Browse and book society facilities.">
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {amenities.map((a) => (
        <Card key={a.id} className="overflow-hidden border-border/60 shadow-elegant transition-all hover:-translate-y-1 hover:shadow-elevated">
          <div className="flex h-32 items-center justify-center gradient-hero text-6xl">{a.img}</div>
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">{a.name}</h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" /> Capacity {a.capacity}
                </div>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div className="mt-4 rounded-lg bg-secondary/50 px-3 py-2 text-xs">
              <span className="text-muted-foreground">Next available · </span>
              <span className="font-medium">{a.nextSlot}</span>
            </div>
            <Button
              className="mt-4 w-full gradient-primary text-primary-foreground hover:opacity-90"
              disabled={a.status === "Maintenance"}
            >
              {a.status === "Booked" ? "Join waitlist" : "Book now"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  </DashboardLayout>
);

export default Amenities;
