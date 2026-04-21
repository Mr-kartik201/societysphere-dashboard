import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  Paid: "bg-success/10 text-success ring-success/20",
  Pending: "bg-warning/10 text-warning ring-warning/20",
  Overdue: "bg-destructive/10 text-destructive ring-destructive/20",
  Open: "bg-info/10 text-info ring-info/20",
  "In Progress": "bg-warning/10 text-warning ring-warning/20",
  Resolved: "bg-success/10 text-success ring-success/20",
  Available: "bg-success/10 text-success ring-success/20",
  Booked: "bg-info/10 text-info ring-info/20",
  Maintenance: "bg-warning/10 text-warning ring-warning/20",
  "On Duty": "bg-success/10 text-success ring-success/20",
  Off: "bg-muted text-muted-foreground ring-border",
  In: "bg-info/10 text-info ring-info/20",
  Out: "bg-muted text-muted-foreground ring-border",
  Owner: "bg-primary/10 text-primary ring-primary/20",
  Tenant: "bg-accent/10 text-accent ring-accent/20",
  High: "bg-destructive/10 text-destructive ring-destructive/20",
  Medium: "bg-warning/10 text-warning ring-warning/20",
  Low: "bg-muted text-muted-foreground ring-border",
};

export const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
      map[status] ?? "bg-muted text-muted-foreground ring-border"
    )}
  >
    {status}
  </span>
);
