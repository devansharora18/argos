import { ArrowRight, Database, Server } from 'lucide-react'
import type { ReactElement } from 'react'
import { ScrollReveal } from '../components/ScrollReveal'

export function PrototypeSection(): ReactElement {
  return (
    <section id="prototype" className="min-h-screen border-t border-white/[0.04] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px]">
        <ScrollReveal>
          <p className="text-[0.64rem] font-semibold tracking-[0.22em] text-[#cc9a84]">
            PROTOTYPE DISTRIBUTION
          </p>
          <h2 className="mt-4 font-display text-[3rem] font-semibold leading-[0.95] text-[#f4f5f8] sm:text-[3.4rem]">
            Get The Prototype
          </h2>
          <p className="mt-5 max-w-[720px] text-[1.02rem] leading-relaxed text-[#9da1af]">
            Download the latest releases from our GitHub repository, including Android client and staff apps, plus the control room application for all platforms.
          </p>
          <a
            href="https://github.com/devansharora18/argos/releases/tag/0.0.1"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#f0b399]/40 bg-[#f0b399]/5 px-6 py-3 text-[0.9rem] font-semibold text-[#f0b399] transition hover:border-[#f0b399]/100 hover:bg-[#f0b399]/10"
          >
            Download on GitHub
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </a>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <ScrollReveal>
            <div className="rounded-xl border border-white/6 bg-[#11131a]/90 p-6">
              <div className="flex items-center gap-3 text-[#f0b399]">
                <Server className="h-5 w-5" strokeWidth={1.5} />
                <p className="text-[0.6rem] font-semibold tracking-[0.22em]">BACKEND SETUP</p>
              </div>
              <div className="mt-4 space-y-3 text-[0.9rem] text-[#9da1af]">
                <p className="leading-relaxed">
                  1. <span className="text-[#f2f3f7]">Install dependencies:</span> <span className="text-[#f0b399]">cd backend</span> then <span className="text-[#f0b399]">pnpm install</span>
                </p>
                <p className="leading-relaxed">
                  2. <span className="text-[#f2f3f7]">Configure env:</span> copy <span className="text-[#f0b399]">example.env</span> to <span className="text-[#f0b399]">.env</span> and set <span className="text-[#f0b399]">GEMINI_API_KEY</span> + <span className="text-[#f0b399]">GCP_PROJECT_ID</span>
                </p>
                <p className="leading-relaxed">
                  3. <span className="text-[#f2f3f7]">Start emulators:</span> <span className="text-[#f0b399]">firebase emulators:start --only firestore,pubsub</span>
                </p>
                <p className="leading-relaxed">
                  4. <span className="text-[#f2f3f7]">Run API server:</span> <span className="text-[#f0b399]">pnpm start:server</span>
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="rounded-xl border border-white/6 bg-[#11131a]/90 p-6">
              <div className="flex items-center gap-3 text-[#f0b399]">
                <Database className="h-5 w-5" strokeWidth={1.5} />
                <p className="text-[0.6rem] font-semibold tracking-[0.22em]">OPTIONAL DEMO DATA</p>
              </div>
              <div className="mt-4 space-y-3 text-[0.9rem] text-[#9da1af]">
                <p className="leading-relaxed">
                  Seed the Firestore demo venue with personnel, routes, and equipment for the control room:
                </p>
                <p className="leading-relaxed">
                  <span className="text-[#f0b399]">pnpm run seed</span>
                </p>
                <a
                  href="#request-demo"
                  className="mt-4 inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-[#f0b399]"
                >
                  REQUEST SUPPORT
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
