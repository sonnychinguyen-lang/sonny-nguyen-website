import { Link } from 'react-router-dom'
import { resume } from '../data/resume.js'
import { asset } from '../asset.js'

export default function ResumePage() {
  return (
    <div className="page resume-page">
      <header className="page-top">
        <Link to="/" className="back">← Back to stairs</Link>
        <div className="page-title-wrap">
          <span className="page-index">Resume</span>
          <h1 className="page-title">{resume.name}</h1>
          <span className="page-label">{resume.title}</span>
        </div>
        <a className="dl" href={asset("files/sonny-nguyen-resume.pdf")} target="_blank" rel="noreferrer">Download PDF ↗</a>
      </header>
      <main className="resume-body">
        <section className="resume-main">
          <p className="resume-loc">{resume.location}</p>
          <h2>Profile</h2>
          <p className="resume-statement">{resume.statement}</p>
          <h2>Experience</h2>
          {resume.experience.map((x) => (
            <article key={x.role + x.org} className="job">
              <div className="job-head"><strong>{x.role}</strong><span>{x.org} · {x.where}</span><em>{x.when}</em></div>
              <ul>{x.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            </article>
          ))}
          <h2>Education</h2>
          {resume.education.map((e) => (
            <article key={e.degree} className="job">
              <div className="job-head"><strong>{e.degree}</strong><span>{e.school}</span><em>{e.when}</em></div>
              <ul>{e.detail.map((d) => <li key={d}>{d}</li>)}</ul>
            </article>
          ))}
        </section>
        <aside className="resume-side">
          <h2>Skills</h2>
          {resume.skills.map((s) => (
            <div key={s.group} className="skill-group"><strong>{s.group}</strong><div className="chips">{s.items.map((i) => <span key={i}>{i}</span>)}</div></div>
          ))}
          <h2>Get in touch</h2>
          <a className="email-link" href={`mailto:${resume.email}`}>{resume.email}</a>
          <p className="tiny">Email is the fastest way to reach me.</p>
        </aside>
      </main>
    </div>
  )
}
