import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { StatCard } from "@/components/StatCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, LogIn, Package, Search, Phone, User, Clock, Check, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

interface VisitorWithResident {
  id: string;
  name: string;
  phone: string;
  visitor_type: string;
  purpose: string;
  entry_time: string;
  exit_time: string | null;
  status: "Pending" | "Approved" | "Denied" | "Completed";
  residents: {
    name: string;
    block_wing: string;
    flat_number: string;
  } | null;
}

interface DeliveryWithResident {
  id: string;
  service_name: string;
  status: "Pending" | "At Gate" | "Delivered" | "Returned";
  entry_time: string;
  delivery_time: string | null;
  residents: {
    name: string;
    block_wing: string;
    flat_number: string;
  } | null;
}

const Visitors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visitors, setVisitors] = useState<VisitorWithResident[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryWithResident[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    flat: "",
    type: "",
    purpose: ""
  });

  // Stats
  const [stats, setStats] = useState({
    inside: 0,
    entriesToday: 0,
    pendingApprovals: 0,
    deliveriesToday: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Visitors
      const { data: vData, error: vError } = await supabase
        .from("visitors")
        .select(`
          *,
          residents (
            name,
            block_wing,
            flat_number
          )
        `)
        .order("created_at", { ascending: false });

      if (vError) throw vError;

      // Fetch Deliveries
      const { data: dData, error: dError } = await supabase
        .from("deliveries")
        .select(`
          *,
          residents (
            name,
            block_wing,
            flat_number
          )
        `)
        .order("created_at", { ascending: false });

      if (dError) {
        // If deliveries table doesn't exist yet, we'll just handle it gracefully
        console.warn("Deliveries table might not exist yet:", dError.message);
        setDeliveries([]);
      } else {
        setDeliveries(dData as DeliveryWithResident[]);
      }

      const typedVisitors = vData as VisitorWithResident[];
      setVisitors(typedVisitors || []);

      // Calculate Stats
      const today = new Date().toISOString().split('T')[0];
      const currentStats = typedVisitors.reduce((acc, v) => {
        if (v.status === "Approved" && !v.exit_time) acc.inside += 1;
        if (v.created_at.startsWith(today)) acc.entriesToday += 1;
        if (v.status === "Pending") acc.pendingApprovals += 1;
        return acc;
      }, { inside: 0, entriesToday: 0, pendingApprovals: 0, deliveriesToday: (dData?.length || 0) });

      setStats(currentStats);

    } catch (error: any) {
      toast.error("Failed to load visitor data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNewEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.flat || !formData.type) {
      toast.error("Required fields missing");
      return;
    }

    setSubmitting(true);
    try {
      // Note: In a real app, we'd lookup resident_id by flat number.
      // For this demo, we'll attempt to find a resident first.
      const { data: resData } = await supabase
        .from("residents")
        .select("id")
        .eq("flat_number", formData.flat.split('-').pop() || formData.flat)
        .limit(1)
        .single();

      const { error } = await supabase
        .from("visitors")
        .insert([{
          name: formData.name,
          phone: formData.phone,
          visitor_type: formData.type,
          purpose: formData.purpose,
          status: "Pending",
          resident_id: resData?.id || null
        }]);

      if (error) throw error;

      toast.success("Entry request submitted");
      setFormData({ name: "", phone: "", flat: "", type: "", purpose: "" });
      fetchData();
    } catch (error: any) {
      toast.error("Failed to log entry: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateVisitorStatus = async (id: string, status: string, isExit = false) => {
    try {
      const updates: any = { status };
      if (isExit) updates.exit_time = new Date().toISOString();

      const { error } = await supabase
        .from("visitors")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      toast.success(`Visitor ${status}`);
      fetchData();
    } catch (error: any) {
      toast.error("Update failed: " + error.message);
    }
  };

  const filteredVisitors = visitors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.residents?.flat_number.includes(searchTerm)
  );

  return (
    <DashboardLayout title="Visitor Security & Logistics" subtitle="Monitor gates, authorize visitors, and track deliveries.">
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Inside Society" value={stats.inside.toString()} icon={LogIn} accent="info" />
          <StatCard label="Today's Entries" value={stats.entriesToday.toString()} delta="+0" icon={UserCheck} accent="success" />
          <StatCard label="Pending Approvals" value={stats.pendingApprovals.toString()} accent="warning" trend="up" icon={Clock} />
          <StatCard label="Deliveries Logged" value={deliveries.length.toString()} icon={Package} accent="primary" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          
          {/* Main Tables Area (Left Column) */}
          <Card className="border-border shadow-sm rounded-xl overflow-hidden flex flex-col min-h-[500px] bg-card">
            <Tabs defaultValue="log" className="w-full h-full flex flex-col">
              <div className="p-5 border-b border-border bg-gradient-to-br from-secondary/30 to-background flex flex-col md:flex-row md:items-center justify-between gap-4">
                <TabsList className="bg-secondary/50">
                  <TabsTrigger value="log" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">Visitor Log</TabsTrigger>
                  <TabsTrigger value="deliveries" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">Deliveries</TabsTrigger>
                </TabsList>

                <div className="flex flex-wrap gap-2">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search name or flat..." 
                      className="bg-background pl-9 h-9 text-xs"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchData}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
                  </Button>
                </div>
              </div>

              <TabsContent value="log" className="m-0 flex-1 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <tr>
                      {["Visitor Info", "Flat/Resident", "Type", "Log Times", "Status", "Actions"].map(h=><th key={h} className="px-4 py-3 font-semibold whitespace-nowrap text-left">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr><td colSpan={6} className="px-4 py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary/30" /></td></tr>
                    ) : filteredVisitors.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-20 text-center text-muted-foreground">No visitors logged.</td></tr>
                    ) : (
                      filteredVisitors.map((v) => (
                        <tr key={v.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 min-w-[160px]">
                            <div className="font-medium flex items-center gap-2 text-[13px]">
                              <User className="h-3.5 w-3.5 text-muted-foreground" /> {v.name}
                            </div>
                            <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                              <Phone className="h-3 w-3" /> {v.phone}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-xs">{v.residents?.block_wing}-{v.residents?.flat_number}</div>
                            <div className="text-[11px] text-muted-foreground">{v.residents?.name || "Unknown"}</div>
                          </td>
                          <td className="px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase">
                            {v.visitor_type}
                          </td>
                          <td className="px-4 py-3 min-w-[140px]">
                            <div className="text-[11px]"><span className="text-muted-foreground">In:</span> {new Date(v.entry_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            <div className="text-[11px]"><span className="text-muted-foreground">Out:</span> {v.exit_time ? new Date(v.exit_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "—"}</div>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={v.status} />
                          </td>
                          <td className="px-4 py-3">
                            {v.status === "Pending" ? (
                              <div className="flex gap-1">
                                <Button size="icon" variant="outline" onClick={() => updateVisitorStatus(v.id, 'Approved')} className="h-7 w-7 text-success border-success/30 hover:bg-success hover:text-white"><Check className="h-4 w-4" /></Button>
                                <Button size="icon" variant="outline" onClick={() => updateVisitorStatus(v.id, 'Denied')} className="h-7 w-7 text-destructive border-destructive/30 hover:bg-destructive hover:text-white"><X className="h-4 w-4" /></Button>
                              </div>
                            ) : (
                              !v.exit_time && v.status === "Approved" ? (
                                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateVisitorStatus(v.id, 'Completed', true)}>Mark Exit</Button>
                              ) : null
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </TabsContent>

              <TabsContent value="deliveries" className="m-0 flex-1 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <tr>
                      {["ID", "Service", "Flat/Recipient", "Status", "Actions"].map(h=><th key={h} className="px-4 py-3 font-semibold whitespace-nowrap text-left">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {deliveries.length === 0 ? (
                       <tr><td colSpan={5} className="px-4 py-20 text-center text-muted-foreground">No deliveries logged.</td></tr>
                    ) : (
                      deliveries.map((d) => (
                        <tr key={d.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 font-mono text-[10px] font-semibold">{d.id.substring(0,8)}</td>
                          <td className="px-4 py-3 font-medium flex items-center gap-2 text-xs">
                            <Package className="h-4 w-4 text-primary" /> {d.service_name}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-xs">{d.residents?.block_wing}-{d.residents?.flat_number}</div>
                            <div className="text-[11px] text-muted-foreground">{d.residents?.name}</div>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={d.status} />
                          </td>
                          <td className="px-4 py-3">
                            {d.status === "At Gate" && (
                              <Button size="sm" variant="outline" className="h-7 text-xs">Mark Delivered</Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Visitor Entry Form (Right Column) */}
          <Card className="border-border shadow-sm rounded-xl p-5 flex flex-col bg-card bg-gradient-to-b from-card to-secondary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -translate-y-4 translate-x-4 blur-xl"></div>
            
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
              <UserCheck className="h-5 w-5 text-primary" /> New Entry Log
            </h3>
            
            <form className="flex-1 flex flex-col gap-4 text-sm" onSubmit={handleNewEntry}>
              <div className="space-y-1.5">
                <Label htmlFor="vname">Visitor Name *</Label>
                <Input id="vname" placeholder="E.g. Delivery Agent" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vphone">Phone Number</Label>
                <Input id="vphone" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="vflat">Visiting Flat *</Label>
                  <Input id="vflat" placeholder="E.g. A-1204" value={formData.flat} onChange={e => setFormData({...formData, flat: e.target.value})} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vtype">Visitor Type *</Label>
                  <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                    <SelectTrigger id="vtype" className="text-xs h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Guest">Guest</SelectItem>
                      <SelectItem value="Delivery">Delivery</SelectItem>
                      <SelectItem value="Maid">Maid</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vpurpose">Purpose of Visit</Label>
                <Input id="vpurpose" placeholder="E.g. Relatives, Amazon package" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} />
              </div>
              
              <div className="flex-1"></div>

              <Button type="submit" disabled={submitting} className="w-full gradient-primary text-primary-foreground font-semibold shadow-md py-6 text-base mt-4">
                {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Request Entry"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Visitors;
