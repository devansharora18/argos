import type { ReactElement } from 'react'
import heroImg from '../assets/hero.png'
import { ScrollReveal } from '../components/ScrollReveal'

type FeatureCard = {
  icon: string
  title: string
  description: string
}

type DeploymentItem = {
  icon: string
  title: string
  description: string
}

const navItems = ['TECHNOLOGY', 'SOLUTIONS', 'HARDWARE']

const featureCards: FeatureCard[] = [
  {
    icon: '◍',
    title: 'Orin Architecture',
    description:
      'Ampere architecture GPU with 2048 NVIDIA CUDA cores and 64 Tensor Cores for unparalleled inference throughput.',
  },
  {
    icon: '◔',
    title: 'TensorRT Acceleration',
    description:
      'Native integration with NVIDIA TensorRT, maximizing performance and reducing memory footprint for complex vision models.',
  },
  {
    icon: '⌁',
    title: 'Edge-Native Inference',
    description:
      'Processes up to 8 concurrent 4K video streams locally, ensuring operational continuity even in disconnected environments.',
  },
]

const deploymentItems: DeploymentItem[] = [
  {
    icon: '▣',
    title: 'Stadiums & Arenas',
    description: 'High-density crowd monitoring and anomaly detection.',
  },
  {
    icon: '▦',
    title: 'Smart Cities',
    description: 'Traffic analytics and public safety incident response.',
  },
  {
    icon: '✚',
    title: 'Hospitals',
    description: 'Perimeter security and restricted area access control.',
  },
]

