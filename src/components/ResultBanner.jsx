import Confetti from './Confetti'

export default function ResultBanner({ state }) {
  if (!state?.done) return null

  const { n, names, results } = state
  const order = []
  for (let t = 1; t <= n; t++) {
    const pi = results.indexOf(t)
    if (pi >= 0) order.push({ name: names[pi], turn: t })
  }

  return (
    <div className="result-banner">
      <Confetti active={state.done} />
      <div className="result-inner">
        <div className="result-emoji">🎲</div>
        <div className="result-title">ORDER CONFIRMED</div>
        <div className="result-sub" style={{ marginBottom: '.5rem' }}>
          All {n} players have been assigned.
        </div>

        {/* inline play order chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px', marginTop: '.25rem' }}>
          {order.map(({ name, turn }, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: 'rgba(255,255,255,.04)',
              border: '1px solid var(--border2)',
              borderRadius: '8px', padding: '4px 10px',
              animation: `popIn .4s ${idx * .07}s cubic-bezier(.22,.68,0,1.2) both`,
            }}>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem',
                color: turn === 1 ? 'var(--gold)' : turn === 2 ? 'var(--cyan)' : 'var(--sub)',
                lineHeight: 1,
              }}>{turn}</span>
              <span style={{ fontSize: '.82rem', color: 'var(--text)' }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}