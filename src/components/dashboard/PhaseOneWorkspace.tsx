import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, MapPin, Navigation, Package, Sparkles, Truck, Users } from "lucide-react";

type WorkspaceRole = "donor" | "ngo" | "volunteer" | "business" | "admin";

const roleCopy: Record<WorkspaceRole, { eyebrow: string; title: string; description: string }> = {
  donor: { eyebrow: "AI matching", title: "See where your donation can help most", description: "Matching is based on distance, food category, urgency, and receiving capacity." },
  ngo: { eyebrow: "Community matching", title: "Nearby food matched to your capacity", description: "Review high-fit donations and request the pickups your team can receive." },
  volunteer: { eyebrow: "Live route", title: "Your next pickup, clearly mapped", description: "Follow the suggested route and keep every handoff visible to the network." },
  business: { eyebrow: "Smart sustainability", title: "Make every surplus pickup count", description: "AI-assisted matching turns surplus inventory into measurable community impact." },
  admin: { eyebrow: "Platform intelligence", title: "AI matching monitor", description: "Watch matching confidence, live routes, and exceptions across the network." },
};

const matches = [
  { name: "Hope Community Kitchen", distance: "2.4 km", fit: 96, need: "Prepared meals", urgency: "High need" },
  { name: "Northside Shelter", distance: "4.1 km", fit: 89, need: "Fresh produce", urgency: "Accepting now" },
  { name: "Community Pantry", distance: "6.8 km", fit: 82, need: "Bakery items", urgency: "Tomorrow morning" },
];

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-[#E6EAE4] bg-white p-5 shadow-sm sm:p-6 ${className}`}>{children}</section>;
}

function OperationsMap({ role }: { role: WorkspaceRole }) {
  return (
    <div className="relative h-72 overflow-hidden rounded-2xl border border-[#DDE8E1] bg-[#EAF3EC]" style={{ backgroundImage: "linear-gradient(#c8ddd0 1px, transparent 1px), linear-gradient(90deg, #c8ddd0 1px, transparent 1px)", backgroundSize: "42px 42px" }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M17 70 Q31 28 48 40 T78 26" fill="none" stroke="#0B8B7F" strokeDasharray="3 2" strokeWidth="1.2" />
        <path d="M48 40 Q60 65 78 26" fill="none" stroke="#D97728" strokeDasharray="2 3" strokeWidth="0.8" />
      </svg>
      {["left-[16%] top-[67%] bg-[#D97728]", "left-[47%] top-[37%] bg-[#0B8B7F]", "left-[77%] top-[23%] bg-[#3569A8]"].map((position) => <span key={position} className={`absolute h-4 w-4 rounded-full border-2 border-white shadow-md ${position}`} />)}
      <div className="absolute bottom-3 left-3 rounded-xl bg-white/90 px-3 py-2 text-xs text-[#536B63] shadow-sm"><b className="text-[#173B38]">{role === "admin" ? "28 active operations" : "3 nearby matches"}</b><br />Updated just now</div>
      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold text-[#087C70] shadow-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-[#3BB273]" /> Live view</div>
    </div>
  );
}

export function PhaseOneWorkspace({ role }: { role: WorkspaceRole }) {
  const copy = roleCopy[role];
  const [selected, setSelected] = useState(0);
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00877F]">{copy.eyebrow}</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#173B38]">{copy.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#71817C]">{copy.description}</p></div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Section><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-extrabold text-[#173B38]">Live operations map</h2><p className="mt-1 text-xs text-[#71817C]">Pickup points, receiving hubs, and suggested routes.</p></div><Navigation className="h-5 w-5 text-[#087C70]" /></div><OperationsMap role={role} /></Section>
        <Section><div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[#A6751A]" /><h2 className="text-lg font-extrabold text-[#173B38]">AI matching</h2></div><p className="mt-2 text-xs leading-5 text-[#71817C]">Recommendations are explainable suggestions. A person confirms every handoff.</p><div className="mt-4 space-y-2">{matches.map((match, index) => <button type="button" key={match.name} onClick={() => setSelected(index)} className={`w-full rounded-2xl border p-3 text-left transition ${selected === index ? "border-[#0B8B7F] bg-[#F1F9F4]" : "border-[#E6EAE4] hover:bg-[#FAFCFA]"}`}><div className="flex items-start justify-between gap-3"><span className="text-sm font-bold text-[#173B38]">{match.name}</span><span className="text-xs font-extrabold text-[#087C70]">{match.fit}% fit</span></div><div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#71817C]"><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{match.distance}</span><span className="flex items-center gap-1"><Package className="h-3 w-3" />{match.need}</span><span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />{match.urgency}</span></div></button>)}</div><button type="button" className="mt-4 w-full rounded-xl bg-[#0B8B7F] px-4 py-2.5 text-xs font-bold text-white">Review selected match</button></Section>
      </div>
      <Section><div className="grid gap-4 sm:grid-cols-3"><div className="flex items-center gap-3 rounded-2xl bg-[#F5F9F5] p-4"><CheckCircle2 className="h-5 w-5 text-[#087C70]" /><div><p className="text-lg font-extrabold text-[#173B38]">96%</p><p className="text-xs text-[#71817C]">Top match confidence</p></div></div><div className="flex items-center gap-3 rounded-2xl bg-[#FFF9EE] p-4"><Truck className="h-5 w-5 text-[#A6751A]" /><div><p className="text-lg font-extrabold text-[#173B38]">12 min</p><p className="text-xs text-[#71817C]">Estimated pickup window</p></div></div><div className="flex items-center gap-3 rounded-2xl bg-[#F1F6FB] p-4"><Users className="h-5 w-5 text-[#3569A8]" /><div><p className="text-lg font-extrabold text-[#173B38]">8 hubs</p><p className="text-xs text-[#71817C]">Currently accepting food</p></div></div></div></Section>
    </motion.div>
  );
}
