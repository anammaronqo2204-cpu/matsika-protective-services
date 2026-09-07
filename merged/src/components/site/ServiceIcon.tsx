import {
  Camera,
  ClipboardCheck,
  Fingerprint,
  Shield,
  Siren,
  Truck,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  shield: Shield,
  siren: Siren,
  cctv: Camera,
  scan: Fingerprint,
  "user-check": UserCheck,
  users: Users,
  clipboard: ClipboardCheck,
  truck: Truck,
};

export default function ServiceIcon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = MAP[name] ?? Shield;
  return <Icon size={size} className={className} />;
}
