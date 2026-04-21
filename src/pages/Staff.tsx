import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Phone, Loader2, UserPlus } from "lucide-react";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: "On Duty" | "Off Duty" | "On Leave";
  shift: string;
  created_at: string;
}

const Staff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  // New Staff Form State
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "",
    phone: "",
    shift: "Morning",
    status: "On Duty"
  });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setStaff(data || []);
    } catch (error: any) {
      toast.error("Failed to load staff: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async () => {
    if (!newStaff.name || !newStaff.role || !newStaff.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("staff")
        .insert([{
          name: newStaff.name,
          role: newStaff.role,
          phone: newStaff.phone,
          status: newStaff.status,
          shift: newStaff.shift
        }]);

      if (error) throw error;

      toast.success("Staff member added successfully!");
      setIsModalOpen(false);
      setNewStaff({ name: "", role: "", phone: "", shift: "Morning", status: "On Duty" });
      fetchStaff();
    } catch (error: any) {
      toast.error("Failed to add staff: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onDutyCount = staff.filter(s => s.status === "On Duty").length;

  return (
    <DashboardLayout title="Staff Management" subtitle="Manage security, maintenance and housekeeping staff.">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="font-display text-xl font-bold flex items-center gap-2">
            {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : staff.length} 
            <span className="text-foreground">total staff</span>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
             <div className="h-2 w-2 rounded-full bg-success"></div>
             {onDutyCount} currently on duty
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground shadow-md">
              <Plus className="mr-1.5 h-4 w-4" /> Add staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" /> Hiring Portal
              </DialogTitle>
              <DialogDescription>Register a new staff member into the society workforce.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" placeholder="E.g. Rajesh Kumar" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={newStaff.role} onValueChange={v => setNewStaff({...newStaff, role: v})}>
                    <SelectTrigger id="role"><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Security Head">Security Head</SelectItem>
                      <SelectItem value="Security Guard">Security Guard</SelectItem>
                      <SelectItem value="Facility Manager">Facility Manager</SelectItem>
                      <SelectItem value="Electrician">Electrician</SelectItem>
                      <SelectItem value="Plumber">Plumber</SelectItem>
                      <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="shift">Shift</Label>
                  <Select value={newStaff.shift} onValueChange={v => setNewStaff({...newStaff, shift: v})}>
                    <SelectTrigger id="shift"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning (6AM-2PM)</SelectItem>
                      <SelectItem value="Afternoon">Afternoon (2PM-10PM)</SelectItem>
                      <SelectItem value="Night">Night (10PM-6AM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" placeholder="+91 XXXXX XXXXX" value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Availability</Label>
                <Select value={newStaff.status} onValueChange={(v: any) => setNewStaff({...newStaff, status: v})}>
                  <SelectTrigger id="status"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On Duty">On Duty</SelectItem>
                    <SelectItem value="Off Duty">Off Duty</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button className="gradient-primary" disabled={submitting} onClick={handleAddStaff}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Hire Staff"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary/20" />
        </div>
      ) : staff.length === 0 ? (
        <div className="px-4 py-32 text-center text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-card/50">
           <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-20" />
           <p className="text-lg font-medium">No workforce data found</p>
           <p className="text-sm">Start by adding your first society staff member.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {staff.map((s) => (
            <Card key={s.id} className="group border-border/60 p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/40 bg-card overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -translate-y-12 translate-x-12 blur-xl"></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground shadow-sm">
                  {s.name.split(" ").map(n=>n[0]).join("").substring(0,2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-bold text-[15px]">{s.name}</h3>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-tight">{s.role}</div>
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-[11px]">
                    <span className="text-muted-foreground font-semibold flex items-center gap-1.5 uppercase">
                      <div className={`h-1.5 w-1.5 rounded-full ${s.shift === 'Night' ? 'bg-indigo-400' : 'bg-orange-400'}`}></div>
                      {s.shift} shift
                    </span>
                    <a href={`tel:${s.phone}`} className="flex items-center gap-1 text-primary font-bold hover:underline transition-all hover:gap-1.5">
                      <Phone className="h-3 w-3" /> CALL NOW
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Staff;
