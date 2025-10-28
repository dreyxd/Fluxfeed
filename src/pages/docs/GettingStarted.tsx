import { Link } from "react-router-dom";
import Logo from "../../components/Logo";

export default function GettingStarted() {
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
          <span className="text-orange-400">Getting Started</span>
        </h1>
        <p className="mt-4 text-zinc-400">Learn how to use Fluxfeed to trade smarter with real-time news sentiment.</p>

        <div className="mt-12 space-y-12">
          {/* Step 1 */}
          <section>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600/20 text-lg font-bold text-orange-400 ring-2 ring-orange-600/30">
                1
              </span>
              <h2 className="text-2xl font-bold text-zinc-100">Launch the App</h2>
            </div>
            <div className="ml-13 mt-4 space-y-3 text-zinc-300">
              <p>
                Click the{" "}
                <Link to="/app" className="font-semibold text-orange-400 hover:text-orange-300">
                  Launch App
                </Link>{" "}
                button in the top-right corner to access the main dashboard. You'll see two main streams:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong className="text-zinc-100">Bearish Stream:</strong> Headlines with negative sentiment (potential sell signals)</li>
                <li><strong className="text-zinc-100">Bullish Stream:</strong> Headlines with positive sentiment (potential buy signals)</li>
              </ul>
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600/20 text-lg font-bold text-orange-400 ring-2 ring-orange-600/30">
                2
              </span>
              <h2 className="text-2xl font-bold text-zinc-100">Filter by Ticker & Timeframe</h2>
            </div>
            <div className="ml-13 mt-4 space-y-3 text-zinc-300">
              <p>
                Use the filters at the top of the page to narrow down news to specific cryptocurrencies and timeframes:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong className="text-zinc-100">Ticker:</strong> Select BTC, ETH, SOL, or any supported coin</li>
                <li><strong className="text-zinc-100">Timeframe:</strong> Choose 1h, 24h, or 7d to see how recent the news is</li>
                <li><strong className="text-zinc-100">Sentiment:</strong> Filter by Bullish, Bearish, or All</li>
              </ul>
              <p>This helps you focus on the assets and windows that matter for your trading strategy.</p>
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600/20 text-lg font-bold text-orange-400 ring-2 ring-orange-600/30">
                3
              </span>
              <h2 className="text-2xl font-bold text-zinc-100">Review AI Signals</h2>
            </div>
            <div className="ml-13 mt-4 space-y-3 text-zinc-300">
              <p>
                Each filtered view generates a <strong className="text-zinc-100">BUY / SELL / NEUTRAL</strong> signal with:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong className="text-zinc-100">Confidence Score:</strong> Percentage indicating signal strength</li>
                <li><strong className="text-zinc-100">Rationale:</strong> 3-5 bullet points explaining why the signal was generated</li>
                <li><strong className="text-zinc-100">Context:</strong> Sentiment skew and recent price action</li>
              </ul>
              <p className="text-sm text-zinc-400 mt-3">
                Tip: Higher confidence scores (≥70%) typically indicate stronger consensus in the news sentiment.
              </p>
            </div>
          </section>

          {/* Step 4 */}
          <section>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600/20 text-lg font-bold text-orange-400 ring-2 ring-orange-600/30">
                4
              </span>
              <h2 className="text-2xl font-bold text-zinc-100">Act on Insights</h2>
            </div>
            <div className="ml-13 mt-4 space-y-3 text-zinc-300">
              <p>
                Use Fluxfeed signals as <strong className="text-zinc-100">one input</strong> in your trading decisions:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Cross-check with your technical analysis (charts, indicators)</li>
                <li>Consider broader market conditions and macro trends</li>
                <li>Set stop-losses and take-profits based on your risk tolerance</li>
                <li>Never trade based solely on sentiment—always DYOR (Do Your Own Research)</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Tips Section */}
        <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="text-lg font-semibold text-zinc-100">Pro Tips</h3>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-orange-400">→</span>
              <span>Check the <strong>Bearish stream</strong> before entering longs—avoid buying into negative news cycles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400">→</span>
              <span>Use the <strong>1h timeframe</strong> for scalp trades and <strong>7d</strong> for swing positions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400">→</span>
              <span>Enable <strong>auto-refresh</strong> to stay updated without manually reloading</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400">→</span>
              <span>Bookmark tickers you trade frequently for faster access</span>
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-2xl border border-rose-800/50 bg-rose-950/20 p-6">
          <p className="text-sm text-rose-200">
            <strong>Important:</strong> Fluxfeed provides informational tools only. All signals are for educational purposes 
            and do not constitute financial advice. Cryptocurrency trading carries significant risk. Always consult with a 
            qualified financial advisor and never invest more than you can afford to lose.
          </p>
        </div>

        <div className="mt-12 flex gap-4">
          <Link
            to="/app"
            className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-black shadow hover:bg-orange-500"
          >
            Launch App
          </Link>
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
