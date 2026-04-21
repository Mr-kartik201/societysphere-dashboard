import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout"; // Updated to correct import if needed, assuming DashboardLayout is in components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Filter, Download, MoreHorizontal, UserCircle, Car, Users, Loader2 } from "lucide-react";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

// Use consistent naming with the database schema
interface Resident {
  id: string;
  name: string;
  phone: string;
  email: string;
  flat_number: string;
  block_wing: string;
  resident_type: "Owner" | "Tenant";
  family_members: number;
  status: "Active" | "Past";
  move_in_date: string;
  created_at: string;
  // Vehicles would normally be in a separate table, for now we keep the UI logic or count them if we had a relation
  vehicles_count?: number; 
}

const Residents = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    move_in_date: "",
    block_wing: "",
    flat_number: "",
    resident_type: "Owner",
    family_members: 1,
  });

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("residents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResidents(data || []);
    } catch (error: any) {
      toast.error("Failed to load residents: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleRegisterResident = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("residents").insert([formData]);

      if (error) throw error;

      toast.success("Resident registered successfully!");
      setIsModalOpen(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        move_in_date: "",
        block_wing: "",
        flat_number: "",
        resident_type: "Owner",
        family_members: 1,
      });
      fetchResidents();
    } catch (error: any) {
      toast.error("Failed to register resident: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredResidents = residents.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.flat_number.includes(searchTerm) ||
    r.phone?.includes(searchTerm)
  );

  return (
    <DashboardLayout title="Residents Management" subtitle="Manage society owners, tenants, and their comprehensive details.">
      <Card className="border-border/60 p-5 shadow-elegant rounded-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by name, flat, or phone..." 
              className="bg-secondary pl-9 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select>
              <SelectTrigger className="w-[110px] h-9 text-xs">
                <SelectValue placeholder="Block" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Block A</SelectItem>
                <SelectItem value="B">Block B</SelectItem>
                <SelectItem value="C">Block C</SelectItem>
                <SelectItem value="D">Block D</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gradient-primary text-primary-foreground hover:opacity-90 shadow-md">
                  <Plus className="mr-1 h-4 w-4" /> Add Resident
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleRegisterResident}>
                  <DialogHeader>
                    <DialogTitle>Add New Resident</DialogTitle>
                    <DialogDescription>
                      Enter the details of the new resident to register them in SocietySphere.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          placeholder="E.g. Siddharth Joshi" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          placeholder="+91 XXXXX XXXXX" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="email@example.com" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="movein">Move-in Date</Label>
                        <Input 
                          id="movein" 
                          type="date" 
                          value={formData.move_in_date}
                          onChange={(e) => setFormData({...formData, move_in_date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="block">Block/Wing</Label>
                        <Select 
                          value={formData.block_wing}
                          onValueChange={(val) => setFormData({...formData, block_wing: val})}
                        >
                          <SelectTrigger id="block"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="D">D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="flat">Flat Number</Label>
                        <Input 
                          id="flat" 
                          placeholder="E.g. 402" 
                          required
                          value={formData.flat_number}
                          onChange={(e) => setFormData({...formData, flat_number: e.target.value})}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="type">Resident Type</Label>
                        <Select 
                          value={formData.resident_type}
                          onValueChange={(val: any) => setFormData({...formData, resident_type: val})}
                        >
                          <SelectTrigger id="type"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Owner">Owner</SelectItem>
                            <SelectItem value="Tenant">Tenant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="family">Family Members Count</Label>
                        <Input 
                          id="family" 
                          type="number" 
                          min="1" 
                          value={formData.family_members}
                          onChange={(e) => setFormData({...formData, family_members: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="gradient-primary" disabled={submitting}>
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Register Resident"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm min-h-[300px]">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-secondary/70 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  {["Resident", "Flat Info", "Contact Details", "Type", "Status", "Actions"].map(h=>(
                    <th key={h} className="px-4 py-4 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredResidents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      No residents found. Add your first resident to get started!
                    </td>
                  </tr>
                ) : (
                  filteredResidents.map((r) => (
                    <tr key={r.id} className="transition-all hover:bg-secondary/40 group">
                      <td className="px-4 py-4 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary text-sm font-semibold text-primary-foreground shadow-sm">
                            {r.name.split(" ").map(n=>n[0]).join("")}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{r.name}</div>
                            <div className="text-xs text-muted-foreground">ID: {r.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 min-w-[120px]">
                        <div className="font-medium">{r.block_wing}-{r.flat_number}</div>
                        <div className="text-xs text-muted-foreground">Since {r.move_in_date ? new Date(r.move_in_date).getFullYear() : "—"}</div>
                      </td>
                      <td className="px-4 py-4 min-w-[180px]">
                        <div className="text-sm">{r.phone || "—"}</div>
                        <div className="text-xs text-muted-foreground">{r.email || "—"}</div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={r.resident_type} />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <UserCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Residents;

