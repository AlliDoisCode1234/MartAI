/**
 * HeroSection
 *
 * Component Hierarchy:
 * App → LandingPage → HeroSection
 *
 * Hero section for phoo.ai landing page with headline and primary CTA.
 */

import { ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  onCtaClick?: () => void;
}

export function HeroSection({ onCtaClick }: Props) {
  return (
    <header className="relative overflow-hidden">
      {/* Gradient orbs for visual interest */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6 py-24 lg:py-32 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-300">Built by the team behind Helps2</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Turn Your Website Into a
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Steady Source of Leads
          </span>
          <br />— Automatically
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10">
          Phoo helps purpose-driven local businesses grow traffic, leads, and revenue with an
          automated SEO system that actually works.
        </p>

        {/* Primary CTA */}
        <a
          href="#join-beta"
          onClick={onCtaClick}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-semibold text-lg text-white transition-all duration-200 shadow-lg shadow-purple-500/25"
        >
          Join the Phoo Beta
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </header>
  );
}
