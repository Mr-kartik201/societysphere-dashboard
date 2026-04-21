export const stats = {
  residents: 842,
  flats: 312,
  pendingDues: 184500,
  openComplaints: 17,
  visitorsToday: 46,
  staffOnDuty: 28,
};

export const revenueData = [
  { month: "Jan", collected: 420000, pending: 38000 },
  { month: "Feb", collected: 445000, pending: 22000 },
  { month: "Mar", collected: 468000, pending: 31000 },
  { month: "Apr", collected: 482000, pending: 18000 },
  { month: "May", collected: 510000, pending: 24000 },
  { month: "Jun", collected: 528000, pending: 19500 },
  { month: "Jul", collected: 545000, pending: 21000 },
];

export const complaintTrend = [
  { day: "Mon", opened: 4, resolved: 6 },
  { day: "Tue", opened: 7, resolved: 5 },
  { day: "Wed", opened: 3, resolved: 4 },
  { day: "Thu", opened: 6, resolved: 8 },
  { day: "Fri", opened: 5, resolved: 7 },
  { day: "Sat", opened: 2, resolved: 3 },
  { day: "Sun", opened: 1, resolved: 2 },
];

export const categoryData = [
  { name: "Plumbing", value: 32 },
  { name: "Electrical", value: 24 },
  { name: "Security", value: 14 },
  { name: "Cleaning", value: 18 },
  { name: "Other", value: 12 },
];

export const residents = [
  { id: "R001", name: "Aarav Sharma", flat: "A-1204", block: "A", phone: "+91 98765 43210", email: "aarav.s@mail.com", status: "Owner", since: "2019" },
  { id: "R002", name: "Priya Mehta", flat: "B-0807", block: "B", phone: "+91 98221 11023", email: "priya.m@mail.com", status: "Owner", since: "2021" },
  { id: "R003", name: "Rohan Iyer", flat: "C-0302", block: "C", phone: "+91 99887 65432", email: "rohan.i@mail.com", status: "Tenant", since: "2023" },
  { id: "R004", name: "Sara Khan", flat: "A-0905", block: "A", phone: "+91 97123 88901", email: "sara.k@mail.com", status: "Owner", since: "2018" },
  { id: "R005", name: "Vikram Patel", flat: "D-1501", block: "D", phone: "+91 96012 22134", email: "vikram.p@mail.com", status: "Owner", since: "2020" },
  { id: "R006", name: "Neha Gupta", flat: "B-0204", block: "B", phone: "+91 95443 87765", email: "neha.g@mail.com", status: "Tenant", since: "2024" },
  { id: "R007", name: "Arjun Reddy", flat: "C-1102", block: "C", phone: "+91 94556 23344", email: "arjun.r@mail.com", status: "Owner", since: "2017" },
  { id: "R008", name: "Meera Nair", flat: "D-0703", block: "D", phone: "+91 93221 66543", email: "meera.n@mail.com", status: "Owner", since: "2022" },
];

export const bills = [
  { id: "INV-2401", flat: "A-1204", resident: "Aarav Sharma", amount: 4500, due: "2025-04-30", status: "Paid", method: "UPI" },
  { id: "INV-2402", flat: "B-0807", resident: "Priya Mehta", amount: 4500, due: "2025-04-30", status: "Paid", method: "Card" },
  { id: "INV-2403", flat: "C-0302", resident: "Rohan Iyer", amount: 4500, due: "2025-04-30", status: "Pending", method: "—" },
  { id: "INV-2404", flat: "A-0905", resident: "Sara Khan", amount: 4500, due: "2025-04-30", status: "Overdue", method: "—" },
  { id: "INV-2405", flat: "D-1501", resident: "Vikram Patel", amount: 4500, due: "2025-04-30", status: "Paid", method: "Bank" },
  { id: "INV-2406", flat: "B-0204", resident: "Neha Gupta", amount: 4500, due: "2025-04-30", status: "Pending", method: "—" },
  { id: "INV-2407", flat: "C-1102", resident: "Arjun Reddy", amount: 4500, due: "2025-04-30", status: "Paid", method: "UPI" },
];

export const complaints = [
  { id: "C-1041", flat: "A-1204", title: "Water leakage in bathroom", category: "Plumbing", priority: "High", status: "In Progress", date: "2025-04-18" },
  { id: "C-1042", flat: "B-0807", title: "Lift making strange noise", category: "Electrical", priority: "Medium", status: "Open", date: "2025-04-19" },
  { id: "C-1043", flat: "C-0302", title: "Garbage not collected", category: "Cleaning", priority: "Low", status: "Resolved", date: "2025-04-17" },
  { id: "C-1044", flat: "D-1501", title: "Intercom not working", category: "Electrical", priority: "Medium", status: "Open", date: "2025-04-20" },
  { id: "C-1045", flat: "A-0905", title: "Parking dispute with B-204", category: "Security", priority: "High", status: "In Progress", date: "2025-04-19" },
  { id: "C-1046", flat: "B-0204", title: "Common area light fused", category: "Electrical", priority: "Low", status: "Resolved", date: "2025-04-16" },
];

