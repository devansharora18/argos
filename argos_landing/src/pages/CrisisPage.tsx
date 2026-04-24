import { motion, useScroll, useTransform } from 'framer-motion'
import type { ReactElement } from 'react'
import heroImg from '../assets/hero.png'
import { Navbar } from '../components/Navbar'
import { ScrollReveal } from '../components/ScrollReveal'

type ModelCard = {
  title: string
  description: string
  icon: string
  status?: string
}

const modelCards: ModelCard[] = [
  {
    title: 'Thermal Anomalies',
    description:
      'Detects rapid temperature spikes and early-stage combustion via IR sensor fusion.',
    icon: 'IR',
    status: 'ACTIVE',
  },
  {
    title: 'Medical Distress',
    description:
      'Identifies irregular movement patterns indicative of falls, seizures, or physical distress.',
    icon: 'MED',
    status: 'ACTIVE',
  },
  {
    title: 'Fluid Contamination',
    description:
      'Spectrometric analysis of local water supplies for immediate contamination alerts.',
    icon: 'H2O',
  },
  {
    title: 'Atmospheric Toxins',
    description: 'Detects dangerous gas concentrations and airborne particulate spikes.',
    icon: 'GAS',
  },
]

const footerLinks = [
  'INFRASTRUCTURE',
  'NG9-1-1 COMPLIANCE',
  'SYSTEM STATUS',
  'PRIVACY PROTOCOL',
]

