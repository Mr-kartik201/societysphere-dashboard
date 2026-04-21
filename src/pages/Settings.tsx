import { useState } from "react";
import { DashboardLayout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, LogOut, Loader2, ShieldCheck, Mail, Phone, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error("Logout failed: " + error.message);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleSaveChanges = () => {
    setSaving(true);
    // Simmons persistent update
    setTimeout(() => {
      toast.success("Profile preferences updated!");
      setSaving(false);
    }, 1000);
  };

  const userInitial = user?.email?.[0].toUpperCase() || "A";

  return (
    <DashboardLayout title="Platform Settings" subtitle="Manage your profile, society preferences, and security.">
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Profile Management Section */}
        <Card className="border-border/60 p-8 shadow-sm bg-card lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full -translate-y-12 translate-x-12 blur-3xl"></div>
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display text-xl font-bold">Administrative Profile</h3>
              <p className="text-sm text-muted-foreground">Manage your identity and contact details.</p>
            </div>
            <StatusBadge status="Verified Admin" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-border/50">
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-4 ring-primary/10 transition-all group-hover:ring-primary/30">
                <AvatarFallback className="gradient-primary text-2xl font-bold text-primary-foreground">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-card shadow-md hover:scale-110 transition-transform">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center md:text-left">
              <div className="font-bold text-lg">{user?.email?.split('@')[0] || "Society Admin"}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1.5 justify-center md:justify-start">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Society Secretary · SocietySphere Dashboard
              </div>
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-muted-foreground uppercase tracking-widest">
                Account ID: {user?.id.substring(0, 8) || "N/A"}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input value={user?.email || ""} readOnly className="pl-10 bg-secondary/30 font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input defaultValue="+91 98765 43210" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Society Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input defaultValue="Green Meadows Society" className="pl-10 font-bold" />
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-border/50">
            <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest">Restore Defaults</Button>
            <Button className="gradient-primary text-primary-foreground font-bold px-8 shadow-md" onClick={handleSaveChanges} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Changes"}
            </Button>
          </div>
        </Card>

        {/* Preferences & Actions Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/60 p-6 shadow-sm bg-card/60 backdrop-blur-sm relative overflow-hidden">
            <h3 className="font-display text-lg font-bold">Preferences</h3>
            <p className="text-xs text-muted-foreground mb-6">Automation and alerts</p>
            
            <div className="space-y-6">
              {[
                ["Email Notifications", "Complaints, payments & notices"],
                ["SMS Alerts", "Emergency gate security alerts"],
                ["Weekly Reports", "Performance summary PDF"],
                ["Auto-Billing", "Generate on 1st of month"],
              ].map(([t, d], i) => (
                <div key={t} className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[13px] font-bold">{t}</div>
                    <div className="text-[11px] text-muted-foreground leading-tight">{d}</div>
                  </div>
                  <Switch defaultChecked={i !== 1} className="data-[state=checked]:bg-primary" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-destructive/20 p-6 shadow-sm bg-destructive/5 relative overflow-hidden border">
            <h3 className="font-display text-lg font-bold text-destructive">Account Actions</h3>
            <p className="text-xs text-muted-foreground mb-6">Security and session management</p>
            
            <Button 
              variant="outline" 
              className="w-full h-12 border-destructive/20 text-destructive hover:bg-destructive hover:text-white font-bold gap-2 transition-all"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              SIGN OUT OF SESSION
            </Button>
            
            <p className="mt-4 text-[10px] text-center text-muted-foreground tracking-tight">
              Logging out will clear your current local session. 
              You will need to re-authenticate to access the management portal.
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Internal Helper for Status Badge locally
const StatusBadge = ({ status }: { status: string }) => (
  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-success/10 text-success border border-success/30 shadow-sm">
    {status}
  </span>
);

export default Settings;
