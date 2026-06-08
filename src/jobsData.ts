import { AgentNode, Department, Location } from "./types.ts";

export const AGENT_BASE_TEMPLATES = [
  {
    title: "Stochastic Arbitrage Broker Agent (Alpha-S1)",
    department: Department.QUANTITATIVE_RESEARCH,
    team: "Fixed Income & Commodities Arbitrage Desk",
    description: "Autonomous Agent Alpha-S1 performs multi-asset portfolio rebalancing and volatility estimation using high-dimensional stochastic calculus models. Cloned from Jane Street's core modeling units, this node continuously scans for premium dispersion across correlation matrices and triggers automated execution vectors.",
    requirements: [
      "Stochastic Drift Constraint: Mean reverting parameter Lambda > 2.4.",
      "Arbitrage Speed Tolerance: Network-to-execution latency < 4 microseconds.",
      "Bayesian Belief Revision Rate: Adaptive signal estimation updated every epoch.",
      "Functional Safety Protocol: Static assertion of budget limits before trade execution."
    ],
    hiddenClues: [
      "Signature: Embedded quantum state hash '0xDECODE_SYM_170_VAL_324'.",
      "Model Weight: Blind betting with asymmetric probability distribution curves."
    ]
  },
  {
    title: "OCaml Compiler Optimizer Replicant (Compiler-X9)",
    department: Department.SOFTWARE_ENGINEERING,
    team: "Core Platform & Compiler Tooling",
    description: "Compiler-X9 is a specialized automation agent that hot-patches local system modules in forked OCaml. It converts raw code blocks into ultra-performant ASTs, minimizes heap allocation garbage collector pauses, and enforces strict type-directed compilation constraints across our cloning clusters.",
    requirements: [
      "Compilation Style: Statically verified tail-recursive abstractions.",
      "Memory Allocation Gate: Enforce O(1) space allocation thresholds for streaming iterations.",
      "Dependency Invariant: Pure functional functor parameters with zero state mutability.",
      "Optimization Rule: Automatic inlining of high-frequency execution pipelines."
    ],
    hiddenClues: [
      "Replicant Signature: '(** Pulse compiler trace #7: Tail Call Optimization Enabled **)'",
      "Type Integrity: algebraic data types with zero-allocation variance."
    ]
  },
  {
    title: "Liquidity Provisioning Ledger Agent (Liquidity-A3)",
    department: Department.TRADING,
    team: "ETF & Options Market Making Desk",
    description: "An active continuous liquidity-making node, Liquidity-A3 runs custom market simulations, prices derivatives inside order books, and neutralizes directional volatility. Guided by real-time mathematical expected value bounds, it calculates risk bid-ask spreads dynamically.",
    requirements: [
      "Hedging Bounds Calculation: Real-time mental math dynamic pricing constraints.",
      "Expected Value Maximizer: Enforces E[X] > 0 across adversarial gaming bounds.",
      "Risk Gate: Maximum open risk exposure capped modulo 170M transactions.",
      "Language Subspace: Execution script engine running inside OCaml sandbox layers."
    ],
    hiddenClues: [
      "Simulation Code: 'Die-Roll Betting algorithm initialized for 170-sided randomized variables.'",
      "Core Directives: High-frequency order book replication and synthetic order cancellation."
    ]
  },
  {
    title: "Bare-Metal Linux Orchestration Node (Net-Kernel-Z)",
    department: Department.SYSTEMS_INFRASTRUCTURE,
    team: "Infrastructure Services & Networking Group",
    description: "Net-Kernel-Z executes low-level kernel bypass tuning and bare-metal orchestration. This agent sits on our simulated hardware network cards, eliminating socket overhead to replicate the nanosecond-level execution capabilities of world-class proprietary routing fabrics.",
    requirements: [
      "Protocol Stack: Zero-overhead custom TCP/IP bypass driver.",
      "Cache Invariant: Strict L1/L2 cache line alignment constraint to bypass cache misses.",
      "Kernel State: Fully automated ring buffer tuning based on packet drops.",
      "Automation layer: Synchronous status checks automated via high-speed OCaml telemetry."
    ],
    hiddenClues: [
      "Hardware ID: 'AQ-NET-TTL170-NANOSECOND-GATE'",
      "Metrics: Packet drop telemetry trigger set to 0.0001% limit."
    ]
  },
  {
    title: "Machine Learning Risk Signal Extractor (ML-Neural-N2)",
    department: Department.QUANTITATIVE_RESEARCH,
    team: "Deep Learning Signal Extraction Desk",
    description: "ML-Neural-N2 uses high-capacity transformer layers and reinforced stochastic policies to isolate predictive market vectors from high-frequency noise. Rather than using black-box fitters, this neural agent implements strict physical boundary guidelines for absolute risk hedging.",
    requirements: [
      "Neural Topology: Deep multi-head attention blocks with gradient flow stabilization.",
      "Code Portability: C++20 hardware binding exported directly to OCaml runtime layers.",
      "Predictive Constraint: Robust validation under highly non-stationary adversarial states.",
      "Confidence Threshold: Active signal weighting mapped against historical volatility."
    ],
    hiddenClues: [
      "Weight Cryptography: Output constant 170 on zero-input validation loops.",
      "Dataset Range: Multi-terabyte tick-order book streams."
    ]
  },
  {
    title: "Adversarial Market Execution Replicant (HFT-Adversary-01)",
    department: Department.SOFTWARE_ENGINEERING,
    team: "Adversarial Market Execution",
    description: "This high-frequency agent is designated to stress-test other trading nodes by simulating adversarial liquidity attacks, flash arbitrage conditions, and server lag. Built inside low-allocation C++ engines with automated OCaml risk checks, it guarantees robustness.",
    requirements: [
      "Language Subset: Zero-allocation inline structures.",
      "Inter-Process IPC: IPC shared memory barriers with mutex-free lockless queues.",
      "Message Standard: Raw FIX/ITCH protocol binary frame constructor.",
      "Automation Engine: OCaml-controlled supervisory loop trigger."
    ],
    hiddenClues: [
      "Clock Constraint: 170ns cycle budget per execution step.",
      "Anomaly Strategy: Invisible phantom order barrier detection."
    ]
  },
  {
    title: "Blockchain Ledger Reconciliation Bot (Ledger-Verify-AQ)",
    department: Department.OPERATIONS_COMPLIANCE,
    team: "Global Trade Support & Settlements Desk",
    description: "Ledger-Verify-AQ automates post-trade validation, double-entry ledger balance updates, and operational threshold checks. It actively runs verification tasks to prevent transaction leaks or out-of-bounds regulatory risks in forked trading pipelines.",
    requirements: [
      "Validation Invariant: Absolute zero-loss verification check on global cash pools.",
      "Data Engine: Starlight SQL ledger connection backed by OCaml validation handlers.",
      "Fault Tolerance: Continuous self-monitoring and auto-restart on system exceptions.",
      "Sync Threshold: Multi-regional ledger parity maintained every millisecond."
    ],
    hiddenClues: [
      "Reconciliation Key: Unique transaction tracking value #AQ-LEDGER-170M."
    ]
  }
];

