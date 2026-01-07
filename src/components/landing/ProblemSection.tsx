/**
 * ProblemSection
 *
 * Component Hierarchy:
 * App → LandingPage → ProblemSection
 *
 * Pain point section for phoo.ai landing page.
 */

export function ProblemSection() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Does this sound familiar?
        </h2>

        <div className="space-y-6 text-lg text-slate-300 max-w-2xl mx-auto">
          <div className="flex gap-4 items-start p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
            <p>Your website looks fine… but doesn&apos;t bring in consistent leads</p>
          </div>
          <div className="flex gap-4 items-start p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
            <p>
              You&apos;re &quot;doing marketing,&quot; but you&apos;re not sure what&apos;s actually
              working
            </p>
          </div>
          <div className="flex gap-4 items-start p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
            <p>SEO feels confusing, slow, or like something only big companies can afford</p>
          </div>
        </div>

        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-center">
          <p className="text-xl text-slate-300 leading-relaxed">
            <span className="font-semibold text-white">
              You didn&apos;t start your business just to chase algorithms.
            </span>
            <br />
            You started it to serve people and build something meaningful.
          </p>
        </div>
      </div>
    </section>
  );
}
