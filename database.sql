-- SOCIETYSPHERE DATABASE SCHEMA (PostgreSQL)
-- This file contains all tables, constraints, and RLS policies for the SocietySphere dashboard.

-- 1. PROFILES (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  society_name TEXT,
  role TEXT DEFAULT 'Admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RESIDENTS
CREATE TABLE residents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  flat_number TEXT NOT NULL,
  block_wing TEXT,
  resident_type TEXT CHECK (resident_type IN ('Owner', 'Tenant')),
  family_members INTEGER DEFAULT 1,
  move_in_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Past')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BILLING (Maintenance & Dues)
CREATE TABLE bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resident_id UUID REFERENCES residents(id) ON DELETE SET NULL,
  billing_month TEXT NOT NULL,
  billing_year INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Overdue', 'Unpaid')),
  payment_method TEXT,
  invoice_number TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. COMPLAINTS
CREATE TABLE complaints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resident_id UUID REFERENCES residents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('High', 'Medium', 'Low', 'Urgent')),
  description TEXT,
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved')),
  assigned_staff TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. VISITORS
CREATE TABLE visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  resident_id UUID REFERENCES residents(id) ON DELETE SET NULL,
  flat_number TEXT,
  purpose TEXT,
  visitor_type TEXT,
  entry_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  exit_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Approved', 'Denied', 'At Gate', 'Pending', 'Entered')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. DELIVERIES
CREATE TABLE deliveries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  flat_number TEXT NOT NULL,
  recipient_name TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Delivered', 'At Gate', 'Pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. NOTICES
CREATE TABLE notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'Low' CHECK (priority IN ('High', 'Medium', 'Low', 'Urgent')),
  body TEXT NOT NULL,
  author TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  attachment_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. AMENITIES
CREATE TABLE amenities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  capacity TEXT,
  timing TEXT,
  fee TEXT,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Booked', 'Maintenance', 'Full', 'Closed')),
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. BOOKINGS
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  resident_id UUID REFERENCES residents(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  purpose TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Approved', 'Pending', 'Cancelled', 'Confirmed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. STAFF
CREATE TABLE staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  shift TEXT,
  phone TEXT,
  status TEXT DEFAULT 'Off' CHECK (status IN ('On Duty', 'Off', 'On Leave')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. VEHICLES
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  vehicle_number TEXT NOT NULL UNIQUE,
  vehicle_type TEXT,
  sticker_id TEXT,
  brand_model TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- SIMPLE POLICIES (Allow authenticated users access)
CREATE POLICY "Manage residents" ON residents FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Manage bills" ON bills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Manage complaints" ON complaints FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Manage visitors" ON visitors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Manage deliveries" ON deliveries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Manage notices" ON notices FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Manage amenities" ON amenities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Manage bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Manage staff" ON staff FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Manage vehicles" ON vehicles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Manage profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');
