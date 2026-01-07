/**
 * AudienceSection
 *
 * Component Hierarchy:
 * App → LandingPage → AudienceSection
 *
 * Who It's For section for landing page.
 */

import { Check } from 'lucide-react';

const AUDIENCE_TRAITS = [
  'Care about serving their community',
  'Want sustainable growth, not gimmicks',
  'Believe their work has purpose',
  'Tired of marketing that feels busy but not effective',
] as const;

export function AudienceSection() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Who It&apos;s For</h2>

        <p className="text-xl text-slate-300 mb-8">Phoo is built for local businesses who:</p>

        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
          {AUDIENCE_TRAITS.map((trait) => (
            <div key={trait} className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>{trait}</span>
            </div>
          ))}
        </div>

        <p className="text-slate-500 mt-8 italic">(And yes — others are welcome too.)</p>
      </div>
    </section>
  );
}
