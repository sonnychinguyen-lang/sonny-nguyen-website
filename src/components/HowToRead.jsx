import { useState } from 'react'

// A collapsible legend that explains what every mark on a map means.
export default function HowToRead({ items, open = true }) {
  const [on, setOn] = useState(open)
  return (
    <div className="howto">
      <button className="howto-toggle" onClick={() => setOn(!on)}>{on ? '▾' : '▸'} How to read this map</button>
      {on && (
        <ul>
          {items.map(([mark, title, desc], i) => (
            <li key={i}><span className={'mark ' + (mark.shape || 'dot')} style={{ background: mark.color, borderColor: mark.color }} /><div><b>{title}</b><span>{desc}</span></div></li>
          ))}
        </ul>
      )}
    </div>
  )
}
