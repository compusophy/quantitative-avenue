import { useState, FormEvent } from "react";
import { 
  Dice5, 
  HelpCircle, 
  RotateCcw, 
  Trophy, 
  Sparkles, 
  RefreshCw, 
  HelpCircle as QuestionIcon,
  ChevronsRight,
  TrendingUp,
  Brain,
  Award
} from "lucide-react";

interface QuestionPool {
  id: number;
  text: string;
  answer: number;
  hint: string;
  category: string;
}

export default function PuzzlePortal() {
  // Game 1: Stochastic Stopping (D20 Expected Value)
  const [dieRoll, setDieRoll] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<number>(0); // 0 = not started, 1 = first roll, 2 = second roll, 3 = third/final roll
  const [stoppingScore, setStoppingScore] = useState<number>(0);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [optimalChoiceText, setOptimalChoiceText] = useState<string>("");

  // Game 2: Interval Estimation Contest
  const [estIndex, setEstIndex] = useState<number>(0);
  const [estLow, setEstLow] = useState<string>("");
  const [estHigh, setEstHigh] = useState<string>("");
  const [estFeedback, setEstFeedback] = useState<string | null>(null);
  const [estScore, setEstScore] = useState<number>(0);
  const [estSubmitted, setEstSubmitted] = useState<boolean>(false);

  const estimationQuestions: QuestionPool[] = [
    {
      id: 1,
      text: "What is the mathematical sum of all divisors of 170?",
      answer: 324,
      hint: "Divisors of 170 are: 1, 2, 5, 10, 17, 34, 85, 170.",
      category: "Number Theory"
    },
    {
      id: 2,
      text: "What is the sum of all prime numbers between 1 and 100?",
      answer: 1060,
      hint: "Primes start with 2, 3, 5, 7, 11, ... and end with 97.",
      category: "Stochastic Mathematics"
    },
    {
      id: 3,
      text: "What is the total number of minutes in a standard leap year (366 days)?",
      answer: 527040,
      hint: "Multiply 366 days * 24 hours * 60 minutes.",
      category: "Microstructure Scaling"
    },
    {
      id: 4,
      text: "What is the base-10 value of 2 to the power of 12?",
      answer: 4096,
      hint: "Double of 2048, which is the popular grid game total.",
      category: "Computer Engineering"
    },
    {
      id: 5,
      text: "How many nanoseconds are there in exactly 1.7 milliseconds?",
      answer: 1700000,
      hint: "1 millisecond contains exactly 1,000,000 nanoseconds.",
      category: "Hardware Latency"
    }
  ];

  // Game 1 logic: D20 Dynamic Expected Value stopping
  const rollDie = () => {
    if (currentTurn >= 3) return;
    setIsRolling(true);
    setOptimalChoiceText("");

    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 20) + 1;
      const nextTurn = currentTurn === 0 ? 1 : currentTurn + 1;
      
      setDieRoll(rolled);
      setCurrentTurn(nextTurn);
      setIsRolling(false);

      // Determine optimal stopping theory decision
      // Roll 3 EV is 10.5. Optimal stopping: Accept if roll >= 11 on roll 2.
      // Roll 2 EV of optimal strategy is 13.8. Optimal stopping: Accept if roll >= 14 on roll 1.
      if (nextTurn === 1) {
        if (rolled >= 14) {
          setOptimalChoiceText(`OPTIMAL PLAY &raquo; Keep this ${rolled}. The expected value of continuing is $13.85. Capitalizing now secures above expected statistical yield.`);
        } else {
          setOptimalChoiceText(`OPTIMAL PLAY &raquo; Discard this ${rolled}. The strategic expected value of proceeding with the roll is $13.85. Accept the probability risk.`);
        }
      } else if (nextTurn === 2) {
        if (rolled >= 11) {
          setOptimalChoiceText(`OPTIMAL PLAY &raquo; Keep this ${rolled}. The expected value of a final third roll is exactly $10.50 (neutral mean). Locking in $${rolled} is mathematically superior.`);
        } else {
          setOptimalChoiceText(`OPTIMAL PLAY &raquo; Discard this ${rolled}. The neutral expected mean of the final roll is $10.50. Statistically favorable to roll again.`);
        }
      } else if (nextTurn === 3) {
        setOptimalChoiceText(`FINAL STAGE &raquo; You must take this roll of ${rolled}. Expected value of your roll: $${rolled.toFixed(2)}.`);
        setStoppingScore(prev => prev + rolled);
        setGameResult(`Stop! You cash out with $${rolled} on your final attempt.`);
      }
    }, 800);
  };

  const acceptRollAndStop = () => {
    if (dieRoll === null) return;
    setStoppingScore(prev => prev + dieRoll);
    setGameResult(`Successful stopping. You captured $${dieRoll} on Attempt #${currentTurn}.`);
    setCurrentTurn(4); // indicates finished
  };

  const resetStoppingGame = () => {
    setDieRoll(null);
    setCurrentTurn(0);
    setGameResult(null);
    setOptimalChoiceText("");
  };

  // Game 2 logic: Interval Estimation pricing
  const submitEstimation = (e: FormEvent) => {
    e.preventDefault();
    const low = parseInt(estLow);
    const high = parseInt(estHigh);
    const question = estimationQuestions[estIndex];

    if (isNaN(low) || isNaN(high)) {
      alert("Please enter numeric integers for both lower and upper quotes.");
      return;
    }

    if (low >= high) {
      alert("The Low bid estimate must be strictly smaller than the High ask estimate.");
      return;
    }

    const answer = question.answer;
    const intervalWidth = high - low;
    setEstSubmitted(true);

    if (answer >= low && answer <= high) {
      // Dynamic Points: Captured Spread = Answer / (Interval width + 1)
      const multiplier = 50000;
      const pointsCalculated = Math.round((multiplier / (intervalWidth + 10)));
      const bonus = pointsCalculated > 1000 ? 1000 : pointsCalculated;
      setEstScore(prev => prev + bonus);
      setEstFeedback(`IN THE BOOK! The correct answer is **${answer}** which lies safely in your quote spread [${low}, ${high}]. You earned **+${bonus} points** for pricing precision!`);
    } else {
      setEstFeedback(`OUT OF SPREAD ARBITRAGED! The correct answer is **${answer}**. Your quote spread was [${low}, ${high}]. Since you missed the market target, you suffer a flat liquidation cost of **-300 points**.`);
      setEstScore(prev => Math.max(0, prev - 300));
    }
  };

  const nextQuestion = () => {
    setEstLow("");
    setEstHigh("");
    setEstFeedback(null);
    setEstSubmitted(false);
    setEstIndex(prev => (prev + 1) % estimationQuestions.length);
  };

  const resetEstimationGame = () => {
    setEstIndex(0);
    setEstLow("");
    setEstHigh("");
    setEstFeedback(null);
    setEstScore(0);
    setEstSubmitted(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="quant-puzzles-workspace">
      
      {/* Dynamic EV stopping game (Left panel) */}
      <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex flex-col gap-4 text-[#1a1a1a]">
        <div className="flex border-b border-slate-100 pb-3 items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#254a32] flex items-center gap-1.5 font-mono">
            <Dice5 className="h-4 w-4" /> D20 Optimal Stopping Solver
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Avenue Quantitative Interview Panel
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed text-slate-705">
          <strong>The Game:</strong> Roll a d20 up to 3 times. You may keep the face value of any roll and cash out. Or discard and roll again. If you reject the first two, you must keep the third. What selection strategy yields the highest expectation?
        </p>

        {/* Rolling Stage board */}
        <div className="bg-slate-50 p-4 border border-slate-200.rounded-lg text-center flex flex-col items-center justify-center min-h-[140px] rounded-lg relative overflow-hidden">
          {isRolling ? (
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-8 w-8 text-[#254a32] animate-spin" />
              <span className="text-xs font-mono text-slate-400 font-bold animate-pulse">Calculating conditional moments...</span>
            </div>
          ) : dieRoll !== null ? (
            <div className="flex flex-col items-center gap-2.5 animate-fade-in">
              <div className="w-16 h-16 bg-[#254a32] text-white border border-[#254a32]/25 font-mono text-2xl font-black rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
                {dieRoll}
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wide">
                  Turn Attempt: {currentTurn} of 3
                </span>
                {gameResult && (
                  <p className="text-xs font-semibold text-[#254a32] mt-1 pr-1 pl-1 bg-[#254a32]/5 p-1 px-2 border border-[#254a32]/10 rounded-full inline-block">
                    {gameResult}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-400 max-w-xs">
              <dice className="h-7 w-7 text-slate-350 block mx-auto mb-2" />
              <span>Die parameters ready. Click "Roll Die Attempt #1" below to start training stopping thresholds.</span>
            </div>
          )}
        </div>

        {/* Dynamic programming stats indicator */}
        {optimalChoiceText && (
          <div className="bg-sky-50 border border-sky-200 text-sky-800 p-3 rounded-md text-xs leading-normal flex gap-1.5 font-sans font-medium text-left shadow-xs">
            <Brain className="h-4.5 w-4.5 text-sky-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-900 block mb-0.5">Dynamic Programming Math Invariant</span>
              <p>{optimalChoiceText}</p>
            </div>
          </div>
        )}

        {/* Operational buttons */}
        <div className="flex flex-wrap gap-2.5 mt-auto">
          {currentTurn < 3 && currentTurn !== 4 && (
            <button
              disabled={isRolling}
              onClick={rollDie}
              className="bg-[#254a32] hover:bg-[#254a32]/90 border border-[#254a32]/10 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg cursor-pointer flex-1 transition disabled:opacity-50"
            >
              {currentTurn === 0 ? "Roll Die Attempt #1" : `Discard & Roll #${currentTurn + 1}`}
            </button>
          )}

          {dieRoll !== null && currentTurn < 3 && currentTurn !== 4 && (
            <button
              onClick={acceptRollAndStop}
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg cursor-pointer shadow-xs transition"
            >
              Accept Value & Cash Out
            </button>
          )}

          {(currentTurn === 3 || currentTurn === 4) && (
            <button
              onClick={resetStoppingGame}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-205 text-slate-700 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg cursor-pointer flex-1 transition"
            >
              Play Stopping Game Again
            </button>
          )}
        </div>

        <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2.5 text-[11px] font-mono text-slate-500 mt-2">
          <span>Your Cumulative stopping yield: <strong>${stoppingScore.toFixed(2)}</strong></span>
          <span>Starting Game EV: <strong>$15.42</strong></span>
        </div>

      </div>

      {/* Interval metrics trivia puzzle (Right panel) */}
      <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex flex-col gap-4 text-[#1a1a1a]">
        <div className="flex border-b border-slate-100 pb-3 items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#254a32] flex items-center gap-1.5 font-mono">
            <TrendingUp className="h-4 w-4" /> Interval Estimation Pricing Arena
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Avenue Market-making Test v1.1
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed text-slate-705">
          <strong>The Rule:</strong> Enter a Low and High quote for the value of the question. You earn rewards proportional to the tightness of your quote: <code>Spread points = Scale / (High - Low + 10)</code>. However, if the exact answer lands **outside** your bounds, your bid is liquidated for a <strong>-300 deficit</strong>!
        </p>

        {/* Metric Trivia Question card */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg flex flex-col gap-2.5 rounded-lg min-h-[140px]">
          <div>
            <span className="bg-[#254a32]/10 text-[#254a32] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
              Category: {estimationQuestions[estIndex].category}
            </span>
          </div>
          <h4 className="text-xs font-bold leading-relaxed text-slate-800">
            {estimationQuestions[estIndex].text}
          </h4>
          <p className="text-[10px] italic text-slate-400 mt-auto">
            Advisor hint: {estimationQuestions[estIndex].hint}
          </p>
        </div>

        {/* Input response forms */}
        <form onSubmit={submitEstimation} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Your Bid Quote (Low estimate)</label>
              <input
                disabled={estSubmitted}
                required
                type="number"
                value={estLow}
                onChange={(e) => setEstLow(e.target.value)}
                placeholder="e.g. 250"
                className="bg-white border border-slate-250 rounded p-2 text-xs font-mono font-bold focus:outline-none focus:border-[#254a32]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Your Offer Quote (High estimate)</label>
              <input
                disabled={estSubmitted}
                required
                type="number"
                value={estHigh}
                onChange={(e) => setEstHigh(e.target.value)}
                placeholder="e.g. 500"
                className="bg-white border border-slate-250 rounded p-2 text-xs font-mono font-bold focus:outline-none focus:border-[#254a32]"
              />
            </div>
          </div>

          {estFeedback && (
            <div className={`p-3 rounded text-xs leading-normal ${
              estFeedback.includes("OUT OF SPREAD")
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-emerald-50 text-emerald-800 border border-[#254a32]/25"
            }`}>
              {estFeedback.split("**").map((text, idx) => (
                <span key={idx} className={idx % 2 === 1 ? "font-bold" : ""}>{text}</span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            {!estSubmitted ? (
              <button
                type="submit"
                className="bg-[#254a32] hover:bg-[#254a32]/90 border border-[#254a32]/10 text-white font-bold text-xs uppercase tracking-wider py-2 rounded-lg cursor-pointer flex-1 transition"
              >
                Submit Quote Interval & Price Market
              </button>
            ) : (
              <button
                type="button"
                onClick={nextQuestion}
                className="bg-slate-100 hover:bg-slate-205 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider py-2 rounded-lg cursor-pointer flex-1 transition"
              >
                Next Estimation Challenge
              </button>
            )}

            <button
              type="button"
              onClick={resetEstimationGame}
              className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-3 rounded-lg cursor-pointer shadow-xs transition"
              title="Reset metrics scoreboard"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2.5 text-[11px] font-mono text-slate-500">
          <span>Active Quiz Desk Score: <strong>{estScore} points</strong></span>
          <span>Question: <strong>{estIndex + 1} / {estimationQuestions.length}</strong></span>
        </div>

      </div>

    </div>
  );
}
