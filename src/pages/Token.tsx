import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Token: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${API_BASE_URL}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setEmail('');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Waitlist signup error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-orange-950/20 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-orange-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
            <div className="text-orange-500 font-bold text-xl">$FLUX</div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-block">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🚀 Coming Soon on Solana
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              $FLUX Token
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            The future of crypto trading intelligence. Unlock premium signals, AI-powered analysis, and exclusive community access.
          </p>
          
          {/* Placeholder Token Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-12">
            <div className="bg-gray-900/50 border border-orange-900/30 rounded-xl p-6">
              <div className="text-gray-400 text-sm mb-2">Token Price</div>
              <div className="text-2xl font-bold text-white">TBA</div>
              <div className="text-orange-500 text-xs mt-1">Launching Soon</div>
            </div>
            <div className="bg-gray-900/50 border border-orange-900/30 rounded-xl p-6">
              <div className="text-gray-400 text-sm mb-2">Contract Address</div>
              <div className="text-2xl font-bold text-white">TBA</div>
              <div className="text-orange-500 text-xs mt-1">Pending Deployment</div>
            </div>
            <div className="bg-gray-900/50 border border-orange-900/30 rounded-xl p-6">
              <div className="text-gray-400 text-sm mb-2">Network</div>
              <div className="text-2xl font-bold text-white">Solana</div>
              <div className="text-green-500 text-xs mt-1">Fast & Low Fees</div>
            </div>
          </div>
        </div>

        {/* Waitlist Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-orange-950/30 to-gray-900/50 border border-orange-900/40 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <svg className="w-12 h-12 text-orange-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h2 className="text-3xl font-bold text-white mb-3">Join the Waitlist</h2>
              <p className="text-gray-400">
                Be the first to know when $FLUX launches. Get exclusive early access and launch announcements.
              </p>
            </div>

            {submitStatus === 'success' ? (
              <div className="bg-green-950/30 border border-green-500/50 rounded-xl p-6 text-center">
                <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-green-400 mb-2">You're on the list!</h3>
                <p className="text-gray-300">We'll notify you as soon as $FLUX goes live.</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-6 py-4 bg-gray-900 border border-orange-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                </button>
                {submitStatus === 'error' && (
                  <p className="text-red-400 text-sm text-center">Failed to join waitlist. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Tokenomics Preview */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tokenomics</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Fair distribution designed to reward early supporters and long-term holders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900/50 border border-orange-900/30 rounded-xl p-6 space-y-3">
              <div className="text-4xl font-bold text-orange-500">40%</div>
              <div className="text-white font-semibold">Liquidity Pool</div>
              <div className="text-gray-400 text-sm">Locked for stability and trading</div>
            </div>
            <div className="bg-gray-900/50 border border-orange-900/30 rounded-xl p-6 space-y-3">
              <div className="text-4xl font-bold text-orange-500">30%</div>
              <div className="text-white font-semibold">Community Rewards</div>
              <div className="text-gray-400 text-sm">Staking, airdrops & incentives</div>
            </div>
            <div className="bg-gray-900/50 border border-orange-900/30 rounded-xl p-6 space-y-3">
              <div className="text-4xl font-bold text-orange-500">20%</div>
              <div className="text-white font-semibold">Development</div>
              <div className="text-gray-400 text-sm">Platform improvements & marketing</div>
            </div>
            <div className="bg-gray-900/50 border border-orange-900/30 rounded-xl p-6 space-y-3">
              <div className="text-4xl font-bold text-orange-500">10%</div>
              <div className="text-white font-semibold">Team</div>
              <div className="text-gray-400 text-sm">Vested over 2 years</div>
            </div>
          </div>
        </div>

        {/* Benefits/Tiers */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Holder Benefits</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Unlock premium features and increased API limits based on your $FLUX holdings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* FREE Tier */}
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 space-y-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-400">FREE</div>
                <div className="text-3xl font-bold text-white mt-2">0 $FLUX</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>100 API calls/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Basic signals</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Community access</span>
                </li>
              </ul>
            </div>

            {/* HOLDER Tier */}
            <div className="bg-gray-900/50 border border-orange-900/30 rounded-xl p-6 space-y-4">
              <div className="text-center">
                <div className="text-xl font-bold text-orange-400">HOLDER</div>
                <div className="text-3xl font-bold text-white mt-2">1K+ $FLUX</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>1,000 API calls/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Advanced signals</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Priority support</span>
                </li>
              </ul>
            </div>

            {/* STAKER Tier */}
            <div className="bg-gray-900/50 border border-orange-500/50 rounded-xl p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-3 py-1 rounded-bl-lg font-semibold">
                POPULAR
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-500">STAKER</div>
                <div className="text-3xl font-bold text-white mt-2">10K+ $FLUX</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-200">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>10,000 API calls/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>AI-powered insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Staking rewards</span>
                </li>
              </ul>
            </div>

            {/* WHALE Tier */}
            <div className="bg-gradient-to-br from-orange-950/30 to-yellow-950/30 border border-orange-500/70 rounded-xl p-6 space-y-4">
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">WHALE</div>
                <div className="text-3xl font-bold text-white mt-2">100K+ $FLUX</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-100">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Unlimited API calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Exclusive alpha signals</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>VIP Discord access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <details className="bg-gray-900/50 border border-orange-900/30 rounded-xl p-6 group">
              <summary className="text-white font-semibold cursor-pointer list-none flex items-center justify-between">
                <span>When will $FLUX token launch?</span>
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-4">
                The exact launch date will be announced soon. Join our waitlist to be the first to know when we go live on Solana.
              </p>
            </details>

            <details className="bg-gray-900/50 border border-orange-900/30 rounded-xl p-6 group">
              <summary className="text-white font-semibold cursor-pointer list-none flex items-center justify-between">
                <span>How can I buy $FLUX tokens?</span>
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-4">
                Once launched, you'll be able to purchase $FLUX on major Solana DEXs like Raydium and Jupiter. Connect your Phantom or Solflare wallet to get started.
              </p>
            </details>

            <details className="bg-gray-900/50 border border-orange-900/30 rounded-xl p-6 group">
              <summary className="text-white font-semibold cursor-pointer list-none flex items-center justify-between">
                <span>What can I do with $FLUX tokens?</span>
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-4">
                Hold $FLUX to unlock premium trading signals, increased API limits, stake for rewards, access exclusive community features, and participate in platform governance.
              </p>
            </details>

            <details className="bg-gray-900/50 border border-orange-900/30 rounded-xl p-6 group">
              <summary className="text-white font-semibold cursor-pointer list-none flex items-center justify-between">
                <span>Is there a minimum holding requirement?</span>
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-4">
                No minimum required! Even small holders get benefits. However, holding 1K+ $FLUX unlocks HOLDER tier with significantly increased API limits and advanced features.
              </p>
            </details>

            <details className="bg-gray-900/50 border border-orange-900/30 rounded-xl p-6 group">
              <summary className="text-white font-semibold cursor-pointer list-none flex items-center justify-between">
                <span>Will there be staking rewards?</span>
                <span className="text-orange-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-4">
                Yes! Stakers (10K+ $FLUX) will earn passive rewards from platform revenue and token emissions. More details on APY and lock periods coming soon.
              </p>
            </details>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-center space-y-6 pb-12">
          <h3 className="text-2xl font-bold text-white">Stay Connected</h3>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://twitter.com/fluxfeed"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900/50 border border-orange-900/30 hover:border-orange-500 rounded-xl px-6 py-3 text-white hover:text-orange-500 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Twitter
            </a>
            <a
              href="https://discord.gg/fluxfeed"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900/50 border border-orange-900/30 hover:border-orange-500 rounded-xl px-6 py-3 text-white hover:text-orange-500 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Discord
            </a>
            <a
              href="https://t.me/fluxfeed_portal"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900/50 border border-orange-900/30 hover:border-orange-500 rounded-xl px-6 py-3 text-white hover:text-orange-500 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Token;
