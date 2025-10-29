import { Link } from "react-router-dom";
import Logo from "../../components/Logo";

export default function Terms() {
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
          Terms & Conditions
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: October 28, 2025</p>

        <div className="mt-12 space-y-8 text-zinc-300">
          <section>
            <h2 className="text-2xl font-bold text-zinc-100">1. Acceptance of Terms</h2>
            <p className="mt-3">
              By accessing or using Fluxfeed ("the Service"), you agree to be bound by these Terms and Conditions. 
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">2. Description of Service</h2>
            <p className="mt-3">
              Fluxfeed provides real-time cryptocurrency news aggregation, sentiment analysis, and AI-generated trading signals. 
              The Service is intended for informational and educational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">3. Not Financial Advice</h2>
            <div className="mt-3 rounded-2xl border border-rose-800/50 bg-rose-950/20 p-6">
              <p className="text-rose-200 font-semibold">
                IMPORTANT: Fluxfeed does NOT provide financial, investment, or trading advice. All signals, sentiment scores, 
                and information provided through the Service are for educational purposes only. You should not construe any 
                such information as legal, tax, investment, financial, or other advice.
              </p>
            </div>
            <p className="mt-4">
              Cryptocurrency trading carries substantial risk of loss. You are solely responsible for your own investment 
              decisions. Always consult with a qualified financial advisor before making any investment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">4. User Responsibilities</h2>
            <p className="mt-3">You agree to:</p>
            <ul className="mt-2 list-disc list-inside ml-4 space-y-1">
              <li>Use the Service in compliance with all applicable laws and regulations</li>
              <li>Not use the Service for any illegal or unauthorized purpose</li>
              <li>Not attempt to gain unauthorized access to any portion of the Service</li>
              <li>Not interfere with or disrupt the Service or servers</li>
              <li>Conduct your own research (DYOR) before making any trading decisions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">5. Data Accuracy</h2>
            <p className="mt-3">
              While we strive to provide accurate and up-to-date information, Fluxfeed makes no warranties or guarantees 
              regarding the accuracy, completeness, or reliability of any data, signals, or sentiment scores provided through 
              the Service. Market data, news, and AI-generated signals may contain errors or delays.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">6. Limitation of Liability</h2>
            <p className="mt-3">
              To the maximum extent permitted by law, Fluxfeed and its affiliates shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
              directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="mt-2 list-disc list-inside ml-4 space-y-1">
              <li>Your use or inability to use the Service</li>
              <li>Any trading decisions made based on information from the Service</li>
              <li>Unauthorized access to or alteration of your data</li>
              <li>Any other matter related to the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">7. Intellectual Property</h2>
            <p className="mt-3">
              All content, features, and functionality of the Service, including but not limited to text, graphics, logos, 
              and software, are the exclusive property of Fluxfeed and are protected by international copyright, trademark, 
              and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">8. Termination</h2>
            <p className="mt-3">
              We reserve the right to suspend or terminate your access to the Service at any time, without notice, for 
              conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any 
              other reason in our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">9. Changes to Terms</h2>
            <p className="mt-3">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by 
              updating the "Last updated" date at the top of this page. Your continued use of the Service after such 
              changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">10. Contact</h2>
            <p className="mt-3">
              For questions about these Terms, please contact us via{" "}
              <a href="https://t.me/fluxfeed_portal" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">
                Telegram
              </a>{" "}
              or{" "}
              <a href="https://x.com/fluxfeed" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">
                X/Twitter
              </a>.
            </p>
          </section>
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
