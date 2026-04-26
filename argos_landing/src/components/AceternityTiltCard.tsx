import { useMemo, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'

type AceternityTiltCardProps = {
  className?: string
  children: ReactNode
}

export function AceternityTiltCard({
  className,
  children,
}: AceternityTiltCardProps): ReactElement {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  const transform = useMemo(
    () =>
      `perspective(1400px) rotateX(${rotation.x.toFixed(2)}deg) rotateY(${rotation.y.toFixed(2)}deg) scale3d(1, 1, 1)`,
    [rotation],
  )

  return (
    <div
      className={`group relative [transform-style:preserve-3d] ${className ?? ''}`}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height

        setRotation({
          x: (0.5 - py) * 18,
          y: (px - 0.5) * 20,
        })
      }}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
      style={{ transform, transition: 'transform 120ms linear' }}
    >
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-red-500/35 via-transparent to-orange-400/20 opacity-70 blur-xl" />
      <div className="relative rounded-2xl border border-white/10 bg-zinc-900/90 backdrop-blur-sm [transform-style:preserve-3d]">
        {children}
      </div>
    </div>
  )
}