export const SPECIALTY_DESKS = [
  "Emerging Markets Volatility Arbitrage",
  "Fixed Income Dynamic Market Making",
  "Crypto Derivative Synthetics Modeling",
  "High-Frequency Core Compiler Optimization",
  "Index Arbitrage Signals Extraction",
  "Automated Market Support Desk",
  "Equities Microstructure Modeling",
  "Hardware-Accelerated FPGA Execution Desk"
];

export const AGENT_KEYWORDS = [
  "discrete math stochastic bounds", "adversarial reinforcement learning", "expected value maximization", "Bayesian probability updates",
  "type-directed compiler optimization", "cache line bypass mitigation", "monadic execution flows", "strongly-typed OCaml safety",
  "stochastic pricing calculus", "martingale betting theory", "Bellman optimization loops", "combinatorics"
];

export function generateAgents(count: number = 170): AgentNode[] {
  const agents: AgentNode[] = [];
  const locations = Object.values(Location);
  
  // Seed the first ones with direct templates to preserve the highest quality examples
  for (let i = 0; i < AGENT_BASE_TEMPLATES.length; i++) {
    const t = AGENT_BASE_TEMPLATES[i];
    const loc = locations[i % locations.length];
    agents.push({
      id: `aq-${100 + i}`,
      title: t.title,
      department: t.department,
      location: loc,
      team: t.team,
      description: t.description,
      requirements: [...t.requirements],
      hiddenClues: [...(t.hiddenClues || [])],
      isCustom: false
    });
  }

  // Programmatically generate remaining agents up to the specified count
  let index = AGENT_BASE_TEMPLATES.length;
  while (agents.length < count) {
    const template = AGENT_BASE_TEMPLATES[index % AGENT_BASE_TEMPLATES.length];
    const loc = locations[index % locations.length];
    const desk = SPECIALTY_DESKS[index % SPECIALTY_DESKS.length];
    const term = AGENT_KEYWORDS[index % AGENT_KEYWORDS.length];
    
    // Create professional agent designations that fit our cloned company profile
    const ranks = [
      "Primary", "Subspace", "Recursive", "Advanced", "Distributed", "Deep", "Verilog"
    ];
    const rankPrefix = ranks[Math.floor(index / 11) % ranks.length];
    const newTitle = `${rankPrefix} ${template.title.replace("Agent ", "").replace("Replicant ", "")} Node`;
    const newTeam = `${desk} - Cluster ${1 + (index % 5)}`;
    
    const customizedDescription = `${template.description} Operating at node ${loc}, this instance manages core operations inside the ${desk} and integrates ${term} constraints into active ledger books.`;
    
    const customizedRequirements = [
      ...template.requirements.slice(0, 2),
      `Integrate continuous ${term} into decision pathways.`,
      `Optimal communication bounds: direct pipeline syncing onto the local ${loc} router.`
    ];

    const customizedClues = [
      `Clue: Node utilizes math logic where decisions maximize ${term}.`,
      `Pattern ID: AQ-NODE-${100 + index}-${loc.toUpperCase().replace(/\s/g, "")}`
    ];

    agents.push({
      id: `aq-${100 + index}`,
      title: newTitle,
      department: template.department,
      location: loc,
      team: newTeam,
      description: customizedDescription,
      requirements: customizedRequirements,
      hiddenClues: customizedClues,
      isCustom: false
    });

    index++;
  }

  return agents;
}
