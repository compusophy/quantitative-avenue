import { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Brain, 
  Code, 
  Database, 
  ShieldCheck, 
  FileSpreadsheet,
  Network,
  Cpu,
  Coins,
  Globe,
  Clock,
  ArrowRight,
  Sparkles,
  Info
} from "lucide-react";
import { Department, Location } from "../types.ts";

interface DeptDetail {
  id: Department;
  title: string;
  fraction: number; // Percentage of firm manpower
  pnlShare: string;
  headcount: number;
  icon: any;
  techSubstrate: string[];
  keyMission: string;
  coreVulnerability: string;
  activeDesks: string[];
  tradingVenuesCount: number;
  recruitingHurdle: string;
}

interface LocationDetail {
  id: Location;
  utcOffset: number;
  currency: string;
  activeVenues: string[];
  primaryDesks: string[];
  firmCapitalPct: number;
  networkLatency: string;
}

export default function OrgExplorer() {
  const [selectedDept, setSelectedDept] = useState<Department | null>(Department.TRADING);
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(Location.NEW_YORK);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const departments: DeptDetail[] = [
    {
      id: Department.TRADING,
      title: "Quantitative Trading",
      fraction: 25,
      pnlShare: "40% (Direct Market Maker capture)",
      headcount: 380,
      icon: TrendingUp,
      techSubstrate: ["OCaml Arbitrage Scripting", "Real-time Delta-Hedging Engine", "Bonsai Risk Terminals"],
      keyMission: "Continuous liquidity provision and dynamic risk management. Avenue traders hold the bid-ask spreads across over 200 venues globally, managing millions in exposure on the fly under high-stakes conditions with zero backing silos.",
      coreVulnerability: "Inventory skew and rapid fat-tailed systemic covariance drift.",
      activeDesks: ["Index Arbitrage", "ETF Liquidity", "Crypto Derivatives", "Volatility Arbitrage", "Fixed Income Bonds"],
      tradingVenuesCount: 220,
      recruitingHurdle: "The 30-second conditional expectation test (98% accuracy required)."
    },
    {
      id: Department.QUANTITATIVE_RESEARCH,
      title: "Quantitative Research",
      fraction: 20,
      pnlShare: "30% (Signal efficiency value)",
      headcount: 310,
      icon: Brain,
      techSubstrate: ["Stochastic Modeling in Julia/Python", "Linear pricing models in OCaml", "High-Performance GPU Model Pools"],
      keyMission: "Extracting tiny, highly structured signals from chaotic, multi-terabyte financial data feeds. Avenue researchers mathematically design predictions and market-clearing thresholds, applying mathematical physics and probability.",
      coreVulnerability: "Backtest overfitting and structural change post-deployment.",
      activeDesks: ["Alpha Generation", "Market Microstructure", "Machine Learning Signals", "Option Pricing Kernels"],
      tradingVenuesCount: 180,
      recruitingHurdle: "The Dynamic Programming Stopping Game interview challenge."
    },
    {
      id: Department.SOFTWARE_ENGINEERING,
      title: "Software Engineering",
      fraction: 30,
      pnlShare: "20% (System throughput leverage value)",
      headcount: 450,
      icon: Code,
      techSubstrate: ["Core OCaml Compiler v5.x", "Shared Memory Rings", "Bonsai client-side state engines"],
      keyMission: "Architecting and perfecting the entire core system written in 95% OCaml. We optimize compiler garbage collectors, design custom statically typed domain languages, and implement algebraic data types that physically prevent state-failures.",
      coreVulnerability: "Garbage collection stop-the-world spikes on multi-core systems.",
      activeDesks: ["Execution Algorithms", "Compiler Upstream Tooling", "Internal Exchange Relays", "Bonsai Core state frontends"],
      tradingVenuesCount: 240,
      recruitingHurdle: "Writing recursive type definitions verifying complete algebraic cases on the fly."
    },
    {
      id: Department.SYSTEMS_INFRASTRUCTURE,
      title: "Systems & Infrastructure",
      fraction: 12,
      pnlShare: "5% (Latency reduction alpha)",
      headcount: 180,
      icon: Cpu,
      techSubstrate: ["FPGA Verilog / SystemVerilog HLS", "Linux Kernel-bypass (Solarflare EF_VI)", "PTP Time Sync (IEEE 1588)"],
      keyMission: "Removing nanoseconds from execution paths. Tuning custom silicon, operating bare-metal low-latency networks, bypassing standard networking kernels to achieve peak throughput across exchange proximity colocation cages.",
      coreVulnerability: "Hardware alignment errors and fiber optical physical damage.",
      activeDesks: ["FPGA HW Acceleration", "Bare-metal Infrastructure", "Clock Distribution & Synch", "Low-latency Routing Fabric"],
      tradingVenuesCount: 205,
      recruitingHurdle: "Designing a lock-free physical queue in assembly during low-level interviews."
    },
    {
      id: Department.BUSINESS_DEVELOPMENT,
      title: "Business Development & Strategy",
      fraction: 7,
      pnlShare: "3% (Partnership & jurisdictional margin)",
      headcount: 110,
      icon: Network,
      techSubstrate: ["Regulatory Compliance Tracking", "Bespoke Valuation Ledgers", "Global CRM Core"],
      keyMission: "Securing raw market connectivity and managing prime broker capital allocations. BD maps policies across continents, acquires licences, establishes exchange membership, and negotiates bilateral wholesale liquidity streams.",
      coreVulnerability: "Geopolitical sanctions and overnight changes in capital-adequacy policies.",
      activeDesks: ["Exchange Integrations", "Prime Broker Relations", "Legal and Market Policy", "Top Talent Scouting Matrix"],
      tradingVenuesCount: 220,
      recruitingHurdle: "Simulated multi-criteria exchange access negotiation test."
    },
    {
      id: Department.OPERATIONS_COMPLIANCE,
      title: "Operations & Compliance",
      fraction: 6,
      pnlShare: "2% (Discrepancy avoidance savings)",
      headcount: 90,
      icon: ShieldCheck,
      techSubstrate: ["OCaml Automated Settlements", "Real-time Reconciliation Daemons", "Post-trade Ledger Audit Pipelines"],
      keyMission: "Flawless settlement and multi-billion dollar trade clearance. Ops sits closely with developers and traders, building tools in OCaml to automate double-entry bookkeeping, audit risk limits, and resolve active clearing anomalies.",
      coreVulnerability: "Asymmetric clearing settlement delays from exchange counterparties.",
      activeDesks: ["Clearing & Custodial Support", "Technical Compliance Audit", "Risk Guardrails Automation", "Post-Trade Analytics"],
      tradingVenuesCount: 220,
      recruitingHurdle: "Reconciliation of a 10,000 transaction anomalous ledger within 15 minutes."
    }
  ];

  const locations: Record<Location, LocationDetail> = {
    [Location.NEW_YORK]: {
      id: Location.NEW_YORK,
      utcOffset: -4, // EDT (usually -4 or -5, let's use -4)
      currency: "USD ($)",
      activeVenues: ["NYSE", "NASDAQ", "CBOE Options", "IEX", "Avenue-internal Crossing Dark Pool"],
      primaryDesks: ["US ETF Options", "Global Volatility Arbitrage HQ", "Stochastic Modeling", "ML Signal Desks"],
      firmCapitalPct: 45,
      networkLatency: "Sub-microsecond local fiber mesh"
    },
    [Location.LONDON]: {
      id: Location.LONDON,
      utcOffset: 1, // BST
      currency: "GBP (£) & EUR (€)",
      activeVenues: ["LSE", "Eurex", "Euroneon", "Ice Futures", "Avenue-London Relay Desk"],
      primaryDesks: ["OCaml Core Compiler Group", "European Option Arbitrage", "Fixed Income Bonds Desk", "Bare-metal low-latency TCP tuning"],
      firmCapitalPct: 25,
      networkLatency: "High-grade optical line to Frankfurt"
    },
    [Location.HONG_KONG]: {
      id: Location.HONG_KONG,
      utcOffset: 8, // HKT
      currency: "HKD ($) & JPY (¥)",
      activeVenues: ["HKEX", "TSE (Japan)", "SGE", "ASX (Australia)"],
      primaryDesks: ["APAC ETF Liquidity Provider", "Emerging Markets Arbitrage", "Index Rebalance Engineering"],
      firmCapitalPct: 15,
      networkLatency: "Underwater trans-pacific ring"
    },
    [Location.SINGAPORE]: {
      id: Location.SINGAPORE,
      utcOffset: 8, // SGT
      currency: "SGD ($)",
      activeVenues: ["SGX", "Bursa Malaysia", "IDX", "Avenue Asia clearing relay"],
      primaryDesks: ["Southeast Asian Arbitrage", "Commodities Derivatives pricing", "Wholesale client trading desk"],
      firmCapitalPct: 10,
      networkLatency: "Local fiber colocation to SGX engine"
    },
    [Location.AMSTERDAM]: {
      id: Location.AMSTERDAM,
      utcOffset: 2, // CEST
      currency: "EUR (€)",
      activeVenues: ["Euronext Amsterdam", "Deutsche Börse", "Borsa Italiana", "Avenue-Europe ETP Bridge"],
      primaryDesks: ["European ETF Market Making", "Wholesale Systematic Liquidity", "MIFID-II Compliance Core"],
      firmCapitalPct: 5,
      networkLatency: "Amsterdam Internet Exchange (AMS-IX) peer"
    }
  };

  const getLocalOfficeTime = (offset: number) => {
    // Current UTC time
    const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);
    const officeTime = new Date(utc + (3600000 * offset));
    return officeTime.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const isOfficeOpen = (offset: number) => {
    const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);
    const officeTime = new Date(utc + (3600000 * offset));
    const hours = officeTime.getHours();
    const day = officeTime.getDay();
    // 8:00 AM to 6:00 PM, Monday to Friday (1-5)
    return hours >= 8 && hours < 18 && day >= 1 && day <= 5;
  };

  return (
    <div className="flex flex-col gap-6" id="org-structure-mirror">
      {/* Brand Fork Pitch */}
      <div className="bg-[#254a32]/10 p-5 rounded border border-[#254a32]/20 flex items-start gap-4 shadow-sm">
        <div className="bg-[#254a32] text-white p-2 rounded shrink-0">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#1a1a1a] font-sans">Avenue Quantitative — Structuring the Replica</h3>
          <p className="text-xs text-slate-705 mt-1 leading-relaxed text-slate-600">
            Avenue Quantitative is a premium, high-integrity quantitative trading firm structured intentionally to mirror <strong>Jane Street</strong> in every dimension. We are active liquidity providers, continuously bidding and offering across ETPs, derivatives, and fixed income on 200+ venues worldwide. Our engineering culture is founded on absolute mathematical excellence and code-safety driven by <strong>OCaml</strong> compilation.
          </p>
        </div>
      </div>

      {/* Global Clock Footprint Hub */}
      <div className="bg-white p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#254a32] flex items-center gap-1.5 font-mono">
            <Globe className="h-4 w-4" /> Global Handover Hub & Market Venues
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Handing off market-making risk continuously
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.values(locations).map((loc) => {
            const isOpen = isOfficeOpen(loc.utcOffset);
            const isTarget = selectedLoc === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLoc(loc.id)}
                className={`p-3 border rounded text-left transition relative cursor-pointer ${
                  isTarget 
                    ? "bg-[#254a32] text-white border-[#254a32] shadow-sm" 
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-extrabold uppercase font-mono truncate">{loc.id.split(" (")[0]}</span>
                  <span className={`h-2 w-2 rounded-full ring-2 ${
                    isOpen 
                      ? isTarget ? "bg-white ring-white/30" : "bg-emerald-500 ring-emerald-500/30 animate-pulse"
                      : "bg-slate-300 ring-slate-300/30"
                  }`}></span>
                </div>
                <div className={`text-sm font-bold font-mono mt-1 ${isTarget ? "text-white" : "text-slate-800"}`}>
                  {getLocalOfficeTime(loc.utcOffset)}
                </div>
                <div className={`text-[10px] font-medium mt-1 uppercase ${isTarget ? "text-emerald-100" : "text-slate-500"}`}>
                  {isOpen ? "Active Desk" : "Closed"} • {loc.firmCapitalPct}% Cap
                </div>
              </button>
            );
          })}
        </div>

        {selectedLoc && (
          <div className="bg-slate-50 p-4 border border-slate-200 rounded text-xs grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in text-[#333]">
            <div>
              <span className="text-[9px] font-mono text-[#254a32] uppercase tracking-wider font-bold block mb-1">
                {selectedLoc} Connected Venues
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {locations[selectedLoc].activeVenues.map((ven) => (
                  <span key={ven} className="bg-white border border-slate-250 px-2.5 py-0.5 rounded text-[10px] font-mono text-slate-700 font-bold shadow-xs">
                    {ven}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#254a32] uppercase tracking-wider font-bold block mb-1">
                Active Desk Assets & Architecture
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {locations[selectedLoc].primaryDesks.map((dsk) => (
                  <span key={dsk} className="bg-[#254a32]/5 border border-[#254a32]/15 text-[#254a32] px-2 py-0.5 rounded text-[10px] font-sans font-semibold">
                    {dsk}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-[10px] text-slate-500 flex justify-between">
                <span>Primary Currency: <strong>{locations[selectedLoc].currency}</strong></span>
                <span>Inter-Desk Latency: <strong>{locations[selectedLoc].networkLatency}</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6 Department Structure Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left selector col */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <label className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold">Replicated Org Branches</label>
          {departments.map((dept) => {
            const isTarget = selectedDept === dept.id;
            const IconComponent = dept.icon;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`p-3.5 border rounded-lg text-left transition flex items-center justify-between cursor-pointer shadow-xs ${
                  isTarget 
                    ? "bg-[#254a32] border-[#254a32] text-white" 
                    : "bg-white border-slate-200 text-slate-700 hover:text-[#254a32] hover:border-[#254a32]/30"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconComponent className={`h-4.5 w-4.5 ${isTarget ? "text-emerald-300" : "text-[#254a32]"}`} />
                  <div>
                    <span className="text-xs font-bold font-sans block tracking-tight leading-none">{dept.title}</span>
                    <span className={`text-[10px] font-mono block mt-1 ${isTarget ? "text-emerald-100" : "text-slate-400"}`}>
                      {dept.headcount} Traders & Engineers ({dept.fraction}% firm)
                    </span>
                  </div>
                </div>
                <ArrowRight className={`h-4 w-4 shrink-0 transition-transform ${isTarget ? "translate-x-1 text-white" : "text-slate-300"}`} />
              </button>
            );
          })}
        </div>

        {/* Right detailed col */}
        <div className="lg:col-span-8">
          {selectedDept ? (
            (() => {
              const dept = departments.find(d => d.id === selectedDept)!;
              const IconComponent = dept.icon;
              return (
                <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex flex-col gap-4.5 animate-fade-in">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-[#254a32]/10 text-[#254a32] rounded">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold font-sans text-[#1a1a1a]">{dept.title}</h4>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">DEPARTMENT COMPOSITION PROFILE</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-[#254a32]/10 text-[#254a32] border border-[#254a32]/25 px-2.5 py-1 rounded">
                      Allocated Capital: {dept.fraction === 25 ? "Max Risk Budget" : dept.fraction === 30 ? "Infrastructure Core" : "Active Pool"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#254a32] uppercase tracking-wider font-bold block">Key Mission & Core Operations</span>
                      <p className="text-xs text-slate-700 leading-relaxed mt-1">{dept.keyMission}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                      <div>
                        <span className="text-[10px] font-mono text-[#254a32] uppercase tracking-wider font-bold block">Firm Asset desks ({dept.activeDesks.length})</span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {dept.activeDesks.map(desk => (
                            <span key={desk} className="bg-slate-50 border border-slate-250 font-bold text-slate-700 px-2.5 py-0.5 rounded text-[10px] font-sans">
                              {desk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-[#254a32] uppercase tracking-wider font-bold block">Production Tech Substrate</span>
                        <div className="flex flex-wrap gap-1.5 mt-2 col-span-1">
                          {dept.techSubstrate.map(tech => (
                            <span key={tech} className="bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded text-[10px] font-mono font-semibold">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-150 p-3 rounded-lg flex items-start gap-2.5 mt-2 text-xs">
                      <Info className="h-4.5 w-4.5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-mono text-amber-800 uppercase tracking-widest font-bold block mb-0.5">Primary Candidate Gate / Interview Target</span>
                        <p className="text-amber-850 text-amber-900 leading-normal font-sans font-medium">{dept.recruitingHurdle}</p>
                        <p className="text-[10px] text-amber-700 mt-1">
                          Our interview processes replicate actual desk operations. This includes extreme stochastic modeling, poker risk tolerance testing, and complete logic transparency.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-3 border border-slate-200 text-[11px] text-slate-500 font-mono mt-1">
                      <span>Department Shareholder Fraction: <strong>{dept.fraction}%</strong></span>
                      <span>Operational Micro-vulnerability: <strong>{dept.coreVulnerability}</strong></span>
                    </div>

                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-12 text-center h-full flex flex-col items-center justify-center">
              <Sparkles className="h-8 w-8 text-[#254a32]" />
              <h5 className="text-sm font-semibold mt-2.5">Explore Org Departments</h5>
              <p className="text-xs text-slate-400 max-w-sm mt-1">Click any department on the left col to inspect capital allocation, trade microstructures, OCaml paradigms, and candidate screening criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
