import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { residents } from "@/lib/dummy-data";
import { Plus, Search, Filter, Download, MoreHorizontal } from "lucide-react";

const Residents = () => (
  <DashboardLayout title="Residents" subtitle="Manage owners, tenants and contacts.">
    <Card className="border-border/60 p-5 shadow-elegant">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, flat or phone..." className="bg-secondary pl-9" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="mr-1 h-4 w-4" />Filter</Button>
          <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4" />Export</Button>
          <Button size="sm" className="gradient-primary text-primary-foreground hover:opacity-90"><Plus className="mr-1 h-4 w-4" />Add resident</Button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {["Resident","Flat","Phone","Email","Status","Since",""].map(h=>(
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {residents.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-secondary/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-xs font-semibold text-primary-foreground">
                      {r.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{r.flat}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{r.since}</td>
                <td className="px-4 py-3"><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div>Showing 1–8 of 842 residents</div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </Card>
  </DashboardLayout>
);

export default Residents;
