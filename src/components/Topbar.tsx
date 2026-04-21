import { Bell, Search, Plus, Settings, LogOut, User, HelpCircle, CreditCard, Check, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/client";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const notifications = [
  { id: 1, title: "Priya Mehta paid ₹4,500", time: "5 min ago", type: "payment", unread: true },
  { id: 2, title: "New complaint from A-1204", time: "12 min ago", type: "complaint", unread: true },
  { id: 3, title: "Visitor logged at gate B", time: "32 min ago", type: "visitor", unread: true },
  { id: 4, title: "Notice published — AGM May 5", time: "1 hr ago", type: "notice", unread: false },
  { id: 5, title: "Sara booked the Clubhouse", time: "2 hr ago", type: "booking", unread: false },
];

const typeColor: Record<string, string> = {
  payment: "bg-success/10 text-success",
  complaint: "bg-warning/10 text-warning",
  visitor: "bg-info/10 text-info",
  notice: "bg-primary/10 text-primary",
  booking: "bg-accent/10 text-accent",
};

export const Topbar = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out");
      navigate("/");
    } catch (error: any) {
      toast.error("Logout failed: " + error.message);
    } finally {
      setLoggingOut(false);
    }
  };

  const userInitial = user?.email?.[0].toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      <div className="hidden md:block">
        <h1 className="font-display text-lg font-semibold leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search residents, flats, invoices..."
            className="h-9 w-72 border-border bg-secondary/60 pl-9 text-sm focus-visible:bg-background"
          />
        </div>

        <Button size="sm" className="hidden gradient-primary text-primary-foreground shadow-sm hover:opacity-90 lg:inline-flex" asChild>
          <Link to="/residents">
            <Plus className="mr-1 h-4 w-4" /> Quick add
          </Link>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground ring-2 ring-background">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2.5">
              <div>
                <div className="text-sm font-semibold">Notifications</div>
                <div className="text-xs text-muted-foreground">{unreadCount} unread</div>
              </div>
              <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                <Check className="h-3 w-3" /> Mark all read
              </button>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex cursor-pointer items-start gap-3 px-3 py-2.5">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${typeColor[n.type]}`}>
                    <Bell className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-start gap-2">
                      <p className="text-sm leading-snug">{n.title}</p>
                      {n.unread && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full p-0.5 outline-none ring-2 ring-primary/20 transition-all hover:ring-primary/40">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="gradient-primary text-xs font-semibold text-primary-foreground">{userInitial}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="flex items-center gap-3 px-3 py-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="gradient-primary text-sm font-semibold text-primary-foreground">{userInitial}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{user?.email?.split('@')[0] || "Admin"}</div>
                <div className="truncate text-xs font-normal text-muted-foreground">{user?.email}</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer"><User className="mr-2 h-4 w-4" />Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer"><Settings className="mr-2 h-4 w-4" />Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive font-semibold"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
