import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = ({ to = "/" }: { to?: string }) => (
  <Link to={to} className="flex items-center gap-2">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
      <Building2 className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
    </div>
    <span className="font-display text-lg font-bold tracking-tight">
      Society<span className="text-primary">Sphere</span>
    </span>
  </Link>
);
