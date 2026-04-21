import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Users, Building, Dumbbell, Waves, Trees, Clock, Banknote, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

interface Amenity {
  id: string;
  name: string;
  description: string;
  status: "Available" | "Maintenance" | "Booked";
}

interface BookingWithDetails {
  id: string;
  resident_id: string;
  amenity_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  residents: {
    name: string;
    block_wing: string;
    flat_number: string;
  } | null;
  amenities: {
    name: string;
  } | null;
}

// Map database names to Heroicons
const iconMap: Record<string, any> = {
  Clubhouse: Building,
  Gymnasium: Dumbbell,
  "Swimming Pool": Waves,
  "Garden Area": Trees,
  "Meeting Hall": Users,
  Default: Building
};

const Amenities = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<string>("");
  const supabase = createClient();

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    flat: "",
    date: "",
    timeSlot: "",
    purpose: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: aData, error: aError } = await supabase
        .from("amenities")
        .select("*");
      
      if (aError) throw aError;
      setAmenities(aData || []);

      const { data: bData, error: bError } = await supabase
        .from("bookings")
        .select(`
          *,
          residents (name, block_wing, flat_number),
          amenities (name)
        `)
        .order("booking_date", { ascending: true })
        .limit(10);

      if (bError) throw bError;
      setBookings(bData as BookingWithDetails[] || []);

    } catch (error: any) {
      toast.error("Failed to load data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookingSubmit = async () => {
    if (!selectedAmenity || !bookingForm.flat || !bookingForm.date) {
      toast.error("Required fields missing");
      return;
    }

    setSubmitting(true);
    try {
      // Find resident
      const { data: resData } = await supabase
        .from("residents")
        .select("id")
        .eq("flat_number", bookingForm.flat.split('-').pop() || bookingForm.flat)
        .limit(1)
        .single();
      
      if (!resData) {
        toast.error("Resident not found with this flat number");
        return;
      }

      // Find amenity ID
      const amenityObj = amenities.find(a => a.name === selectedAmenity);
      if (!amenityObj) throw new Error("Amenity not found");

      const [start, end] = bookingForm.timeSlot.split(" - ");

      const { error } = await supabase
        .from("bookings")
        .insert([{
          resident_id: resData.id,
          amenity_id: amenityObj.id,
          booking_date: bookingForm.date,
          start_time: start || "09:00:00",
          end_time: end || "13:00:00",
          status: "Confirmed"
        }]);

      if (error) throw error;

      toast.success("Booking confirmed!");
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error("Booking failed: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const calendarDates = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <DashboardLayout title="Amenities & Facilities" subtitle="Browse, manage, and book society facilities online.">
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Main Area: Amenities Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Available Facilities</h2>
            <Button variant="outline" size="sm" onClick={fetchData}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
          </div>

          {loading ? (
             <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/30" /></div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {amenities.length === 0 ? (
                <div className="col-span-2 px-4 py-20 text-center text-muted-foreground border border-dashed rounded-xl">No facilities registered.</div>
              ) : (
                amenities.map((fac) => {
                  const Icon = iconMap[fac.name] || iconMap.Default;
                  return (
                    <Card key={fac.id} className="overflow-hidden border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/40 flex flex-col group">
                      <div className="flex h-24 items-center justify-center bg-gradient-to-br from-primary/10 to-secondary relative">
                        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 to-transparent"></div>
                        <Icon className="h-10 w-10 text-primary drop-shadow-sm transition-transform group-hover:scale-110" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-display font-bold leading-tight">{fac.name}</h3>
                          <StatusBadge status={fac.status} />
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
                          {fac.description || "Beautiful facility available for all residents."}
                        </p>

                        <Button 
                          className="mt-2 w-full gradient-primary text-primary-foreground font-semibold shadow-sm"
                          disabled={fac.status === "Maintenance"}
                          onClick={() => { setSelectedAmenity(fac.name); setIsModalOpen(true); }}
                        >
                          {fac.status === "Booked" ? "Join waitlist" : "Request Booking"}
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar: Schedule & Bookings */}
        <div className="space-y-6">
          <Card className="border-border p-5 shadow-sm bg-card">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-4 text-sm">
              <CalendarIcon className="h-4 w-4 text-primary" /> Month Overview
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] mb-2 text-muted-foreground font-medium uppercase">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-[11px]">
              <div className="col-start-3 p-1"></div>
              {calendarDates.map((d) => (
                <div 
                  key={d} 
                  className={`flex h-7 items-center justify-center rounded-md font-medium cursor-pointer transition-colors
                    ${d === 21 ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`
                  }
                >
                  {d}
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-border p-0 shadow-sm bg-card overflow-hidden flex flex-col min-h-[350px]">
            <div className="p-4 border-b border-border bg-secondary/30">
              <h3 className="font-display font-semibold text-sm">Active Bookings</h3>
            </div>
            <div className="divide-y divide-border overflow-y-auto max-h-[400px]">
              {bookings.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">No upcoming bookings found.</div>
              ) : (
                bookings.map((b) => (
                  <div key={b.id} className="p-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-primary uppercase">{b.amenities?.name}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <div>
                        <div className="text-xs font-semibold">{b.residents?.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{b.residents?.block_wing}-{b.residents?.flat_number}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold">{new Date(b.booking_date).toLocaleDateString([], {month:'short', day:'numeric'})}</div>
                        <div className="text-[10px] text-muted-foreground">{b.start_time.substring(0,5)} - {b.end_time.substring(0,5)}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-border mt-auto">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                  <DialogHeader>
                    <DialogTitle>Quick Reservation</DialogTitle>
                    <DialogDescription>Submit a formal booking request for an amenity.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 text-sm mt-2">
                    <div className="space-y-1.5">
                      <Label>Facility *</Label>
                      <Select value={selectedAmenity} onValueChange={setSelectedAmenity}>
                        <SelectTrigger><SelectValue placeholder="Select facility" /></SelectTrigger>
                        <SelectContent>
                          {amenities.map(f => <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Flat Number *</Label>
                        <Input placeholder="E.g. A-1204" value={bookingForm.flat} onChange={e => setBookingForm({...bookingForm, flat: e.target.value})} className="font-mono text-xs h-9" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Date *</Label>
                        <Input type="date" className="h-9" value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} required />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Time Slot *</Label>
                      <Select value={bookingForm.timeSlot} onValueChange={v => setBookingForm({...bookingForm, timeSlot: v})}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select time" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00:00 - 13:00:00">09:00 AM - 01:00 PM</SelectItem>
                          <SelectItem value="14:00:00 - 18:00:00">02:00 PM - 06:00 PM</SelectItem>
                          <SelectItem value="18:30:00 - 22:30:00">06:30 PM - 10:30 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Purpose / Occasion</Label>
                      <Textarea placeholder="E.g. Birthday Party, Annual Meet..." value={bookingForm.purpose} onChange={e => setBookingForm({...bookingForm, purpose: e.target.value})} className="resize-none h-20" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button className="gradient-primary" disabled={submitting} onClick={handleBookingSubmit}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Confirm Booking"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="w-full text-xs" onClick={() => { setSelectedAmenity(""); setIsModalOpen(true); }}>
                Manual Booking
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Amenities;
