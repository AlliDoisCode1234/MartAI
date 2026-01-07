/**
 * BetaSection
 *
 * Component Hierarchy:
 * App → LandingPage → BetaSection
 *
 * Why Beta section for landing page.
 */

import { Check } from 'lucide-react';

const OUR_GOALS = [
  'Shape Phoo around real-world needs',
  'Gather feedback from business owners we trust',
  'Build something genuinely helpful — not bloated',
] as const;

const BETA_BENEFITS = [
  'Early access to Phoo',
  'Founding beta pricing',
  'Direct input into product features',
  'Priority onboarding and support',
] as const;

export function BetaSection() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Why Beta?</h2>
        <p className="text-xl text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          We&apos;re opening early beta access to a small group of businesses so we can:
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* What We Get */}
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-semibold mb-6 text-slate-300">We want to:</h3>
            <ul className="space-y-4">
              {OUR_GOALS.map((goal) => (
                <li key={goal} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2.5 flex-shrink-0" />
                  <span className="text-slate-400">{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What You Get */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <h3 className="text-xl font-semibold mb-6 text-white">Beta users get:</h3>
            <ul className="space-y-4">
              {BETA_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
