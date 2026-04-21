import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Car, Plus, Loader2, Search } from "lucide-react";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  vehicle_number: string;
  vehicle_type: string;
  brand_model: string;
  sticker_id: string;
  residents: {
    name: string;
    flat_number: string;
    block_wing: string;
  } | null;
}

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const supabase = createClient();

  // Registration Form State
  const [form, setForm] = useState({
    vNumber: "",
    vType: "Car",
    flat: "",
    brand: "",
    sticker: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select(`
          *,
          residents (name, flat_number, block_wing)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVehicles(data as Vehicle[] || []);
    } catch (error: any) {
      toast.error("Failed to load vehicles: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegister = async () => {
    if (!form.vNumber || !form.flat) {
      toast.error("Vehicle number and Flat are required");
      return;
    }

    setSubmitting(true);
    try {
      // Find resident
      const { data: resData } = await supabase
        .from("residents")
        .select("id")
        .eq("flat_number", form.flat.split('-').pop() || form.flat)
        .limit(1)
        .single();

      if (!resData) {
        toast.error("Resident not found with this flat number");
        return;
      }

      const { error } = await supabase
        .from("vehicles")
        .insert([{
          vehicle_number: form.vNumber,
          vehicle_type: form.vType,
          brand_model: form.brand,
          sticker_id: form.sticker,
          resident_id: resData.id
        }]);

      if (error) throw error;

      toast.success("Vehicle registered successfully!");
      setIsModalOpen(false);
      setForm({ vNumber: "", vType: "Car", flat: "", brand: "", sticker: "" });
      fetchData();
    } catch (error: any) {
      toast.error("Registration failed: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.residents?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const vehicleStats = vehicles.reduce((acc: any, v) => {
    acc[v.vehicle_type] = (acc[v.vehicle_type] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout title="Vehicles Management" subtitle="Registered vehicles and parking slots.">
      <div className="space-y-6">
        <Card className="border-border/60 p-6 shadow-sm bg-card">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display text-xl font-bold">{loading ? "..." : vehicles.length} Vehicles</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex gap-2">
                   {Object.entries(vehicleStats).map(([type, count]) => (
                     <span key={type}>{count} {type}s</span>
                   ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search number or owner..." 
                  className="pl-9 h-10 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary text-primary-foreground shadow-md h-10">
                    <Plus className="mr-1.5 h-4 w-4" /> Register Vehicle
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px]">
                  <DialogHeader>
                    <DialogTitle>Vehicle Registration</DialogTitle>
                    <DialogDescription>Link a new vehicle to a society resident.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Vehicle Number *</Label>
                        <Input placeholder="E.g. MH 12 AB 1234" value={form.vNumber} onChange={e => setForm({...form, vNumber: e.target.value})} className="font-mono" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Type</Label>
                        <Select value={form.vType} onValueChange={v => setForm({...form, vType: v})}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Car">Car</SelectItem>
                            <SelectItem value="Bike">Bike</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="Cycle">Cycle/Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Visiting Flat *</Label>
                        <Input placeholder="E.g. A-1204" value={form.flat} onChange={e => setForm({...form, flat: e.target.value})} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Brand / Model</Label>
                        <Input placeholder="E.g. Toyota Camry" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Parking Sticker ID</Label>
                      <Input placeholder="E.g. GM-P-2024-55" value={form.sticker} onChange={e => setForm({...form, sticker: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button className="gradient-primary" disabled={submitting} onClick={handleRegister}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Confirm Registration"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-sm">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                <tr>
                  {["Reg. Number", "Owner Info", "Flat Details", "Vehicle Details", "Sticker ID"].map(h => (
                    <th key={h} className="px-5 py-4 text-left font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary/20" /></td></tr>
                ) : filteredVehicles.length === 0 ? (
                  <tr><td colSpan={5} className="py-20 text-center text-muted-foreground italic">No vehicles registered.</td></tr>
                ) : (
                  filteredVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-5 py-4">
                         <div className="font-mono text-xs font-bold py-1 px-2 rounded-md bg-secondary border border-border inline-block shadow-sm group-hover:border-primary/20">{v.vehicle_number}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-[13px]">{v.residents?.name || "Unknown"}</div>
                      </td>
                      <td className="px-5 py-4">
                         <div className="font-mono text-xs text-muted-foreground font-semibold">
                           {v.residents?.block_wing}-{v.residents?.flat_number}
                         </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                           <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                             {v.vehicle_type}
                           </span>
                           <span className="text-[11px] text-muted-foreground italic">{v.brand_model}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-[11px] font-mono font-medium text-muted-foreground/80">{v.sticker_id || "N/A"}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Vehicles;