export const visitors = [
  { id: "V-3301", name: "Ramesh Kumar", purpose: "Delivery — Amazon", flat: "A-1204", entry: "10:24 AM", exit: "10:38 AM", status: "Out" },
  { id: "V-3302", name: "Anita Desai", purpose: "Guest", flat: "B-0807", entry: "11:05 AM", exit: "—", status: "In" },
  { id: "V-3303", name: "Suresh M.", purpose: "Plumber", flat: "C-0302", entry: "11:42 AM", exit: "12:30 PM", status: "Out" },
  { id: "V-3304", name: "Pooja R.", purpose: "Tutor", flat: "A-0905", entry: "04:00 PM", exit: "—", status: "In" },
  { id: "V-3305", name: "Karan S.", purpose: "Swiggy", flat: "D-1501", entry: "07:18 PM", exit: "07:24 PM", status: "Out" },
];

export const notices = [
  { id: "N-201", title: "Annual General Meeting — May 5th", category: "Meeting", date: "2025-04-20", pinned: true, body: "All residents are requested to attend the AGM on May 5th at 6:00 PM in the community hall." },
  { id: "N-202", title: "Water tank cleaning — Tower B", category: "Maintenance", date: "2025-04-19", pinned: false, body: "Water supply will be disrupted from 9 AM to 1 PM on April 25th in Tower B." },
  { id: "N-203", title: "Holi celebration registration open", category: "Event", date: "2025-04-15", pinned: false, body: "Register at the office to participate in the society Holi event." },
  { id: "N-204", title: "New visitor app rollout", category: "Update", date: "2025-04-12", pinned: true, body: "Starting next week, all visitors must be pre-approved through the SocietySphere app." },
];

export const amenities = [
  { id: "AM-01", name: "Swimming Pool", capacity: 30, status: "Available", nextSlot: "Today 5:00 PM", img: "🏊" },
  { id: "AM-02", name: "Clubhouse", capacity: 80, status: "Booked", nextSlot: "Tomorrow 11:00 AM", img: "🏛️" },
  { id: "AM-03", name: "Tennis Court", capacity: 4, status: "Available", nextSlot: "Today 6:30 PM", img: "🎾" },
  { id: "AM-04", name: "Gym", capacity: 25, status: "Available", nextSlot: "Anytime", img: "🏋️" },
  { id: "AM-05", name: "Banquet Hall", capacity: 150, status: "Maintenance", nextSlot: "May 1st", img: "🎉" },
  { id: "AM-06", name: "Kids Play Area", capacity: 40, status: "Available", nextSlot: "Anytime", img: "🛝" },
];

export const vehicles = [
  { id: "VH-01", number: "MH 12 AB 3344", owner: "Aarav Sharma", flat: "A-1204", type: "Car", slot: "P-12", color: "White" },
  { id: "VH-02", number: "MH 14 KL 8821", owner: "Priya Mehta", flat: "B-0807", type: "SUV", slot: "P-34", color: "Black" },
  { id: "VH-03", number: "KA 03 MM 7766", owner: "Rohan Iyer", flat: "C-0302", type: "Bike", slot: "B-09", color: "Red" },
  { id: "VH-04", number: "MH 02 PQ 2210", owner: "Sara Khan", flat: "A-0905", type: "Car", slot: "P-45", color: "Silver" },
  { id: "VH-05", number: "GJ 05 RR 9981", owner: "Vikram Patel", flat: "D-1501", type: "SUV", slot: "P-58", color: "Blue" },
];

export const staff = [
  { id: "S-01", name: "Mahesh Yadav", role: "Security Guard", shift: "Day", phone: "+91 99887 12321", status: "On Duty" },
  { id: "S-02", name: "Lakshmi Devi", role: "Housekeeping", shift: "Morning", phone: "+91 98223 44556", status: "On Duty" },
  { id: "S-03", name: "Ravi K.", role: "Electrician", shift: "On-call", phone: "+91 97881 22341", status: "Off" },
  { id: "S-04", name: "Sunil P.", role: "Plumber", shift: "On-call", phone: "+91 96772 55432", status: "On Duty" },
  { id: "S-05", name: "Geeta M.", role: "Gardener", shift: "Morning", phone: "+91 95443 99812", status: "On Duty" },
  { id: "S-06", name: "Anil R.", role: "Security Guard", shift: "Night", phone: "+91 94221 87765", status: "Off" },
];

export const activities = [
  { who: "Priya Mehta", what: "paid maintenance bill", when: "5 min ago", type: "payment" },
  { who: "Security", what: "logged a new visitor for A-1204", when: "12 min ago", type: "visitor" },
  { who: "Rohan Iyer", what: "raised a complaint — Plumbing", when: "32 min ago", type: "complaint" },
  { who: "Admin", what: "published a new notice", when: "1 hr ago", type: "notice" },
  { who: "Sara Khan", what: "booked the Clubhouse", when: "2 hr ago", type: "booking" },
  { who: "Vikram Patel", what: "registered a new vehicle", when: "3 hr ago", type: "vehicle" },
];

export const testimonials = [
  { name: "Anil Verma", role: "Society Secretary, Green Meadows", quote: "SocietySphere replaced 4 different tools and a WhatsApp group. Our collections improved 38% in the first quarter." },
  { name: "Kavita Joshi", role: "Treasurer, Silver Oaks", quote: "The billing automation alone saves us two full days every month. Residents love the clean payment experience." },
  { name: "Rajiv Menon", role: "Chairman, Palm Heights", quote: "Visitor management is finally sane. Our guards adopted it on day one — that's how intuitive it is." },
];
