import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

const AuthShell = ({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) => (
  <div className="grid min-h-screen lg:grid-cols-2">
    <div className="flex flex-col p-6 md:p-10">
      <Logo />
      <div className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
    <div className="relative hidden overflow-hidden lg:block">
      <div className="absolute inset-0 gradient-primary" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.2),transparent_50%)]" />
      <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
        <div className="text-sm font-medium opacity-90">SocietySphere · Admin Console</div>
        <div className="space-y-6">
          <h2 className="font-display text-4xl font-bold leading-tight">"We replaced four tools and a WhatsApp group. SocietySphere just works."</h2>
          <div>
            <div className="font-semibold">Anil Verma</div>
            <div className="text-sm opacity-80">Secretary · Green Meadows Society</div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-primary-foreground/20 pt-6">
            {[["1,200+","Societies"],["₹120Cr","Processed"],["98%","Retention"]].map(([v,l])=>(
              <div key={l}>
                <div className="font-display text-2xl font-bold">{v}</div>
                <div className="text-xs opacity-80">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue managing your community."
      footer={<>Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Create one</Link></>}
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="admin@yoursociety.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button disabled={loading} type="submit" className="h-11 w-full gradient-primary text-primary-foreground hover:opacity-90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
        <Button variant="outline" className="h-11 w-full" type="button">Continue with Google</Button>
      </form>
    </AuthShell>
  );
};

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [society, setSociety] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            society_name: society,
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        toast.success("Registration successful! Please check your email for verification.");
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start managing your society more efficiently."
      footer={<>Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link></>}
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input 
            id="fullName" 
            placeholder="Anil Verma" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="society">Society name</Label>
          <Input 
            id="society" 
            placeholder="Green Meadows Society" 
            value={society}
            onChange={(e) => setSociety(e.target.value)}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="anil@greenmeadows.in" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <Button disabled={loading} type="submit" className="h-11 w-full gradient-primary text-primary-foreground hover:opacity-90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
        <ul className="space-y-2 pt-2 text-xs text-muted-foreground">
          {["14-day free trial","Cancel anytime","Free onboarding & training"].map(t=>(
            <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-accent" />{t}</li>
          ))}
        </ul>
      </form>
    </AuthShell>
  );
};

