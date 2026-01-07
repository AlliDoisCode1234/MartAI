/**
 * FeaturesSection
 *
 * Component Hierarchy:
 * App → LandingPage → FeaturesSection
 *
 * What Phoo Does section for landing page.
 */

import { Target, Zap, TrendingUp, Users } from 'lucide-react';

const FEATURES = [
  {
    icon: Target,
    color: 'text-purple-400',
    title: 'Analyzes your website and competitors',
    description: 'Understand where you stand and where opportunity lives.',
  },
  {
    icon: Zap,
    color: 'text-pink-400',
    title: 'Builds a clear SEO content plan',
    description: 'A roadmap tailored to your business, not generic advice.',
  },
  {
    icon: TrendingUp,
    color: 'text-blue-400',
    title: 'Creates and improves content over time',
    description: 'AI-powered content that gets better, not stale.',
  },
  {
    icon: Users,
    color: 'text-green-400',
    title: 'Turns visits into real leads',
    description: 'Traffic that matters, not just vanity metrics.',
  },
] as const;

export function FeaturesSection() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Phoo Does</h2>
          <p className="text-xl text-slate-400">Phoo is your automated SEO growth system.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4"
            >
              <feature.icon className={`w-6 h-6 ${feature.color} flex-shrink-0 mt-1`} />
              <div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-lg text-slate-400 mt-10">
          All without you needing to become a marketing expert.
        </p>
      </div>
    </section>
  );
}
