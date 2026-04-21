import { Bell, Search, Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Topbar = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
    <SidebarTrigger className="text-muted-foreground" />
    <div className="hidden md:block">
      <h1 className="font-display text-lg font-semibold">{title}</h1>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
    <div className="ml-auto flex items-center gap-2 md:gap-3">
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search residents, flats..." className="h-9 w-64 bg-secondary pl-9" />
      </div>
      <Button size="sm" className="hidden gradient-primary text-primary-foreground hover:opacity-90 md:inline-flex">
        <Plus className="mr-1 h-4 w-4" /> Quick add
      </Button>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
      </Button>
      <Avatar className="h-9 w-9 ring-2 ring-primary/20">
        <AvatarFallback className="gradient-primary text-sm font-semibold text-primary-foreground">AK</AvatarFallback>
      </Avatar>
    </div>
  </header>
);
