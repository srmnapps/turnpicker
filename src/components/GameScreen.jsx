import { useRef, useEffect } from 'react'
import Drum from './Drum'
import PoolPills from './PoolPills'
import ResultTable from './ResultTable'
import ResultBanner from './ResultBanner'

export default function GameScreen({
  state, spinning, setSpinning,
  commitSpin, commitAutoAssign, finishGame,
  doUndo, resetGame,
}) {
  const drumRef = useRef(null)
  const { pool, cur, n, names, done, results } = state

  useEffect(() => {
    if (!drumRef.current) return
    drumRef.current.build()
    for (let i = 1; i <= n; i++) {
      if (!pool.includes(i)) drumRef.current.markUsed(i)
    }
    const lastVal = results[cur - 1]
    if (lastVal != null) drumRef.current.spinTo(lastVal, true)
  }, []) // eslint-disable-line

  async function doSpin() {
    if (spinning || done) return

    if (pool.length === 1) {
      await runAutoAssign()
      return
    }

    setSpinning(true)
    const idx = Math.floor(Math.random() * pool.length)
    const value = pool[idx]

    // spin first, THEN update state so table updates after spin
    await drumRef.current.spinTo(value)

    commitSpin(value)
    setTimeout(() => drumRef.current.markUsed(value), 2000)

    const nextPool = pool.filter(v => v !== value)
    if (nextPool.length === 1) {
      setSpinning(false)
      setTimeout(() => runAutoAssign(nextPool[0]), 400)
    } else if (nextPool.length === 0) {
      setSpinning(false)
      finishGame()
    } else {
      setSpinning(false)
    }
  }

  async function runAutoAssign(knownValue) {
    setSpinning(true)
    const value = knownValue ?? pool[0]

    // spin first, THEN update state
    await drumRef.current.spinTo(value)

    commitAutoAssign(value)
    setTimeout(() => drumRef.current.markUsed(value), 2000)
    setSpinning(false)
    finishGame()
  }

  function handleUndo() {
    if (spinning) return
    const lastVal = state.results[state.cur - 1]
    if (lastVal != null) drumRef.current.unmarkUsed(lastVal)
    doUndo()
  }

  function getPlayOrder() {
    const order = []
    for (let t = 1; t <= n; t++) {
      const pi = results.indexOf(t)
      if (pi >= 0) order.push({ turn: t, name: names[pi] })
    }
    return order
  }

  const playOrder = getPlayOrder()

  let spinLabel = 'SPIN THE DRUM'
  let spinClass = 'btn-spin active-spin'
  if (done) { spinLabel = '✓ ORDER COMPLETE'; spinClass = 'btn-spin done-spin' }
  else if (cur < n) spinLabel = `SPIN FOR ${names[cur].toUpperCase()}`

  return (
    <section className="game">
      <div className="game-topbar">
        <div className="round-badge">
          <div className="round-dot" style={done ? { background: 'var(--green)', boxShadow: '0 0 8px var(--green)', animation: 'none' } : {}} />
          <span style={{ fontSize: '.8rem', color: 'var(--sub)' }}>
            {done ? 'Complete' : cur < n ? `${names[cur]}'s roll` : 'Ready'}
          </span>
        </div>
        <div className="topbar-actions">
          <button
            className="btn-sm undo-btn"
            onClick={handleUndo}
            disabled={spinning || state.history.length === 0}
          >↩ Undo</button>
          <button className="btn-sm danger" onClick={resetGame}>⟳ New Game</button>
        </div>
      </div>

      <div className="game-grid">
        <div className="left-col">
          <div className="drum-card">
            <div className="drum-header">
              <span className="drum-header-label">Picker</span>
              <span className="pool-count">{pool.length} remaining</span>
            </div>
            <Drum ref={drumRef} n={n} />
            <div className="spin-btn-wrap">
              <button
                className={spinClass}
                onClick={doSpin}
                disabled={spinning || done}
              >
                {spinLabel}
              </button>
            </div>
          </div>

          {playOrder.length > 0 && (
            <div className="play-order-card">
              <div className="play-order-title">Play Order</div>
              <div className="play-order-list">
                {playOrder.map(({ turn, name }, idx) => (
                  <div key={turn} className="play-order-item">
                    <span className="play-order-num">{turn}</span>
                    <span className="play-order-name">{name}</span>
                    {idx < playOrder.length - 1 && (
                      <span className="play-order-arrow">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <PoolPills pool={pool} n={n} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
          <ResultTable state={state} />
          <ResultBanner state={state} />
        </div>
      </div>
    </section>
  )
}