function SmallModelCard({ card, delay }: { card: ModelCard; delay: number }): ReactElement {
  return (
    <ScrollReveal delay={delay} className="h-full">
      <article className="relative flex h-full flex-col rounded-xl border border-white/6 bg-[#13151c]/92 p-6 sm:p-7">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-display text-xs tracking-[0.12em] text-[#f0b399]">
          {card.icon}
        </div>
        <h3 className="mt-6 max-w-[220px] font-display text-[1.45rem] leading-tight text-[#f2f3f7] sm:text-[1.6rem]">
          {card.title}
        </h3>
        <p className="mt-3 max-w-[230px] text-[0.92rem] leading-relaxed text-[#9498a7] sm:text-sm">
          {card.description}
        </p>
        {card.status ? (
          <p className="mt-auto pt-4 text-[0.6rem] font-semibold tracking-[0.2em] text-[#f0b399]">
            * {card.status}
          </p>
        ) : null}
      </article>
    </ScrollReveal>
  )
}

export function CrisisPage(): ReactElement {
  const { scrollYProgress } = useScroll()
  const glowOneY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const glowTwoY = useTransform(scrollYProgress, [0, 1], [0, -160])

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[var(--bg)] font-body text-[var(--text)]">
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 h-[42rem] w-[68rem] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(255,97,39,0.22),rgba(255,97,39,0)_66%)] blur-2xl"
        style={{ y: glowOneY }}
      />
      <motion.div
        className="pointer-events-none absolute right-[-8rem] top-[18rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,97,39,0.14),rgba(255,97,39,0)_74%)] blur-3xl"
        style={{ y: glowTwoY }}
      />

      <div className="relative mx-auto w-full max-w-[1520px] border-x border-white/[0.04] bg-[linear-gradient(180deg,#0a0b10_0%,#090a0f_100%)]">
        <Navbar />

        <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_576px] xl:items-stretch">
            <ScrollReveal>
              <div className="flex flex-col justify-center py-8 xl:min-h-[640px] xl:py-0">
                <div className="inline-flex w-fit items-center gap-2 rounded-sm bg-[#a1161a] px-3 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  MISSION CRITICAL STATUS: ACTIVE
                </div>

                <h1 className="mt-9 max-w-[620px] font-display text-[3.75rem] font-semibold leading-[0.92] text-[#f4f5f8] sm:text-[4.2rem]">
                  CRISIS DETECTION
                  <br />
                  AT THE EDGE.
                </h1>

                <p className="mt-7 max-w-[560px] text-[1.05rem] leading-relaxed text-[#a5a9b6]">
                  90MS LATENCY. ZERO INTERNET. The ARGOS platform operates entirely
                  off-grid, deploying 7 concurrent AI models directly on tactical hardware to
                  analyze mission-critical telemetry instantly.
                </p>

                <div className="mt-12 flex flex-wrap items-center gap-5">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 border-b border-transparent pb-1 text-xs font-semibold tracking-[0.2em] text-[#8f94a3] transition hover:border-[#252936] hover:text-[#c9cdd9]"
                  >
                    DEPLOY SYSTEM
                    <span aria-hidden="true">{'->'}</span>
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 border-b border-white/15 pb-1 text-xs font-semibold tracking-[0.2em] text-[#d7d9e2] transition hover:text-white"
                  >
                    VIEW SPECS
                    <span aria-hidden="true">[]</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="relative min-h-[440px] overflow-hidden rounded-xl border border-white/8 bg-[#0c0d12] sm:min-h-[560px] xl:h-[640px] xl:min-h-0">
                <img
                  src={heroImg}
                  alt="Argos edge compute board"
                  className="h-full w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,10,0.52),rgba(6,7,10,0.3)_36%,rgba(6,7,10,0.58))]" />

                <div className="absolute left-6 right-6 top-6 flex items-center justify-between text-[0.55rem] font-semibold tracking-[0.18em] text-[#c3c8d7]">
                  <span>SYS_ID: ARG-20-NVIDIA</span>
                  <span className="text-right leading-relaxed">LATENCY: 87.4MS<br />TEMP: 42 C</span>
                </div>

                <div className="absolute bottom-6 left-6 h-14 w-36 rounded-sm border border-white/12 bg-[#08090d]/72 p-2">
                  <svg viewBox="0 0 128 32" className="h-full w-full">
                    <polyline
                      points="0,24 10,18 20,26 30,14 40,22 50,10 60,24 70,12 80,20 90,8 100,16 110,10 120,18 128,9"
                      fill="none"
                      stroke="#f0b399"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                <div className="absolute bottom-7 right-6 flex items-center gap-2 text-[0.55rem] font-semibold tracking-[0.18em] text-[#d8dbe6]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  PROCESSING
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-y border-white/[0.04] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <ScrollReveal>
            <p className="text-[0.64rem] font-semibold tracking-[0.22em] text-[#cc9a84]">
              CORE INTELLIGENCE
            </p>
            <h2 className="mt-4 font-display text-[3rem] font-semibold leading-[0.95] text-[#f4f5f8] sm:text-[3.4rem]">
              THE 7 CONCURRENT MODELS
            </h2>
            <p className="mt-5 max-w-[700px] text-[1.02rem] leading-relaxed text-[#9da1af]">
              Processing disparate visual, thermal, and acoustic data streams simultaneously
              without relying on cloud infrastructure.
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-6 xl:grid-cols-[280px_280px_minmax(0,1fr)] xl:grid-rows-[240px_240px]">
            <SmallModelCard card={modelCards[0]} delay={0.06} />
            <SmallModelCard card={modelCards[1]} delay={0.12} />

            <ScrollReveal delay={0.18} className="h-full xl:row-span-2">
              <article className="relative flex h-full flex-col rounded-xl border border-white/6 bg-[#14161d]/92 p-6 sm:p-7">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-display text-xs tracking-[0.12em] text-[#f0b399]">
                  SNS
                </div>
                <h3 className="mt-5 max-w-[460px] font-display text-[1.85rem] leading-tight text-[#f2f3f7] sm:text-[2rem]">
                  Seismic and Structural Integrity
                </h3>
                <p className="mt-3 max-w-[450px] text-[0.93rem] leading-relaxed text-[#9498a7] sm:text-sm">
                  Continuous micro-vibration analysis to detect early earthquake tremors and
                  structural fatigue in critical infrastructure before visible failure occurs.
                </p>

                <div className="mt-auto pt-8">
                  <div className="rounded-md border border-white/10 bg-[#2a2d36] p-4">
                    <div className="flex h-24 items-end gap-1.5">
                      {[20, 32, 18, 44, 76, 54, 28].map((height, index) => (
                        <div
                          key={height + index}
                          className={`relative flex-1 rounded-sm ${
                            index === 4 ? 'bg-[#f0b399]' : 'bg-[#93766c]'
                          }`}
                          style={{ height }}
                        >
                          {index === 4 ? (
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-[2px] bg-[#cf1e26] px-1.5 py-0.5 text-[0.5rem] font-bold tracking-[0.16em] text-white">
                              ALERT
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </ScrollReveal>

            <SmallModelCard card={modelCards[2]} delay={0.14} />
            <SmallModelCard card={modelCards[3]} delay={0.2} />
          </div>
        </section>

        <footer className="px-4 pb-8 pt-16 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-[0.62rem] font-semibold tracking-[0.2em] text-[var(--accent)]">ARGOS</p>
            <div className="mt-10 flex flex-col gap-4 text-[0.62rem] font-semibold tracking-[0.2em] text-[#727785] sm:max-w-[300px]">
              {footerLinks.map((item) => (
                <a key={item} href="#" className="transition hover:text-[#b8bcc8]">
                  {item}
                </a>
              ))}
            </div>
          </ScrollReveal>

          <div className="mt-14 border-t border-white/[0.04] pt-8 text-[0.54rem] font-semibold tracking-[0.2em] text-[#5f6370]">
            &copy; 2024 ARGOS EDGE-AI PLATFORM. MISSION CRITICAL STATUS: ACTIVE.
          </div>
        </footer>
      </div>
    </main>
  )
}
