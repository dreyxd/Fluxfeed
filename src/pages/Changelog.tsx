import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function Changelog() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-zinc-900/80 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <Logo size={48} />
              <div className="leading-tight">
                <div className="text-lg font-bold tracking-tight text-orange-400">Fluxfeed</div>
                <div className="text-sm text-zinc-400">AI-Powered News → Signals</div>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/" className="rounded-lg px-3 py-1.5 text-sm text-zinc-300 hover:text-zinc-100">
                Home
              </Link>
              <Link
                to="/app"
                className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-black shadow hover:bg-orange-500"
              >
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          <span className="text-orange-400">Changelog</span>
        </h1>
        <p className="mt-4 text-zinc-400">Track updates, new features, and improvements to Fluxfeed.</p>

        <div className="mt-12 space-y-12">
          {/* Version 0.3.0 */}
          <div className="border-l-2 border-orange-600 pl-6">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-bold text-zinc-100">v0.3.0</h2>
              <span className="text-sm text-zinc-500">October 28, 2025</span>
            </div>
            <ul className="mt-4 space-y-2 text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Enhanced landing page with smooth scroll animations and section reveals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Added complete documentation pages (About, Changelog, Terms, Privacy)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Optimized news refresh to load only latest 12 items incrementally</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Improved navbar with scroll-aware styling and active section highlighting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Added "View full feed" link to news preview section</span>
              </li>
            </ul>
          </div>

          {/* Version 0.2.0 */}
          <div className="border-l-2 border-zinc-700 pl-6">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-bold text-zinc-100">v0.2.0</h2>
              <span className="text-sm text-zinc-500">October 15, 2025</span>
            </div>
            <ul className="mt-4 space-y-2 text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-orange-400">+</span>
                <span>Added AI-powered BUY/SELL/NEUTRAL signals with confidence scoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">+</span>
                <span>Implemented ticker and timeframe filters for targeted news</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">+</span>
                <span>Bullish/Bearish stream separation for clearer sentiment view</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">+</span>
                <span>TradingView chart integration for price context</span>
              </li>
            </ul>
          </div>

          {/* Version 0.1.0 */}
          <div className="border-l-2 border-zinc-700 pl-6">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-bold text-zinc-100">v0.1.0</h2>
              <span className="text-sm text-zinc-500">October 1, 2025</span>
            </div>
            <ul className="mt-4 space-y-2 text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">◆</span>
                <span>Initial release with real-time crypto news aggregation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">◆</span>
                <span>Sentiment classification using OpenAI GPT models</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">◆</span>
                <span>Basic news feed with auto-refresh capability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">◆</span>
                <span>Dark theme UI optimized for trading environments</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="text-lg font-semibold text-zinc-100">Coming Soon</h3>
          <ul className="mt-4 space-y-2 text-sm text-zinc-400">
            <li>• Mobile app (iOS & Android)</li>
            <li>• Public API & webhook support</li>
            <li>• Custom watchlists and alerts</li>
            <li>• Historical sentiment data and backtesting</li>
            <li>• Sentiment heatmaps and market overview</li>
          </ul>
        </div>

        <div className="mt-12">
          <Link
            to="/"
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-800"
          >
            Back to Home
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-zinc-950 mt-20">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-center text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Fluxfeed. All rights reserved. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
