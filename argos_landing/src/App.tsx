import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CrisisPage } from './pages/CrisisPage'
import { HardwarePage } from './pages/HardwarePage'
import { SolutionsPage } from './pages/SolutionsPage'

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<CrisisPage />} />
      <Route path="/solutions" element={<SolutionsPage />} />
      <Route path="/hardware" element={<HardwarePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
