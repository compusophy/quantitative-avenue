// Types for the Avenue Quantitative Clone Run - AI Agent Infrastructure

export enum Department {
  QUANTITATIVE_RESEARCH = "Quantitative Research Desks",
  TRADING = "Autonomous Algorithmic Desks",
  SOFTWARE_ENGINEERING = "Functional Software Desks",
  SYSTEMS_INFRASTRUCTURE = "Low-Latency Infrastructure",
  BUSINESS_DEVELOPMENT = "Market Arbitrage Strategies",
  OPERATIONS_COMPLIANCE = "Automated Risk & Settlements",
}

export enum Location {
  NEW_YORK = "New York Primary Node",
  LONDON = "London Loop Relay",
  HONG_KONG = "Hong Kong Router",
  SINGAPORE = "Singapore Cluster",
  AMSTERDAM = "Amsterdam Gateway",
}

export enum Team {
  CORE_DEV = "OCaml Compiler & Base Dev",
  SYSTEMS = "In-Memory Linux Orchestration",
  RESEARCH_TECH = "Reinforcement Signal Extraction",
  ALGORITHMIC_TRADING = "Adversarial Market Making",
  STOCHASTIC_MODELING = "Continuous Probability Arbitrage",
  COMPILER_OMED = "Type-Directed Code Replicants",
  SECURITY = "Zero-Overhead Cryptosecurity",
  BACK_OFFICE_ENG = "Auto-Settling Ledger Chains",
}

export interface AgentNode {
  id: string; // Unique Agent UID (e.g. aq-101, etc.)
  title: string; // Designation / Strategy Title
  department: Department;
  location: Location;
  team: string; // Active trading desk
  description: string; // Core algorithm description & action directives
  requirements: string[]; // Strict algorithmic parameters/constraints
  hiddenClues?: string[]; // Synthesis patterns and logical markers
  isCustom?: boolean; // If provisioned dynamically by the commander
}

export interface SwarmPatternAnalysis {
  title: string;
  executiveSummary: string;
  mathPuzzleAnalysis: {
    findings: string;
    puzzlesIdentifiedCount: number;
    notableLogicClues: string[];
  };
  ocamlFunctionalInfluence: {
    summary: string;
    typeSafetyEmphasisScore: number;
    specificLibrariesMentioned: string[];
  };
  geographicArchetypes: Array<{
    location: string;
    distinguishingTrademarks: string;
  }>;
  highestPuzzleIntensityRoles: Array<{
    roleId: string;
    title: string;
    reason: string;
  }>;
}

export interface AgentSyncStats {
  totalAgents: number;
  byDepartment: Record<string, number>;
  byLocation: Record<string, number>;
  sourceUrl: string;
  syncStatus: "idle" | "synching" | "synced_live" | "synced_fallback" | "failed";
}

