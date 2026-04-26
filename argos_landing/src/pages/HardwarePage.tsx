import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.png'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
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
    <main className="relative min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_top,rgba(255,111,59,0.12),transparent_34%),linear-gradient(180deg,#160c07_0%,#0d0806_100%)] font-body text-[var(--text)]">
      <div className="relative mx-auto w-full max-w-[1520px] border-x border-white/[0.04] bg-[radial-gradient(circle_at_50%_0%,rgba(255,97,39,0.1),transparent_30%),linear-gradient(180deg,#120a08_0%,#090607_100%)]">
        <Navbar />

        <section className="min-h-screen px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-20">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-center">
            <ScrollReveal>
              <div className="max-w-[640px]">
                <p className="inline-flex items-center gap-2 rounded-sm bg-[rgba(120,60,33,0.5)] px-3 py-1 text-[0.58rem] font-semibold tracking-[0.2em] text-[#f4b39a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f4b39a] animate-pulse" />
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

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/request-demo"
                    className="inline-flex items-center gap-2 rounded-sm bg-[var(--accent)] px-5 py-3 text-[0.62rem] font-semibold tracking-[0.22em] text-[#1f120b] transition hover:brightness-110 hover:shadow-[0_0_20px_rgba(255,97,39,0.4)]"
                  >
                    REQUEST DEMO
                    <span aria-hidden="true">{'=>'}</span>
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 border-b border-white/15 pb-1 text-xs font-semibold tracking-[0.2em] text-[#d7d9e2] transition hover:text-white hover:border-[var(--accent)]"
                  >
                    BACK TO TOP
                    <span aria-hidden="true">{'=>'}</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <div className="relative overflow-hidden rounded-lg border border-white/[0.09] bg-[radial-gradient(circle_at_50%_35%,#205a76_0%,#132833_44%,#0f1720_100%)] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:shadow-[0_0_70px_rgba(0,0,0,0.7)]">
                <div className="pointer-events-none absolute inset-0 opacity-25 [background:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
                <div className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l border-t border-[#9da4ad]/60" />
                <div className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b border-r border-[#9da4ad]/60" />

                <img
                  src={heroImg}
                  alt="Argos hardware device"
                  className="relative z-10 mx-auto w-full max-w-[350px] rounded-md object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:scale-105"
                />
                <p className="relative z-10 mt-4 text-center font-display text-3xl text-[#d7dbe4]">SAFE WORK</p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="flex min-h-screen flex-col justify-center border-t border-white/[0.04] bg-[linear-gradient(180deg,#141318_0%,#121216_100%)] px-4 py-14 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-display text-[2.5rem] text-[#eef0f5] sm:text-[3rem]">NVIDIA Jetson Optimized</h2>
            <p className="mt-3 max-w-[760px] text-[0.96rem] leading-relaxed text-[#a4a8b5]">
              Hardware-level acceleration tailored specifically for deep learning models
              operating at the edge. No cloud dependency. No downtime.
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featureCards.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={0.06 * index}>
                <article className="group relative h-full overflow-hidden rounded-md border border-white/[0.07] bg-[#313136]/72 p-6 transition-all hover:border-[var(--accent)]/40 hover:shadow-[0_0_25px_rgba(255,97,39,0.08)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <p className="font-display text-xl text-[#f1ad96] transition-colors group-hover:text-[#ff9a73]">{feature.icon}</p>
                  <h3 className="mt-4 font-display text-[1.45rem] leading-tight text-[#eff1f5] transition-colors group-hover:text-[#ff9a73]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-[0.86rem] leading-relaxed text-[#9ca0ad] transition-colors group-hover:text-[#b0b5c7]">
                    {feature.description}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="min-h-screen bg-[#05070b] px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex h-full min-h-screen items-center">
            <div className="grid gap-10 xl:grid-cols-[520px_minmax(0,1fr)] xl:items-center">
              <ScrollReveal>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-56 rounded-md border border-white/[0.08] bg-[linear-gradient(160deg,#5e8dac,#2f4f62_50%,#163246)] transition-transform duration-500 hover:scale-105" />
                  <div className="h-56 rounded-md border border-white/[0.08] bg-[radial-gradient(circle_at_45%_30%,#49a0c3_0%,#18435e_40%,#0e1f2f_100%)] transition-transform duration-500 hover:scale-105" />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08}>
                <h2 className="font-display text-[2.4rem] text-[#eff1f6] sm:text-[3rem]">Industrial Durability</h2>
                <p className="mt-3 max-w-[620px] text-[1rem] leading-relaxed text-[#a2a7b4]">
                  Engineered for zero failure tolerance. Deployed in critical infrastructure
                  worldwide, the ARGOS sensor chassis withstands extreme temperatures,
                  vibrations, and weather conditions.
                </p>

                <div className="mt-6 space-y-3">
                  {deploymentItems.map((item) => (
                    <div
                      key={item.title}
                      className="group relative overflow-hidden rounded-sm border border-white/[0.07] bg-[#1b1b1f]/75 px-4 py-3 transition-all hover:border-[var(--accent)]/40 hover:shadow-[0_0_20px_rgba(255,97,39,0.06)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <p className="relative z-10 font-display text-[1.1rem] text-[#f2f4f8]">
                        <span className="mr-2 text-[#f0ab92] transition-colors group-hover:text-[#ff9a73]">{item.icon}</span>
                        {item.title}
                      </p>
                      <p className="relative z-10 mt-1 text-[0.82rem] text-[#9ba0ad]">{item.description}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
