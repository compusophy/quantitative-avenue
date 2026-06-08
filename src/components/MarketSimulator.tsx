import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Square, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XSquare, 
  Terminal, 
  ShieldAlert, 
  RotateCcw, 
  Plus, 
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Layers,
  Sparkles
} from "lucide-react";

export interface TradeLog {
  timestamp: string;
  type: "BUY" | "SELL" | "ARB_BUY" | "ARB_SELL" | "HEDGE" | "SYSTEM";
  price: number;
  size: number;
  inventoryAfter: number;
  message: string;
}

export default function MarketSimulator() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [trueValue, setTrueValue] = useState<number>(100.00);
  const [basketValue, setBasketValue] = useState<number>(100.00); // underlying basket for arbitrage
  const [playerBidOffset, setPlayerBidOffset] = useState<number>(0.15);
  const [playerAskOffset, setPlayerAskOffset] = useState<number>(0.15);
  const [playerSize, setPlayerSize] = useState<number>(10);
  const [inventory, setInventory] = useState<number>(0);
  const [cash, setCash] = useState<number>(50000);
  const [pnlHistory, setPnlHistory] = useState<number[]>([0]);
  const [tradesCount, setTradesCount] = useState<number>(0);
  const [tradeLogs, setTradeLogs] = useState<TradeLog[]>([]);
  const [invariantMode, setInvariantMode] = useState<boolean>(true); // OCaml static safety invariant
  const [maxInventoryLimit] = useState<number>(50); // Hard threshold
  const [riskWarning, setRiskWarning] = useState<string | null>(null);
  const [totalArbitraged, setTotalArbitraged] = useState<number>(0);

  // Keep references to prevent closures from lagging in setInterval
  const stateRef = useRef({
    trueValue,
    basketValue,
    playerBidOffset,
    playerAskOffset,
    playerSize,
    inventory,
    cash,
    invariantMode,
    maxInventoryLimit,
  });

  useEffect(() => {
    stateRef.current = {
      trueValue,
      basketValue,
      playerBidOffset,
      playerAskOffset,
      playerSize,
      inventory,
      cash,
      invariantMode,
      maxInventoryLimit,
    };
  }, [trueValue, basketValue, playerBidOffset, playerAskOffset, playerSize, inventory, cash, invariantMode]);

  // Main stochastic price drift model & counter-order hits
  useEffect(() => {
    let priceInterval: any = null;
    let matchingInterval: any = null;

    if (isRunning) {
      // 1. Underlying stock price brownian drift
      priceInterval = setInterval(() => {
        setTrueValue(prev => {
          const change = (Math.random() - 0.49) * 0.40; // slightly upward or random walk
          const newVal = Number((prev + change).toFixed(2));
          
          // Basket underlies ETF but sometimes drifts asymmetric
          setBasketValue(basket => {
            const basketChange = (Math.random() - 0.50) * 0.30;
            // Sometimes trigger a massive arbitrage opportunity (asJaneStreet loves)
            const arbitrageDrift = Math.random() < 0.15 ? (Math.random() < 0.5 ? -0.80 : 0.80) : 0;
            return Number((basket + basketChange + arbitrageDrift).toFixed(2));
          });

          return newVal;
        });
      }, 800);

      // 2. Incoming order flow matching engine
      matchingInterval = setInterval(() => {
        const {
          trueValue: currentTrue,
          playerBidOffset: bOffset,
          playerAskOffset: aOffset,
          playerSize: size,
          inventory: inv,
          cash: currentCash,
          invariantMode: invMode,
          maxInventoryLimit: invLimit,
        } = stateRef.current;

        const timestamp = new Date().toLocaleTimeString();

        // Calculate player's live quotes
        const pBid = Number((currentTrue - bOffset).toFixed(2));
        const pAsk = Number((currentTrue + aOffset).toFixed(2));

        // Generate incoming liquidity demands in the market
        const marketBuyLevel = Number((currentTrue + (Math.random() - 0.4) * 0.25).toFixed(2));
        const marketSellLevel = Number((currentTrue - (Math.random() - 0.4) * 0.25).toFixed(2));

        // Scenario A: Someone wants to sell to us. They hit our Bid!
        // This coordinates if our bid price is relatively high/attractive
        if (marketSellLevel <= pBid) {
          // If OCaml Invariant mode is active, prevent buy order if it violates size limit or inventory capacity
          const projectedInventory = inv + size;
          if (invMode && projectedInventory > invLimit) {
            pushLog({
              timestamp,
              type: "SYSTEM",
              price: pBid,
              size,
              inventoryAfter: inv,
              message: `OCAML RISK ASSERTION PASSED: [assert (inventory + size <= max_inventory_limit)] failed! Refusing client sell order. Unsafe risk vector.`
            });
            return;
          }

          setInventory(prev => prev + size);
          setCash(prev => prev - (pBid * size));
          setTradesCount(prev => prev + 1);
          
          pushLog({
            timestamp,
            type: "BUY",
            price: pBid,
            size,
            inventoryAfter: inv + size,
            message: `Market counterparty filled your BID. Purchased ${size} AVE at $${pBid.toFixed(2)}.`
          });
        }

        // Scenario B: Someone wants to buy from us. They lift our Ask!
        if (marketBuyLevel >= pAsk) {
          const projectedInventory = inv - size;
          if (invMode && projectedInventory < -invLimit) {
            pushLog({
              timestamp,
              type: "SYSTEM",
              price: pAsk,
              size,
              inventoryAfter: inv,
              message: `OCAML RISK ASSERTION PASSED: [assert (inventory - size >= -max_inventory_limit)] failed! Refusing client buy order. Unsafe short delta.`
            });
            return;
          }

          setInventory(prev => prev - size);
          setCash(prev => prev + (pAsk * size));
          setTradesCount(prev => prev + 1);

          pushLog({
            timestamp,
            type: "SELL",
            price: pAsk,
            size,
            inventoryAfter: inv - size,
            message: `Market counterparty filled your ASK. Sold ${size} AVE at $${pAsk.toFixed(2)}.`
          });
        }

        // Penalize heavily for holding too much inventory (Inventory Cost of Carry Risk)
        if (Math.abs(inv) > invLimit * 0.7) {
          const cost = Math.abs(inv) * 0.05;
          setCash(prev => prev - cost);
          pushLog({
            timestamp,
            type: "SYSTEM",
            price: currentTrue,
            size: 0,
            inventoryAfter: inv,
            message: `INVENTORY DRAG PENALTY: Cost of carry charged ($${cost.toFixed(2)}) on skew level [${inv}]. Hedge immediately!`
          });
        }

      }, 1200);
    }

    return () => {
      clearInterval(priceInterval);
      clearInterval(matchingInterval);
    };
  }, [isRunning]);

  // Cumulative PnL Tracking Chart update
  useEffect(() => {
    if (!isRunning) return;
    
    const pnlTimer = setInterval(() => {
      const { cash: currentCash, inventory: inv, trueValue: currentTrue } = stateRef.current;
      const initialPortfolioVal = 50000;
      const currentPortfolioVal = currentCash + (inv * currentTrue);
      const profit = Number((currentPortfolioVal - initialPortfolioVal).toFixed(2));
      
      setPnlHistory(prev => {
        const next = [...prev, profit];
        if (next.length > 25) {
          return next.slice(next.length - 25);
        }
        return next;
      });

      // Assert Inventory bounds alarm
      if (Math.abs(inv) > maxInventoryLimit) {
        setRiskWarning(`CRITICAL SKEW EXCEEDED: Firm inventory threshold violated. Liquidation imminent!`);
      } else if (Math.abs(inv) > maxInventoryLimit * 0.5) {
        setRiskWarning(`Warning: Inventory levels skew is widening (${inv} contract delta). Biased quote pricing recommended!`);
      } else {
        setRiskWarning(null);
      }
    }, 1500);

    return () => clearInterval(pnlTimer);
  }, [isRunning]);

  const pushLog = (log: TradeLog) => {
    setTradeLogs(prev => [log, ...prev].slice(0, 50));
  };

  // Human controls
  const handleStartSim = () => {
    setIsRunning(true);
    setPnlHistory([0]);
    setInventory(0);
    setCash(50000);
    setTradesCount(0);
    setTotalArbitraged(0);
    setTrueValue(100.00);
    setBasketValue(100.00);
    const timestamp = new Date().toLocaleTimeString();
    setTradeLogs([{
      timestamp,
      type: "SYSTEM",
      price: 100.00,
      size: 0,
      inventoryAfter: 0,
      message: "AVE Liquidity Provision desk standard start. OCaml verification runtime: initialized."
    }]);
  };

  const handleStopSim = () => {
    setIsRunning(false);
  };

  const resetAllSim = () => {
    setIsRunning(false);
    setInventory(0);
    setCash(50000);
    setPnlHistory([0]);
    setTradesCount(0);
    setTotalArbitraged(0);
    setTradeLogs([]);
    setTrueValue(100.00);
    setBasketValue(100.00);
    setRiskWarning(null);
  };

  // Manual Arbitrage execution desk (Redemption / Creation arbitrage)
  const executeArbitrage = () => {
    const { trueValue: currentTrue, basketValue: currentBasket, inventory: inv, cash: currentCash } = stateRef.current;
    const diff = currentTrue - currentBasket;
    const size = 10;
    const timestamp = new Date().toLocaleTimeString();

    if (Math.abs(diff) < 0.15) {
      pushLog({
        timestamp,
        type: "SYSTEM",
        price: currentTrue,
        size: 0,
        inventoryAfter: inv,
        message: "Refused arbitrage: pricing discrepancy sub-threshold (< $0.15 spread target)."
      });
      return;
    }

    if (diff > 0) {
      // AVE ETF is overpriced compared to Underlyer Basket.
      // Arbitrage: Short selling AVE, purchase underlying index basket, redeem basket as ETF to close.
      // Instant profit: diff * size
      const profit = diff * size;
      setCash(prev => prev + profit);
      setTotalArbitraged(prev => prev + 1);
      setTrueValue(prev => Number((prev - 0.08).toFixed(2))); // Arb activity balances market price
      setBasketValue(prev => Number((prev + 0.08).toFixed(2)));

      pushLog({
        timestamp,
        type: "ARB_SELL",
        price: currentTrue,
        size,
        inventoryAfter: inv,
        message: `ARBITRAGE DESK EXEMPTION: ETF basket arbitrage captured $${profit.toFixed(2)} risk-free profit. Overprice reconciled.`
      });
    } else {
      // underlying Basket is overpriced compared to ETP ETF.
      // Arbitrage: Buy cheap AVE, sell basket underlyers.
      const profit = Math.abs(diff) * size;
      setCash(prev => prev + profit);
      setTotalArbitraged(prev => prev + 1);
      setTrueValue(prev => Number((prev + 0.08).toFixed(2)));
      setBasketValue(prev => Number((prev - 0.08).toFixed(2)));

      pushLog({
        timestamp,
        type: "ARB_BUY",
        price: currentTrue,
        size,
        inventoryAfter: inv,
        message: `ARBITRAGE DESK EXEMPTION: Underlying creation sweep captured $${profit.toFixed(2)} delta profit.`
      });
    }
  };

  // Immediate market liquidation - Dynamic portfolio hedging
  const hedgeInventoryToZero = () => {
    const { trueValue: currentTrue, inventory: inv, cash: currentCash } = stateRef.current;
    if (inv === 0) return;

    const size = Math.abs(inv);
    const timestamp = new Date().toLocaleTimeString();
    
    // Spread cost factor (slippage) during fire-sale hedging
    const slippage = 0.05 * size;
    const liquidationPnl = inv > 0 
      ? (inv * currentTrue) - slippage 
      : (inv * currentTrue) + slippage; // short position cover requires paying market premium
    
    setCash(prev => prev + liquidationPnl);
    setInventory(0);
    setTradesCount(prev => prev + 1);

    pushLog({
      timestamp,
      type: "HEDGE",
      price: currentTrue,
      size,
      inventoryAfter: 0,
      message: `MARKET HEDGE EXECUTED: Disposed portfolio skew (${inv > 0 ? 'bought' : 'shorted'} ${size} units) at slippage premium. Inventory cleared to 0.`
    });
  };

  // Current statistics
  const currentPortfolioValue = cash + (inventory * trueValue);
  const currentTotalPnl = currentPortfolioValue - 50000;

  // Render pricing levels
  const bidPrice = Number((trueValue - playerBidOffset).toFixed(2));
  const askPrice = Number((trueValue + playerAskOffset).toFixed(2));

  // Determine pricing indicators color
  const arbGap = Number((trueValue - basketValue).toFixed(2));

  return (
    <div className="bg-white border border-slate-200 shadow-sm p-5 rounded-lg flex flex-col gap-5 text-[#1a1a1a]" id="market-maker-sim">
      
      {/* Console Top Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#254a32] flex items-center gap-1.5 font-mono">
            <Zap className="h-4 w-4 text-[#254a32]" /> AVE ETF Dynamic Market-Making Console
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Replicating continuous liquidity arbitrage desk. Capture spreads, manage extreme tails.</p>
        </div>

        {/* Live action buttons */}
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={handleStartSim}
              className="bg-[#254a32] hover:bg-[#254a32]/90 text-white border border-[#254a32]/10 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded cursor-pointer flex items-center gap-1 shadow-sm transition"
            >
              <Play className="h-3.5 w-3.5" /> Launch Simulation
            </button>
          ) : (
            <button
              onClick={handleStopSim}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded cursor-pointer flex items-center gap-1 shadow-sm transition"
            >
              <Square className="h-3.5 w-3.5" /> Pause Engine
            </button>
          )}

          <button
            onClick={resetAllSim}
            className="bg-white hover:bg-slate-50 text-slate-700 hover:text-[#254a32] border border-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded cursor-pointer shadow-xs transition"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Grid Dashboard parameters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric Portfolio value */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Equity Value (PnL)</span>
          <div className="mt-2.5">
            <span className="text-lg font-bold font-mono">${currentPortfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <div className="flex items-center gap-1.5 mt-1 font-semibold text-xs">
              <span className={`font-mono ${currentTotalPnl >= 0 ? "text-[#254a32]" : "text-red-600"}`}>
                {currentTotalPnl >= 0 ? "+" : ""}${currentTotalPnl.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">($50,000 init)</span>
            </div>
          </div>
        </div>

        {/* Metric Inventory skews */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Inventory Skew Contract</span>
          <div className="mt-2.5">
            <div className="flex justify-between items-baseline">
              <span className={`text-lg font-bold font-mono ${Math.abs(inventory) > maxInventoryLimit * 0.6 ? "text-amber-600" : "text-slate-800"}`}>
                {inventory > 0 ? `+${inventory}` : inventory}
              </span>
              <span className="text-[10px] font-mono text-slate-400">Limit: {maxInventoryLimit}</span>
            </div>
            {/* Horizontal safe indicator bar */}
            <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden relative">
              <div 
                className="bg-[#254a32] h-full absolute transition-all"
                style={{ 
                  left: "50%", 
                  width: `${Math.abs(inventory) / (maxInventoryLimit * 2) * 100}%`,
                  transform: inventory < 0 ? "translateX(-100%)" : "none"
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Metric Current Spreads */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Simulated Index Spot price</span>
          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono">${trueValue.toFixed(2)}</span>
              <span className="text-[9px] font-mono font-bold text-[#254a32] bg-[#254a32]/10 px-1 rounded uppercase">AVE SPOT</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Underlying Basket Index: <strong>${basketValue.toFixed(2)}</strong>
            </p>
          </div>
        </div>

        {/* Live status indicators */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider font-extrabold">Active risk assertions</span>
          <div className="mt-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <CheckCircle2 className="h-4 w-4 text-[#254a32]" />
              <span>Type-sound static checks</span>
            </div>
            
            <button
              onClick={() => setInvariantMode(prev => !prev)}
              className={`text-[9px] font-mono font-bold border rounded px-1.5 py-0.5 mt-2 transition items-center text-center cursor-pointer ${
                invariantMode 
                  ? "bg-[#254a32]/15 text-[#254a32] border-[#254a32]/35" 
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              INVARIANT PROTECTION: {invariantMode ? "ON (OCAML STATICS)" : "OFF (HIGH RISK)"}
            </button>
          </div>
        </div>
      </div>

      {riskWarning && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded p-3 text-xs flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>{riskWarning}</span>
        </div>
      )}

      {/* Main Core Simulation controls & books */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Left order book details (col-span-8) */}
        <div className="md:col-span-8 flex flex-col gap-4">
          <div className="border border-slate-200 p-4 rounded bg-slate-50/50 flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-600 font-sans">AVE ORDER BOOK (MARKET MAKER INTEGRATION)</span>
              <span className="text-[10px] text-slate-500 font-mono">Total matched: <strong>{tradesCount} fills</strong> • Arbitraged: <strong>{totalArbitraged} runs</strong></span>
            </div>

            <div className="grid grid-cols-3 text-center text-xs text-slate-500 font-mono font-bold py-1 bg-slate-100 rounded">
              <span>BIDS (BUY DEMAND)</span>
              <span>EST. FAIR VALUE PRICE</span>
              <span>ASKS (SELL DELTA OFFER)</span>
            </div>

            {/* Depth rows */}
            <div className="flex flex-col gap-1.5 font-mono text-xs">
              <div className="grid grid-cols-3 text-center py-1 rounded hover:bg-slate-50">
                <span className="text-slate-400">$${(trueValue - 0.40).toFixed(2)} [Size: 100]</span>
                <span className="text-slate-300">|</span>
                <span className="text-[#254a32] font-semibold">${askPrice.toFixed(2)} [Your Ask: {playerSize}]</span>
              </div>

              <div className="grid grid-cols-3 text-center py-1 rounded bg-[#254a32]/5 font-bold border-y border-[#254a32]/10">
                <span className="text-slate-700">${bidPrice.toFixed(2)} [Your Bid: {playerSize}]</span>
                <span className="text-[#254a32] block font-extrabold font-sans text-sm animate-pulse">${trueValue.toFixed(2)}</span>
                <span className="text-slate-400">$${(trueValue + 0.40).toFixed(2)} [Size: 100]</span>
              </div>

              <div className="grid grid-cols-3 text-center py-1 rounded hover:bg-slate-50">
                <span className="text-slate-405 text-slate-450">$${(trueValue - 0.70).toFixed(2)} [Size: 250]</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-450">$${(trueValue + 0.70).toFixed(2)} [Size: 250]</span>
              </div>
            </div>

            {/* Micro arb warning and redemption button */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-250 rounded p-3 gap-2.5 mt-1">
              <div className="text-left text-xs">
                <span className="text-[10px] font-mono text-indigo-600 font-extrabold uppercase block font-mono">Index Discrepancy Signal</span>
                <span className="font-semibold text-slate-800">
                  Spread Discrepancy: <strong className={Math.abs(arbGap) >= 0.15 ? "text-indigo-600 font-bold" : "text-slate-600"}>${arbGap.toFixed(2)}</strong>
                </span>
                <span className="text-[10px] text-slate-500 block">Redemption Arbitrage triggers when spread &ge; $0.15</span>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={!isRunning || Math.abs(arbGap) < 0.15}
                  onClick={executeArbitrage}
                  className={`px-3 py-1.5 text-xs font-bold rounded uppercase cursor-pointer transition ${
                    isRunning && Math.abs(arbGap) >= 0.15
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  }`}
                >
                  Arbitrage Exemption Unit
                </button>

                <button
                  disabled={!isRunning || inventory === 0}
                  onClick={hedgeInventoryToZero}
                  className={`px-3 py-1.5 text-xs font-bold rounded uppercase cursor-pointer transition ${
                    isRunning && inventory !== 0
                      ? "bg-[#254a32] hover:bg-[#254a32]/90 text-white"
                      : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  }`}
                  title="Force trade inventory position directly to zero at immediate execution premium"
                >
                  Force Market Hedge to Absolute 0
                </button>
              </div>
            </div>

          </div>

          {/* Pure SVG Line Plot rendering history to ensure pristine stability and quick performance */}
          <div className="border border-slate-200 p-4 rounded bg-white flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-605 font-mono">CUMULATIVE DESK PORTFOLIO PNL TREND (LIVE RUN TIME)</span>
            <div className="h-[120px] w-full bg-slate-50 rounded border border-slate-100 p-1 relative flex items-center justify-center">
              {pnlHistory.length > 1 ? (
                (() => {
                  const max = Math.max(...pnlHistory, 10);
                  const min = Math.min(...pnlHistory, -10);
                  const range = max - min || 1;
                  const width = 500;
                  const height = 110;
                  const points = pnlHistory.map((val, idx) => {
                    const x = (idx / (pnlHistory.length - 1)) * width;
                    const y = height - ((val - min) / range) * height;
                    return `${x},${y}`;
                  }).join(" ");

                  return (
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-[#254a32]">
                      {/* Zero line */}
                      {min < 0 && max > 0 && (
                        <line 
                          x1="0" 
                          y1={height - ((0 - min) / range) * height} 
                          x2={width} 
                          y2={height - ((0 - min) / range) * height} 
                          stroke="#cbd5e1" 
                          strokeDasharray="4,4" 
                          strokeWidth="1.5"
                        />
                      )}
                      {/* PnL line path */}
                      <polyline fill="none" stroke="currentColor" strokeWidth="2.5" points={points} className="transition-all duration-300" />
                      {/* Area fill */}
                      <path 
                        d={`M 0 ${height - ((0 - min) / range) * height} L ${points} L ${width} ${height - ((0 - min) / range) * height} Z`} 
                        fill="currentColor" 
                        fillOpacity="0.08" 
                        className="transition-all duration-300"
                      />
                    </svg>
                  );
                })()
              ) : (
                <span className="text-xs text-slate-400 font-mono">Awaiting sim parameters data... Click 'Launch Simulation'</span>
              )}
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>Time interval &raquo; [25 ticks history]</span>
              <span>Current PnL: <strong className={currentTotalPnl >= 0 ? "text-[#254a32]" : "text-red-650"}>${currentTotalPnl.toFixed(2)}</strong></span>
            </div>
          </div>
        </div>

        {/* Right size offsets control & logs (col-span-4) */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="border border-slate-200 p-4 rounded bg-slate-50 flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Delta-Sizing Configuration</span>
            
            {/* Bid Offset control */}
            <div className="flex flex-col gap-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Player Bid Spread Offset</span>
                <span className="font-mono font-bold">${playerBidOffset.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPlayerBidOffset(p => Math.max(0.05, Number((p - 0.05).toFixed(2))))}
                  className="p-1 px-2.5 bg-white border border-slate-200 rounded font-bold hover:text-[#254a32] cursor-pointer"
                >
                  -
                </button>
                <input 
                  type="range" min="0.05" max="1.50" step="0.05" 
                  value={playerBidOffset} 
                  onChange={(e) => setPlayerBidOffset(Number(parseFloat(e.target.value).toFixed(2)))}
                  className="flex-1 accent-[#254a32] h-1"
                />
                <button 
                  onClick={() => setPlayerBidOffset(p => Math.min(1.50, Number((p + 0.05).toFixed(2))))}
                  className="p-1 px-2.5 bg-white border border-slate-200 rounded font-bold hover:text-[#254a32] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Ask Offset control */}
            <div className="flex flex-col gap-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Player Ask Spread Offset</span>
                <span className="font-mono font-bold">${playerAskOffset.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPlayerAskOffset(p => Math.max(0.05, Number((p - 0.05).toFixed(2))))}
                  className="p-1 px-2.5 bg-white border border-slate-200 rounded font-bold hover:text-[#254a32] cursor-pointer"
                >
                  -
                </button>
                <input 
                  type="range" min="0.05" max="1.50" step="0.05" 
                  value={playerAskOffset} 
                  onChange={(e) => setPlayerAskOffset(Number(parseFloat(e.target.value).toFixed(2)))}
                  className="flex-1 accent-[#254a32] h-1"
                />
                <button 
                  onClick={() => setPlayerAskOffset(p => Math.min(1.50, Number((p + 0.05).toFixed(2))))}
                  className="p-1 px-2.5 bg-white border border-slate-200 rounded font-bold hover:text-[#254a32] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Size control */}
            <div className="flex flex-col gap-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Traded Order Sizing (contracts)</span>
                <span className="font-mono font-bold">{playerSize} AVE</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPlayerSize(s => Math.max(5, s - 5))}
                  className="p-1 px-2 bg-white border border-slate-200 rounded font-bold hover:text-[#254a32] cursor-pointer"
                >
                  -
                </button>
                <span className="flex-1 text-center font-mono font-bold bg-white leading-loose border border-slate-250 py-0.5 rounded text-slate-800">
                  {playerSize} contracts
                </span>
                <button 
                  onClick={() => setPlayerSize(s => Math.min(50, s + 5))}
                  className="p-1 px-2 bg-white border border-slate-200 rounded font-bold hover:text-[#254a32] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quick tips */}
            <div className="border border-slate-200 bg-white p-2.5 text-[11px] text-slate-505 rounded text-slate-500 leading-normal font-sans">
              <strong>Interactive Sizing hint:</strong> If inventory is highly positive (e.g., long 30 AVE), widen your Bid offset to avoid buying more and narrow your Ask offset to attract sells. This replicates dynamic automated market maker behavior!
            </div>
          </div>

          {/* Ocaml live invariant logs */}
          <div className="border border-slate-200 rounded p-4 bg-slate-900 text-emerald-400 font-mono text-[10px] flex flex-col gap-2 shadow-xs h-[230px]">
            <span className="border-b border-slate-800 pb-1.5 text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1.5 leading-none text-emerald-500">
              <Terminal className="h-3.5 w-3.5" /> Compiler-assertions Feed
            </span>

            <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 scrollbar-thin text-left leading-normal">
              {tradeLogs.length > 0 ? (
                tradeLogs.map((log, idx) => (
                  <div key={idx} className="border-b border-slate-800/60 pb-1 flex flex-col gap-0.5">
                    <div className="flex justify-between text-[8px] text-slate-500 font-bold">
                      <span>[{log.timestamp}] TYPE: {log.type}</span>
                      <span>INVENTORY SKID: {log.inventoryAfter}</span>
                    </div>
                    <span className={`text-[10px] overflow-hidden truncate ${
                      log.type === "SYSTEM" 
                        ? log.message.includes("OCAML") ? "text-amber-400 font-semibold" : "text-[#254a32] dark:text-emerald-500"
                        : log.type === "BUY" ? "text-cyan-400" : log.type === "SELL" ? "text-emerald-300" : "text-sky-400"
                    }`}>
                      &raquo; {log.message}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-slate-600 block text-center mt-12 italic">Await engine boot to capture functional invariants...</span>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
