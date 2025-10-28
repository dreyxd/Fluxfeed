import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { useState } from "react";

export default function Pricing() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with email service
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

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
      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Pricing <span className="text-orange-400">Coming Soon</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            We're finalizing our pricing tiers to ensure we deliver maximum value for traders, developers, and institutions.
          </p>
        </div>

        {/* Teaser Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {/* Free Tier */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Free</div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-zinc-100">Explorer</h3>
              <p className="mt-2 text-sm text-zinc-400">Perfect for casual traders getting started</p>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Up to 50 news items per day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Basic sentiment filtering</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>2 ticker watchlists</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-600">✗</span>
                <span className="text-zinc-500">AI signals (Pro only)</span>
              </li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="relative rounded-2xl border-2 border-orange-600 bg-zinc-900/60 p-6 shadow-lg shadow-orange-600/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-black">Most Popular</span>
            </div>
            <div className="text-sm font-semibold uppercase tracking-wide text-orange-400">Pro</div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-zinc-100">Trader</h3>
              <p className="mt-2 text-sm text-zinc-400">For active traders who need an edge</p>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-orange-400">✓</span>
                <span>Unlimited news & signals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">✓</span>
                <span>AI-powered BUY/SELL/NEUTRAL signals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">✓</span>
                <span>Advanced filters & timeframes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">✓</span>
                <span>Real-time alerts (Telegram, email)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">✓</span>
                <span>Historical sentiment data</span>
              </li>
            </ul>
          </div>

          {/* Enterprise Tier */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="text-sm font-semibold uppercase tracking-wide text-blue-400">Enterprise</div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-zinc-100">Institution</h3>
              <p className="mt-2 text-sm text-zinc-400">For funds and teams that need API access</p>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>REST API & webhook support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Custom integrations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Dedicated support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>SLA & uptime guarantees</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Email Capture */}
        <div className="mt-16 mx-auto max-w-xl">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
            <h2 className="text-2xl font-bold text-center text-zinc-100">Get Notified</h2>
            <p className="mt-2 text-center text-sm text-zinc-400">
              Be the first to know when pricing launches. We'll send you an exclusive early-access discount.
            </p>
            
            {!subscribed ? (
              <form onSubmit={handleSubmit} className="mt-6">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/50"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-semibold text-black hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
                  >
                    Notify Me
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 rounded-lg bg-emerald-900/30 border border-emerald-700/50 px-4 py-3 text-center text-sm text-emerald-300">
                ✓ Thanks! We'll notify you when pricing is live.
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
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
