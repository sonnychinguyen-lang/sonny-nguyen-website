import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Background from '../Background.jsx'
import Stairs from '../Stairs.jsx'
import Underlay from '../Underlay.jsx'
import { projects, flatDocs } from '../data.js'
import { useTour, steps } from '../tour.jsx'
import { asset } from '../asset.js'

export default function Home() {
  const [status, setStatus] = useState({ objects: [], cycle: 0 })
  const [popupIdx, setPopupIdx] = useState(null)
  const [menu, setMenu] = useState(false)
  const hideTimer = useRef(null)
  const navigate = useNavigate()
  const { go } = useTour()

  const onHover = (i) => {
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null }
    setPopupIdx(i)
  }
  const onUnhover = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => { setPopupIdx(null); hideTimer.current = null }, 5000)
  }
  const openDoc = (i) => {
    const d = flatDocs[i]
    go(`${d.project.route}?tab=${d.tab}`)
  }

  return (
    <div className="app">
      <Background />
      <Stairs popupIdx={popupIdx} onHover={onHover} onUnhover={onUnhover} onOpen={openDoc} onStatus={setStatus} />
      <Underlay status={status} onMenu={() => setMenu(true)} onTour={() => go(steps[0].path)} />
      {menu && (
        <nav className="menu" onClick={() => setMenu(false)}>
          <div className="menu-inner" onClick={(e) => e.stopPropagation()}>
            <button className="panel-close" aria-label="Close" onClick={() => setMenu(false)}>×</button>
            {projects.map((p) => (
              <Link key={p.id} className="menu-item" to={p.route}>
                <span className="menu-index">{p.index}</span>
                <span className="menu-title">{p.title}</span>
                <span className="menu-kicker">{p.kicker}</span>
              </Link>
            ))}
            <Link className="menu-item" to="/resume">
              <span className="menu-index">Resume</span>
              <span className="menu-title">Work history &amp; skills</span>
              <span className="menu-kicker">With a PDF to download</span>
            </Link>
            <a className="menu-item" href={asset('phonics/')}>
              <span className="menu-index">Students</span>
              <span className="menu-title">Sound Hive</span>
              <span className="menu-kicker">Phonics games · K to grade 7</span>
            </a>
            <a className="menu-item" href="https://claude.ai/artifact/WJo8k7XuMirVasonwXDGVx" target="_blank" rel="noreferrer">
              <span className="menu-index">Teacher</span>
              <span className="menu-title">Marking desk</span>
              <span className="menu-kicker">Private · sign-in required</span>
            </a>
            <div className="menu-about">
              <div className="menu-index">About</div>
              <p>K–7 English teacher in Richmond, BC, with a criminal justice degree and forensic investigations coursework at BCIT. The analysis projects are coursework: scenarios and datasets are training material, not live files.</p>
            </div>
          </div>
        </nav>
      )}
    </div>
  )
}