export function HardwarePage(): ReactElement {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[var(--bg)] font-body text-[var(--text)]">
      <div className="relative mx-auto w-full max-w-[1520px] border-x border-white/[0.04] bg-[linear-gradient(180deg,#0b0c11_0%,#0a0b10_100%)]">
        <header className="border-b border-white/[0.04] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8 lg:gap-12">
              <a href="#/crisis" className="font-display text-[1.35rem] font-semibold tracking-[0.05em] text-white">
                ARGOS
              </a>
              <nav className="hidden items-center gap-8 md:flex">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={item === 'HARDWARE' ? '#/hardware' : '#/crisis'}
                    className={`text-[0.6rem] font-semibold tracking-[0.22em] transition ${
                      item === 'HARDWARE'
                        ? 'text-[var(--accent)] underline decoration-[var(--accent)] underline-offset-[6px]'
                        : 'text-[#727785] hover:text-[#b4b8c4]'
                    }`}
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                className="rounded-sm border border-white/12 px-4 py-2 text-[0.58rem] font-semibold tracking-[0.2em] text-[#b7bbc7] transition hover:border-white/25 hover:text-white"
              >
                REQUEST DEMO
              </button>
              <button
                type="button"
                className="rounded-sm bg-[var(--accent)] px-4 py-2 text-[0.58rem] font-semibold tracking-[0.2em] text-[#1f120b] transition hover:brightness-110"
              >
                EMERGENCY CONTACT
              </button>
            </div>
          </div>
        </header>

        <section className="px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-20">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-center">
            <ScrollReveal>
              <div className="max-w-[640px]">
                <p className="inline-flex items-center gap-2 rounded-sm bg-[rgba(120,60,33,0.5)] px-3 py-1 text-[0.58rem] font-semibold tracking-[0.2em] text-[#f4b39a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f4b39a]" />
                  HARDWARE SPECS
                </p>

                <h1 className="mt-6 font-display text-[3.3rem] leading-[0.98] text-[#eef0f6] sm:text-[4rem]">
                  Built for
                  <br />
                  <span className="text-[#ffa07e]">The Edge.</span>
                </h1>

                <p className="mt-7 max-w-[560px] text-[1.05rem] leading-relaxed text-[#a6aab7]">
                  A mission-critical sensor array engineered for zero-latency AI inference in
                  the harshest environments. Designed as a physical extension of the kinetic
                  command center.
                </p>

                <div className="mt-8 border-t border-white/[0.07] pt-4">
                  <div className="grid max-w-[420px] grid-cols-2 gap-8">
                    <div>
                      <p className="text-[0.58rem] font-semibold tracking-[0.2em] text-[#6b6f7d]">
                        LATENCY
                      </p>
                      <p className="mt-1 font-display text-[2rem] text-[#f2f4f8]">{'< 5ms'}</p>
                    </div>
                    <div>
                      <p className="text-[0.58rem] font-semibold tracking-[0.2em] text-[#6b6f7d]">
                        PROCESSING
                      </p>
                      <p className="mt-1 font-display text-[2rem] text-[#f2f4f8]">275 TOPS</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <div className="relative overflow-hidden rounded-lg border border-white/[0.09] bg-[radial-gradient(circle_at_50%_35%,#205a76_0%,#132833_44%,#0f1720_100%)] p-8">
                <div className="pointer-events-none absolute inset-0 opacity-25 [background:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
                <div className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l border-t border-[#9da4ad]/60" />
                <div className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b border-r border-[#9da4ad]/60" />

                <img
                  src={heroImg}
                  alt="Argos hardware device"
                  className="relative z-10 mx-auto w-full max-w-[350px] rounded-md object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.7)]"
                />
                <p className="relative z-10 mt-4 text-center font-display text-3xl text-[#d7dbe4]">
                  safe work
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-t border-white/[0.04] bg-[linear-gradient(180deg,#141318_0%,#121216_100%)] px-4 py-14 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-display text-[2.5rem] text-[#eef0f5] sm:text-[3rem]">
              NVIDIA Jetson Optimized
            </h2>
            <p className="mt-3 max-w-[760px] text-[0.96rem] leading-relaxed text-[#a4a8b5]">
              Hardware-level acceleration tailored specifically for deep learning models
              operating at the edge. No cloud dependency. No downtime.
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featureCards.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={0.06 * index}>
                <article className="h-full rounded-md border border-white/[0.07] bg-[#313136]/72 p-6">
                  <p className="font-display text-xl text-[#f1ad96]">{feature.icon}</p>
                  <h3 className="mt-4 font-display text-[1.45rem] leading-tight text-[#eff1f5]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-[0.86rem] leading-relaxed text-[#9ca0ad]">
                    {feature.description}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="bg-[#05070b] px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[520px_minmax(0,1fr)] xl:items-center">
            <ScrollReveal>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-56 rounded-md border border-white/[0.08] bg-[linear-gradient(160deg,#5e8dac,#2f4f62_50%,#163246)]" />
                <div className="h-56 rounded-md border border-white/[0.08] bg-[radial-gradient(circle_at_45%_30%,#49a0c3_0%,#18435e_40%,#0e1f2f_100%)]" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <h2 className="font-display text-[2.4rem] text-[#eff1f6] sm:text-[3rem]">
                Industrial Durability
              </h2>
              <p className="mt-3 max-w-[620px] text-[1rem] leading-relaxed text-[#a2a7b4]">
                Engineered for zero failure tolerance. Deployed in critical infrastructure
                worldwide, the ARGOS sensor chassis withstands extreme temperatures,
                vibrations, and weather conditions.
              </p>

              <div className="mt-6 space-y-3">
                {deploymentItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-sm border border-white/[0.07] bg-[#1b1b1f]/75 px-4 py-3"
                  >
                    <p className="font-display text-[1.1rem] text-[#f2f4f8]">
                      <span className="mr-2 text-[#f0ab92]">{item.icon}</span>
                      {item.title}
                    </p>
                    <p className="mt-1 text-[0.82rem] text-[#9ba0ad]">{item.description}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <footer className="border-t border-white/[0.04] bg-[#101116] px-4 py-8 text-[0.6rem] font-semibold tracking-[0.2em] sm:px-6 lg:px-8">
          <div className="grid gap-8 text-[#676c79] md:grid-cols-3">
            <div>
              <p className="text-[var(--accent)]">ARGOS</p>
              <p className="mt-3 max-w-[320px] leading-relaxed">
                © 2024 ARGOS EDGE-AI PLATFORM. MISSION CRITICAL STATUS: ACTIVE.
              </p>
            </div>
            <div className="space-y-3">
              <p>INFRASTRUCTURE</p>
              <p>NG9-1-1 COMPLIANCE</p>
            </div>
            <div className="space-y-3">
              <p>SYSTEM STATUS</p>
              <p>PRIVACY PROTOCOL</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
