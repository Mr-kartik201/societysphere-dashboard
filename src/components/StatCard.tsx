import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const StatCard = ({
  label,
  value,
  delta,
  trend = "up",
  icon: Icon,
  accent = "primary",
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  accent?: "primary" | "accent" | "warning" | "info";
}) => {
  const accentBg = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
  }[accent];

  return (
    <Card className="relative overflow-hidden border-border/60 p-5 shadow-elegant transition-all hover:shadow-elevated">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-bold tracking-tight md:text-3xl">{value}</p>
          {delta && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend === "up" ? "text-success" : "text-destructive"
              )}
            >
              {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {delta}
            </div>
          )}
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", accentBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
};
