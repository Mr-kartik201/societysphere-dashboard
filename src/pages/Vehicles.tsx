import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/lib/dummy-data";
import { Car, Plus } from "lucide-react";

const Vehicles = () => (
  <DashboardLayout title="Vehicles" subtitle="Registered vehicles and parking slots.">
    <Card className="border-border/60 p-5 shadow-elegant">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Car className="h-5 w-5" /></div>
          <div>
            <div className="font-display text-lg font-semibold">418 vehicles registered</div>
            <div className="text-sm text-muted-foreground">312 cars · 84 bikes · 22 SUVs</div>
          </div>
        </div>
        <Button className="gradient-primary text-primary-foreground hover:opacity-90"><Plus className="mr-1 h-4 w-4" />Register vehicle</Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>{["Reg. number","Owner","Flat","Type","Color","Slot"].map(h=><th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-secondary/40">
                <td className="px-4 py-3 font-mono text-xs font-semibold">{v.number}</td>
                <td className="px-4 py-3 font-medium">{v.owner}</td>
                <td className="px-4 py-3 font-mono text-xs">{v.flat}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{v.type}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{v.color}</td>
                <td className="px-4 py-3 font-mono text-xs">{v.slot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </DashboardLayout>
);

export default Vehicles;
