import type { ReactElement } from 'react'
import { Navbar } from '../components/Navbar'
import { ScrollReveal } from '../components/ScrollReveal'

export function SolutionsPage(): ReactElement {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050404] font-body text-[#f4f2ef]">
      <div className="relative mx-auto w-full max-w-[1520px] border-x border-white/[0.04] bg-[radial-gradient(circle_at_50%_0%,rgba(255,117,62,0.16),transparent_32%),linear-gradient(180deg,#070605_0%,#050404_100%)]">
        <Navbar />

        <section className="px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-10">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_500px] xl:items-start">
            <ScrollReveal>
              <div className="max-w-[620px] pt-6 xl:pt-8">
                <p className="inline-flex items-center gap-2 rounded-sm border border-[#2d1f19] bg-[rgba(90,52,40,0.55)] px-3 py-1 text-[0.58rem] font-semibold tracking-[0.2em] text-[#f5b39e]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f5b39e]" />
                  INDUSTRY SPECIFIC DEPLOYMENT
                </p>

                <h1 className="mt-5 font-display text-[2.95rem] leading-[0.96] text-white sm:text-[3.9rem] xl:text-[4rem]">
                  Mission Critical
                  <br />
                  <span className="text-[#ff9a73]">Ecosystems</span>
                </h1>

                <p className="mt-5 max-w-[520px] text-[0.96rem] leading-relaxed text-[#a7a19c] sm:text-[1rem]">
                  Tailored AI deployments engineered for high-density environments. ARGOS adapts its sensory matrix to the specific kinetic signatures of your industry.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <div className="relative overflow-hidden rounded-md border border-white/[0.06] bg-[linear-gradient(180deg,#3a352f_0%,#1d1b19_100%)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,148,102,0.1),transparent_40%)]" />
                <div className="pointer-events-none absolute left-5 top-5 h-8 w-10 border-l border-t border-[#f0a07f]/70" />
                <div className="pointer-events-none absolute right-5 bottom-5 h-8 w-10 border-r border-b border-[#f0a07f]/70" />
                <div className="mx-auto flex h-[314px] max-w-[392px] items-center justify-center rounded-md bg-[linear-gradient(180deg,#47403c_0%,#22201d_70%,#191716_100%)] shadow-inner shadow-black/40">
                  <div className="relative h-[236px] w-[178px] rounded-sm border border-white/10 bg-[linear-gradient(180deg,#3a3735_0%,#1f1d1b_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                    <div className="absolute inset-x-2 top-2 bottom-2 rounded-[3px] border border-white/[0.04] bg-[linear-gradient(180deg,#2f2d2b_0%,#171615_100%)]" />
                    <div className="absolute left-4 top-4 h-[200px] w-[44px] rounded-[2px] bg-[repeating-linear-gradient(180deg,#181716_0_6px,#2d2b28_6px_12px)]" />
                    <div className="absolute right-4 top-4 h-[200px] w-[44px] rounded-[2px] bg-[repeating-linear-gradient(180deg,#1a1817_0_6px,#35302d_6px_12px)]" />
                    <div className="absolute inset-y-4 left-1/2 w-[52px] -translate-x-1/2 rounded-[2px] bg-[repeating-linear-gradient(180deg,#0f0f10_0_5px,#232224_5px_10px)] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]" />
                    <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35 bg-[radial-gradient(circle,#8b857e_0%,#655f58_55%,#2e2c29_100%)] shadow-[0_0_0_8px_rgba(255,255,255,0.05)]" />
                    <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-[linear-gradient(180deg,#b7b1a6_0%,#5f5a53_100%)]" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-[0.58rem] font-semibold tracking-[0.2em] text-[#f0b08f]">
                  <span>SYS_01 // ACTIVE</span>
                  <span>LV5</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="px-4 pb-16 pt-2 sm:px-6 lg:px-8 lg:pb-18">
          <ScrollReveal>
            <h2 className="text-[1.65rem] font-semibold text-white sm:text-[1.9rem]">Active Sectors</h2>
            <div className="mt-2 h-[2px] w-8 bg-[#ff8f60]" />
          </ScrollReveal>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.72fr)]">
            <ScrollReveal>
              <article className="relative overflow-hidden rounded-md border border-white/[0.06] bg-[#171615]">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.55)),radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.12),transparent_42%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
                <div className="relative min-h-[312px] p-5 sm:p-6">
                  <div className="inline-flex items-center gap-2 rounded-sm border border-white/[0.08] bg-[rgba(98,61,44,0.5)] px-3 py-1 text-[0.55rem] font-semibold tracking-[0.2em] text-[#f0b49c]">
                    ARGOS ENABLED
                  </div>
                  <h3 className="mt-24 max-w-[420px] font-display text-[1.9rem] leading-[0.98] text-white sm:text-[2.15rem]">
                    Stadiums & Venues
                  </h3>
                  <p className="mt-3 max-w-[420px] text-[0.83rem] leading-relaxed text-[#a7a19c]">
                    Real-time crowd density mapping to prevent stampedes. Acoustic anomaly detection isolates panic signatures over background noise.
                  </p>

                  <div className="mt-11 grid grid-cols-2 gap-3">
                    <div className="rounded-sm border border-white/[0.06] bg-[#101010]/80 p-4">
                      <p className="text-[0.53rem] font-semibold tracking-[0.2em] text-[#d4c6b7]">
                        DENSITY TRACKING
                      </p>
                      <p className="mt-2 font-display text-[1.35rem] text-[#f4ede7]">99.8%</p>
                    </div>
                    <div className="rounded-sm border border-white/[0.06] bg-[#101010]/80 p-4">
                      <p className="text-[0.53rem] font-semibold tracking-[0.2em] text-[#d4c6b7]">
                        ACOUSTIC ISOLATION
                      </p>
                      <p className="mt-2 font-display text-[1.35rem] text-[#ff9877]">{'< 0.2s'}</p>
                    </div>
                  </div>
                </div>
              </article>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <article className="relative h-full overflow-hidden rounded-md border border-white/[0.06] bg-[linear-gradient(180deg,#141312_0%,#11100f_100%)] p-5 sm:p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_35%),linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
                <div className="relative flex h-full min-h-[416px] flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-sm border border-white/[0.08] bg-[rgba(72,70,67,0.45)] px-3 py-1 text-[0.55rem] font-semibold tracking-[0.2em] text-[#d6c8bf]">
                      SECTOR 02
                    </div>
                    <h3 className="mt-20 max-w-[240px] font-display text-[1.82rem] leading-[0.98] text-white">
                      Hotels & Hospitality
                    </h3>
                    <p className="mt-3 max-w-[250px] text-[0.82rem] leading-relaxed text-[#a7a19c]">
                      Hyper-localized thermal detection for early fire warnings. Automated, personalized evacuation routing distributed to guest devices.
                    </p>
                  </div>

                  <div className="border-t border-white/[0.06] pt-4 text-[0.58rem] font-semibold tracking-[0.2em] text-[#f3c0a7]">
                    <div className="flex items-center justify-between">
                      <span>EVAC EFFICIENCY</span>
                      <span className="text-[#ff9877]">+45%</span>
                    </div>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.12}>
            <article className="relative mt-6 overflow-hidden rounded-md border border-white/[0.06] bg-[linear-gradient(180deg,#11100f_0%,#0d0d0d_100%)] p-5 sm:p-6">
              <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px);background-size:22px_22px]" />
              <div className="relative flex min-h-[192px] flex-col justify-between lg:flex-row lg:items-end">
                <div className="max-w-[700px]">
                  <div className="inline-flex items-center gap-2 rounded-sm border border-white/[0.08] bg-[rgba(96,59,43,0.45)] px-3 py-1 text-[0.55rem] font-semibold tracking-[0.2em] text-[#f0b49c]">
                    GRID LEVEL INTEGRATION
                  </div>
                  <h3 className="mt-4 font-display text-[1.92rem] leading-[0.98] text-white sm:text-[2.3rem]">
                    Smart City Infrastructure
                  </h3>
                  <p className="mt-4 max-w-[560px] border-l border-[#ff8d5c] pl-4 text-[0.86rem] leading-relaxed text-[#a7a19c]">
                    Decentralized node networks creating a unified sensory canopy over metropolitan areas. Instantaneous threat vector analysis shared across emergency services.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 lg:mt-0 lg:min-w-[220px]">
                  <div className="rounded-sm border border-white/[0.06] bg-[#101010]/85 p-4 text-center">
                    <p className="font-display text-[1.82rem] text-white">0.05ms</p>
                    <p className="mt-1 text-[0.52rem] font-semibold tracking-[0.2em] text-[#d2c5bd]">
                      NODE SYNC
                    </p>
                  </div>
                  <div className="rounded-sm border border-white/[0.06] bg-[#101010]/85 p-4 text-center">
                    <p className="font-display text-[1.82rem] text-[#ff9a73]">10k+</p>
                    <p className="mt-1 text-[0.52rem] font-semibold tracking-[0.2em] text-[#d2c5bd]">
                      ACTIVE NODES
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </ScrollReveal>
        </section>

        <footer className="border-t border-white/[0.04] bg-[#101116] px-4 py-8 text-[0.6rem] font-semibold tracking-[0.2em] sm:px-6 lg:px-8">
          <div className="grid gap-8 text-[#676c79] md:grid-cols-4 md:items-start">
            <div>
              <p className="text-[var(--accent)]">ARGOS</p>
              <p className="mt-3 max-w-[320px] leading-relaxed">
                © 2024 ARGOS EDGE-AI PLATFORM. MISSION CRITICAL STATUS: ACTIVE.
              </p>
            </div>
            <div className="space-y-3">
              <p>OPERATIONS</p>
              <p>INFRASTRUCTURE</p>
              <p>NG9-1-1 COMPLIANCE</p>
            </div>
            <div className="space-y-3">
              <p>MONITORING</p>
              <p>SYSTEM STATUS</p>
              <p>PRIVACY PROTOCOL</p>
            </div>
            <div className="flex justify-start md:justify-end">
              <div className="inline-flex items-center gap-2 rounded-sm border border-[#5c382b] bg-[rgba(98,60,44,0.45)] px-3 py-2 text-[0.55rem] font-semibold tracking-[0.2em] text-[#f4b39a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f4b39a]" />
                SYSTEM ONLINE
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
