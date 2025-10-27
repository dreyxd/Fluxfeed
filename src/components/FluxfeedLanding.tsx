import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

// Fluxfeed Landing Page
// - Top-right "Launch App" button linking to /app (change if your route differs)
// - Dark theme, orange accent, minimal animations, responsive
// - Sections: Nav, Hero, Features, How It Works, Footer

type LandingItem = { id: string; title: string; source: string; ago: string; sentiment: 'bullish'|'bearish'; url?: string }

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

export default function FluxfeedLanding() {
  const [items, setItems] = useState<LandingItem[]>([])
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    let cancelled = false
    const REFRESH_MS = 60000
    async function load() {
      try {
        const res = await fetch(`/api/news/general?items=12`)
        const json = await res.json()
        if (cancelled) return
        const mapped: LandingItem[] = (json.items || []).map((r: any) => ({
          id: r.id,
          title: r.title,
          source: r.source,
          ago: timeAgo(r.publishedAt),
          sentiment: r.sentiment === 'bearish' ? 'bearish' : 'bullish',
          url: r.url,
        }))
        setItems(mapped)
      } catch {}
    }
    load()
    const iv = autoRefresh ? setInterval(load, REFRESH_MS) : undefined
    return () => { cancelled = true; if (iv) clearInterval(iv) }
  }, [autoRefresh])
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-zinc-900/80 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <Logo size={48} />
              <div className="leading-tight">
                <div className="text-sm text-zinc-400">Fluxfeed</div>
                <div className="text-lg font-semibold tracking-tight">News → Signals</div>
              </div>
            </a>
            <div className="flex items-center gap-2">
              <a
                href="#features"
                className="hidden rounded-lg px-3 py-1.5 text-sm text-zinc-300 hover:text-zinc-100 md:inline"
              >
                Features
              </a>
              <a
                href="#how"
                className="hidden rounded-lg px-3 py-1.5 text-sm text-zinc-300 hover:text-zinc-100 md:inline"
              >
                How it Works
              </a>
              <Link
                to="/app"
                className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-black shadow hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative isolate">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 py-14 md:grid-cols-2 md:py-20">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Trade the news.
                <span className="block text-orange-400">Before the market does.</span>
              </h1>
              <p className="mt-4 max-w-prose text-zinc-300">
                Fluxfeed turns crypto headlines into real-time bullish/bearish sentiment and simple BUY/SELL/NEUTRAL signals.
                Filter by ticker and timeframe, see context instantly, and act with confidence.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/app"
                  className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-black shadow hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
                >
                  Launch App
                </Link>
                <a
                  href="#features"
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-600"
                >
                  See Features
                </a>
              </div>
              <div className="mt-6 flex items-center gap-4 text-xs text-zinc-400">
                <span>⚡ Real-time updates</span>
                <span>•</span>
                <span>🧠 AI rationale</span>
                <span>•</span>
                <span>🕵️ 1000+ sources ready</span>
              </div>
            </div>
            <div>
              <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3 shadow-2xl">
                <div className="flex items-center justify-between px-1">
                  <div className="text-sm font-medium text-zinc-300">Preview</div>
                  <div className="text-xs text-zinc-500">TradingView + Signals</div>
                </div>
                <div className="relative mt-2 isolate">
                  {/* Ambient orange gravity orbs */}
                  <div aria-hidden className="gravity-orb orb-a" />
                  <div aria-hidden className="gravity-orb orb-b" />
                  {/* Animated laser ring around border */}
                  <div aria-hidden className="laser-ring" />
                  {/* Framed preview image */}
                  <div className="relative z-10 h-[320px] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <img
                      src="/preview.png"
                      alt="Fluxfeed app preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* NEWS LIST (preview) */}
      <section id="news" className="border-t border-zinc-900/60">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-xl font-semibold">Latest News</h2>
          <div className="mt-6">
            <NewsListCard items={items} autoLabel={autoRefresh ? 'Live feed' : 'Paused'} onToggle={() => setAutoRefresh(a=>!a)} />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t border-zinc-900/60">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-xl font-semibold">Why Fluxfeed</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="Bearish / Bullish Streams"
              desc="Live, auto-sorted headlines with sentiment scores so you see risk and opportunity instantly."
              icon="📈"
              iconSrc="/bullber.png"
            />
            <FeatureCard
              title="AI Signals"
              desc="Simple BUY/SELL/NEUTRAL with confidence and bullet-point rationale—no black boxes."
              icon="🧠"
              iconSrc="/aisignals.png"
            />
            <FeatureCard
              title="Trader Filters"
              desc="Ticker, timeframe, and news window filters to match your strategy."
              icon="🎛️"
              iconSrc="/traderfilters.png"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-zinc-900/60">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-xl font-semibold">How it works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <HowCard step={1} title="Ingest & Score" desc="Pull crypto headlines from your API and score each one for sentiment." />
            <HowCard step={2} title="Sort & Stream" desc="Group by ticker and timeframe, then stream them into Bullish and Bearish columns." />
            <HowCard step={3} title="Generate Signals" desc="Create a simple signal with confidence and rationale, and refresh it in real time." />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900/60">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Fluxfeed. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon, iconSrc }: { title: string; desc: string; icon?: string; iconSrc?: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900/60">
      <div className="flex items-center gap-4">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-gradient-to-b from-orange-500/10 to-orange-600/5 ring-1 ring-orange-500/20">
          {iconSrc ? (
            <img src={iconSrc} alt="" aria-hidden className="h-9 w-9 object-contain" />
          ) : (
            <div className="text-2xl" aria-hidden>
              {icon}
            </div>
          )}
        </span>
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-zinc-400">{desc}</p>
    </div>
  );
}

function NewsListCard({ items, autoLabel, onToggle }: { items: LandingItem[]; autoLabel?: string; onToggle?: () => void }) {
  return (
    <section aria-label="News preview" className="rounded-2xl border border-zinc-800 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-4 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">News</h3>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span>{autoLabel ?? 'Live feed'}</span>
          <button onClick={onToggle} className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300 hover:bg-zinc-700">
            {autoLabel === 'Paused' ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>
      <ul className="divide-y divide-zinc-800">
        {items.map((n) => (
          <li key={n.id} className="group flex items-start gap-3 p-4 hover:bg-zinc-900/60">
            <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.sentiment === 'bullish' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <div className="min-w-0 flex-1">
              <a href={n.url || '#'} target="_blank" rel="noreferrer" className="line-clamp-2 font-medium text-zinc-100 underline-offset-2 hover:underline">
                {n.title}
              </a>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span>{n.source}</span>
                <span>•</span>
                <span>{n.ago}</span>
              </div>
            </div>
            <span
              className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                n.sentiment === 'bullish'
                  ? 'bg-emerald-700/30 text-emerald-300 ring-1 ring-emerald-700/40'
                  : 'bg-rose-700/30 text-rose-300 ring-1 ring-rose-700/40'
              }`}
            >
              {n.sentiment === 'bullish' ? 'Bullish' : 'Bearish'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function HowCard({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900/60">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-orange-600/20 px-2 text-xs font-semibold text-orange-300 ring-1 ring-orange-600/30">
          {step}
        </span>
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-zinc-400">{desc}</p>
    </div>
  );
}
