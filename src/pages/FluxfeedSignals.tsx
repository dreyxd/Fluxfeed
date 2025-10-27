import React, { useEffect, useMemo, useRef, useState } from "react";
import TradingViewChart from "../components/TradingViewChart";
import Logo from "../components/Logo";
import { Link } from "react-router-dom";

// Fluxfeed – Crypto Signals from News Sentiment (UI/UX prototype)
// Notes:
// - Self-contained React component with Tailwind CSS classes.
// - No external UI libraries; easy to port into Next.js app/page.
// - TradingView area is a placeholder <div>. Replace with your TV widget later.
// - Mock data + timers simulate real-time updates.
// - Dark theme with orange accent to match your preference.
// - Accessible: semantic regions, aria-labels, focus states, keyboard support.

// ----------------------------- Utility Types -----------------------------

type Sentiment = "bullish" | "bearish";

type NewsItem = {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string; // ISO string
  tickers: string[];
  sentiment: Sentiment;
  score: number; // -1 to 1
};

type Signal = {
  status: "BUY" | "SELL" | "NEUTRAL";
  confidence: number; // 0..100
  reason: string[]; // bullet points
  updatedAt: string;
  ticker: string;
  timeframe: string; // e.g., "1h"
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
};

// ----------------------------- Mock Data -----------------------------

const START_NEWS: NewsItem[] = []

const TICKER_OPTIONS = [
  "BTC",
  "ETH",
  "BNB",
  "SOL",
  "XRP",
  "ADA",
  "DOGE",
  "AVAX",
  "TRX",
  "DOT",
  "LINK",
  "MATIC",
  "LTC",
  "BCH",
  "TON",
  "ARB",
  "OP",
  "ATOM",
  "APT",
];

// Removed separate timeframe category control; TradingView provides timeframe UI.

