import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { CrisisPage } from './pages/CrisisPage'
import { HardwarePage } from './pages/HardwarePage'

type LandingRoute = 'crisis' | 'hardware'

function getRouteFromHash(hash: string): LandingRoute {
  const normalized = hash.replace(/^#\/?/, '').trim().toLowerCase()
  if (normalized === 'hardware') {
    return 'hardware'
  }
  return 'crisis'
}

function App(): ReactElement {
  const [route, setRoute] = useState<LandingRoute>(() => getRouteFromHash(window.location.hash))

  useEffect(() => {
    const onHashChange = (): void => setRoute(getRouteFromHash(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (route === 'hardware') {
    return <HardwarePage />
  }

  return <CrisisPage />
}

export default App
