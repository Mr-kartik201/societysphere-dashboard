import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pin, Plus, Search, Megaphone, Bell, Calendar, UploadCloud, ChevronRight, User, Loader2 } from "lucide-react";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

interface Notice {
  id: string;
  title: string;
  body: string;
  category: string;
  priority: string;
  is_pinned: boolean;
  author: string;
  created_at: string;
}

const categoryColors: Record<string, string> = {
  General: "bg-primary/20 text-primary border-primary/20",
  Maintenance: "bg-warning/20 text-warning border-warning/20",
  Event: "bg-accent/20 text-accent border-accent/20",
  Emergency: "bg-destructive/20 text-destructive border-destructive/20",
  Security: "bg-info/20 text-info border-info/20",
};

const priorityColors: Record<string, string> = {
  High: "text-destructive",
  Medium: "text-warning",
  Low: "text-muted-foreground",
};

const Notices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // New Notice Form State
  const [newNotice, setNewNotice] = useState({
    title: "",
    category: "General",
    priority: "Medium",
    body: "",
    is_pinned: false
  });

  const supabase = createClient();

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error: any) {
      toast.error("Failed to load notices: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handlePublish = async () => {
    if (!newNotice.title || !newNotice.body) {
      toast.error("Please fill in title and body");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("notices")
        .insert([{
          title: newNotice.title,
          body: newNotice.body,
          category: newNotice.category,
          priority: newNotice.priority,
          is_pinned: newNotice.is_pinned,
          author: "Admin" // Replace with real user name from auth if available
        }]);

      if (error) throw error;

      toast.success("Notice published successfully!");
      setIsModalOpen(false);
      setNewNotice({ title: "", category: "General", priority: "Medium", body: "", is_pinned: false });
      fetchNotices();
    } catch (error: any) {
      toast.error("Failed to publish: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredNotices = notices.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || n.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const pinnedNotices = filteredNotices.filter((n) => n.is_pinned);
  const otherNotices = filteredNotices.filter((n) => !n.is_pinned);

  return (
    <DashboardLayout title="Notice Board" subtitle="Official announcements, alerts, and community updates.">
      <div className="space-y-8">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-1">
          <div className="flex flex-wrap gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search notices..." 
                className="bg-card pl-9 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px] bg-card shadow-sm"><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="Event">Events</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={fetchNotices}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground shadow-md">
                <Plus className="mr-2 h-4 w-4" /> Create Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Notice</DialogTitle>
                <DialogDescription>Draft and publish a new announcement to the community board.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 text-sm">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Notice Title *</Label>
                  <Input id="title" placeholder="Brief and clear headline" className="font-medium" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} required/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newNotice.category} onValueChange={v => setNewNotice({...newNotice, category: v})}>
                      <SelectTrigger id="category"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="priority">Visibility Priority</Label>
                    <Select value={newNotice.priority} onValueChange={v => setNewNotice({...newNotice, priority: v})}>
                      <SelectTrigger id="priority"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High (Red Alert)</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low (Routine)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="desc">Full Description *</Label>
                  <Textarea id="desc" placeholder="Provide complete details of the announcement..." className="h-32 resize-none" value={newNotice.body} onChange={e => setNewNotice({...newNotice, body: e.target.value})} required />
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <input 
                    type="checkbox" 
                    id="is_pinned" 
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={newNotice.is_pinned}
                    onChange={e => setNewNotice({...newNotice, is_pinned: e.target.checked})}
                  />
                  <Label htmlFor="is_pinned" className="cursor-pointer">Pin this notice to the top</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button className="gradient-primary" onClick={handlePublish} disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Publish Notice"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary/20" /></div>
        ) : (
          <>
            {/* Pinned Section */}
            {pinnedNotices.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                  <Pin className="h-5 w-5 text-primary" /> Pinned Announcements
                </h2>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {pinnedNotices.map((n) => (
                    <Card key={n.id} className="group relative flex flex-col justify-between border-primary/20 bg-gradient-to-b from-primary/5 to-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md h-[250px] overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Megaphone className="h-20 w-20 text-primary" />
                      </div>
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`border rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryColors[n.category] || "text-foreground bg-secondary"}`}>
                            {n.category}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            <Pin className="h-3 w-3" /> Pinned
                          </span>
                        </div>
                        <h3 className="font-display text-lg font-bold leading-tight mb-2 pr-4">{n.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{n.body}</p>
                        
                        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                              <User className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-muted-foreground leading-none">{new Date(n.created_at).toLocaleDateString()}</span>
                              <span className="text-xs font-semibold leading-none mt-1">{n.author}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary group-hover:bg-primary/10">Read <ChevronRight className="ml-1 h-3 w-3" /></Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Notices Section */}
            <div>
              <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2 pt-4 border-t border-border">
                <Bell className="h-5 w-5 text-muted-foreground" /> Recent Notices
              </h2>
              {otherNotices.length === 0 && pinnedNotices.length === 0 ? (
                 <div className="px-4 py-20 text-center text-muted-foreground border border-dashed rounded-xl">No active notices found.</div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {otherNotices.map((n) => (
                    <Card key={n.id} className="group flex flex-col justify-between border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md h-[240px]">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`border rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryColors[n.category] || "text-foreground bg-secondary"}`}>
                            {n.category}
                          </span>
                          <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${priorityColors[n.priority]}`}>
                            {n.priority}
                          </div>
                        </div>
                        <h3 className="font-semibold leading-snug mb-2">{n.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-3 mb-4">{n.body}</p>
                        
                        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Calendar className="h-3 w-3" /> {new Date(n.created_at).toLocaleDateString()}
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] opacity-60 group-hover:opacity-100 group-hover:text-primary transition-opacity">Details <ChevronRight className="ml-1 h-3 w-3" /></Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Notices;
