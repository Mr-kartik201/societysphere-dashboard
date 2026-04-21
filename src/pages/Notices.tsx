import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notices } from "@/lib/dummy-data";
import { Pin, Plus, Megaphone } from "lucide-react";

const categoryColor: Record<string, string> = {
  Meeting: "bg-primary/10 text-primary",
  Maintenance: "bg-warning/10 text-warning",
  Event: "bg-accent/10 text-accent",
  Update: "bg-info/10 text-info",
};

const Notices = () => (
  <DashboardLayout title="Notice Board" subtitle="Announcements for all residents.">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Megaphone className="h-5 w-5" /></div>
          <div>
            <div className="font-display text-lg font-semibold">{notices.length} active notices</div>
            <div className="text-sm text-muted-foreground">{notices.filter(n=>n.pinned).length} pinned</div>
          </div>
        </div>
        <Button className="gradient-primary text-primary-foreground hover:opacity-90"><Plus className="mr-1 h-4 w-4" />New notice</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {notices.map((n) => (
          <Card key={n.id} className="group border-border/60 p-6 shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-elevated">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColor[n.category]}`}>{n.category}</span>
                {n.pinned && <Pin className="h-3.5 w-3.5 text-primary" />}
              </div>
              <span className="text-xs text-muted-foreground">{n.date}</span>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{n.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{n.body}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs">
              <span className="text-muted-foreground">By Admin · {n.id}</span>
              <Button variant="ghost" size="sm">Read more</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default Notices;
