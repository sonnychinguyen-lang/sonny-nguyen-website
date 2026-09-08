import { Link, useSearchParams, useLocation } from 'react-router-dom'
import StepNav from '../components/StepNav.jsx'
import { useTour } from '../tour.jsx'

export default function ProjectLayout({ project, tabs, children, scroll = false }) {
  const [params] = useSearchParams()
  const { pathname } = useLocation()
  const { go } = useTour()
  const tab = params.get('tab') || tabs[0].id
  return (
    <div className="page">
      <header className="page-top">
        <Link to="/" className="back">← Back to stairs</Link>
        <div className="page-title-wrap">
          <span className="page-index">{project.index}</span>
          <h1 className="page-title">{project.title}</h1>
          <span className="page-label">{project.label}</span>
        </div>
        {tabs.length > 1 && <nav className="tabs">
          {tabs.map((t) => (
            <button key={t.id} className={'tab' + (t.id === tab ? ' active' : '')} onClick={() => t.id !== tab && go(`${pathname}?tab=${t.id}`)}>
              {t.title}
            </button>
          ))}
        </nav>}
      </header>
      {project.finding && <p className="page-finding">{project.finding}</p>}
      <main className={"page-body" + (scroll ? " scroll" : "")}>{children(tab)}</main>
      <StepNav />
    </div>
  )
}
