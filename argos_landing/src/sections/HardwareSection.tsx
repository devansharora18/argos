import {
  ArrowRight,
  Cpu,
  Gauge,
  Network,
  Trophy,
} from 'lucide-react'
import type { ReactElement } from 'react'
import { ScrollReveal } from '../components/ScrollReveal'

export function HardwareSection(): ReactElement {
  return (
    <>
      <section id="hardware" className="min-h-screen px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-20">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-center">
          <ScrollReveal>
            <div className="max-w-[640px]">
              <p className="inline-flex items-center gap-2 rounded-sm bg-[rgba(120,60,33,0.5)] px-3 py-1 text-[0.58rem] font-semibold tracking-[0.2em] text-[#f4b39a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f4b39a] animate-pulse" />
                INTEGRATED PLATFORM
              </p>

              <h1 className="mt-6 font-display text-[3.3rem] leading-[0.98] text-[#eef0f6] sm:text-[4rem]">
                Cloud &
                <br />
                <span className="text-[#ffa07e]">Edge Convergence.</span>
              </h1>

              <p className="mt-7 max-w-[560px] text-[1.05rem] leading-relaxed text-[#a6aab7]">
                Phase 2 is live with full Google Cloud AI integration. Gemini-powered crisis analysis combined with Firebase Firestore for real-time cloud-to-device synchronization. Phase 3 adds edge-local inference on NVIDIA Jetson for offline resilience.
              </p>

              <div className="mt-8 border-t border-white/[0.07] pt-4">
                <div className="grid max-w-[420px] grid-cols-2 gap-8">
                  <div>
                    <p className="text-[0.58rem] font-semibold tracking-[0.2em] text-[#6b6f7d]">
                      ANALYSIS LATENCY
                    </p>
                    <p className="mt-1 font-display text-[2rem] text-[#f2f4f8]">{'< 5s'}</p>
                  </div>
                  <div>
                    <p className="text-[0.58rem] font-semibold tracking-[0.2em] text-[#6b6f7d]">
                      MODALITIES
                    </p>
                    <p className="mt-1 font-display text-[2rem] text-[#f2f4f8]">Text+Voice+Video</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#request-demo"
                  className="inline-flex items-center gap-2 rounded-sm bg-[var(--accent)] px-5 py-3 text-[0.62rem] font-semibold tracking-[0.22em] text-[#1f120b] transition hover:brightness-110 hover:shadow-[0_0_20px_rgba(255,97,39,0.4)]"
                >
                  REQUEST DEMO
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                </a>
                <a
                  href="#technology"
                  className="inline-flex items-center gap-2 border-b border-white/15 pb-1 text-xs font-semibold tracking-[0.2em] text-[#d7d9e2] transition hover:text-white hover:border-[var(--accent)]"
                >
                  BACK TO TOP
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                </a>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="group relative overflow-hidden rounded-lg border border-white/[0.09] shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:shadow-[0_0_70px_rgba(0,0,0,0.7)]">
              <img
                src="/hardware.png"
                alt="Argos hardware device"
                className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 z-10 opacity-25 [background:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
              <div className="pointer-events-none absolute left-6 top-6 z-10 h-10 w-10 border-l border-t border-[#9da4ad]/60" />
              <div className="pointer-events-none absolute bottom-6 right-6 z-10 h-10 w-10 border-b border-r border-[#9da4ad]/60" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="flex min-h-screen flex-col justify-center border-t border-white/[0.04] bg-[linear-gradient(180deg,#141318_0%,#121216_100%)] px-4 py-14 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="font-display text-[2.5rem] text-[#eef0f5] sm:text-[3rem]">Google Cloud AI Services</h2>
          <p className="mt-3 max-w-[760px] text-[0.96rem] leading-relaxed text-[#a4a8b5]">
            ARGOS Phase 2 leverages Google's serverless AI infrastructure for zero-latency crisis analysis. Gemini models, Cloud Vision, and Speech-to-Text run on Firebase Functions for automatic scaling and reliability.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <ScrollReveal delay={0}>
            <article className="group relative h-full overflow-hidden rounded-md border border-white/[0.07] bg-[#313136]/72 p-6 transition-all hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(255,97,39,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#f1ad96] transition-colors group-hover:text-[#ff9a73]">
                <Cpu className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <h3 className="mt-4 font-display text-[1.45rem] leading-tight text-[#eff1f5] transition-colors group-hover:text-[#ff9a73]">
                Gemini Models
              </h3>
              <p className="mt-3 text-[0.86rem] leading-relaxed text-[#9ca0ad] transition-colors group-hover:text-[#b0b5c7]">
                Gemini 2.5 Flash for real-time classification, Gemini 2.5 Pro for complex orchestration reasoning with multi-dispatch logic.
              </p>
            </article>
          </ScrollReveal>
          
          <ScrollReveal delay={0.06}>
            <article className="group relative h-full overflow-hidden rounded-md border border-white/[0.07] bg-[#313136]/72 p-6 transition-all hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(255,97,39,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#f1ad96] transition-colors group-hover:text-[#ff9a73]">
                <Gauge className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <h3 className="mt-4 font-display text-[1.45rem] leading-tight text-[#eff1f5] transition-colors group-hover:text-[#ff9a73]">
                Cloud Vision API
              </h3>
              <p className="mt-3 text-[0.86rem] leading-relaxed text-[#9ca0ad] transition-colors group-hover:text-[#b0b5c7]">
                Real-time camera frame analysis extracting person counts, fire/smoke detection, and security signals in parallel.
              </p>
            </article>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <article className="group relative h-full overflow-hidden rounded-md border border-white/[0.07] bg-[#313136]/72 p-6 transition-all hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(255,97,39,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#f1ad96] transition-colors group-hover:text-[#ff9a73]">
                <Network className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <h3 className="mt-4 font-display text-[1.45rem] leading-tight text-[#eff1f5] transition-colors group-hover:text-[#ff9a73]">
                Speech-to-Text + FCM
              </h3>
              <p className="mt-3 text-[0.86rem] leading-relaxed text-[#9ca0ad] transition-colors group-hover:text-[#b0b5c7]">
                Multilingual voice transcription + Firebase Cloud Messaging for staff push notifications and guest broadcasts.
              </p>
            </article>
          </ScrollReveal>
        </div>
      </section>

      <section className="min-h-screen bg-[#05070b] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-full min-h-screen w-full max-w-[1280px] items-center justify-center">
          <div className="grid w-full gap-10 xl:grid-cols-[520px_minmax(0,1fr)] xl:items-center">
            <ScrollReveal>
              <div className="grid gap-4">
                <img
                  src="/malls.png"
                  alt="Malls and retail centers deployment"
                  className="h-64 w-full rounded-md border border-white/[0.08] object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
                <img
                  src="/hotel.png"
                  alt="Hotels and hospitality deployment"
                  className="h-64 w-full rounded-md border border-white/[0.08] object-cover brightness-150 transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <h2 className="font-display text-[2.4rem] text-[#eff1f6] sm:text-[3rem]">Production Ready</h2>
              <p className="mt-3 max-w-[620px] text-[1rem] leading-relaxed text-[#a2a7b4]">
                ARGOS backend runs on Firebase Cloud Functions with Firestore as the operational source of truth. Pub/Sub provides event ordering for crisis pipelines. All AI models have graceful fallbacks to ensure the system never goes dark, even if Gemini is unreachable.
              </p>

              <div className="mt-6 space-y-3">
                <DeploymentResult title="Uptime SLA" desc="99.95% on Google Cloud infrastructure" />
                <DeploymentResult title="Crisis Analysis" desc="Classification + orchestration in under 5 seconds" />
                <DeploymentResult title="Dispatch Quality" desc="98% accuracy with multi-modal context fusion" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}

function DeploymentResult({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden rounded-sm border border-white/[0.07] bg-[#1b1b1f]/75 px-4 py-3 transition-all hover:border-[var(--accent)]/40 hover:shadow-[0_0_20px_rgba(255,97,39,0.06)]">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <p className="relative z-10 flex items-center gap-2.5 font-display text-[1.1rem] text-[#f2f4f8]">
        <Trophy className="h-4 w-4 flex-none text-[#f0ab92] transition-colors group-hover:text-[#ff9a73]" strokeWidth={1.5} />
        {title}
      </p>
      <p className="relative z-10 mt-1 text-[0.82rem] text-[#9ba0ad]">{desc}</p>
    </div>
  )
}
