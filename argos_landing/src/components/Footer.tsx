import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

type FooterColumn = {
  heading: string
  links: Array<{ label: string; to?: string }>
}

const footerColumns: FooterColumn[] = [
  {
    heading: 'PLATFORM',
    links: [
      { label: 'TECHNOLOGY', to: '/' },
      { label: 'SOLUTIONS', to: '/solutions' },
      { label: 'HARDWARE', to: '/hardware' },
    ],
  },
  {
    heading: 'OPERATIONS',
    links: [{ label: 'INFRASTRUCTURE' }, { label: 'NG9-1-1 COMPLIANCE' }, { label: 'SYSTEM STATUS' }],
  },
  {
    heading: 'COMPLIANCE',
    links: [{ label: 'PRIVACY PROTOCOL' }, { label: 'SECURITY' }, { label: 'CONTACT' }],
  },
]

export function Footer(): ReactElement {
  return (
    <footer className="border-t border-white/[0.06] bg-[linear-gradient(180deg,#101116_0%,#0a0a0e_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)] md:items-start">
        <div>
          <Link
            to="/"
            className="font-display text-[0.7rem] font-semibold tracking-[0.28em] text-[var(--accent)]"
          >
            ARGOS
          </Link>
          <p className="mt-4 max-w-[320px] text-[0.72rem] leading-relaxed tracking-[0.08em] text-[#7a7e8b]">
            Edge-native AI for zero-latency crisis detection. Engineered for the harshest
            environments, deployed where it matters most.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-sm border border-[#5c382b] bg-[rgba(98,60,44,0.45)] px-3 py-2 text-[0.55rem] font-semibold tracking-[0.2em] text-[#f4b39a]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f4b39a]" />
            SYSTEM ONLINE
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.heading} className="space-y-3">
            <p className="text-[0.6rem] font-semibold tracking-[0.22em] text-[var(--accent)]">
              {column.heading}
            </p>
            <ul className="space-y-3 text-[0.6rem] font-semibold tracking-[0.2em] text-[#727785]">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="transition hover:text-[#b8bcc8]">
                      {link.label}
                    </Link>
                  ) : (
                    <a href="#" className="transition hover:text-[#b8bcc8]">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.05] pt-6 text-[0.55rem] font-semibold tracking-[0.2em] text-[#5f6370] sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; 2024 ARGOS EDGE-AI PLATFORM. ALL RIGHTS RESERVED.</span>
        <span className="text-[#cc9a84]">MISSION CRITICAL STATUS: ACTIVE</span>
      </div>
    </footer>
  )
}
