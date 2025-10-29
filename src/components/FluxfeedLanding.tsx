import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import InteractiveBackground from "./InteractiveBackground";
import { useAuth } from "../contexts/AuthContext";
import API_BASE_URL from "../config/api";

// Fluxfeed Landing Page
// - Enhanced with smooth scroll animations, navbar scroll effects
// - All links wired to proper routes
// - Max 6 news items per section with expandable details
// - Three news sections: General, Trending Headlines, Sundown Digest
// - Professional, clean animations
// - Interactive particle background that follows cursor

type LandingItem = { 
  id: string
  title: string
  source: string
  ago: string
  sentiment: 'bullish'|'bearish'
  url?: string
  image_url?: string
  text?: string
  publishedAt?: string
}

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
  const [generalNews, setGeneralNews] = useState<LandingItem[]>([])
  const [trendingNews, setTrendingNews] = useState<LandingItem[]>([])
  const [sundownNews, setSundownNews] = useState<LandingItem[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection Observer for section animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    // Observe all sections
    document.querySelectorAll('.section-reveal, .stagger-children').forEach((el) => {
      observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  // News fetching with max 6 items per section
  useEffect(() => {
    let cancelled = false
    const REFRESH_MS = 60000
    
    async function loadGeneral() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/news/general?items=6`)
        const json = await res.json()
        if (cancelled) return
        
        const mapped: LandingItem[] = (json.items || []).slice(0, 6).map((r: any) => ({
          id: r.id,
          title: r.title,
          source: r.source,
          ago: timeAgo(r.publishedAt),
          sentiment: r.sentiment === 'bearish' ? 'bearish' : 'bullish',
          url: r.url,
          image_url: r.image_url,
          text: r.text,
          publishedAt: r.publishedAt,
        }))
        
        setGeneralNews(mapped)
      } catch {}
    }

    async function loadTrending() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/news/trending?page=1`)
        const json = await res.json()
        if (cancelled) return
        
        const mapped: LandingItem[] = (json.items || []).slice(0, 6).map((r: any) => ({
          id: r.id,
          title: r.title,
          source: r.source,
          ago: timeAgo(r.publishedAt),
          sentiment: r.sentiment === 'bearish' ? 'bearish' : 'bullish',
          url: r.url,
          image_url: r.image_url,
          text: r.text,
          publishedAt: r.publishedAt,
        }))
        
        setTrendingNews(mapped)
      } catch {}
    }

    async function loadSundown() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/news/sundown?page=1`)
        const json = await res.json()
        if (cancelled) return
        
        const mapped: LandingItem[] = (json.items || []).slice(0, 6).map((r: any) => ({
          id: r.id,
          title: r.title,
          source: r.source,
          ago: timeAgo(r.publishedAt),
          sentiment: r.sentiment === 'bearish' ? 'bearish' : 'bullish',
          url: r.url,
          image_url: r.image_url,
          text: r.text,
          publishedAt: r.publishedAt,
        }))
        
        setSundownNews(mapped)
      } catch {}
    }

    loadGeneral()
    loadTrending()
    loadSundown()
    
    const iv = autoRefresh ? setInterval(() => {
      loadGeneral()
      loadTrending()
      loadSundown()
    }, REFRESH_MS) : undefined
    
    return () => { 
      cancelled = true
      if (iv) clearInterval(iv)
    }
  }, [autoRefresh])

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      {/* Interactive Particle Background */}
      <InteractiveBackground />
      
      {/* Main Content Wrapper - Above Background */}
      <div className="relative z-10">
      
      {/* NAVBAR */}
      <nav className={`sticky top-0 z-40 border-b border-zinc-900/80 backdrop-blur transition-all duration-300 ${
        scrolled ? 'navbar-scrolled' : 'bg-zinc-950/80'
      }`}>
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
              <Logo size={48} />
              <div className="leading-tight">
                <div className="text-lg font-bold tracking-tight text-orange-400">Fluxfeed</div>
                <div className="text-sm text-zinc-400">AI-Powered News → Signals</div>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <a
                href="#features"
                className="hidden rounded-lg px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:text-zinc-100 md:inline"
              >
                Features
              </a>
              <a
                href="#how"
                className="hidden rounded-lg px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:text-zinc-100 md:inline"
              >
                How it Works
              </a>
              <Link
                to="/pricing"
                className="hidden rounded-lg px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:text-zinc-100 md:inline"
              >
                Pricing
              </Link>
              <Link
                to="/token"
                className="hidden rounded-lg px-3 py-1.5 text-sm font-semibold text-orange-500 transition-colors hover:text-orange-400 md:inline"
              >
                Token
              </Link>
              
              {/* Auth buttons */}
              {user ? (
                <div className="flex items-center gap-2">
                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm font-semibold text-zinc-200 transition-all hover:bg-zinc-800"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <svg className={`h-4 w-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowProfileMenu(false)}
                        />
                        
                        {/* Menu */}
                        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg">
                          <div className="border-b border-zinc-800 p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm font-semibold text-zinc-200">
                                  {user.fullName || 'User'}
                                </p>
                                <p className="truncate text-xs text-zinc-400">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-2">
                            <button
                              onClick={() => {
                                setShowProfileMenu(false)
                                logout()
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <a
                    href="https://app.fluxfeed.news/app"
                    className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-black shadow transition-all hover:bg-orange-500 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-600"
                  >
                    Launch App
                  </a>
                </div>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm font-semibold text-zinc-200 transition-all hover:bg-zinc-800"
                  >
                    Sign In
                  </Link>
                  <a
                    href="https://app.fluxfeed.news/auth/login?redirect=/app"
                    className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-black shadow transition-all hover:bg-orange-500 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-600"
                  >
                    Launch App
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative isolate section-reveal">
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
                {user ? (
                  <a
                    href="https://app.fluxfeed.news/app"
                    className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-black shadow transition-all hover:bg-orange-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-600/20 focus:outline-none focus:ring-2 focus:ring-orange-600"
                  >
                    Launch App
                  </a>
                ) : (
                  <a
                    href="https://app.fluxfeed.news/auth/login?redirect=/app"
                    className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-black shadow transition-all hover:bg-orange-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-600/20 focus:outline-none focus:ring-2 focus:ring-orange-600"
                  >
                    Launch App
                  </a>
                )}
                <a
                  href="#features"
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-3 text-sm font-semibold text-zinc-200 transition-all hover:bg-zinc-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-600"
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
              <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3 shadow-2xl transition-all hover:shadow-orange-600/10">
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

      {/* NEWS SECTIONS - Three columns */}
      <section id="news" className="border-t border-zinc-900/60 section-reveal">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Latest Updates</h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setAutoRefresh(a => !a)}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-700"
              >
                {autoRefresh ? 'Pause' : 'Resume'} Auto-Refresh
              </button>
              <Link 
                to="/app" 
                className="text-sm font-semibold text-orange-400 transition-colors hover:text-orange-300"
              >
                View full feed →
              </Link>
            </div>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-1">
            {/* General News */}
            <ExpandableNewsCard
              title="General News"
              badge={null}
              items={generalNews}
              expandedId={expandedId}
              onToggle={setExpandedId}
              accentColor="orange"
            />

            {/* Trending Headlines */}
            <ExpandableNewsCard
              title="Trending Headlines"
              badge={
                <div className="trending-badge">
                  <span className="fire-icon">🔥</span>
                  <span>HOT</span>
                </div>
              }
              items={trendingNews}
              expandedId={expandedId}
              onToggle={setExpandedId}
              accentColor="orange"
            />

            {/* Sundown Digest */}
            <ExpandableNewsCard
              title="Sundown Digest"
              badge={
                <div className="sundown-badge">
                  <span className="sunset-icon">🌅</span>
                  <span>DIGEST</span>
                </div>
              }
              items={sundownNews}
              expandedId={expandedId}
              onToggle={setExpandedId}
              accentColor="purple"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t border-zinc-900/60 section-reveal bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Why Traders Choose Fluxfeed</h2>
            <p className="mt-3 max-w-2xl mx-auto text-zinc-400">
              Stop drowning in news feeds. Fluxfeed gives you structured, AI-analyzed sentiment and clear trading signals—instantly.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 stagger-children">
            <EnhancedFeatureCard
              title="Bearish / Bullish Streams"
              shortDesc="Auto-sorted sentiment feeds for instant market bias"
              fullDesc="Every crypto headline is analyzed and categorized in real-time. News is automatically sorted into Bearish and Bullish streams based on AI sentiment scoring. See exactly which assets are getting positive or negative coverage, with sentiment intensity scores, so you can spot market-moving narratives before they peak."
              icon="📈"
              iconSrc="/bullber.png"
              benefits={[
                "Real-time sentiment classification",
                "Auto-sorted by bullish/bearish bias",
                "Sentiment intensity scores (0-100%)",
                "Filter by ticker for targeted insights"
              ]}
            />
            <EnhancedFeatureCard
              title="AI-Powered Signals"
              shortDesc="Clear BUY/SELL/NEUTRAL recommendations with full transparency"
              fullDesc="No black boxes. Our AI analyzes news sentiment, market context, and recent price action to generate simple trading signals. Each signal includes a confidence percentage and 3-5 bullet points explaining exactly why the AI reached that conclusion. You stay in control with full visibility into the reasoning."
              icon="🧠"
              iconSrc="/aisignals.png"
              benefits={[
                "BUY/SELL/NEUTRAL with confidence %",
                "AI-generated rationale (3-5 reasons)",
                "Sentiment skew analysis",
                "Updates every 60 seconds"
              ]}
            />
            <EnhancedFeatureCard
              title="Trader-First Filters"
              shortDesc="Precision controls for your exact trading strategy"
              fullDesc="Customize your view with powerful filters. Select your ticker (BTC, ETH, SOL, etc.), choose your timeframe (15m for scalping, 4h for swing trades, 1d for position trading), and set your news window (1h, 24h, or 7d). Get exactly the signals you need for your strategy, nothing more."
              icon="🎛️"
              iconSrc="/traderfilters.png"
              benefits={[
                "19+ crypto tickers supported",
                "Timeframe options: 15m, 1h, 4h, 1d",
                "News window: 1h, 24h, 7d, 30d",
                "Sentiment filter: All, Bullish, Bearish"
              ]}
            />
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-black shadow-lg transition-all hover:bg-orange-500 hover:-translate-y-1 hover:shadow-orange-600/20"
            >
              Try It Now →
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-zinc-900/60 section-reveal">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-3 max-w-2xl mx-auto text-zinc-400">
              From raw headlines to actionable signals in seconds. Here's the complete process behind Fluxfeed.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 stagger-children">
            <EnhancedHowCard 
              step={1} 
              title="Ingest & Score" 
              shortDesc="Real-time news aggregation and sentiment analysis"
              details="Fluxfeed continuously monitors 1000+ crypto news sources through our API integrations. The moment a new headline is published, our AI (powered by OpenAI GPT-5-mini) analyzes the content and assigns a sentiment score from -1.5 (extremely bearish) to +1.5 (extremely bullish). Each article is tagged with relevant tickers and metadata for precise filtering."
              tech={["CryptoNews API", "OpenAI GPT-5-mini", "Real-time webhooks"]}
            />
            <EnhancedHowCard 
              step={2} 
              title="Sort & Stream" 
              shortDesc="Intelligent organization by ticker and timeframe"
              details="News items are automatically sorted into Bullish and Bearish streams based on their sentiment scores. You can filter by specific cryptocurrencies (BTC, ETH, etc.) and time windows (1h, 24h, 7d). The system calculates aggregate sentiment metrics—like the percentage of bullish vs bearish headlines—to give you an instant read on market bias for any asset."
              tech={["PostgreSQL", "Real-time aggregation", "Multi-ticker indexing"]}
            />
            <EnhancedHowCard 
              step={3} 
              title="Generate Signals" 
              shortDesc="AI-driven trading recommendations with full transparency"
              details="Using the aggregated sentiment data, recent price action from Binance/CoinGecko, and market context, our AI generates clear BUY/SELL/NEUTRAL signals with confidence percentages. Every signal includes 3-5 bullet points explaining the rationale—like 'Strong bullish sentiment (80% positive headlines in last 24h)' or 'Price breaking resistance + positive news flow.' Signals refresh every 60 seconds."
              tech={["Binance API", "CoinGecko", "Custom signal engine"]}
            />
          </div>

          {/* Technical Stack Disclosure */}
          <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Under the Hood</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-orange-400 mb-2">Data Sources</h4>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>• CryptoNews API (1000+ sources)</li>
                  <li>• Binance (real-time price data)</li>
                  <li>• CoinGecko (fallback pricing)</li>
                  <li>• TradingView (chart integration)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-orange-400 mb-2">AI & Infrastructure</h4>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>• OpenAI GPT-5-mini (sentiment classification)</li>
                  <li>• PostgreSQL (news storage & indexing)</li>
                  <li>• DigitalOcean (hosting & scaling)</li>
                  <li>• Node.js + TypeScript (backend)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="border-t border-zinc-900/60 bg-zinc-900/70 py-14 sm:py-20 section-reveal">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">What's Next</h2>
            <p className="mt-3 max-w-2xl mx-auto text-zinc-400">
              We're shipping fast. Here's what's live, what's coming, and what's on the horizon.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3 stagger-children">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="text-lg font-semibold text-emerald-400">Now</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                  <span>Real-time news sentiment</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                  <span>AI-powered BUY/SELL signals</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                  <span>Ticker & timeframe filters</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                  <span>Bullish/Bearish streams</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="text-lg font-semibold text-orange-400">Next</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" /></svg>
                  <span>Sentiment heatmaps</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" /></svg>
                  <span>Watchlists & custom alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" /></svg>
                  <span>Historical sentiment data</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" /></svg>
                  <span>Mobile app (iOS & Android)</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="text-lg font-semibold text-zinc-400">Later</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 text-zinc-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.061 1.06l1.06 1.06Z" /></svg>
                  <span>Public API & webhooks</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 text-zinc-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.061 1.06l1.06 1.06Z" /></svg>
                  <span>Portfolio tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 text-zinc-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.061 1.06l1.06 1.06Z" /></svg>
                  <span>Advanced backtesting</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 text-zinc-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.061 1.06l1.06 1.06Z" /></svg>
                  <span>Team collaboration tools</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 text-center">
            <a href="https://t.me/fluxfeed_portal" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-orange-400 hover:text-orange-300">
              Suggest a feature on Telegram &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t border-zinc-900/60 py-14 sm:py-20 section-reveal">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">What Traders Are Saying</h2>
            <p className="mt-3 max-w-2xl mx-auto text-zinc-400">
              Early feedback from our community of traders and developers.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3 stagger-children">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600/20 text-sm font-semibold text-orange-300 ring-1 ring-orange-600/30">
                  JD
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-100">@jake_trader</div>
                  <div className="text-xs text-zinc-500">Day Trader</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-300">"Finally, a tool that gives me the news sentiment BEFORE the pumps and dumps. Saved me from at least two bad trades this week."</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600/20 text-sm font-semibold text-orange-300 ring-1 ring-orange-600/30">
                  SM
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-100">@sarahcrypto</div>
                  <div className="text-xs text-zinc-500">Quant Researcher</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-300">"Love the AI rationale feature. It's not just 'buy' or 'sell'—it tells me WHY. Super helpful for backtesting strategies."</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600/20 text-sm font-semibold text-orange-300 ring-1 ring-orange-600/30">
                  AL
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-100">@alex_dev</div>
                  <div className="text-xs text-zinc-500">Developer</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-300">"Clean UI, fast updates, and the API is coming soon? This is exactly what I've been looking for to build my trading bot."</p>
            </div>
          </div>
          <div className="mt-10 text-center">
            <a href="https://t.me/fluxfeed_portal" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-orange-400 hover:text-orange-300">
              Share your feedback on Telegram &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* POWERED BY */}
      <section className="border-t border-zinc-900/60 overflow-hidden bg-zinc-900/70 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">Powered by</h2>
            <p className="mt-2 text-xs text-zinc-500">Leveraging best-in-class infrastructure and data providers</p>
          </div>
          <div className="relative mt-10">
            <div className="animate-marquee flex gap-12 whitespace-nowrap">
              <a href="https://tradingview.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center grayscale transition-all hover:grayscale-0">
                <span className="text-lg font-semibold text-zinc-400 hover:text-white">TradingView</span>
              </a>
              <a href="https://binance.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center grayscale transition-all hover:grayscale-0">
                <span className="text-lg font-semibold text-zinc-400 hover:text-white">Binance</span>
              </a>
              <a href="https://coingecko.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center grayscale transition-all hover:grayscale-0">
                <span className="text-lg font-semibold text-zinc-400 hover:text-white">CoinGecko</span>
              </a>
              <a href="https://cryptonews.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center grayscale transition-all hover:grayscale-0">
                <span className="text-lg font-semibold text-zinc-400 hover:text-white">CryptoNews API</span>
              </a>
              <a href="https://openai.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center grayscale transition-all hover:grayscale-0">
                <span className="text-lg font-semibold text-zinc-400 hover:text-white">OpenAI</span>
              </a>
              <a href="https://digitalocean.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center grayscale transition-all hover:grayscale-0">
                <span className="text-lg font-semibold text-zinc-400 hover:text-white">DigitalOcean</span>
              </a>
              <a href="https://postgresql.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center grayscale transition-all hover:grayscale-0">
                <span className="text-lg font-semibold text-zinc-400 hover:text-white">PostgreSQL</span>
              </a>
              {/* Duplicate for seamless loop */}
              <a href="https://tradingview.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center grayscale transition-all hover:grayscale-0">
                <span className="text-lg font-semibold text-zinc-400 hover:text-white">TradingView</span>
              </a>
              <a href="https://binance.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center grayscale transition-all hover:grayscale-0">
                <span className="text-lg font-semibold text-zinc-400 hover:text-white">Binance</span>
              </a>
              <a href="https://coingecko.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center grayscale transition-all hover:grayscale-0">
                <span className="text-lg font-semibold text-zinc-400 hover:text-white">CoinGecko</span>
              </a>
              <a href="https://cryptonews.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center grayscale transition-all hover:grayscale-0">
                <span className="text-lg font-semibold text-zinc-400 hover:text-white">CryptoNews API</span>
              </a>
              <a href="https://openai.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center grayscale transition-all hover:grayscale-0">
                <span className="text-lg font-semibold text-zinc-400 hover:text-white">OpenAI</span>
              </a>
              <a href="https://digitalocean.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center grayscale transition-all hover:grayscale-0">
                <span className="text-lg font-semibold text-zinc-400 hover:text-white">DigitalOcean</span>
              </a>
              <a href="https://postgresql.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center grayscale transition-all hover:grayscale-0">
                <span className="text-lg font-semibold text-zinc-400 hover:text-white">PostgreSQL</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Column 1: Product */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/" className="text-sm text-zinc-400 transition-colors hover:text-orange-400">Home</Link></li>
                <li><a href="#features" className="text-sm text-zinc-400 transition-colors hover:text-orange-400">Features</a></li>
                <li><Link to="/pricing" className="text-sm text-zinc-400 transition-colors hover:text-orange-400">Pricing</Link></li>
                <li><Link to="/changelog" className="text-sm text-zinc-400 transition-colors hover:text-orange-400">Changelog</Link></li>
              </ul>
            </div>
            {/* Column 2: Company */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/about" className="text-sm text-zinc-400 transition-colors hover:text-orange-400">About</Link></li>
              </ul>
            </div>
            {/* Column 3: Docs */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Docs</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/docs/getting-started" className="text-sm text-zinc-400 transition-colors hover:text-orange-400">Getting Started</Link></li>
                <li><span className="text-sm text-zinc-600 cursor-not-allowed">API <span className="text-xs text-zinc-500">(Soon)</span></span></li>
                <li><Link to="/docs/terms" className="text-sm text-zinc-400 transition-colors hover:text-orange-400">Terms & Conditions</Link></li>
                <li><Link to="/docs/privacy" className="text-sm text-zinc-400 transition-colors hover:text-orange-400">Privacy Policy</Link></li>
              </ul>
            </div>
            {/* Column 4: Community */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Community</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="https://x.com/fluxfeed" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 transition-colors hover:text-orange-400">X / Twitter</a></li>
                <li><a href="https://t.me/fluxfeed_portal" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 transition-colors hover:text-orange-400">Telegram</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-zinc-800 pt-6 text-center">
            <p className="text-sm text-zinc-500">&copy; {new Date().getFullYear()} Fluxfeed. All rights reserved. Not financial advice.</p>
          </div>
        </div>
      </footer>
      </div> {/* End Main Content Wrapper */}
    </div>
  );
}

function FeatureCard({ title, desc, icon, iconSrc }: { title: string; desc: string; icon?: string; iconSrc?: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-600/5">
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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60 hover:-translate-y-1">
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

function EnhancedFeatureCard({ 
  title, 
  shortDesc, 
  fullDesc, 
  icon, 
  iconSrc, 
  benefits 
}: { 
  title: string
  shortDesc: string
  fullDesc: string
  icon?: string
  iconSrc?: string
  benefits: string[]
}) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  
  return (
    <div 
      className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-300 hover:border-orange-700/50 hover:bg-zinc-900/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-900/10 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-4">
        {iconSrc && (
          <img 
            src={iconSrc} 
            alt={title} 
            className="h-10 w-10 flex-shrink-0 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" 
          />
        )}
        {icon && !iconSrc && (
          <span className="text-3xl flex-shrink-0">{icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-orange-400 transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            {shortDesc}
          </p>
          
          <div 
            className={`overflow-hidden transition-all duration-500 ${
              isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              {fullDesc}
            </p>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide">Key Benefits:</p>
              <ul className="space-y-1.5">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-zinc-400">
                    <svg className="h-4 w-4 flex-shrink-0 text-orange-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <button className="mt-3 text-xs text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
            {isExpanded ? '← Show less' : 'Learn more →'}
          </button>
        </div>
      </div>
    </div>
  )
}

function EnhancedHowCard({ 
  step, 
  title, 
  shortDesc, 
  details, 
  tech 
}: { 
  step: number
  title: string
  shortDesc: string
  details: string
  tech: string[]
}) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  
  return (
    <div 
      className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60 hover:-translate-y-1 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-4">
        <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-orange-700 text-base font-bold text-white shadow-lg shadow-orange-900/50">
          {step}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{shortDesc}</p>
          
          <div 
            className={`overflow-hidden transition-all duration-500 ${
              isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              {details}
            </p>
            <div>
              <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-2">Technology Stack:</p>
              <div className="flex flex-wrap gap-2">
                {tech.map((t, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center rounded-full bg-zinc-800/60 px-3 py-1 text-xs font-medium text-zinc-300 ring-1 ring-zinc-700/50"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <button className="mt-3 text-xs text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
            {isExpanded ? '← Collapse' : 'View details →'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ExpandableNewsCard({ 
  title, 
  badge, 
  items, 
  expandedId, 
  onToggle,
  accentColor 
}: { 
  title: string
  badge: React.ReactNode
  items: LandingItem[]
  expandedId: string | null
  onToggle: (id: string | null) => void
  accentColor: 'orange' | 'purple'
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60 relative isolate">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-4 py-3 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
          {badge}
        </div>
        <div className="text-xs text-zinc-500">
          {items.length} items
        </div>
      </div>

      {/* News Items */}
      <ul className="divide-y divide-zinc-800">
        {items.length === 0 ? (
          <li className="p-8 text-center text-sm text-zinc-500">
            No news available
          </li>
        ) : (
          items.map((item) => {
            const isExpanded = expandedId === item.id
            const itemRef = React.useRef<HTMLLIElement>(null)
            
            // Smooth scroll into view when expanded
            React.useEffect(() => {
              if (isExpanded && itemRef.current) {
                setTimeout(() => {
                  itemRef.current?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest',
                    inline: 'nearest'
                  })
                }, 100)
              }
            }, [isExpanded])
            
            return (
              <li ref={itemRef} key={item.id} className="relative transition-colors hover:bg-zinc-900/60">
                {/* Collapsed View */}
                <button
                  onClick={() => onToggle(isExpanded ? null : item.id)}
                  className="w-full text-left p-4 focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      item.sentiment === 'bullish' ? 'bg-emerald-400' : 'bg-rose-400'
                    }`} />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-zinc-100 line-clamp-2">
                        {item.title}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{item.ago}</span>
                      </div>
                    </div>
                    <span className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                      item.sentiment === 'bullish'
                        ? 'bg-emerald-700/30 text-emerald-300 ring-1 ring-emerald-700/40'
                        : 'bg-rose-700/30 text-rose-300 ring-1 ring-rose-700/40'
                    }`}>
                      {item.sentiment === 'bullish' ? 'Bullish' : 'Bearish'}
                    </span>
                  </div>
                </button>

                {/* Expanded Details */}
                <div className={isExpanded ? 'news-card-expanded' : 'news-card-collapsed'}>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4 border-t border-zinc-800/50 animate-slide-in bg-zinc-900/30">
                      {/* Image/Video if available */}
                      {item.image_url && (
                        <div className="mt-4 rounded-lg overflow-hidden border border-zinc-800">
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        </div>
                      )}

                      {/* Full Text/Description */}
                      {item.text && (
                        <div className="text-sm text-zinc-300 leading-relaxed break-words whitespace-pre-wrap">
                          {item.text}
                        </div>
                      )}

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-zinc-800/50">
                        <div className="text-xs text-zinc-500">
                          <span className="text-zinc-400">Source:</span>{' '}
                          <span className="text-zinc-300">{item.source}</span>
                        </div>
                        {item.publishedAt && (
                          <div className="text-xs text-zinc-500">
                            <span className="text-zinc-400">Published:</span>{' '}
                            <span className="text-zinc-300">
                              {new Date(item.publishedAt).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Source Link */}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-orange-400 transition-colors hover:text-orange-300"
                        >
                          Read full article
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}
