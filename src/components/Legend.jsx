export default function Legend({ title = 'How to read this', items }) {
  return (
    <div className="legend-block">
      <h4>{title}</h4>
      <ul>
        {items.map((it) => (
          <li key={it.label}>
            <i className={it.shape || 'dot'} style={{ background: it.color }} />
            <span><b>{it.label}</b>{it.text ? ` — ${it.text}` : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
