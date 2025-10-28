import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function About() {
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
          About <span className="text-orange-400">Fluxfeed</span>
        </h1>
        
        <div className="mt-8 space-y-6 text-zinc-300">
          <p className="text-lg">
            Fluxfeed is a real-time crypto news aggregator and sentiment analysis platform that transforms headlines into actionable trading signals.
          </p>

          <h2 className="text-2xl font-bold text-zinc-100 mt-12">Our Mission</h2>
          <p>
            We believe that news drives markets, but consuming and interpreting hundreds of crypto headlines daily is overwhelming. 
            Fluxfeed solves this by automatically scoring sentiment, filtering by ticker and timeframe, and generating simple BUY/SELL/NEUTRAL signals with AI-powered rationale.
          </p>

          <h2 className="text-2xl font-bold text-zinc-100 mt-12">How We're Different</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Real-time sentiment scoring across 1000+ crypto news sources</li>
            <li>AI-generated signals with transparent reasoning—no black boxes</li>
            <li>Trader-first filters: ticker, timeframe, and news window</li>
            <li>Clean, fast interface built for decision-making under pressure</li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-100 mt-12">Technology Stack</h2>
          <p>
            Fluxfeed is powered by OpenAI for sentiment classification, pulls price data from Binance and CoinGecko, 
            aggregates news from CryptoNews API, and runs on DigitalOcean infrastructure with PostgreSQL for reliable, fast data delivery.
          </p>

          <h2 className="text-2xl font-bold text-zinc-100 mt-12">Get in Touch</h2>
          <p>
            We're actively building in public and love feedback from traders, developers, and quants. 
            Join our community on{" "}
            <a href="https://t.me/fluxfeed" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">
              Telegram
            </a>{" "}
            or follow us on{" "}
            <a href="https://x.com/fluxfeed" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">
              X/Twitter
            </a>.
          </p>

          <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <p className="text-sm text-zinc-400">
              <strong className="text-zinc-200">Disclaimer:</strong> Fluxfeed provides informational tools only. 
              All signals and sentiment scores are for educational purposes and should not be considered financial advice. 
              Always do your own research and consult with a qualified financial advisor before making investment decisions.
            </p>
          </div>
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
