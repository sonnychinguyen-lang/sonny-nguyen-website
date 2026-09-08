import { useEffect } from 'react'
import { useTour, useStepNav, steps } from '../tour.jsx'

export default function StepNav() {
  const { go } = useTour()
  const { index, prev, next, total } = useStepNav()
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return
      if (e.key === 'ArrowRight' && next) go(next.path)
      if (e.key === 'ArrowLeft' && prev) go(prev.path)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])
  if (index < 0) return null
  return (
    <div className="stepnav">
      <button className="glass round" disabled={!prev} onClick={() => prev && go(prev.path)} aria-label="Previous step">‹</button>
      <div className="glass pill">
        <span className="stepnav-count">{index + 1} / {total}</span>
        <span className="stepnav-next">{next ? <>Next · <b>{next.project.id !== steps[index].project.id ? next.project.title + ' — ' : ''}{next.title}</b></> : 'End of tour'}</span>
      </div>
      <button className="glass round big" disabled={!next} onClick={() => next && go(next.path)} aria-label="Next step">›</button>
    </div>
  )
}
