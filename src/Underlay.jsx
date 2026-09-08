import { Link } from 'react-router-dom'

export default function Underlay({ onMenu, status, onTour }) {
  return (
    <div className="underlay">
      <div className="top-left">
        <i>Sonny</i>
        <br />
        Nguyen
        <div className="kicker"><b>Aspiring intelligence &amp; crime analyst.</b> Criminology BA, BCIT forensic investigations. I turn offence data, phone records and case files into maps, networks and findings someone can act on.</div>
        <div className="box-row"><Link to="/resume" className="resume-box">Resume ↗</Link><button className="resume-box glass-cta" onClick={onTour}>Start the tour ›</button></div>
      </div>
      <div className="bottom-right">
        2026
        <br />
        Sonny Nguyen
      </div>
      <div className="right-middle">Ten steps, seven cases</div>
      <button className="hamburger" aria-label="Open menu" onClick={onMenu}>
        <div />
        <div />
        <div />
      </button>
      <div className="bar" />
      <div className="bar vertical" />
      <div className="status">
        {status.objects.map((_, i) => (
          <div key={i} className="dot" style={{ background: i === status.cycle ? '#70ffd0' : '#ccc' }} />
        ))}
        {status.objects.length ? (
          <div className="name" style={{ left: status.cycle * 14 }}>{status.objects[status.cycle]?.object?.name}</div>
        ) : null}
      </div>
    </div>
  )
}
