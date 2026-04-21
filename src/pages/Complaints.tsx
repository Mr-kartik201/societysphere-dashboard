import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { StatCard } from "@/components/StatCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MessageSquareWarning, CheckCircle2, Clock, Plus, UploadCloud, Eye, MessageSquare, Wrench, Loader2 } from "lucide-react";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

interface ComplaintWithResident {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: "Open" | "In Progress" | "Resolved";
  created_at: string;
  staff_assigned: string | null;
  resident_id: string | null;
  residents: {
    name: string;
    block_wing: string;
    flat_number: string;
  } | null;
}

const Complaints = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [complaints, setComplaints] = useState<ComplaintWithResident[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ComplaintWithResident | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "",
    flat: "", // Optional input for location
    description: ""
  });

  // Stats
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0
  });

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("complaints")
        .select(`
          *,
          residents (
            name,
            block_wing,
            flat_number
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const typedData = data as ComplaintWithResident[];
      setComplaints(typedData || []);
      
      // Calculate Stats
      const currentStats = (typedData || []).reduce((acc, c) => {
        if (c.status === "Open") acc.open += 1;
        else if (c.status === "In Progress") acc.inProgress += 1;
        else if (c.status === "Resolved") acc.resolved += 1;
        return acc;
      }, { open: 0, inProgress: 0, resolved: 0 });

      setStats(currentStats);
    } catch (error: any) {
      toast.error("Failed to load complaints: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleRaiseComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.priority || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("complaints")
        .insert([{
          title: formData.title,
          category: formData.category,
          priority: formData.priority,
          description: formData.description,
          status: "Open"
        }]);

      if (error) throw error;

      toast.success("Complaint submitted successfully!");
      setFormData({ title: "", category: "", priority: "", flat: "", description: "" });
      fetchComplaints();
    } catch (error: any) {
      toast.error("Submission failed: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveTicket = async (id: string) => {
    try {
      const { error } = await supabase
        .from("complaints")
        .update({ status: "Resolved" })
        .eq("id", id);

      if (error) throw error;

      toast.success("Ticket marked as resolved");
      setIsDetailOpen(false);
      fetchComplaints();
    } catch (error: any) {
      toast.error("Failed to update ticket: " + error.message);
    }
  };

  const filteredComplaints = complaints.filter(c => 
    activeTab === "All" ? true : 
    (activeTab === "Open" && c.status === "Open") ||
    (activeTab === "In Progress" && c.status === "In Progress") ||
    (activeTab === "Resolved" && c.status === "Resolved")
  );

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "High": return "text-destructive bg-destructive/10";
      case "Medium": return "text-warning bg-warning/10";
      case "Low": return "text-muted-foreground bg-muted";
      default: return "";
    }
  };

  return (
    <DashboardLayout title="Complaint Management" subtitle="Log, assign, and track resident issues efficiently.">
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Total Open" value={stats.open.toString()} icon={MessageSquareWarning} accent="destructive" />
          <StatCard label="In Progress" value={stats.inProgress.toString()} icon={Clock} accent="warning" />
          <StatCard label="Resolved (Total)" value={stats.resolved.toString()} delta="+0" icon={CheckCircle2} accent="success" />
          <StatCard label="Response Tier" value="Standard" delta="24h" icon={Wrench} accent="primary" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Table Area (2/3 width) */}
          <Card className="lg:col-span-2 border-border shadow-sm rounded-xl overflow-hidden flex flex-col min-h-[500px] bg-card">
            <div className="p-5 border-b border-border bg-gradient-to-br from-secondary/30 to-background flex flex-col md:flex-row md:items-center justify-between gap-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
                  <TabsTrigger value="All">All</TabsTrigger>
                  <TabsTrigger value="Open">Open</TabsTrigger>
                  <TabsTrigger value="In Progress">Working</TabsTrigger>
                  <TabsTrigger value="Resolved">Resolved</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm" onClick={fetchComplaints}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
              </Button>
            </div>

            <div className="overflow-x-auto flex-1">
              {loading ? (
                <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/30" /></div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <tr>
                      {["Ticket", "Resident", "Category", "Priority", "Status", "Staff", "Actions"].map(h=><th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredComplaints.length === 0 ? (
                       <tr><td colSpan={7} className="px-4 py-20 text-center text-muted-foreground">No complaints found.</td></tr>
                    ) : (
                      filteredComplaints.map((c) => (
                        <tr key={c.id} className="hover:bg-secondary/30 transition-colors group">
                          <td className="px-4 py-4">
                            <div className="font-mono text-[10px] font-semibold text-primary">{c.id.substring(0,8)}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(c.created_at).toLocaleDateString()}</div>
                          </td>
                          <td className="px-4 py-4 min-w-[140px]">
                            <div className="font-medium">{c.residents?.name || "Self/Admin"}</div>
                            <div className="text-xs text-muted-foreground">{c.residents ? `${c.residents.block_wing}-${c.residents.flat_number}` : "N/A"}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-sm truncate max-w-[150px]" title={c.title}>{c.title}</div>
                            <div className="text-xs text-muted-foreground uppercase">{c.category}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getPriorityColor(c.priority)}`}>
                              {c.priority}
                            </span>
                          </td>
                          <td className="px-4 py-4"><StatusBadge status={c.status} /></td>
                          <td className="px-4 py-4 text-xs font-medium text-muted-foreground">{c.staff_assigned || "Unassigned"}</td>
                          <td className="px-4 py-4">
                            <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-primary" onClick={() => { setSelectedTicket(c); setIsDetailOpen(true); }}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-primary">
                                <MessageSquare className="h-4 w-4" />
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

          {/* Form Section / Side Panel (1/3 width) */}
          <Card className="border-border shadow-sm rounded-xl p-5 flex flex-col bg-card">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Plus className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">Raise Complaint</h3>
            </div>
            
            <form className="flex-1 flex flex-col gap-4 text-sm" onSubmit={handleRaiseComplaint}>
              <div className="space-y-1.5">
                <Label htmlFor="title">Complaint Title *</Label>
                <Input id="title" placeholder="Brief summary of issue" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cat">Category *</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                    <SelectTrigger id="cat"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pri">Priority *</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}>
                    <SelectTrigger id="pri"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="desc">Description *</Label>
                <Textarea id="desc" placeholder="Provide detailed explanation..." className="resize-none h-24" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
              </div>

              <div className="space-y-1.5 mt-2">
                <Label>Attachments (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-secondary/50 transition-colors cursor-pointer text-center">
                  <UploadCloud className="h-6 w-6" />
                  <span className="text-xs">File upload coming soon</span>
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="mt-auto w-full gradient-primary text-primary-foreground font-semibold shadow-md">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Submit Ticket"}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTicket && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader className="mb-4">
              <div className="flex justify-between items-start pe-4">
                <div>
                  <DialogTitle className="text-xl font-display leading-tight">{selectedTicket.title}</DialogTitle>
                  <DialogDescription className="mt-1 font-mono text-[10px] uppercase text-muted-foreground">{selectedTicket.id}</DialogDescription>
                </div>
                <StatusBadge status={selectedTicket.status} />
              </div>
            </DialogHeader>
            <div className="space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-secondary/40 p-4 border border-border">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Raised By</div>
                  <div className="font-medium">{selectedTicket.residents?.name || "Admin"}</div>
                  <div className="text-[10px] text-muted-foreground">{selectedTicket.residents ? `${selectedTicket.residents.block_wing}-${selectedTicket.residents.flat_number}` : ""}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Assigned To</div>
                  <div className="font-medium">{selectedTicket.staff_assigned || "Pending Assignment"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Category & Priority</div>
                  <div className="font-medium text-xs">{selectedTicket.category} · <span className={getPriorityColor(selectedTicket.priority) + " px-1.5 py-0.5 rounded text-[10px] uppercase font-bold"}>{selectedTicket.priority}</span></div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Created Date</div>
                  <div className="font-medium text-xs">{new Date(selectedTicket.created_at).toLocaleString()}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-primary text-xs uppercase tracking-wider">Description</h4>
                <p className="text-muted-foreground leading-relaxed text-[13px]">
                  {selectedTicket.description}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close</Button>
              {selectedTicket.status !== "Resolved" && (
                <Button className="gradient-primary" onClick={() => handleResolveTicket(selectedTicket.id)}>Mark as Resolved</Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default Complaints;