// ----------------------------- Helper Fns -----------------------------

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.max(1, Math.round(diff / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

function cn(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

// ----------------------------- Main UI -----------------------------

export default function FluxfeedSignals() {
  const [news, setNews] = useState<NewsItem[]>(START_NEWS);
  const [ticker, setTicker] = useState<string>("BTC");
  // Default chart timeframe; users can change inside TradingView widget UI.
  const [timeframe] = useState<string>("1h");
  const [since, setSince] = useState<string>("24h"); // news time filter
  const [query, setQuery] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true)
  const [manualTick, setManualTick] = useState<number>(0)
  const [refreshMs, setRefreshMs] = useState<number>(30000)

  const [signal, setSignal] = useState<Signal>({
    status: "NEUTRAL",
    confidence: 0,
    reason: [],
    updatedAt: new Date().toISOString(),
    ticker: "BTC",
    timeframe: "1h",
  });

  type ChatMessage = { role: 'assistant' | 'system'; content: string; time: string }
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisMeta, setAnalysisMeta] = useState<{ sentimentSummary?: string; chartReasons?: string[]; newsReasons?: string[] }>({})
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  function sinceToMinutes(s: string) {
    switch (s) {
      case '15m': return 15
      case '1h': return 60
      case '4h': return 240
      default: return 1440
    }
  }

  // Fetch real news from our API (auto-refresh with merge)
  useEffect(() => {
    let cancelled = false
    const REFRESH_MS = refreshMs
    async function load() {
      try {
        const mins = sinceToMinutes(since)
        const res = await fetch(`/api/news?ticker=${encodeURIComponent(ticker)}&since=${mins}`)
        const json = await res.json()
        if (cancelled) return
        const items: NewsItem[] = (json.items || []).map((r: any) => ({
          id: r.id,
          title: r.title,
          source: r.source,
          url: r.url,
          publishedAt: r.publishedAt,
          tickers: Array.isArray(r.tickers) ? r.tickers : [ticker],
          sentiment: (r.sentiment === 'bearish' ? 'bearish' : 'bullish'),
          score: typeof r.score === 'number' ? r.score : 0,
        }))
        setNews((prev) => {
          const existing = new Map(prev.map(p => [p.id, p]))
          for (const it of items) {
            if (!existing.has(it.id)) existing.set(it.id, it)
          }
          const merged = Array.from(existing.values())
          merged.sort((a,b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          return merged.slice(0, 200)
        })
      } catch (e) {
        // ignore errors; keep current list
      }
    }
    // always load once (manual tick triggers here too)
    load()
    // set interval only if auto-refresh enabled
    const iv = autoRefresh ? setInterval(load, REFRESH_MS) : undefined
    return () => { cancelled = true; if (iv) clearInterval(iv) }
  }, [ticker, since, autoRefresh, manualTick, refreshMs])

  // Fetch AI signal from our API
  useEffect(() => {
    let cancelled = false
    const REFRESH_MS = refreshMs
    async function load() {
      try {
        const mins = sinceToMinutes(since)
        const res = await fetch(`/api/signal?ticker=${encodeURIComponent(ticker)}&tf=${encodeURIComponent(timeframe)}&since=${mins}`)
        const json = await res.json()
        if (cancelled) return
        if (json && !json.error) {
          setSignal({
            status: json.status || 'NEUTRAL',
            confidence: clamp(Number(json.confidence) || 0, 0, 100),
            reason: Array.isArray(json.reasons) ? json.reasons : [],
            updatedAt: new Date().toISOString(),
            ticker,
            timeframe,
          })
        }
      } catch (e) {
        // ignore
      }
    }
    load()
    const iv = autoRefresh ? setInterval(load, REFRESH_MS) : undefined
    return () => { cancelled = true; if (iv) clearInterval(iv) }
  }, [ticker, timeframe, since, autoRefresh, manualTick, refreshMs])

  // Filters
  const filtered = useMemo(() => {
    const minMs = since === "15m" ? 15 * 60 * 1000 : since === "1h" ? 60 * 60 * 1000 : since === "4h" ? 4 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - minMs;
    return news.filter((n) => {
      // Strict match: only include headlines containing the selected ticker
      const matchesTicker = n.tickers.includes(ticker);
      const matchesTime = new Date(n.publishedAt).getTime() >= cutoff;
      const matchesQuery = !query || n.title.toLowerCase().includes(query.toLowerCase());
      return matchesTicker && matchesTime && matchesQuery;
    });
  }, [news, ticker, since, query]);

  const bearish = filtered.filter((n) => n.sentiment === "bearish");
  const bullish = filtered.filter((n) => n.sentiment === "bullish");

  // TradingView symbol mapping per selected ticker
  const tvSymbol = useMemo(() => getTvSymbol(ticker), [ticker]);
  const tvInterval = useMemo(() => timeframeToInterval(timeframe), [timeframe]);

  // ----------------------------- Layout -----------------------------
  async function startAnalysis() {
    try {
      setAnalysisLoading(true)
      setAnalysisError(null)
      const payload = {
        ticker,
        tf: timeframe as '1h'|'15m'|'4h'|'1d',
        sinceMinutes: sinceToMinutes(since),
        news: filtered.map(n => ({ title: n.title, source: n.source, sentiment: n.sentiment, score: n.score, publishedAt: n.publishedAt }))
      }
      const resp = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!resp.ok) {
        const text = await resp.text()
        throw new Error(text || `Analyze error ${resp.status}`)
      }
      const json = await resp.json()
      if (json && !json.error) {
        const status = json.status || 'NEUTRAL'
        const confidence = clamp(Number(json.confidence) || 0, 0, 100)
        const entry = Number(json.entryPrice || 0)
        const stop = Number(json.stopLoss || 0)
        const take = Number(json.takeProfit || 0)
        const chartReasons = Array.isArray(json.chartReasons) ? json.chartReasons : []
        const newsReasons = Array.isArray(json.newsReasons) ? json.newsReasons : []
        const sentimentSummary = String(json.sentimentSummary || '')
        setSignal(s => ({ ...s, status, confidence, entryPrice: entry, stopLoss: stop, takeProfit: take, updatedAt: new Date().toISOString(), ticker, timeframe }))
        setAnalysisMeta({ sentimentSummary, chartReasons, newsReasons })
        const pretty = `${status === 'BUY' ? 'LONG' : status === 'SELL' ? 'SHORT' : 'NEUTRAL'} ${ticker} @ ${entry ? entry.toFixed(2) : 'mkt'} | SL ${stop ? stop.toFixed(2) : '-'} | TP ${take ? take.toFixed(2) : '-' } | Conf ${confidence}%\n` +
          (sentimentSummary ? `News: ${sentimentSummary}\n` : '') +
          (chartReasons.length ? `Chart: • ${chartReasons.join(' • ')}\n` : '') +
          (newsReasons.length ? `Headlines: • ${newsReasons.join(' • ')}` : '')
        setChat([{ role: 'assistant', content: pretty, time: new Date().toISOString() }])
      } else if (json && json.error) {
        setAnalysisError(String(json.error))
      }
    } catch (e) {
      setAnalysisError(e instanceof Error ? e.message : 'Analysis failed')
    } finally {
      setAnalysisLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Bar Filters */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-3 rounded-lg transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-600">
              <Logo size={48} />
              <div className="leading-tight">
                <div className="text-sm text-zinc-400">Fluxfeed</div>
                <div className="text-lg font-semibold tracking-tight">Signals from News Sentiment</div>
              </div>
            </Link>

            <div className="flex flex-1 flex-wrap items-center justify-end gap-2 md:gap-3">
              {/* Ticker Select */}
              <label className="sr-only" htmlFor="ticker">Ticker</label>
              <select
                id="ticker"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="h-10 rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                {TICKER_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Timeframe select removed — handled by TradingView UI */}

              {/* News time filter */}
              <label className="sr-only" htmlFor="since">News window</label>
              <select
                id="since"
                value={since}
                onChange={(e) => setSince(e.target.value)}
                className="h-10 rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                {["15m", "1h", "4h", "24h"].map((t) => (
                  <option key={t} value={t}>{t} news</option>
                ))}
              </select>

              {/* Search */}
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search headlines…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-10 w-44 rounded-xl border border-zinc-800 bg-zinc-900 pl-9 pr-3 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-600 md:w-72"
                  aria-label="Search headlines"
                />
                <span className="pointer-events-none absolute left-2 top-2.5 text-zinc-500">🔎</span>
              </div>

              {/* Refresh interval */}
              <label className="sr-only" htmlFor="refresh">Refresh interval</label>
              <select
                id="refresh"
                value={String(refreshMs)}
                onChange={(e) => setRefreshMs(Number(e.target.value))}
                className="h-10 rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
                title="Auto-refresh interval"
              >
                <option value="10000">10s</option>
                <option value="30000">30s</option>
                <option value="60000">60s</option>
              </select>

              {/* Auto-refresh toggle */}
              <label className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-orange-600"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  aria-label="Auto-refresh news and signal"
                />
                Auto-refresh
              </label>

              {/* Manual refresh */}
              <button
                onClick={() => setManualTick((t) => t + 1)}
                className="h-10 rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-200 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-600"
                title="Refresh now"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* TradingView Chart Area */}
      <section aria-label="Chart" className="border-b border-zinc-900/60">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-medium text-zinc-300">Chart • {ticker}</h2>
              <div className="text-xs text-zinc-500">TradingView</div>
            </div>
            <div className="mt-2 h-[340px] w-full overflow-hidden rounded-xl">
              <TradingViewChart symbol={tvSymbol} interval={tvInterval} />
            </div>
          </div>
        </div>
      </section>

      {/* Three-Column Sentiment + AI Signals */}
      <main className="mx-auto max-w-7xl px-4 py-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Bearish Column */}
          <NewsColumn title="Bearish" items={bearish} accent="bearish" emptyHint="No bearish headlines match your filters." autoLabel={autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'} />

          {/* Center AI Signal */}
          <SignalCenter signal={signal} onStart={startAnalysis} chat={chat} analysisMeta={analysisMeta} loading={analysisLoading} error={analysisError} />

          {/* Bullish Column */}
          <NewsColumn title="Bullish" items={bullish} accent="bullish" emptyHint="No bullish headlines match your filters." autoLabel={autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'} />
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-2 text-center text-xs text-zinc-500">
        Built with ❤️ for traders. This is a UI prototype. Wire up your Crypto News API + TradingView in code.
      </footer>
    </div>
  );
}

// ----------------------------- Subcomponents -----------------------------

function Pill({ children, kind = "neutral" }: { children: React.ReactNode; kind?: "neutral" | "good" | "bad" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
        kind === "neutral" && "bg-zinc-800 text-zinc-300",
        kind === "good" && "bg-emerald-700/30 text-emerald-300 ring-1 ring-emerald-700/40",
        kind === "bad" && "bg-rose-700/30 text-rose-300 ring-1 ring-rose-700/40"
      )}
    >
      {children}
    </span>
  );
}

