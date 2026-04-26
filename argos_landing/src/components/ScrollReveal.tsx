import { motion } from 'framer-motion'
import type { PropsWithChildren, ReactElement } from 'react'

type ScrollRevealProps = PropsWithChildren<{
  delay?: number
  y?: number
  once?: boolean
  className?: string
}>

export function ScrollReveal({
  children,
  delay = 0,
  y = 28,
  once = true,
  className,
}: ScrollRevealProps): ReactElement {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration: 0.65, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
