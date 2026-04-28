import { useEffect, useState, type ReactElement } from 'react'
import { Menu, X } from 'lucide-react'

const navItems: Array<{ label: string; href: string }> = [
  { label: 'TECHNOLOGY', href: '#technology' },
  { label: 'SOLUTIONS', href: '#solutions' },
  { label: 'HARDWARE', href: '#hardware' },
  { label: 'PROTOTYPE', href: '#prototype' },
]

const sectionIds = ['technology', 'solutions', 'hardware', 'prototype', 'request-demo']

export function Navbar(): ReactElement {
  const [activeSection, setActiveSection] = useState<string>('technology')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          setActiveSection(visible.target.id)
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.05] bg-[rgba(10,7,6,0.72)] px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-8 lg:gap-12">
          <a
            href="#technology"
            aria-label="ARGOS home"
            className="flex items-center gap-3 transition hover:opacity-80"
          >
            <img src="/logo.png" alt="" className="h-10 w-auto" />
            <span className="font-display text-xl font-semibold tracking-[0.07em] text-white">
              ARGOS
            </span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              const isActive = `#${activeSection}` === item.href
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-[0.6rem] font-semibold tracking-[0.22em] transition ${
                    isActive
                      ? 'text-[var(--accent)] underline decoration-[var(--accent)] underline-offset-[6px]'
                      : 'text-[#727785] hover:text-[#b4b8c4]'
                  }`}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#prototype"
            className="rounded-sm border border-white/15 px-4 py-2 text-[0.58rem] font-semibold tracking-[0.2em] text-[#d7d9e2] transition hover:border-[var(--accent)] hover:text-white"
          >
            PROTOTYPE
          </a>
          <a
            href="#request-demo"
            className="rounded-sm bg-[var(--accent)] px-4 py-2 text-[0.58rem] font-semibold tracking-[0.2em] text-[#1f120b] transition hover:brightness-110"
          >
            REQUEST DEMO
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 text-[#e4e7ef] transition hover:border-[var(--accent)] hover:text-white md:hidden"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-menu"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="mobile-nav-menu"
        className={`md:hidden overflow-hidden border-t border-white/[0.06] transition-[max-height,opacity] duration-300 ease-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-2 px-4 py-4 sm:px-6">
          {navItems.map((item) => {
            const isActive = `#${activeSection}` === item.href
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-md px-3 py-3 text-[0.7rem] font-semibold tracking-[0.2em] transition ${
                  isActive
                    ? 'bg-white/[0.05] text-[var(--accent)]'
                    : 'text-[#c8ccd6] hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {item.label}
              </a>
            )
          })}

          <a
            href="#prototype"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-2 rounded-md border border-white/15 px-3 py-3 text-center text-[0.68rem] font-semibold tracking-[0.2em] text-[#d7d9e2] transition hover:border-[var(--accent)] hover:text-white"
          >
            PROTOTYPE
          </a>
          <a
            href="#request-demo"
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-md bg-[var(--accent)] px-3 py-3 text-center text-[0.68rem] font-semibold tracking-[0.2em] text-[#1f120b] transition hover:brightness-110"
          >
            REQUEST DEMO
          </a>
        </div>
      </div>
    </header>
  )
}
