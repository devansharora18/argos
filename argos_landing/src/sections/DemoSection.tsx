import { useState, type ReactElement } from 'react'
import { ScrollReveal } from '../components/ScrollReveal'
import demo1 from '../assets/screenshots/demo-1.png'
import demo2 from '../assets/screenshots/demo-2.png'
import demo3 from '../assets/screenshots/demo-3.png'
import demo4 from '../assets/screenshots/demo-4.png'

const screenshots = [
  { src: demo1, alt: 'ARGOS control room dashboard', tag: 'CONTROL ROOM' },
  { src: demo2, alt: 'ARGOS incident map view', tag: 'INCIDENT MAP' },
  { src: demo3, alt: 'ARGOS AI classification panel', tag: 'AI PIPELINE' },
  { src: demo4, alt: 'ARGOS mobile client', tag: 'FIELD CLIENT' },
]

export function DemoSection(): ReactElement {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <section id="demo" className="border-t border-white/[0.04] px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1520px]">
        <ScrollReveal>
          <p className="text-[0.64rem] font-semibold tracking-[0.22em] text-[#cc9a84]">
            DEMO GALLERY
          </p>
          <h2 className="mt-4 font-display text-[3rem] font-semibold leading-[0.95] text-[#f4f5f8] sm:text-[3.4rem]">
            See ARGOS In Action
          </h2>
          <p className="mt-5 max-w-[720px] text-[1.02rem] leading-relaxed text-[#9da1af]">
            Real interface views from the ARGOS crisis management platform — from the control room dashboard to the mobile field client.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-2 gap-5 lg:gap-8 xl:grid-cols-4">
          {screenshots.map((shot, index) => (
            <ScrollReveal key={shot.tag} delay={0.06 * index}>
              <button
                type="button"
                onClick={() => setExpanded(expanded === index ? null : index)}
                className="group relative w-full text-left transition-all"
              >
                <div className="relative mx-auto overflow-hidden rounded-[2rem] border border-white/[0.06] bg-[#0a0b0f] shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:border-[var(--accent)]/30 group-hover:shadow-[0_0_40px_rgba(255,97,39,0.12)]">
                  <div className="pointer-events-none absolute left-4 top-4 z-10 h-6 w-6 border-l border-t border-[#f0a07f]/50]" />
                  <div className="pointer-events-none absolute right-4 bottom-4 z-10 h-6 w-6 border-r border-b border-[#f0a07f]/50]" />
                  <div className="aspect-[3/5] w-full overflow-hidden">
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,transparent_30%,transparent_55%,rgba(0,0,0,0.7)_100%)]" />
                  <div className="pointer-events-none absolute left-5 top-5">
                    <span className="rounded-sm bg-[#a1161a] px-2 py-0.5 text-[0.5rem] font-semibold tracking-[0.16em] text-white">
                      LIVE
                    </span>
                  </div>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>

        {expanded !== null && (
          <ScrollReveal className="mt-10">
            <div className="relative mx-auto max-w-[360px] overflow-hidden rounded-[2.25rem] border-2 border-white/[0.08] bg-[#0a0b0f] shadow-[0_0_80px_rgba(0,0,0,0.6)]">
              <div className="pointer-events-none absolute left-5 top-5 z-10 h-7 w-7 border-l border-t border-[#f0a07f]/60]" />
              <div className="pointer-events-none absolute right-5 bottom-5 z-10 h-7 w-7 border-r border-b border-[#f0a07f]/60]" />
              <div className="aspect-[3/5] w-full overflow-hidden">
                <img
                  src={screenshots[expanded].src}
                  alt={screenshots[expanded].alt}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,transparent_25%,transparent_65%,rgba(0,0,0,0.65)_100%)]" />
              <div className="pointer-events-none absolute left-5 top-5">
                <span className="rounded-sm bg-[#a1161a] px-2 py-0.5 text-[0.5rem] font-semibold tracking-[0.16em] text-white">
                  LIVE
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[linear-gradient(transparent,rgba(0,0,0,0.8))] px-5 py-4">
                <span className="text-[0.6rem] font-semibold tracking-[0.2em] text-[#c3c8d7]">
                  {screenshots[expanded].tag}
                </span>
                <button
                  type="button"
                  onClick={() => setExpanded(null)}
                  className="rounded-sm bg-[var(--accent)] px-3 py-1.5 text-[0.55rem] font-semibold tracking-[0.2em] text-[#1f120b] transition hover:brightness-110"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}