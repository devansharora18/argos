import type { ReactElement } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const navItems: Array<{ label: string; to: string }> = [
  { label: 'TECHNOLOGY', to: '/' },
  { label: 'SOLUTIONS', to: '/solutions' },
  { label: 'HARDWARE', to: '/hardware' },
]

export function Navbar(): ReactElement {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.05] bg-[rgba(10,7,6,0.72)] px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex h-20 items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link
            to="/"
            className="font-display text-xl font-semibold tracking-[0.07em] text-white transition hover:text-[var(--accent)]"
          >
            ARGOS
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `text-[0.6rem] font-semibold tracking-[0.22em] transition ${
                      isActive
                        ? 'text-[var(--accent)] underline decoration-[var(--accent)] underline-offset-[6px]'
                        : 'text-[#727785] hover:text-[#b4b8c4]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => navigate('/request-demo')}
            className="rounded-sm bg-[var(--accent)] px-4 py-2 text-[0.58rem] font-semibold tracking-[0.2em] text-[#1f120b] transition hover:brightness-110"
          >
            REQUEST DEMO
          </button>
        </div>
      </div>
    </header>
  )
}