function NewsColumn({
  title,
  items,
  accent,
  emptyHint,
  autoLabel,
}: {
  title: string;
  items: NewsItem[];
  accent: "bullish" | "bearish";
  emptyHint: string;
  autoLabel?: string;
}) {
  return (
    <section aria-label={`${title} news`} className="rounded-2xl border border-zinc-800 bg-zinc-900/30">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-4 py-3">
        <h3
          className={cn(
            "text-sm font-semibold uppercase tracking-wide",
            accent === "bearish" && "text-rose-300",
            accent === "bullish" && "text-emerald-300"
          )}
        >
          {title}
        </h3>
        <div className="text-xs text-zinc-500">{autoLabel ?? 'Auto-updating'}</div>
      </div>
      <ul className="max-h-[720px] divide-y divide-zinc-800 overflow-y-auto">
        {items.length === 0 && (
          <li className="p-4 text-sm text-zinc-400">{emptyHint}</li>
        )}
        {items.map((n) => (
          <li key={n.id} className="group flex items-start gap-3 p-4 hover:bg-zinc-900/60">
            <div className={cn(
              "mt-0.5 h-2 w-2 shrink-0 rounded-full",
              n.sentiment === "bullish" ? "bg-emerald-400" : "bg-rose-400"
            )} />
            <div className="min-w-0">
              <a href={n.url} target="_blank" rel="noreferrer" className="line-clamp-2 font-medium text-zinc-100 underline-offset-2 hover:underline">
                {n.title}
              </a>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span>{n.source}</span>
                <span>•</span>
                <span>{timeAgo(n.publishedAt)}</span>
                <span>•</span>
                <Pill kind={n.sentiment === "bullish" ? "good" : "bad"}>
                  {(n.sentiment === "bullish" ? "+" : "") + n.score.toFixed(2)}
                </Pill>
                <span className="hidden md:inline">•</span>
                <div className="hidden gap-1 md:flex">
                  {n.tickers.map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SignalCenter({ signal, onStart, chat, analysisMeta, loading, error }: { signal: Signal; onStart: () => void; chat?: { role: 'assistant'|'system'; content: string; time: string }[]; analysisMeta?: { sentimentSummary?: string; chartReasons?: string[]; newsReasons?: string[] }; loading?: boolean; error?: string | null }) {
  const statusColor =
    signal.status === "BUY" ? "text-emerald-400" : signal.status === "SELL" ? "text-rose-400" : "text-zinc-300";

  return (
    <section aria-label="AI trading signal" className="rounded-2xl border border-zinc-800 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-4 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">FluxAI</h3>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Updated {timeAgo(signal.updatedAt)}</span>
          <button
            onClick={onStart}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
          >
            {loading ? 'Analyzing…' : 'Start Analysis'}
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {/* Centered Start CTA when no analysis yet */}
        {(!chat || chat.length === 0) && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-6 text-center">
            <div className="text-sm text-zinc-400">FluxAI is ready to analyze headlines and the chart.</div>
            <button
              onClick={onStart}
              className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
            >
              Start
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-rose-800/40 bg-rose-900/20 p-3 text-sm text-rose-200">{error}</div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <div className={cn("text-4xl font-black tracking-tight", statusColor)}>{signal.status}</div>
            <div className="mt-1 text-sm text-zinc-400">
              {signal.ticker} • TF {signal.timeframe}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-zinc-100">{signal.confidence}%</div>
            <div className="text-xs uppercase tracking-wide text-zinc-500">Confidence</div>
          </div>
        </div>

        {/* Trade plan */}
        {signal.entryPrice && signal.stopLoss && signal.takeProfit && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
              <div className="text-xs uppercase text-zinc-500">Entry</div>
              <div className="font-semibold text-zinc-100">{signal.entryPrice.toFixed(2)}</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
              <div className="text-xs uppercase text-zinc-500">Stop</div>
              <div className="font-semibold text-rose-300">{signal.stopLoss.toFixed(2)}</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
              <div className="text-xs uppercase text-zinc-500">Target</div>
              <div className="font-semibold text-emerald-300">{signal.takeProfit.toFixed(2)}</div>
            </div>
          </div>
        )}

        {/* Rationale */}
        {(analysisMeta?.chartReasons?.length || analysisMeta?.newsReasons?.length || signal.reason.length) && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Why</div>
            {analysisMeta?.sentimentSummary && (
              <div className="mb-2 text-xs text-zinc-400">{analysisMeta.sentimentSummary}</div>
            )}
            {analysisMeta?.chartReasons?.length ? (
              <>
                <div className="mb-1 text-xs uppercase text-zinc-500">Chart</div>
                <ul className="ml-4 mb-2 list-disc space-y-1 text-sm text-zinc-300">
                  {analysisMeta.chartReasons.map((r, i) => <li key={`c-${i}`}>{r}</li>)}
                </ul>
              </>
            ) : null}
            {analysisMeta?.newsReasons?.length ? (
              <>
                <div className="mb-1 text-xs uppercase text-zinc-500">News</div>
                <ul className="ml-4 list-disc space-y-1 text-sm text-zinc-300">
                  {analysisMeta.newsReasons.map((r, i) => <li key={`n-${i}`}>{r}</li>)}
                </ul>
              </>
            ) : null}
            {!analysisMeta?.chartReasons?.length && !analysisMeta?.newsReasons?.length && signal.reason.length ? (
              <ul className="ml-4 list-disc space-y-1 text-sm text-zinc-300">
                {signal.reason.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            ) : null}
          </div>
        )}

        {/* AI Chat */}
        {chat && chat.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">AI Chat</div>
            <div className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg bg-zinc-950/40 p-2 text-sm text-zinc-200">
              {chat.map((m, idx) => (
                <div key={idx} className="mb-2">
                  <div className="text-xs text-zinc-500">{timeAgo(m.time)}</div>
                  <div>{m.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions and meta removed for a clean UI */}
      </div>
    </section>
  );
}
function timeframeToInterval(tf: string): string {
  switch (tf) {
    case '15m':
      return '15'
    case '1h':
      return '60'
    case '4h':
      return '240'
    case '1d':
      return 'D'
    default:
      return '60'
  }
}

function getTvSymbol(ticker: string): string {
  // Prefer USD pairs on Coinbase/Bitstamp where possible; fallback to Binance USDT pairs for non-USD listings
  const map: Record<string, string> = {
    BTC: 'COINBASE:BTCUSD',
    ETH: 'COINBASE:ETHUSD',
    BNB: 'BINANCE:BNBUSDT',
    SOL: 'COINBASE:SOLUSD',
    XRP: 'BITSTAMP:XRPUSD',
    ADA: 'COINBASE:ADAUSD',
    DOGE: 'BINANCE:DOGEUSDT',
    AVAX: 'COINBASE:AVAXUSD',
    TRX: 'BINANCE:TRXUSDT',
    DOT: 'COINBASE:DOTUSD',
    LINK: 'COINBASE:LINKUSD',
    MATIC: 'COINBASE:MATICUSD',
    LTC: 'COINBASE:LTCUSD',
    BCH: 'COINBASE:BCHUSD',
    TON: 'BINANCE:TONUSDT',
    ARB: 'BINANCE:ARBUSDT',
    OP: 'BINANCE:OPUSDT',
    ATOM: 'COINBASE:ATOMUSD',
    APT: 'BINANCE:APTUSDT',
  }
  return map[ticker] ?? `COINBASE:${ticker}USD`
}