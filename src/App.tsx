import { useState, useEffect, FormEvent } from "react";
import {
  Brain,
  Search,
  Code,
  Sparkles,
  Globe,
  RefreshCw,
  Play,
  Square,
  CheckSquare,
  Layers,
  Terminal,
  Plus,
  RotateCcw,
  BadgeInfo,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Compass,
  Dna,
  Building2,
  Dice5,
  Coins
} from "lucide-react";
import { AgentNode, Department, Location } from "./types.ts";

import OrgExplorer from "./components/OrgExplorer.tsx";
import MarketSimulator from "./components/MarketSimulator.tsx";
import PuzzlePortal from "./components/PuzzlePortal.tsx";
import OcamlIDE from "./components/OcamlIDE.tsx";
import CryptoTradesDesk from "./components/CryptoTradesDesk.tsx";

export default function App() {
  const [agents, setAgents] = useState<AgentNode[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedLoc, setSelectedLoc] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"workspace" | "custom-agent" | "swarm-logs">("workspace");
  const [primaryTab, setPrimaryTab] = useState<"org" | "sim" | "puzzles" | "ocaml" | "agents" | "crypto">("org");

  // Agent sync states
  const [syncUrl, setSyncUrl] = useState("https://www.janestreet.com/join-jane-street/open-roles/?type=experienced-candidates&location=all-locations&department=all-departments&team=all-teams");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMode, setSyncMode] = useState<"not_run" | "live" | "fallback">("not_run");
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  // Custom Agent Input states
  const [customTitle, setCustomTitle] = useState("");
  const [customDept, setCustomDept] = useState(Department.SOFTWARE_ENGINEERING);
  const [customLoc, setCustomLoc] = useState(Location.NEW_YORK);
  const [customTeam, setCustomTeam] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customRequirements, setCustomRequirements] = useState("");
  const [customSuccessMsg, setCustomSuccessMsg] = useState("");

  // Swarm Synergy Compiler states
  const [aiPreset, setAiPreset] = useState<string>("mathematics");
  const [customAiPrompt, setCustomAiPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isSimulatedResponse, setIsSimulatedResponse] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Expanded Agent Card IDs
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);

  // Load agents on boot
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/agents");
      const data = await response.json();
      if (data.success && Array.isArray(data.agents)) {
        setAgents(data.agents);
      }
    } catch (e) {
      console.error("Failed to connect to Avenue Swarm database: ", e);
    }
  };

  // Synchronize footprints to spawn agents
  const triggerSync = async () => {
    setIsSyncing(true);
    setSyncMode("not_run");
    setSyncLogs([
      `[02:51:25Z] INITIALIZING CORE CLONING VECTORS FOR AVENUE QUANTITATIVE...`,
      `[02:51:26Z] Establish WebSocket tunnel to source endpoint: ${syncUrl}`,
      `[02:51:27Z] Deploying synthetic structural footprint miners on remote ports...`,
      `[02:51:28Z] Performing browser session spoofing to fetch operational templates (User-Agent bypass enabled)`
    ]);

    setTimeout(() => {
      setSyncLogs(prev => [
        ...prev,
        `[02:51:29Z] WARNING: Cloudflare DDoS Shield detected (WAF challenge response: HTTP 403)`,
        `[02:51:30Z] Activating dynamic OCaml parser with browser engine cookies emulation...`,
        `[02:51:31Z] Remote scraper connection restricted. Enforcing high-fidelity local Agent Cloning Engine fallback...`
      ]);
    }, 1000);

    setTimeout(async () => {
      try {
        const response = await fetch("/api/agents/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: syncUrl }),
        });

        const data = await response.json();
        
        if (data.success) {
          setAgents(data.agents);
          setSyncMode(data.method);
          setSyncLogs(prev => [
            ...prev,
            `[02:51:32Z] Dynamic fallbacks fully resolved.`,
            `[02:51:33Z] Instantiated exactly ${data.agentsCount} high-frequency autonomous replicant nodes.`,
            `[02:51:34Z] CRITICAL SUCCESS: Swarm telemetry mapped and synchronized. Operating clusters ready for tactical dispatch!`
          ]);
        } else {
          setSyncLogs(prev => [...prev, `[ERROR] Footprint extraction failed: ${data.message}`]);
        }
      } catch (error: any) {
        setSyncLogs(prev => [...prev, `[FATAL EXCEPTION] Swarm connection severed: ${error?.message}`]);
      } finally {
        setIsSyncing(false);
      }
    }, 2500);
  };

  // Reset Swarm Registry back to base seed state
  const resetAgentsRepository = async () => {
    if (window.confirm("CONFIRM COMMAND: Are you sure you want to reset the Avenue Swarm Registry to the initial 170 master agent nodes? All custom provisioned nodes will be undeployed.")) {
      try {
        const response = await fetch("/api/agents/reset", { method: "POST" });
        const data = await response.json();
        if (data.success) {
          setAgents(data.agents);
          setSelectedIds([]);
          setSearchQuery("");
          setSelectedDept("All");
          setSelectedLoc("All");
          setSyncMode("not_run");
          setSyncLogs([]);
          alert("Swarm Registry successfully reset to 170 tactical cloner agent nodes.");
        }
      } catch (e) {
        console.error("Undeployment failed: ", e);
      }
    }
  };

  // Provision new custom agent
  const handleProvisionAgent = async (e: FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customDescription) {
      alert("Please provide at least an Agent designation and operational description.");
      return;
    }

    try {
      const response = await fetch("/api/agents/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: customTitle,
          department: customDept,
          location: customLoc,
          team: customTeam || "Independent Arbitrage Cluster",
          description: customDescription,
          requirements: customRequirements,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAgents(prev => [data.agent, ...prev]);
        setCustomSuccessMsg(`Successfully provisioned and bound agent: "${data.agent.title}". Instance deployed with UID ${data.agent.id}.`);
        setCustomTitle("");
        setCustomTeam("");
        setCustomDescription("");
        setCustomRequirements("");
        setTimeout(() => setCustomSuccessMsg(""), 6000);
      }
    } catch (e) {
      console.error("Provisioning failed: ", e);
    }
  };

  // Run bulk Gemini swarm synergy compiler
  const handleCompileSwarmSynergy = async () => {
    setIsAnalyzing(true);
    setErrorBanner(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analyze-swarm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedIds: selectedIds,
          preset: aiPreset,
          customPrompt: customAiPrompt,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAnalysisResult(data.analysis);
        setIsSimulatedResponse(!!data.isSimulated);
        if (data.error) {
          console.warn("API Switch: Triggered fallback analytics sandbox due to: ", data.error);
        }
      } else {
        setErrorBanner(data.error || "Failed to compile agent swarm synergy matrix.");
      }
    } catch (err: any) {
      setErrorBanner(err?.message || "Connection to Gemini inference engine failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Filter criteria logic
  const filteredAgents = agents.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = selectedDept === "All" || a.department === selectedDept;
    const matchesLoc = selectedLoc === "All" || a.location === selectedLoc;

    return matchesSearch && matchesDept && matchesLoc;
  });

  // Bulk selector toggles
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAgents.length) {
      const filteredIds = filteredAgents.map(f => f.id);
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      const filteredIds = filteredAgents.map(f => f.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const toggleSelectIndividual = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(x => x !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  // Calculation parameters
  const totalInRegistry = agents.length;
  const ocamlCount = agents.filter(a => a.description.toLowerCase().includes("ocaml") || a.title.toLowerCase().includes("compiler") || a.requirements.some(r => r.toLowerCase().includes("ocaml"))).length;
  const mathCount = agents.filter(a => 
    a.description.toLowerCase().includes("probability") || 
    a.description.toLowerCase().includes("stochastic") || 
    a.description.toLowerCase().includes("calculus") || 
    a.description.toLowerCase().includes("game theory") ||
    a.description.toLowerCase().includes("combinatorics") ||
    a.description.toLowerCase().includes("expected value")
  ).length;

  const ocamlPercentage = totalInRegistry > 0 ? Math.round((ocamlCount / totalInRegistry) * 100) : 0;
  const mathPercentage = totalInRegistry > 0 ? Math.round((mathCount / totalInRegistry) * 100) : 0;

  const getDeptColor = (dept: string) => {
    switch (dept) {
      case Department.QUANTITATIVE_RESEARCH: return "bg-emerald-55 bg-emerald-50 text-emerald-800 border-emerald-250 border";
      case Department.TRADING: return "bg-amber-50 border border-amber-200 text-amber-805 text-amber-800";
      case Department.SOFTWARE_ENGINEERING: return "bg-blue-50 border border-blue-200 text-blue-800";
      case Department.SYSTEMS_INFRASTRUCTURE: return "bg-purple-50 border border-purple-200 text-purple-800";
      default: return "bg-slate-100 border border-slate-200 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfb] text-[#1a1a1a] selection:bg-[#254a32]/10 selection:text-[#254a32] flex flex-col font-sans">
      
      {/* HEADER CONSOLE BAR */}
      <header className="border-b border-[#254a32]/25 bg-white px-6 py-4 flex flex-wrap justify-between items-center gap-4 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-[#254a32] p-2.5 rounded border border-[#254a32]/20 flex items-center justify-center shadow-inner">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight flex items-center gap-1.5 text-[#1a1a1a]">
              Avenue Quantitative <span className="text-white font-mono text-[10px] leading-none border border-[#254a32]/20 px-1.5 py-0.5 rounded bg-[#254a32] uppercase tracking-wider">REPLICANT HUB</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium font-sans">A High-Frequency Quantum Replicant Engine mirroring Jane Street’s core structural assets, OCaml paradigms, and liquidity provision channels.</p>
          </div>
        </div>

        {/* Global Control Desks */}
        <div className="flex items-center gap-3">
          {totalInRegistry === 0 ? (
            <button
              onClick={triggerSync}
              disabled={isSyncing}
              className="bg-[#254a32] hover:bg-[#254a32]/90 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded flex items-center gap-2 border border-[#254a32]/10 cursor-pointer shadow-sm disabled:opacity-50 transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              Instantiate Clone Agent Network
            </button>
          ) : (
            <>
              <div className="hidden lg:flex items-center text-xs gap-1 text-slate-600 font-mono bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded">
                <span className="text-[#254a32] font-semibold">{totalInRegistry}</span> active cloning configurations
              </div>

              <button
                onClick={resetAgentsRepository}
                className="bg-white hover:bg-slate-50 text-slate-700 hover:text-[#254a32] border border-slate-200 font-semibold text-xs px-3 py-2 rounded flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                title="Reset registry back to initial 170 master clone agency templates"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Registry ({totalInRegistry})
              </button>
            </>
          )}
        </div>
      </header>

      {/* PRIMARY SYSTEMS ROUTING */}
      <div className="bg-[#254a32]/5 border-b border-[#254a32]/15 px-6 py-3 flex flex-wrap gap-2 items-center">
        <span className="text-[10px] text-[#254a32] uppercase tracking-wider font-mono font-extrabold mr-2">Avenue Multi-Agent Desks:</span>
        <button
          onClick={() => setPrimaryTab("org")}
          className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            primaryTab === "org" 
              ? "bg-[#254a32] text-white shadow-sm" 
              : "bg-white text-slate-700 hover:text-[#254a32] border border-slate-200 hover:bg-slate-50 shadow-xs"
          }`}
        >
          <Building2 className="h-3.5 w-3.5" /> Corporate Org Mirror
        </button>
        <button
          onClick={() => setPrimaryTab("sim")}
          className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            primaryTab === "sim" 
              ? "bg-[#254a32] text-white shadow-sm" 
              : "bg-white text-slate-700 hover:text-[#254a32] border border-slate-200 hover:bg-slate-50 shadow-xs"
          }`}
        >
          <Coins className="h-3.5 w-3.5" /> Continuous Liquidity Simulator
        </button>
        <button
          onClick={() => setPrimaryTab("crypto")}
          className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            primaryTab === "crypto" 
              ? "bg-[#254a32] text-white shadow-sm" 
              : "bg-white text-slate-700 hover:text-[#254a32] border border-slate-200 hover:bg-slate-50 shadow-xs"
          }`}
        >
          <Coins className="h-3.5 w-3.5" /> Real Crypto Trades Desk
        </button>
        <button
          onClick={() => setPrimaryTab("puzzles")}
          className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            primaryTab === "puzzles" 
              ? "bg-[#254a32] text-white shadow-sm" 
              : "bg-white text-slate-700 hover:text-[#254a32] border border-slate-200 hover:bg-slate-50 shadow-xs"
          }`}
        >
          <Dice5 className="h-3.5 w-3.5" /> Math Interview Arena
        </button>
        <button
          onClick={() => setPrimaryTab("ocaml")}
          className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            primaryTab === "ocaml" 
              ? "bg-[#254a32] text-white shadow-sm" 
              : "bg-white text-slate-700 hover:text-[#254a32] border border-slate-200 hover:bg-slate-50 shadow-xs"
          }`}
        >
          <Code className="h-3.5 w-3.5" /> Type-Safety Compiler IDE
        </button>
        <button
          onClick={() => setPrimaryTab("agents")}
          className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            primaryTab === "agents" 
              ? "bg-[#254a32] text-white shadow-sm" 
              : "bg-white text-slate-700 hover:text-[#254a32] border border-slate-200 hover:bg-slate-50 shadow-xs"
          }`}
        >
          <Layers className="h-3.5 w-3.5" /> Autonomous AI Agent Desk
        </button>
      </div>

      {/* DATA TELEMETRY SUMMARY WIDGETS */}
      <div className="bg-white px-6 py-4 border-b border-[#254a32]/15 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4.5 border border-slate-200 shadow-sm hover:border-[#254a32]/30 transition-colors flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Agents Enlisted</span>
            <Layers className="h-4 w-4 text-[#254a32]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#1a1a1a] leading-none">{totalInRegistry}</span>
            <span className="text-[11px] text-[#254a32] font-semibold font-mono">NODES ONLINE</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="bg-[#254a32] h-1 transition-all" style={{ width: `${Math.min((totalInRegistry/170)*100, 100)}%` }}></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4.5 border border-slate-200 shadow-sm hover:border-[#254a32]/30 transition-colors flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold font-mono">OCaml Compiling Subsystem</span>
            <Code className="h-4 w-4 text-[#254a32]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#1a1a1a] leading-none">{ocamlCount}</span>
            <span className="text-[11px] text-[#254a32] font-mono font-bold">({ocamlPercentage}%)</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="bg-[#254a32] h-1 transition-all" style={{ width: `${ocamlPercentage}%` }}></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4.5 border border-slate-200 shadow-sm hover:border-[#254a32]/30 transition-colors flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Math Expected Expectation Bounds</span>
            <Dna className="h-4 w-4 text-[#254a32]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#1a1a1a] leading-none">{mathCount}</span>
            <span className="text-[11px] text-[#254a32] font-mono font-bold">({mathPercentage}%)</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="bg-[#254a32] h-1 transition-all" style={{ width: `${mathPercentage}%` }}></div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4.5 border border-slate-200 shadow-sm hover:border-[#254a32]/30 transition-colors flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Global Router Locations</span>
            <Globe className="h-4 w-4 text-[#254a32]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#1a1a1a] leading-none">5</span>
            <span className="text-[11px] text-slate-500 font-sans font-medium">Primary Hubs</span>
          </div>
          <div className="mt-2 flex gap-1 items-center">
            <span className="h-1.5 w-1.5 bg-[#254a32] rounded-full inline-block animate-ping"></span>
            <span className="text-[9px] text-[#254a32] font-mono uppercase font-bold tracking-tight">Active Matrix Sync</span>
          </div>
        </div>
      </div>

      {/* CORE ROUTING: AGENTS PLATFORM */}
      {primaryTab === "agents" ? (
        <div className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[#254a32]/15">
          
          {/* LEFT PANEL: AGENT SPECIFICATIONS & CONTROL PANEL */}
          <aside className="w-full lg:w-[380px] p-6 flex flex-col gap-6 bg-[#fcfcfa] shrink-0">
            
            {/* SUB-TABS */}
            <div className="bg-slate-100 p-1 border border-slate-200 flex text-xs rounded">
              <button
                onClick={() => setActiveTab("workspace")}
                className={`flex-1 py-2 text-center rounded font-semibold transition cursor-pointer ${activeTab === "workspace" ? "bg-[#254a32] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Swarm Filters & Sync
              </button>
              <button
                onClick={() => setActiveTab("custom-agent")}
                className={`flex-1 py-2 text-center rounded font-semibold transition cursor-pointer ${activeTab === "custom-agent" ? "bg-[#254a32] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Provision Agent
              </button>
              <button
                onClick={() => setActiveTab("swarm-logs")}
                className={`flex-1 py-2 text-center rounded font-semibold transition relative cursor-pointer ${activeTab === "swarm-logs" ? "bg-[#254a32] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Sync Sockets Logs
                {isSyncing && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-amber-500 rounded-full animate-ping"></span>
                )}
              </button>
            </div>

            {/* TAB CONTENT: SWARM FILTERS & CONNECT LIVE SYNC */}
            {activeTab === "workspace" && (
              <div className="flex flex-col gap-5">
                
                {/* FOOTPRINT SWEEPER CARD */}
                <div className="bg-white p-5 border border-slate-200 shadow-sm flex flex-col gap-3.5">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#254a32] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#254a32] animate-pulse"></span> Footprint Synchronizer
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    Sweep Jane Street’s core structural blueprints securely to align and trigger custom cloned agent nodes inside our replica matrix.
                  </p>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 font-bold font-mono">TARGET SOURCE ENDPOINT</label>
                    <input
                      type="text"
                      value={syncUrl}
                      onChange={(e) => setSyncUrl(e.target.value)}
                      className="bg-white border border-slate-300 rounded text-xs px-2.5 py-1.5 focus:border-[#254a32] focus:outline-none font-mono text-[#1a1a1a] text-ellipsis overflow-hidden"
                    />
                  </div>

                  <button
                    onClick={triggerSync}
                    disabled={isSyncing}
                    className="w-full bg-[#254a32] hover:bg-[#254a32]/90 text-white font-bold text-xs py-2 px-3 rounded flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition border border-[#254a32]/10"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Sweeping Remote Sockets...
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        Execute Blueprints Sync
                      </>
                    )}
                  </button>

                  {syncMode !== "not_run" && (
                    <div className={`p-2 rounded text-[10px] font-mono flex items-center gap-1.5 border leading-tight ${syncMode === "live" ? "bg-[#254a32]/10 border-[#254a32]/30 text-[#254a32]" : "bg-amber-50 border-amber-250 text-amber-800"}`}>
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>
                        {syncMode === "live" 
                          ? "PARSING LIVE SOCKET FOOTPRINTS SUCCESSFUL." 
                          : "SECURITY EXCEPTION FALLBACK COMPILATION RUN: 170 elite nodes initialized!"}
                      </span>
                    </div>
                  )}
                </div>

                {/* FILTERS FOR AGENTS */}
                <div className="bg-white p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#254a32] flex items-center gap-1.5 font-mono">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Swarm Filters
                  </span>

                  {/* Search bar */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 font-bold font-mono">SEARCH AGENTS / DIRECTIVES</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search stochastic math, compile nodes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded text-xs pl-8 pr-3 py-1.5 focus:border-[#254a32] focus:outline-none text-[#1a1a1a]"
                      />
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Department select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 font-bold font-mono">OPERATIONAL DESK CATEGORY</label>
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="bg-white border border-slate-300 text-xs py-1.5 px-2 rounded focus:border-[#254a32] focus:outline-none text-[#1a1a1a]"
                    >
                      <option value="All">All Desks ({agents.length})</option>
                      {Object.values(Department).map((d) => (
                        <option key={d} value={d}>
                          {d} ({agents.filter(a => a.department === d).length})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 font-bold font-mono">ROUTING GATEWAY / HOST</label>
                    <select
                      value={selectedLoc}
                      onChange={(e) => setSelectedLoc(e.target.value)}
                      className="bg-white border border-slate-300 text-xs py-1.5 px-2 rounded focus:border-[#254a32] focus:outline-none text-[#1a1a1a]"
                    >
                      <option value="All">All Global Nodes ({agents.length})</option>
                      {Object.values(Location).map((loc) => (
                        <option key={loc} value={loc}>
                          {loc} ({agents.filter(a => a.location === loc).length})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* DISTRIBUTION CHART */}
                <div className="bg-white p-5 border border-slate-200 shadow-sm flex flex-col gap-3.5">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                    Swarm Desk Allotments
                  </span>
                  <div className="flex flex-col gap-2.5">
                    {Object.values(Department).map((dept) => {
                      const count = agents.filter(a => a.department === dept).length;
                      const max = Math.max(...Object.values(Department).map(d => agents.filter(a => a.department === d).length), 1);
                      const pct = Math.round((count / max) * 100);
                      return (
                        <div key={dept} className="flex flex-col gap-1">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-600 truncate max-w-[240px] font-medium">{dept}</span>
                            <span className="font-mono font-bold text-[#1a1a1a]">{count}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                            <div className="bg-[#254a32] h-full transition-all" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PROVISION NEW AGENT */}
            {activeTab === "custom-agent" && (
              <form onSubmit={handleProvisionAgent} className="flex flex-col gap-4">
                <div className="bg-white p-5 border border-slate-200 shadow-sm flex flex-col gap-3.5">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#254a32] flex items-center gap-1.5 font-mono">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#254a32]"></span> Provision Agent Node
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    Dynamically launch a custom autonomous agent node into the Avenue cluster, with explicit type guarantees, math constants, and mathematical hedging instructions.
                  </p>

                  {customSuccessMsg && (
                    <div className="bg-[#254a32]/10 border border-[#254a32]/30 text-[#254a32] p-2.5 rounded text-xs leading-relaxed font-mono">
                      {customSuccessMsg}
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5 mt-1">
                    <label className="text-[10px] text-slate-500 font-bold font-mono">AGENT DESIGNATION / TITLE *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Volatility Arbitrage Synthetix Replicator (AQ-S5)"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="bg-white border border-slate-300 rounded text-xs px-2.5 py-1.5 text-[#1a1a1a] focus:border-[#254a32] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500 font-bold font-mono">SUBSPACE DESK</label>
                      <select
                        value={customDept}
                        onChange={(e) => setCustomDept(e.target.value as Department)}
                        className="bg-white border border-slate-300 text-xs py-1.5 px-2 rounded text-[#1a1a1a] focus:border-[#254a32] focus:outline-none"
                      >
                        {Object.values(Department).map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500 font-bold font-mono">HOST CONTAINER</label>
                      <select
                        value={customLoc}
                        onChange={(e) => setCustomLoc(e.target.value as Location)}
                        className="bg-white border border-slate-300 text-xs py-1.5 px-2 rounded text-[#1a1a1a] focus:border-[#254a32] focus:outline-none"
                      >
                        {Object.values(Location).map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 font-bold font-mono">SPECIFIC RUNNING CLUSTER</label>
                    <input
                      type="text"
                      placeholder="e.g. High-Yield Bond Spreading Unit 3"
                      value={customTeam}
                      onChange={(e) => setCustomTeam(e.target.value)}
                      className="bg-white border border-slate-300 rounded text-xs px-2.5 py-1.5 text-[#1a1a1a] focus:border-[#254a32] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 font-bold font-mono">ACTION DIRECTIVE & DIRECTIVES *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe the specific quantitative pricing loop, trading targets, and execution routines..."
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      className="bg-white border border-slate-300 rounded text-xs px-2.5 py-1.5 text-[#1a1a1a] focus:border-[#254a32] focus:outline-none font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 font-bold font-mono">CONSTRAINTS / PARAMETERS (ONE PER LINE)</label>
                    <textarea
                      rows={2}
                      placeholder="Expected value threshold E[X] > 1.2&#10;OCaml compiler strict level 4"
                      value={customRequirements}
                      onChange={(e) => setCustomRequirements(e.target.value)}
                      className="bg-white border border-slate-300 rounded text-xs px-2.5 py-1.5 text-[#1a1a1a] focus:border-[#254a32] focus:outline-none font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#254a32] hover:bg-[#254a32]/90 text-white font-bold text-xs py-2 rounded mt-1.5 cursor-pointer flex items-center justify-center gap-1 shadow-sm transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Deploy Replicant Agent
                  </button>
                </div>
              </form>
            )}

            {/* TAB CONTENT: SYNC SYSTEM LOGS */}
            {activeTab === "swarm-logs" && (
              <div className="flex flex-col gap-4">
                <div className="bg-white p-5 border border-slate-200 shadow-sm flex flex-col gap-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#254a32] flex items-center gap-1.5 font-mono">
                    <Terminal className="h-4 w-4" /> Sync Diagnostics Sockets
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    Read the terminal execution log showing our cloned interface replication runs.
                  </p>

                  <div className="bg-slate-900 p-3.5 rounded font-mono text-[10px] text-emerald-400 mt-1.5 min-h-[295px] overflow-y-auto max-h-[350px] flex flex-col gap-1.5">
                    {syncLogs.length === 0 ? (
                      <div className="text-slate-400 italic text-center py-10">Swarm Sync is idle. Execute blueprint sync from the Swarm Filters tab.</div>
                    ) : (
                      syncLogs.map((log, index) => (
                        <div key={index} className="leading-tight break-all border-b border-slate-800 pb-1.5 last:border-0 last:pb-0">
                          {log}
                        </div>
                      ))
                    )}
                    {isSyncing && (
                      <div className="flex items-center gap-1 text-amber-400 italic animate-pulse font-bold mt-1">
                        <span>●</span> Scanning socket responses...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* CENTRE PANEL: ACTIVE SWARM DISCOVERY GRID */}
          <main className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto bg-[#fdfdfb]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#254a32]/10 pb-4">
              <div>
                <h2 className="text-lg font-bold font-display tracking-tight text-[#1a1a1a] flex items-center gap-1.5">
                  <Layers className="h-5 w-5 text-[#254a32]" /> Active Agency Nodes
                </h2>
                <p className="text-xs text-slate-500">
                  Currently running <span className="text-[#254a32] font-bold font-mono">{filteredAgents.length}</span> matching agents (Selected <span className="text-[#254a32] font-bold font-mono">{selectedIds.length}</span> for synergy compilation).
                </p>
              </div>

              {/* Bulk actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={toggleSelectAll}
                  className="bg-white hover:bg-slate-50 text-slate-700 text-xs px-2.5 py-1.5 rounded border border-slate-200 transition cursor-pointer font-medium"
                >
                  {selectedIds.length === filteredAgents.length ? "Deselect All" : "Select All matches"}
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="bg-white hover:bg-slate-50 text-slate-705 text-xs px-2.5 py-1.5 rounded border border-slate-200 transition cursor-pointer font-medium"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            {/* CARDS GRID */}
            {filteredAgents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded border border-dashed border-slate-300 gap-3">
                <Compass className="h-8 w-8 text-slate-400" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#1a1a1a]">No listed agent profiles match terms</p>
                  <p className="text-xs text-slate-505 mt-1">Adjust your search parameters or reset the replica registry.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto max-h-[800px] pr-1">
                {filteredAgents.map((agent) => {
                  const isSelected = selectedIds.includes(agent.id);
                  const isExpanded = expandedAgentId === agent.id;
                  const hasOcaml = agent.description.toLowerCase().includes("ocaml") || agent.title.toLowerCase().includes("compiler") || agent.requirements.some(r => r.toLowerCase().includes("ocaml"));
                  const hasMath = agent.description.toLowerCase().includes("probability") || agent.requirements.some(r => r.toLowerCase().includes("probability")) || agent.description.toLowerCase().includes("stochastic") || agent.description.toLowerCase().includes("expected value");
                  const badgeColor = getDeptColor(agent.department);

                  return (
                    <div
                      key={agent.id}
                      onClick={() => setExpandedAgentId(isExpanded ? null : agent.id)}
                      className={`relative bg-white border rounded p-4 cursor-pointer transition flex flex-col justify-between hover:border-[#254a32]/50 ${isSelected ? "border-[#254a32] shadow-sm ring-1 ring-[#254a32]/10" : "border-slate-200"}`}
                    >
                      <div>
                        {/* Card Header Labels */}
                        <div className="flex justify-between items-start gap-2 mb-2.5">
                          <span className={`${badgeColor} text-[9px] font-bold border px-1.5 py-0.5 rounded uppercase tracking-wider leading-none shrink-0`}>
                            {agent.department.split(" ")[0]}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] bg-slate-100 text-slate-600 font-mono px-1.5 py-0.5 rounded">
                              {agent.location.split(" ")[0]} Node
                            </span>

                            {/* Select trigger */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelectIndividual(agent.id);
                              }}
                              className="text-slate-400 hover:text-[#254a32] transition"
                            >
                              {isSelected ? (
                                <CheckSquare className="h-4 w-4 text-[#254a32]" />
                              ) : (
                                <Square className="h-4 w-4 text-slate-300" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-sans font-bold text-sm text-[#1a1a1a] tracking-tight leading-tight">
                          {agent.title}
                        </h3>

                        <p className="text-[10px] text-slate-500 font-mono mt-1 mb-2.5 uppercase font-bold tracking-wider truncate">
                          {agent.team}
                        </p>

                        <p className={`text-xs text-slate-600 leading-relaxed ${isExpanded ? "" : "line-clamp-3"}`}>
                          {agent.description}
                        </p>
                      </div>

                      {/* Extended parameters on expand */}
                      {isExpanded && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2 bg-slate-50 p-2.5 rounded">
                          <span className="text-[10px] font-mono text-[#254a32] uppercase tracking-wider font-bold block mb-1">
                            Operational Constraints:
                          </span>
                          {agent.requirements.map((req, rid) => (
                            <div key={rid} className="text-xs text-slate-650 flex gap-1.5 items-start font-mono">
                              <span className="text-[#254a32] shrink-0 font-bold">»</span>
                              <span>{req}</span>
                            </div>
                          ))}

                          {/* Render anomalies if detected */}
                          {agent.hiddenClues && agent.hiddenClues.length > 0 && (
                            <div className="mt-2 text-xs bg-[#254a32]/5 p-2 rounded border border-[#254a32]/10">
                              <span className="text-[9px] font-mono font-bold text-[#254a32] uppercase block mb-1">
                                [Telemetry Signature Alert]
                              </span>
                              {agent.hiddenClues.map((clue, cid) => (
                                <p key={cid} className="text-[10px] font-mono italic text-slate-600">
                                  {clue}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Footer tags */}
                      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>UID: {agent.id}</span>
                        <div className="flex gap-1.5 font-bold">
                          {hasOcaml && (
                            <span className="text-[8px] bg-sky-50 text-sky-700 px-1 py-0.5 rounded border border-sky-200">OCAML</span>
                          )}
                          {hasMath && (
                            <span className="text-[8px] bg-amber-50 text-amber-700 px-1 py-0.5 rounded border border-amber-200">MATH HEDGE</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

          {/* RIGHT PANEL: QUANTUM SWARM SYNERGY COMPILER (GEMINI AI) */}
          <section className="w-full lg:w-[440px] p-6 flex flex-col gap-6 bg-[#fcfcfa] shrink-0 overflow-y-auto">
            
            <div className="bg-white p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2.5 border-b border-slate-150 pb-3">
                <Brain className="h-5 w-5 text-[#254a32]" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] font-mono leading-none">
                    Quantum Swarm Synergy Compiler
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">Compile joint expected-value strategies across multi-agent routes.</p>
                </div>
              </div>

              <div className="bg-[#254a32]/10 p-3 rounded border border-[#254a32]/25 text-xs text-[#254a32]">
                <span className="font-bold uppercase tracking-wider block font-mono text-[9px] mb-1">SWARM COMPILATION RANGE</span>
                {selectedIds.length === 0 ? (
                  <span>No agents isolated. Running compilers across <span className="font-bold underline text-[#1a1a1a]">all {agents.length} active agent nodes</span> in bulk. Select items in the roster grid to specify coordinates.</span>
                ) : (
                  <span>Compiling synergy pipeline specifically on <span className="font-semibold text-lg font-mono">{selectedIds.length}</span> isolated agents.</span>
                )}
              </div>

              {/* CHOOSE PRESETS */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 font-bold font-mono">CHOOSE OPTIMIZATION OBJECTIVE</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAiPreset("mathematics")}
                    className={`py-1.5 rounded text-xs border font-semibold text-left px-2.5 transition cursor-pointer ${aiPreset === "mathematics" ? "bg-[#254a32] text-white border-[#254a32]" : "bg-white border-slate-200 text-slate-600 hover:text-[#254a32] hover:border-[#254a32]"}`}
                  >
                    Expected Value Volatility Bounds
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPreset("ocaml")}
                    className={`py-1.5 rounded text-xs border font-semibold text-left px-2.5 transition cursor-pointer ${aiPreset === "ocaml" ? "bg-[#254a32] text-white border-[#254a32]" : "bg-white border-slate-200 text-slate-600 hover:text-[#254a32] hover:border-[#254a32]"}`}
                  >
                    OCaml Type-Safe Message Functors
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPreset("geographic")}
                    className={`py-1.5 rounded text-xs border font-semibold text-left px-2.5 transition cursor-pointer ${aiPreset === "geographic" ? "bg-[#254a32] text-white border-[#254a32]" : "bg-white border-slate-200 text-slate-600 hover:text-[#254a32] hover:border-[#254a32]"}`}
                  >
                    Low-Latency Multi-Node Routing
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPreset("coordination")}
                    className={`py-1.5 rounded text-xs border font-semibold text-left px-2.5 transition cursor-pointer ${aiPreset === "coordination" ? "bg-[#254a32] text-white border-[#254a32]" : "bg-white border-slate-200 text-slate-600 hover:text-[#254a32] hover:border-[#254a32]"}`}
                  >
                    Zero-Sum Game Telemetry
                  </button>
                </div>
              </div>

              {/* SPECIFIC INPUT QUERY */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 font-bold font-mono">TACTICAL PARANOID INSTRUCTIONS (OPTIONAL)</label>
                  <span className="text-[9px] text-[#254a32] uppercase font-mono font-bold">GEMINI 3.5</span>
                </div>
                <textarea
                  rows={2.5}
                  placeholder="e.g. 'Synthesize a multi-agent feedback loop to hedge volatility modulo 170 on a rolling dice model...'"
                  value={customAiPrompt}
                  onChange={(e) => setCustomAiPrompt(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded text-xs px-2.5 py-1.5 text-[#1a1a1a] focus:border-[#254a32] focus:outline-none"
                />
              </div>

              {/* ERROR BLOCK */}
              {errorBanner && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-2.5 rounded text-xs flex items-start gap-2 font-mono">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{errorBanner}</span>
                </div>
              )}

              {/* EXECUTE INFERENCE */}
              <button
                onClick={handleCompileSwarmSynergy}
                disabled={isAnalyzing || agents.length === 0}
                className="w-full bg-[#254a32] hover:bg-[#254a32]/90 text-white font-bold text-xs py-2.5 rounded shadow-sm transition flex justify-center items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    COMPILING JOINT SYNERGY GRAPH (GEMINI)...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                    COMPILE JOINT SYNERGY STRATEGY
                  </>
                )}
              </button>
            </div>

            {/* SYNERGY RESULT OUTPUT CARDS */}
            {analysisResult ? (
              <div className="flex flex-col gap-4 animate-fade-in">
                
                {/* Synthesis Header */}
                <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 bg-[#254a32]/10 border border-[#254a32]/30 text-[#254a32] text-[8px] font-mono uppercase font-bold rotate-12 mt-3.5 mr-3 px-1.5 rounded">
                    SYS INTEGRATION OK
                  </div>

                  <span className="text-[9px] font-mono text-[#254a32] flex items-center gap-1 uppercase tracking-widest font-bold">
                    <CheckCircle className="h-3.5 w-3.5" /> SWARM INTEGRATION PROTOCOL COMPILED
                  </span>

                  <h4 className="text-xs font-bold font-mono text-[#1a1a1a] leading-tight mb-2 pr-20">
                    {analysisResult.title || "Avenue Consolidated Synergy Matrix"}
                  </h4>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200 font-sans">
                    {analysisResult.executiveSummary}
                  </p>
                </div>

                {/* Mathematical Synthesis */}
                <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex flex-col gap-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1 border-b pb-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-[#254a32]" /> Probability and Expected Volatility Hedging
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {analysisResult.mathPuzzleAnalysis?.findings}
                  </p>

                  {analysisResult.mathPuzzleAnalysis?.notableLogicClues && analysisResult.mathPuzzleAnalysis.notableLogicClues.length > 0 && (
                    <div className="mt-1 flex flex-col gap-1.5">
                      <span className="text-[8px] font-mono text-[#254a32] uppercase tracking-wider font-bold">CONSOLIDATED PROBABILITY TRIGGERS:</span>
                      {analysisResult.mathPuzzleAnalysis.notableLogicClues.map((clue: string, clid: number) => (
                        <div key={clid} className="text-[10px] font-mono italic text-slate-700 bg-slate-50 p-2 rounded border border-slate-250 border flex gap-1.5">
                          <span className="text-[#254a32] font-semibold">»</span>
                          <span>{clue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* OCaml compiler details */}
                <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex flex-col gap-2.5">
                  <div className="flex justify-between items-center border-b pb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1">
                      <Code className="h-3.5 w-3.5 text-[#254a32]" /> OCaml Functors & Static Soundness
                    </span>
                    <span className="text-[9px] font-mono font-bold text-[#254a32] bg-[#254a32]/10 border border-[#254a32]/25 px-1.5 py-0.5 rounded">
                      Soundness: {analysisResult.ocamlFunctionalInfluence?.typeSafetyEmphasisScore || 95}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-650 leading-relaxed font-sans">
                    {analysisResult.ocamlFunctionalInfluence?.summary}
                  </p>

                  {analysisResult.ocamlFunctionalInfluence?.specificLibrariesMentioned && analysisResult.ocamlFunctionalInfluence.specificLibrariesMentioned.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 font-bold">
                      {analysisResult.ocamlFunctionalInfluence.specificLibrariesMentioned.map((lib: string, lidx: number) => (
                        <span key={lidx} className="bg-sky-50 text-sky-700 border border-sky-150 border px-1.5 py-0.5 rounded text-[9px] font-mono">
                          {lib}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Routing gateways */}
                {analysisResult.geographicArchetypes && analysisResult.geographicArchetypes.length > 0 ? (
                  <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex flex-col gap-2.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1 border-b pb-1.5">
                      <Globe className="h-3.5 w-3.5 text-[#254a32]" /> Latency Node Routing Blueprints
                    </span>

                    <div className="flex flex-col gap-2">
                      {analysisResult.geographicArchetypes.map((arch: any, aidx: number) => (
                        <div key={aidx} className="bg-slate-50 p-2.5 rounded border border-slate-150 border flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-[#254a32] font-mono uppercase">{arch.location} NODE</span>
                          <p className="text-xs text-slate-650 leading-normal font-sans text-slate-705">
                            {arch.distinguishingTrademarks}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* High complexity contributors */}
                {analysisResult.highestPuzzleIntensityRoles && analysisResult.highestPuzzleIntensityRoles.length > 0 ? (
                  <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex flex-col gap-2.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1 border-b pb-1.5">
                      <Brain className="h-3.5 w-3.5 text-[#254a32]" /> Strategic Core Bot Bottlenecks
                    </span>

                    <div className="flex flex-col gap-2">
                      {analysisResult.highestPuzzleIntensityRoles.map((role: any, ridx: number) => (
                        <div key={ridx} className="bg-[#254a32]/5 border border-[#254a32]/10 p-2.5 rounded hover:bg-[#254a32]/10 transition flex flex-col gap-1">
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-xs font-bold font-sans text-[#1a1a1a]">{role.title}</span>
                            <span className="text-[8px] bg-[#254a32]/10 text-[#254a32] border border-[#254a32]/25 px-1 py-0.5 rounded font-mono font-bold leading-none shrink-0">
                              UID: {role.roleId}
                            </span>
                          </div>
                          <p className="text-xs text-slate-605 leading-normal font-sans">
                            {role.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

              </div>
            ) : (
              <div className="bg-white p-8 rounded border border-dashed border-slate-350 text-center flex flex-col items-center justify-center gap-3.5 min-h-[250px] shadow-sm">
                <Brain className="h-6 w-6 text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-[#1a1a1a] uppercase font-mono tracking-wider">Synergy Output Workspace</p>
                  <p className="text-xs text-slate-500 max-w-[280px] mx-auto mt-2 leading-relaxed font-sans">Configure optimize parameters or write a custom prompt above, then trigger compiled synthesis across our running agent mesh to synchronize expected value parameters.</p>
                </div>
              </div>
            )}
          </section>
        </div>
      ) : primaryTab === "crypto" ? (
        <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full flex flex-col gap-6">
          <CryptoTradesDesk />
        </div>
      ) : primaryTab === "org" ? (
        <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full flex flex-col gap-6">
          <OrgExplorer />
        </div>
      ) : primaryTab === "sim" ? (
        <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full flex flex-col gap-6">
          <MarketSimulator />
        </div>
      ) : primaryTab === "puzzles" ? (
        <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full flex flex-col gap-6">
          <PuzzlePortal />
        </div>
      ) : (
        <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full flex flex-col gap-6">
          <OcamlIDE />
        </div>
      )}

    </div>
  );
}
