import { Link } from 'react-router-dom'
import ProjectLayout from './ProjectLayout.jsx'
import { byId } from '../data.js'
import { teaching, studies, certifications } from '../data/resume.js'

const project = byId('education')
const tabs = [{ id: 'teaching', title: 'Teaching' }, { id: 'studies', title: 'Studies' }]

function Teaching() {
  return (
    <div className="edu">
      <p className="edu-intro">{teaching.intro}</p>
      <div className="stat-row">
        {teaching.stats.map((s) => <div key={s.label} className="stat"><span>{s.label}</span><strong>{s.value}</strong></div>)}
      </div>
      <h2>Where I teach</h2>
      {teaching.places.map((p) => (
        <article key={p.org} className="chart-card edu-card">
          <div className="job-head"><strong>{p.role}</strong><span>{p.org} · {p.where}</span><em>{p.when}</em></div>
          <p>{p.text}</p>
        </article>
      ))}
      <h2>What I teach</h2>
      <div className="chips">{teaching.areas.map((a) => <span key={a}>{a}</span>)}</div>
      <p className="tiny">Certifications and schooling are on the <Link to="/education?tab=studies">Studies</Link> tab. The full work history is on the <Link to="/resume">resume</Link>.</p>
    </div>
  )
}

function Studies() {
  return (
    <div className="edu">
      <h2>Degrees and certificates</h2>
      {studies.map((s) => (
        <article key={s.degree} className="chart-card edu-card">
          <div className="job-head"><strong>{s.degree}</strong><span>{s.school}</span><em>{s.when}</em></div>
          <ul className="edu-courses">
            {s.courses.map((c) => (
              <li key={c.name}>
                <b>{c.code ? `${c.code} · ` : ''}{c.name}.</b> {c.text}
                {c.projects && <span className="edu-links"> See {c.projects.map((id, i) => <span key={id}>{i > 0 && ', '}<Link to={byId(id).route}>{byId(id).title}</Link></span>)}.</span>}
              </li>
            ))}
          </ul>
        </article>
      ))}
      <h2>Teaching certifications</h2>
      <div className="stat-row">
        {certifications.map((c) => <div key={c.name} className="stat"><span>{c.text}</span><strong className="edu-cert">{c.name}</strong></div>)}
      </div>
    </div>
  )
}

export default function EducationPage() {
  return <ProjectLayout project={project} tabs={tabs} scroll>{(tab) => (tab === 'studies' ? <Studies /> : <Teaching />)}</ProjectLayout>
}
