import { useRef, useEffect } from 'react'
import Drum from './Drum'
import PoolPills from './PoolPills'
import ResultTable from './ResultTable'
import ResultBanner from './ResultBanner'

const SPIN_MS = 1800 + 700 + 250 + 200

export default function GameScreen({
  state, spinning, setSpinning,
  commitSpin, commitAutoAssign, finishGame,
  doUndo, resetGame,
}) {
  const drumRef = useRef(null)
  const { pool, cur, n, names, done, results } = state

  // On mount or n change: rebuild drum, re-apply used faces, restore position
  useEffect(() => {
    if (!drumRef.current) return
    drumRef.current.build()
    for (let i = 1; i <= n; i++) {
      if (!pool.includes(i)) drumRef.current.markUsed(i)
    }
    const lastVal = results[cur - 1]
    if (lastVal != null) drumRef.current.spinTo(lastVal, true)
  }, [])  // eslint-disable-line

  async function doSpin() {
    if (spinning || done) return

    if (pool.length === 1) {
      await runAutoAssign()
      return
    }

    setSpinning(true)
    const idx = Math.floor(Math.random() * pool.length)
    const value = pool[idx]

    commitSpin(value)
    await drumRef.current.spinTo(value)
    setTimeout(() => drumRef.current.markUsed(value), 2000)

    // Check if next state will have 1 left — auto assign silently
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
    // get value from current pool if not passed
    const value = knownValue ?? pool[0]
    commitAutoAssign(value)
    await drumRef.current.spinTo(value)
    setTimeout(() => drumRef.current.markUsed(value), 2000)
    setSpinning(false)
    finishGame()
  }

  function handleUndo() {
    if (spinning) return
    // unmark the last assigned value visually
    const lastVal = state.results[state.cur - 1]
    if (lastVal != null) drumRef.current.unmarkUsed(lastVal)
    doUndo()
  }

  // Spin button label
  let spinLabel = 'SPIN THE DRUM'
  let spinClass = 'btn-spin active-spin'
  if (done) { spinLabel = '✓ ORDER COMPLETE'; spinClass = 'btn-spin done-spin' }
  else if (cur < n) spinLabel = `SPIN FOR ${names[cur].toUpperCase()}`

  return (
    <section className="game">
      {/* Top bar */}
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

      {/* Grid */}
      <div className="game-grid">
        <div className="left-col">
          <div className="drum-card">
            <div className="drum-header">
              <span className="drum-header-label">Drum</span>
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
          <PoolPills pool={pool} n={n} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ResultTable state={state} />
          <ResultBanner state={state} />
        </div>
      </div>
    </section>
  )
}