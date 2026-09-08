import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { flatDocs } from './data.js'

// The tour order is the stairs order: 14 steps across 6 projects.
export const steps = flatDocs.map((d) => ({ ...d, path: `${d.project.route}?tab=${d.tab}` }))
export function currentStepIndex(pathname, search) {
  const tab = new URLSearchParams(search).get('tab')
  const i = steps.findIndex((s) => s.project.route === pathname && s.tab === tab)
  if (i >= 0) return i
  const j = steps.findIndex((s) => s.project.route === pathname)
  return j
}

const TourCtx = createContext({ go: () => {}, transitioning: false })
export const useTour = () => useContext(TourCtx)

export function TourProvider({ children }) {
  const navigate = useNavigate()
  const [transitioning, setTransitioning] = useState(false)
  const busy = useRef(false)
  const go = (path) => {
    if (busy.current) return
    busy.current = true
    setTransitioning(true)
    setTimeout(() => navigate(path), 420)
    setTimeout(() => { setTransitioning(false); busy.current = false }, 900)
  }
  return <TourCtx.Provider value={{ go, transitioning }}>{children}</TourCtx.Provider>
}

export function useStepNav() {
  const { pathname, search } = useLocation()
  const i = currentStepIndex(pathname, search)
  const prev = i > 0 ? steps[i - 1] : null
  const next = i >= 0 && i < steps.length - 1 ? steps[i + 1] : null
  return { index: i, step: i >= 0 ? steps[i] : null, prev, next, total: steps.length }
}
