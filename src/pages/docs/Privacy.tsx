import { Link } from "react-router-dom";
import Logo from "../../components/Logo";

export default function Privacy() {
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: October 28, 2025</p>

        <div className="mt-12 space-y-8 text-zinc-300">
          <section>
            <h2 className="text-2xl font-bold text-zinc-100">1. Information We Collect</h2>
            <p className="mt-3">
              Fluxfeed is designed with privacy in mind. We collect minimal information necessary to provide and improve the Service:
            </p>
            <ul className="mt-3 list-disc list-inside ml-4 space-y-2">
              <li>
                <strong className="text-zinc-100">Usage Data:</strong> We collect anonymous analytics on how you interact with the Service 
                (e.g., pages visited, features used, time spent). This helps us improve the user experience.
              </li>
              <li>
                <strong className="text-zinc-100">Technical Data:</strong> We automatically collect certain information about your device 
                and browser, including IP address, browser type, operating system, and referral URLs.
              </li>
              <li>
                <strong className="text-zinc-100">Email (Optional):</strong> If you sign up for notifications or newsletters, we collect 
                and store your email address. You can unsubscribe at any time.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">2. Information We Do NOT Collect</h2>
            <div className="mt-3 rounded-2xl border border-emerald-800/50 bg-emerald-950/20 p-6">
              <p className="text-emerald-200">
                We do <strong>NOT</strong> collect, store, or have access to:
              </p>
              <ul className="mt-2 list-disc list-inside ml-4 space-y-1 text-emerald-200">
                <li>Your trading positions, balances, or portfolio data</li>
                <li>Your exchange API keys or credentials</li>
                <li>Personal financial information</li>
                <li>Names, addresses, or phone numbers (unless you voluntarily provide them)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">3. How We Use Your Information</h2>
            <p className="mt-3">We use the information we collect to:</p>
            <ul className="mt-2 list-disc list-inside ml-4 space-y-1">
              <li>Provide, maintain, and improve the Service</li>
              <li>Analyze usage patterns and optimize performance</li>
              <li>Send you service updates, newsletters, or notifications (if you've opted in)</li>
              <li>Detect and prevent fraud, abuse, or security issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">4. Data Sharing and Disclosure</h2>
            <p className="mt-3">
              We do not sell, rent, or trade your personal information to third parties. We may share information only in the following cases:
            </p>
            <ul className="mt-2 list-disc list-inside ml-4 space-y-1">
              <li>
                <strong className="text-zinc-100">Service Providers:</strong> We use third-party services (e.g., hosting, analytics) 
                that may process data on our behalf. These providers are contractually obligated to protect your data.
              </li>
              <li>
                <strong className="text-zinc-100">Legal Requirements:</strong> We may disclose information if required by law, court order, 
                or government request.
              </li>
              <li>
                <strong className="text-zinc-100">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, 
                your information may be transferred to the acquiring entity.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">5. Cookies and Tracking</h2>
            <p className="mt-3">
              Fluxfeed uses cookies and similar technologies to enhance your experience and analyze usage. Cookies are small text files 
              stored on your device. You can disable cookies in your browser settings, but this may limit some functionality of the Service.
            </p>
            <p className="mt-3">
              We use:
            </p>
            <ul className="mt-2 list-disc list-inside ml-4 space-y-1">
              <li><strong className="text-zinc-100">Essential Cookies:</strong> Required for the Service to function properly</li>
              <li><strong className="text-zinc-100">Analytics Cookies:</strong> Help us understand how users interact with the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">6. Data Security</h2>
            <p className="mt-3">
              We implement industry-standard security measures to protect your information, including encryption, secure servers, 
              and access controls. However, no method of transmission over the internet is 100% secure. While we strive to protect 
              your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">7. Data Retention</h2>
            <p className="mt-3">
              We retain your information only as long as necessary to provide the Service and comply with legal obligations. 
              Anonymous usage data may be retained indefinitely for analytics and improvement purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">8. Your Rights</h2>
            <p className="mt-3">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="mt-2 list-disc list-inside ml-4 space-y-1">
              <li>Access and receive a copy of your data</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict certain processing activities</li>
              <li>Withdraw consent (where processing is based on consent)</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us via{" "}
              <a href="https://t.me/fluxfeed_portal" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">
                Telegram
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">9. Children's Privacy</h2>
            <p className="mt-3">
              Fluxfeed is not intended for users under the age of 18. We do not knowingly collect personal information from children. 
              If we become aware that we have collected data from a child without parental consent, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">10. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by updating the 
              "Last updated" date at the top of this page. Your continued use of the Service after changes constitutes acceptance 
              of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-100">11. Contact Us</h2>
            <p className="mt-3">
              If you have questions or concerns about this Privacy Policy, please reach out via{" "}
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
