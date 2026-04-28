import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { ScrollReveal } from '../components/ScrollReveal'

export function SolutionsPage(): ReactElement {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_top,rgba(255,111,59,0.12),transparent_34%),linear-gradient(180deg,#160c07_0%,#0d0806_100%)] font-body text-[#f4f2ef]">
      <div className="relative mx-auto w-full max-w-[1520px] border-x border-white/[0.04] bg-[radial-gradient(circle_at_50%_0%,rgba(255,117,62,0.2),transparent_32%),linear-gradient(180deg,#120a08_0%,#090607_100%)]">
        <Navbar />

        <section className="min-h-screen px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_576px] xl:items-stretch">
            <ScrollReveal>
              <div className="flex max-w-[620px] flex-col justify-center py-8 xl:min-h-[640px] xl:py-0">
                <p className="inline-flex w-fit items-center gap-2 rounded-sm border border-[#2d1f19] bg-[rgba(90,52,40,0.55)] px-3 py-1 text-[0.58rem] font-semibold tracking-[0.2em] text-[#f5b39e]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f5b39e] animate-pulse" />
                  INDUSTRY SPECIFIC DEPLOYMENT
                </p>

                <h1 className="mt-9 font-display text-[2.95rem] leading-[0.96] text-white sm:text-[3.9rem] xl:text-[4rem]">
                  Mission Critical
                  <br />
                  <span className="text-[#ff9a73]">Ecosystems</span>
                </h1>

                <p className="mt-7 max-w-[520px] text-[0.96rem] leading-relaxed text-[#a7a19c] sm:text-[1rem]">
                  Tailored AI deployments engineered for high-density environments. ARGOS adapts its sensory matrix to the specific kinetic signatures of your industry.
                </p>

                <div className="mt-12 flex flex-wrap items-center gap-5">
                  <Link
                    to="/request-demo"
                    className="inline-flex items-center gap-2 rounded-sm bg-[var(--accent)] px-5 py-3 text-[0.62rem] font-semibold tracking-[0.22em] text-[#1f120b] transition hover:brightness-110 hover:shadow-[0_0_20px_rgba(255,97,39,0.4)]"
                  >
                    REQUEST DEMO
                    <span aria-hidden="true">{'=>'}</span>
                  </Link>
                  <Link
                    to="/hardware"
                    className="inline-flex items-center gap-2 border-b border-white/15 pb-1 text-[0.62rem] font-semibold tracking-[0.22em] text-[#d7d9e2] transition hover:text-white hover:border-[var(--accent)]"
                  >
                    EXPLORE HARDWARE
                    <span aria-hidden="true">{'=>'}</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <div className="relative min-h-[440px] overflow-hidden rounded-md border border-white/[0.06] shadow-[0_30px_80px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:shadow-[0_0_60px_rgba(255,97,39,0.15)] sm:min-h-[560px] xl:h-[640px] xl:min-h-0">
                <img
                  src="/solutions.png"
                  alt="ARGOS solutions deployment"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute left-5 top-5 z-10 h-8 w-10 border-l border-t border-[#f0a07f]/70" />
                <div className="pointer-events-none absolute right-5 bottom-5 z-10 h-8 w-10 border-r border-b border-[#f0a07f]/70" />
                <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.85)_100%)] px-5 py-4 text-[0.58rem] font-semibold tracking-[0.2em] text-[#f0b08f]">
                  <span>SYS_01 // ACTIVE</span>
                  <span className="flex items-center gap-2">
                    LV5
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff9a73] animate-pulse" />
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="flex min-h-screen flex-col justify-center px-4 pb-16 pt-2 sm:px-6 lg:px-8 lg:pb-18">
          <ScrollReveal>
            <div className="flex items-center gap-4">
              <h2 className="text-[1.65rem] font-semibold text-white sm:text-[1.9rem]">Active Sectors</h2>
              <div className="h-[2px] w-8 bg-[#ff8f60]" />
            </div>
          </ScrollReveal>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.72fr)]">
            <ScrollReveal>
              <article className="relative overflow-hidden rounded-md border border-white/[0.06] bg-[#171615] transition-all hover:border-[#ff8f60]/40 hover:shadow-[0_0_30px_rgba(255,143,96,0.08)]">
                <img
                  src="/malls.png"
                  alt="Malls and retail centers deployment"
                  className="absolute inset-0 h-full w-full object-cover opacity-65"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.75)_100%)]" />
                <div className="relative min-h-[312px] p-5 sm:p-6">
                  <div className="inline-flex items-center gap-2 rounded-sm border border-white/[0.08] bg-[rgba(98,61,44,0.5)] px-3 py-1 text-[0.55rem] font-semibold tracking-[0.2em] text-[#f0b49c]">
                    PRIMARY DEPLOYMENT
                  </div>
                  <h3 className="mt-24 max-w-[420px] font-display text-[1.9rem] leading-[0.98] text-white sm:text-[2.15rem]">
                    Malls & Retail Centers
                  </h3>
                  <p className="mt-3 max-w-[420px] text-[0.83rem] leading-relaxed text-[#a7a19c]">
                    Continuous foot-traffic intelligence across multi-floor environments. Early thermal and acoustic detection isolates incidents before they escalate into evacuations.
                  </p>

                  <div className="mt-11 grid grid-cols-2 gap-3">
                    <div className="rounded-sm border border-white/[0.06] bg-[#101010]/80 p-4 transition-colors hover:border-[#ff8f60]/30">
                      <p className="text-[0.53rem] font-semibold tracking-[0.2em] text-[#d4c6b7]">
                        FOOT TRAFFIC ACCURACY
                      </p>
                      <p className="mt-2 font-display text-[1.35rem] text-[#f4ede7]">99.8%</p>
                    </div>
                    <div className="rounded-sm border border-white/[0.06] bg-[#101010]/80 p-4 transition-colors hover:border-[#ff8f60]/30">
                      <p className="text-[0.53rem] font-semibold tracking-[0.2em] text-[#d4c6b7]">
                        INCIDENT RESPONSE
                      </p>
                      <p className="mt-2 font-display text-[1.35rem] text-[#ff9877]">{'< 0.2s'}</p>
                    </div>
                  </div>
                </div>
              </article>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <article className="relative h-full overflow-hidden rounded-md border border-white/[0.06] bg-[#141312] p-5 sm:p-6 transition-all hover:border-[#ff8f60]/40 hover:shadow-[0_0_30px_rgba(255,143,96,0.08)]">
                <img
                  src="/hotel.png"
                  alt="Hotels and hospitality deployment"
                  className="absolute inset-0 h-full w-full object-cover opacity-65"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.75)_100%)]" />
                <div className="relative flex h-full min-h-[416px] flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-sm border border-white/[0.08] bg-[rgba(72,70,67,0.45)] px-3 py-1 text-[0.55rem] font-semibold tracking-[0.2em] text-[#d6c8bf]">
                      PRIMARY DEPLOYMENT
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
                      <span className="flex items-center gap-2 text-[#ff9877]">
                        +45%
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ff9877] animate-pulse" />
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.12}>
            <article className="relative mt-6 overflow-hidden rounded-md border border-white/[0.06] bg-[#11100f] p-5 sm:p-6 transition-all hover:border-[#ff8f60]/40 hover:shadow-[0_0_30px_rgba(255,143,96,0.08)]">
              <img
                src="/stadium.png"
                alt="Stadiums and venues deployment"
                className="absolute inset-0 h-full w-full object-cover opacity-55"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.8)_100%)]" />
              <div className="relative flex min-h-[192px] flex-col justify-between lg:flex-row lg:items-end">
                <div className="max-w-[700px]">
                  <div className="inline-flex items-center gap-2 rounded-sm border border-white/[0.08] bg-[rgba(96,59,43,0.45)] px-3 py-1 text-[0.55rem] font-semibold tracking-[0.2em] text-[#f0b49c]">
                    SECONDARY DEPLOYMENT
                  </div>
                  <h3 className="mt-4 font-display text-[1.92rem] leading-[0.98] text-white sm:text-[2.3rem]">
                    Stadiums & Venues
                  </h3>
                  <p className="mt-4 max-w-[560px] border-l border-[#ff8d5c] pl-4 text-[0.86rem] leading-relaxed text-[#a7a19c]">
                    Real-time crowd density mapping to prevent stampedes. Acoustic anomaly detection isolates panic signatures over background noise across high-capacity venues.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 lg:mt-0 lg:min-w-[220px]">
                  <div className="rounded-sm border border-white/[0.06] bg-[#101010]/85 p-4 text-center transition-colors hover:border-[#ff8f60]/30">
                    <p className="font-display text-[1.82rem] text-white">{'< 0.2s'}</p>
                    <p className="mt-1 text-[0.52rem] font-semibold tracking-[0.2em] text-[#d2c5bd]">
                      ACOUSTIC ISOLATION
                    </p>
                  </div>
                  <div className="rounded-sm border border-white/[0.06] bg-[#101010]/85 p-4 text-center transition-colors hover:border-[#ff8f60]/30">
                    <p className="font-display text-[1.82rem] text-[#ff9a73]">99.8%</p>
                    <p className="mt-1 text-[0.52rem] font-semibold tracking-[0.2em] text-[#d2c5bd]">
                      DENSITY TRACKING
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </ScrollReveal>
        </section>

        <Footer />
      </div>
    </main>
  )
}
