'use client';

/**
 * WaitlistForm
 *
 * Component Hierarchy:
 * App → LandingPage → WaitlistForm
 *
 * Email capture form for phoo.ai beta waitlist.
 * Submits to Convex waitlist mutation which syncs to HubSpot.
 */

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const joinWaitlist = useMutation(api.waitlist.joinWaitlist);
  const waitlistData = useQuery(api.waitlist.getWaitlistCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const params = new URLSearchParams(window.location.search);
      const metadata = {
        referrer: document.referrer || undefined,
        utmSource: params.get('utm_source') || undefined,
        utmMedium: params.get('utm_medium') || undefined,
        utmCampaign: params.get('utm_campaign') || undefined,
        userAgent: navigator.userAgent,
      };

      await joinWaitlist({ email, source: 'phoo.ai', metadata });
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <section id="join-beta" className="py-24 border-t border-white/5">
      <div className="max-w-xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to make your website work for your business?
        </h2>
        <p className="text-xl text-slate-400 mb-10">
          Join the Phoo beta and be part of building a smarter, more meaningful way to grow.
        </p>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
              <p className="text-xl text-green-300 font-medium">You&apos;re on the list!</p>
              <p className="text-slate-400">We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-semibold text-lg text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
              >
                {status === 'loading' ? (
                  <span className="animate-pulse">Joining...</span>
                ) : (
                  <>
                    Join the Phoo Beta
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {status === 'error' && <p className="text-red-400 text-sm">{errorMessage}</p>}
            </form>
          )}
        </div>

        <p className="mt-6 text-slate-500 text-sm">Spots are limited.</p>

        {waitlistData && waitlistData.count > 0 && (
          <p className="mt-4 text-sm text-slate-400">
            Join {waitlistData.count.toLocaleString()}+ others on the waitlist
          </p>
        )}
      </div>
    </section>
  );
}
