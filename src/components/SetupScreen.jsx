const MIN_P = 2
const MAX_P = 10

export default function SetupScreen({ playerCount, setPlayerCount, onStart }) {
  return (
    <section className="setup">
      <div className="setup-card">

        <div>
          <span className="setup-label">Number of Players</span>
          <div className="picker-row">
            <button
              className="pick-btn"
              onClick={() => setPlayerCount(p => Math.max(MIN_P, p - 1))}
              disabled={playerCount <= MIN_P}
            >−</button>

            <div
              className="pick-num"
              style={{ transform: 'scale(1)', transition: 'transform .15s' }}
            >
              {playerCount}
            </div>

            <button
              className="pick-btn"
              onClick={() => setPlayerCount(p => Math.min(MAX_P, p + 1))}
              disabled={playerCount >= MAX_P}
            >+</button>
          </div>

          <div className="seg-bar" style={{ marginTop: '1.1rem' }}>
            {Array.from({ length: MAX_P }, (_, i) => (
              <div key={i} className={`seg${i < playerCount ? ' on' : ''}`} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(playerCount, 5)}, 1fr)`,
            gap: '6px',
          }}>
            {Array.from({ length: playerCount }, (_, i) => (
              <div key={i} style={{
                height: '36px',
                borderRadius: '8px',
                background: 'var(--s2)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1rem', letterSpacing: '.06em',
                color: 'var(--sub)',
              }}>
                P{i + 1}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '.7rem', color: 'var(--dim)', textAlign: 'center', letterSpacing: '.04em' }}>
            Players will be assigned random turn numbers
          </p>
        </div>

        <button className="btn-start" onClick={() => onStart(playerCount)}>
          ROLL THE ORDER →
        </button>

      </div>
    </section>
  )
}