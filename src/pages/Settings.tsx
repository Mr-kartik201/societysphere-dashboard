import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

const Settings = () => (
  <DashboardLayout title="Settings" subtitle="Manage your profile and society preferences.">
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="border-border/60 p-6 shadow-elegant lg:col-span-2">
        <h3 className="font-display text-lg font-semibold">Profile</h3>
        <p className="text-sm text-muted-foreground">Update your personal information.</p>

        <div className="mt-6 flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-2 ring-primary/20">
              <AvatarFallback className="gradient-primary text-xl font-semibold text-primary-foreground">AK</AvatarFallback>
            </Avatar>
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card shadow-sm">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <div className="font-semibold">Anil Verma</div>
            <div className="text-sm text-muted-foreground">Society Secretary · Green Meadows</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label>First name</Label><Input defaultValue="Anil" /></div>
          <div className="space-y-2"><Label>Last name</Label><Input defaultValue="Verma" /></div>
          <div className="space-y-2"><Label>Email</Label><Input defaultValue="anil@greenmeadows.in" /></div>
          <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
          <div className="space-y-2 md:col-span-2"><Label>Society name</Label><Input defaultValue="Green Meadows Society" /></div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button className="gradient-primary text-primary-foreground hover:opacity-90">Save changes</Button>
        </div>
      </Card>

      <Card className="border-border/60 p-6 shadow-elegant">
        <h3 className="font-display text-lg font-semibold">Preferences</h3>
        <p className="text-sm text-muted-foreground">Notification settings.</p>
        <div className="mt-6 space-y-5">
          {[
            ["Email notifications","New complaints, payments and notices"],
            ["SMS alerts","Critical issues only"],
            ["Weekly digest","Society summary every Monday"],
            ["Auto-generate bills","On the 1st of every month"],
          ].map(([t,d],i)=>(
            <div key={t} className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium">{t}</div>
                <div className="text-xs text-muted-foreground">{d}</div>
              </div>
              <Switch defaultChecked={i!==1} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  </DashboardLayout>
);

export default Settings;
