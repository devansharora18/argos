import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, type FormEvent, type ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { ScrollReveal } from '../components/ScrollReveal'

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/mail@devansharora.in'

const sectorOptions = [
  'Stadiums & Venues',
  'Smart City Infrastructure',
  'Hospitality',
  'Healthcare',
  'Industrial / Energy',
  'Defense & Public Safety',
  'Other',
]

const deploymentScale = ['1 - 10 nodes', '11 - 50 nodes', '51 - 250 nodes', '250+ nodes']

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function RequestDemoPage(): ReactElement {
  const { scrollYProgress } = useScroll()
  const glowOneY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const glowTwoY = useTransform(scrollYProgress, [0, 1], [0, -120])

  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<Status>(searchParams.get('status') === 'success' ? 'success' : 'idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      setStatus('success')
      form.reset()
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Submission failed.')
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_top,rgba(255,111,59,0.12),transparent_34%),linear-gradient(180deg,#160c07_0%,#0d0806_100%)] font-body text-[var(--text)]">
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 h-[42rem] w-[68rem] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(255,97,39,0.22),rgba(255,97,39,0)_66%)] blur-2xl"
        style={{ y: glowOneY }}
      />
      <motion.div
        className="pointer-events-none absolute right-[-8rem] top-[16rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,97,39,0.14),rgba(255,97,39,0)_74%)] blur-3xl"
        style={{ y: glowTwoY }}
      />

      <div className="relative mx-auto w-full max-w-[1520px] border-x border-white/[0.04] bg-[radial-gradient(circle_at_50%_0%,rgba(255,97,39,0.12),transparent_30%),linear-gradient(180deg,#120a08_0%,#090607_100%)]">
        <Navbar />

        <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] xl:items-start">
            <ScrollReveal>
              <div className="max-w-[620px]">
                <p className="inline-flex w-fit items-center gap-2 rounded-sm bg-[#a1161a] px-3 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  CLEARANCE REQUIRED
                </p>

                <h1 className="mt-7 font-display text-[3rem] font-semibold leading-[0.94] text-[#f4f5f8] sm:text-[3.8rem]">
                  REQUEST A
                  <br />
                  <span className="text-[#ff9a73]">LIVE DEMO.</span>
                </h1>

                <p className="mt-6 max-w-[520px] text-[1.02rem] leading-relaxed text-[#a5a9b6]">
                  Speak with the deployment team. We will configure a sandboxed ARGOS node
                  against your operational telemetry and walk through the 7 concurrent models
                  in under 30 minutes.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md border border-white/[0.07] bg-[#13151c]/85 p-5">
                    <p className="text-[0.55rem] font-semibold tracking-[0.2em] text-[#cc9a84]">
                      RESPONSE TIME
                    </p>
                    <p className="mt-2 font-display text-[1.7rem] text-[#f2f3f7]">{'< 24h'}</p>
                    <p className="mt-1 text-[0.78rem] leading-relaxed text-[#9498a7]">
                      Direct line to deployment engineering, not sales.
                    </p>
                  </div>
                  <div className="rounded-md border border-white/[0.07] bg-[#13151c]/85 p-5">
                    <p className="text-[0.55rem] font-semibold tracking-[0.2em] text-[#cc9a84]">
                      DEPLOYMENT
                    </p>
                    <p className="mt-2 font-display text-[1.7rem] text-[#f2f3f7]">14 DAYS</p>
                    <p className="mt-1 text-[0.78rem] leading-relaxed text-[#9498a7]">
                      Average from contract signed to live edge node.
                    </p>
                  </div>
                </div>

                <div className="mt-10 border-t border-white/[0.06] pt-6">
                  <p className="text-[0.6rem] font-semibold tracking-[0.22em] text-[var(--accent)]">
                    WHAT YOU GET
                  </p>
                  <ul className="mt-4 space-y-3 text-[0.88rem] leading-relaxed text-[#9da1af]">
                    {[
                      'Architecture review with NVIDIA Jetson reference designs.',
                      'Live walkthrough of all 7 concurrent inference models.',
                      'Threat-vector simulation against your environment specs.',
                      'Direct technical contact for procurement and integration.',
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-[0.45rem] h-1.5 w-1.5 flex-none rounded-full bg-[var(--accent)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <form
                onSubmit={handleSubmit}
                className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-[linear-gradient(180deg,#15161c_0%,#0d0e13_100%)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-8"
              >
                <div className="pointer-events-none absolute left-5 top-5 h-8 w-10 border-l border-t border-[#f0a07f]/70" />
                <div className="pointer-events-none absolute right-5 bottom-5 h-8 w-10 border-r border-b border-[#f0a07f]/70" />

                <input type="hidden" name="_subject" value="ARGOS — New Demo Request" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="flex items-center justify-between">
                  <p className="text-[0.6rem] font-semibold tracking-[0.22em] text-[var(--accent)]">
                    SECURE INTAKE FORM
                  </p>
                  <span className="inline-flex items-center gap-2 text-[0.55rem] font-semibold tracking-[0.2em] text-[#9498a7]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
                    ENCRYPTED
                  </span>
                </div>

                <h2 className="mt-3 font-display text-[1.6rem] leading-tight text-[#f2f3f7] sm:text-[1.85rem]">
                  Provision your access.
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field label="FULL NAME" name="name" placeholder="Jane Doe" required />
                  <Field
                    label="WORK EMAIL"
                    name="email"
                    type="email"
                    placeholder="jane@org.com"
                    required
                  />
                  <Field label="ORGANIZATION" name="organization" placeholder="Acme Defense" required />
                  <Field label="ROLE / TITLE" name="role" placeholder="Director of Operations" />
                  <SelectField
                    label="SECTOR"
                    name="sector"
                    options={sectorOptions}
                    required
                  />
                  <SelectField
                    label="DEPLOYMENT SCALE"
                    name="deployment_scale"
                    options={deploymentScale}
                  />
                </div>

                <div className="mt-5">
                  <label className="block text-[0.55rem] font-semibold tracking-[0.22em] text-[#9498a7]">
                    OPERATIONAL CONTEXT
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Briefly describe environment, telemetry sources, and the threat profile you need to monitor."
                    className="mt-2 w-full rounded-sm border border-white/[0.08] bg-[#0b0c11] px-4 py-3 text-[0.9rem] leading-relaxed text-[#f2f3f7] placeholder:text-[#5d6271] transition focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>

                <label className="mt-5 flex items-start gap-3 text-[0.7rem] leading-relaxed text-[#9498a7]">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-[0.2rem] h-3.5 w-3.5 accent-[var(--accent)]"
                  />
                  <span>
                    I confirm I am authorized to evaluate ARGOS for the named organization and
                    consent to operational follow-up from the deployment team.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[var(--accent)] px-5 py-3 text-[0.62rem] font-semibold tracking-[0.22em] text-[#1f120b] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'submitting' ? 'TRANSMITTING…' : 'TRANSMIT REQUEST'}
                  <span aria-hidden="true">{'->'}</span>
                </button>

                {status === 'success' ? (
                  <div className="mt-5 rounded-sm border border-[#3d6644] bg-[rgba(46,86,55,0.32)] px-4 py-3 text-[0.72rem] leading-relaxed text-[#bce0c4]">
                    Request received. The deployment team will reach out within 24 hours.
                  </div>
                ) : null}
                {status === 'error' ? (
                  <div className="mt-5 rounded-sm border border-[#7c2a2e] bg-[rgba(120,40,44,0.32)] px-4 py-3 text-[0.72rem] leading-relaxed text-[#f3b9bd]">
                    Transmission failed{errorMessage ? ` — ${errorMessage}` : ''}. Please retry or
                    email mail@devansharora.in directly.
                  </div>
                ) : null}
              </form>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}

type FieldProps = {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
}

function Field({ label, name, type = 'text', placeholder, required }: FieldProps): ReactElement {
  return (
    <label className="block">
      <span className="block text-[0.55rem] font-semibold tracking-[0.22em] text-[#9498a7]">
        {label}
        {required ? <span className="text-[var(--accent)]"> *</span> : null}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-white/[0.08] bg-[#0b0c11] px-4 py-3 text-[0.9rem] text-[#f2f3f7] placeholder:text-[#5d6271] transition focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
      />
    </label>
  )
}

type SelectFieldProps = {
  label: string
  name: string
  options: string[]
  required?: boolean
}

function SelectField({ label, name, options, required }: SelectFieldProps): ReactElement {
  return (
    <label className="block">
      <span className="block text-[0.55rem] font-semibold tracking-[0.22em] text-[#9498a7]">
        {label}
        {required ? <span className="text-[var(--accent)]"> *</span> : null}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="mt-2 w-full rounded-sm border border-white/[0.08] bg-[#0b0c11] px-4 py-3 text-[0.9rem] text-[#f2f3f7] transition focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
