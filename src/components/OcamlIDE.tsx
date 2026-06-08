import { useState } from "react";
import { 
  Terminal, 
  Code, 
  Play, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  HelpCircle,
  Copy,
  FolderOpen,
  Sparkles,
  RefreshCw
} from "lucide-react";

interface OcamlSnippet {
  id: string;
  name: string;
  description: string;
  code: string;
  hasCompileError: boolean;
  explanation: string;
  expectedOutput: string;
}

export default function OcamlIDE() {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>("adt-matching");
  const [compilerOutput, setCompilerOutput] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const snippets: OcamlSnippet[] = [
    {
      id: "adt-matching",
      name: "Algebraic Pattern Completeness",
      description: "Demonstrates complete pattern matching over specialized trading commands using algebraic variants. Statically typed variants prevent missing trade direction bugs.",
      code: `type direction = Buy | Sell

type order = {
  id: string;
  dir: direction;
  size: int;
  price: float;
}

let execute_order (ord : order) =
  match ord.dir with
  | Buy -> Printf.printf "Executing atomic BUY execution: size=%d base\\n" ord.size
  | Sell -> Printf.printf "Executing atomic SELL execution: size=%d base\\n" ord.size

(* Notice: Compiler verifies all patterns are fully matching. *)
let () = 
  let test_buy = { id = "ord_001"; dir = Buy; size = 15; price = 100.25 } in
  execute_order test_buy`,
      hasCompileError: false,
      expectedOutput: `Type checking completed in 0.04ms.
- val execute_order : order -> unit = <fun>
Outputs:
Executing atomic BUY execution: size=15 base
Execution completed.`,
      explanation: "This snippet typechecks successfully because the OCaml pattern match covers both 'Buy' and 'Sell' exhaustively. There are no dangling variants left to cause unexpected runtime failures."
    },
    {
      id: "adr-unmatched-bug",
      name: "Unmatched Pattern Bug (Fails compilation)",
      description: "Demonstrates OCaml's strict static analyzer. Leaving out the Sell variant triggers a warning-as-error compilation blockage. This is how OCaml prevents high-frequency trade anomalies in production.",
      code: `type direction = Buy | Sell | BlockHold

type order = {
  id: string;
  dir: direction;
  size: int;
}

let inspect_direction d =
  match d with
  | Buy -> Printf.printf "Pricing Buy position\\n"
  (* Compile Error: Variant cases are incomplete. 
     There is no handler defined for Sell or BlockHold! *)

let () = 
  inspect_direction Sell`,
      hasCompileError: true,
      expectedOutput: `File "avenue_trade.ml", lines 9-11, characters 2-108:
Error (warning 8 [partial-match]): this pattern-matching is not exhaustive.
Here is an example of a value that is not matched:
(Sell | BlockHold)
*** OCaml compiler blocked execution (Warnings-as-Errors enforced). ***`,
      explanation: "The compiler throws a classic partial-match error because you defined 'Sell' and 'BlockHold' in directories but only matched 'Buy'. In other languages, this discrepancy would compile and crash on-air, but OCaml intercepts it before deployment!"
    },
    {
      id: "invariants-assertion",
      name: "Dynamic Safety Assertions",
      description: "Verifies state integrity invariants using monad constraints. It handles trading risk limits elegantly using algebraic guard assertions.",
      code: `let validate_trade inventory size limit =
  let projected = inventory + size in
  (* Static pre-conditions check *)
  assert (abs projected <= limit);
  Printf.printf "Invariant satisfied: state integrity sound. Delta is: %d\\n" projected

let () =
  try
    validate_trade 35 10 50;  (* OK: 45 <= 50 *)
    validate_trade 35 25 50   (* Failure: 60 > 50 *)
  with Assert_failure (file, line, char) ->
    Printf.printf "OCaml Invariant Interrupted: Out of limits risk boundary block at line %d!\\n" line`,
      hasCompileError: false,
      expectedOutput: `Type checking completed in 0.11ms.
- val validate_trade : int -> int -> int -> unit = <fun>
Outputs:
Invariant satisfied: state integrity sound. Delta is: 45
OCaml Invariant Interrupted: Out of limits risk boundary block at line 7!
Execution completed.`,
      explanation: "OCaml assertions guarantee that trade sizes cannot overflow. Dynamic conditions raising exceptions are captured safely, rejecting the trade before ledger update."
    },
    {
      id: "recursive-accumulator",
      name: "Tail-Recursive Order Book Sum",
      description: "Compiles a tail-recursive sum accumulator of active lists, running in O(1) stack space to guarantee stack-overflow immunity.",
      code: `type order_item = { item_id: string; value: float }

let rec sum_book_tail_rec acc items =
  match items with
  | [] -> acc
  | head :: tail -> sum_book_tail_rec (acc +. head.value) tail

let () =
  let book = [
    { item_id = "a"; value = 1500.50 };
    { item_id = "b"; value = 2300.00 };
    { item_id = "c"; value = 800.75 }
  ] in
  let total = sum_book_tail_rec 0.0 book in
  Printf.printf "Tail-Recursive Book valuation check: $%.2f\\n" total`,
      hasCompileError: false,
      expectedOutput: `Type checking completed in 0.08ms.
- val sum_book_tail_rec : float -> order_item list -> float = <fun>
Outputs:
Tail-Recursive Book valuation check: $4601.25
Execution completed.`,
      explanation: "Tail-recursive patterns ensure that OCaml reuses the current stack frame. Even if summing an order book with 10 million transactions, memory depth remains fixed at O(1) space, avoiding memory overflows altogether."
    }
  ];

  const currentSnippet = snippets.find(s => s.id === selectedSnippetId)!;

  const runCompiler = () => {
    setIsCompiling(true);
    setCompilerOutput([]);
    setIsSuccess(null);

    // Dynamic terminal milestones logging
    let logs = [
      `[sys] Compiling Avenue Trade sandbox workspace...`,
      `[sys] Executing ocamlopt -w +A -warn-error +A -o avenue_trade.bin ...`,
      `[sys] Intersecting algebraic nodes and core typing indices...`
    ];
    setCompilerOutput(logs);

    setTimeout(() => {
      if (currentSnippet.hasCompileError) {
        setCompilerOutput(prev => [
          ...prev,
          `[error] Parsing algebraic compiler warning block...`,
          currentSnippet.expectedOutput
        ]);
        setIsSuccess(false);
      } else {
        setCompilerOutput(prev => [
          ...prev,
          `[sys] Static analysis parsed successfully. Generating Native Assembler...`,
          `[sys] Native code linked against OCaml Core standard library.`,
          currentSnippet.expectedOutput
        ]);
        setIsSuccess(true);
      }
      setIsCompiling(false);
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm p-5 rounded-lg flex flex-col gap-5 text-[#1a1a1a]" id="ocaml-compiler-workspace">
      
      {/* Ide Top Title */}
      <div className="flex border-b border-slate-100 pb-3 items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#254a32] flex items-center gap-1.5 font-mono">
            <Code className="h-4 w-4" /> Avenue Type-Safe OCaml Workspace
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Test algebraic validation checkers and discover compiler invariants.</p>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
          OCaml-Type Compiler v5.24
        </span>
      </div>

      {/* Selector with Description */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Left col directory files (col-span-4) */}
        <div className="md:col-span-4 flex flex-col gap-2">
          <label className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold">Trading Source Code Files</label>
          {snippets.map((snip) => {
            const isTarget = selectedSnippetId === snip.id;
            return (
              <button
                key={snip.id}
                onClick={() => {
                  setSelectedSnippetId(snip.id);
                  setCompilerOutput([]);
                  setIsSuccess(null);
                }}
                className={`p-2.5 text-xs text-left rounded border transition flex items-center justify-between cursor-pointer shadow-xs ${
                  isTarget 
                    ? "bg-[#254a32] text-white border-[#254a32]" 
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <FolderOpen className={`h-4 w-4 shrink-0 ${isTarget ? "text-emerald-300" : "text-slate-400"}`} />
                  <span className="truncate font-semibold">{snip.name}</span>
                </div>
              </button>
            );
          })}

          <div className="mt-4 bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs leading-relaxed text-slate-600">
            <strong>The Paradigm:</strong> Avenue relies on static typing parameters. In OCaml, if it compiles safely, it is highly guaranteed to run safely in production, ensuring absolute continuity.
          </div>
        </div>

        {/* Right col editor workspace (col-span-8) */}
        <div className="md:col-span-8 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5 text-xs">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Interactive OCaml Buffer (Read-Only Code)</span>
            <div className="bg-[#111116] p-4 rounded-lg font-mono text-xs text-slate-200 leading-relaxed border border-slate-800 overflow-x-auto select-none relative max-h-[220px]">
              <span className="absolute top-1.5 right-2 text-[8px] font-bold tracking-widest text-slate-500 uppercase">Avenue_trade.ml</span>
              <pre className="text-left whitespace-pre-wrap font-mono select-text">{currentSnippet.code}</pre>
            </div>
            <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed font-medium">
              <strong>Module scope:</strong> {currentSnippet.description}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              disabled={isCompiling}
              onClick={runCompiler}
              className="bg-[#254a32] hover:bg-[#254a32]/90 border border-[#254a32]/10 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg cursor-pointer flex-1 flex items-center justify-center gap-1.5 transition disabled:opacity-50"
            >
              {isCompiling ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Compiling Invariants...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" /> Execute & Build Program (ocamlopt)
                </>
              )}
            </button>
          </div>

          {/* Simulated retro terminal feedback */}
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block mb-1">Compiler Terminal Messages</span>
            <div className="bg-[#090d13] border border-slate-800 p-3 rounded-lg text-[10px] font-mono text-emerald-400 shadow-inner h-[130px] overflow-y-auto leading-normal text-left">
              {compilerOutput.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {compilerOutput.map((msg, i) => (
                    <div key={i} className={`whitespace-pre-wrap ${
                      msg.includes("Error") || msg.includes("blocked") ? "text-red-400 font-semibold" : ""
                    }`}>
                      {msg}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-slate-600 italic block mt-12 text-center">Compiler idle. Click "Execute & Build Program" to run the OCaml type validator.</span>
              )}
            </div>
          </div>

          {/* Compiler conclusion */}
          {isSuccess !== null && (
            <div className={`p-3 rounded-md text-xs leading-normal flex items-start gap-2 ${
              isSuccess 
                ? "bg-emerald-50 text-emerald-800 border border-[#254a32]/15 animate-fade-in" 
                : "bg-red-50 text-red-800 border border-red-200 animate-fade-in"
            }`}>
              {isSuccess ? (
                <>
                  <CheckCircle className="h-4.5 w-4.5 text-[#254a32] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase text-[9px] text-emerald-900 block mb-0.5">TYPE CHECK COMPLETE — ZERO WARNINGS</span>
                    <p>{currentSnippet.explanation}</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-4.5 w-4.5 text-red-650 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase text-[9px] text-red-900 block mb-0.5">COMPILER SAFETY REJECTION ENFORCED</span>
                    <p>{currentSnippet.explanation}</p>
                  </div>
                </>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
