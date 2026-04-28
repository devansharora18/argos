import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, type ReactElement } from 'react'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { HardwareSection } from '../sections/HardwareSection'
import { PrototypeSection } from '../sections/PrototypeSection'
import { RequestDemoSection } from '../sections/RequestDemoSection'
import { SolutionsSection } from '../sections/SolutionsSection'
import { TechnologySection } from '../sections/TechnologySection'

export function Home(): ReactElement {
  const { scrollYProgress } = useScroll()
  const glowOneY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const glowTwoY = useTransform(scrollYProgress, [0, 1], [0, -160])

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.slice(1)
      if (!hash) return

      const target = document.getElementById(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)

    return () => {
      window.removeEventListener('hashchange', scrollToHash)
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_top,rgba(255,111,59,0.12),transparent_34%),linear-gradient(180deg,#160c07_0%,#0d0806_100%)] font-body text-[var(--text)]">
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 h-[42rem] w-[68rem] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(255,97,39,0.22),rgba(255,97,39,0)_66%)] blur-2xl"
        style={{ y: glowOneY }}
      />
      <motion.div
        className="pointer-events-none absolute right-[-8rem] top-[18rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,97,39,0.14),rgba(255,97,39,0)_74%)] blur-3xl"
        style={{ y: glowTwoY }}
      />

      <div className="relative mx-auto w-full max-w-[1520px] border-x border-white/[0.04] bg-[radial-gradient(circle_at_50%_0%,rgba(255,97,39,0.12),transparent_30%),linear-gradient(180deg,#120a08_0%,#090607_100%)]">
        <Navbar />
        <TechnologySection />
        <SolutionsSection />
        <HardwareSection />
        <PrototypeSection />
        <RequestDemoSection />
        <Footer />
      </div>
    </main>
  )
}
