import { memo } from 'react'

const Row = memo(function Row({ i, name, result, isActive, isDone }) {
  let cls = 'sb-row'
  if (isActive) cls += ' is-active'
  else if (isDone) cls += ' is-done'

  let badge
  if (isActive)    badge = <span className="badge badge-rolling"><span className="badge-dot" />Rolling</span>
  else if (isDone) badge = <span className="badge badge-done"><span className="badge-dot" />Done</span>
  else             badge = <span className="badge badge-wait"><span className="badge-dot" />Waiting</span>

  return (
    <tr className={cls}>
      <td className="td-pos">{i + 1}</td>
      <td className="td-name">{name}</td>
      {isDone
        ? <td className="td-turn">{result}</td>
        : <td className="td-turn none">—</td>
      }
      <td className="td-badge">{badge}</td>
    </tr>
  )
})

export default function ResultTable({ state }) {
  const { n, names, results, cur, done } = state
  const assigned = results.filter(r => r !== null).length

  return (
    <div className="scoreboard-card">
      <div className="sb-header">
        <div className="sb-title">RESULTS</div>
        <div className="sb-progress">{assigned} / {n} assigned</div>
      </div>

      <div style={{ animation: 'fadeUp .3s cubic-bezier(.22,.68,0,1.2) both' }}>
        <table className="sb-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Player</th>
              <th style={{ textAlign: 'right', paddingRight: '1.25rem' }}>Turn #</th>
              <th style={{ textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: n }, (_, i) => (
              <Row
                key={i}
                i={i}
                name={names[i]}
                result={results[i]}
                isActive={i === cur && !done}
                isDone={results[i] !== null}
              />
            ))}
          </tbody>
        </table>
        {done && <PlayOrder names={names} results={results} n={n} />}
      </div>
    </div>
  )
}

function PlayOrder({ names, results, n }) {
  const order = []
  for (let t = 1; t <= n; t++) {
    const pi = results.indexOf(t)
    if (pi >= 0) order.push(names[pi])
  }
  return (
    <div className="summary-row show">
      <span style={{ color: 'var(--sub)', fontSize: '.66rem', letterSpacing: '.12em', textTransform: 'uppercase', marginRight: '.35rem' }}>
        Play order:
      </span>
      {order.map((name, idx) => (
        <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="summary-num">{idx + 1}</span>
          <span style={{ color: 'var(--text)' }}>{name}</span>
          {idx < order.length - 1 && <span className="summary-arrow">→</span>}
        </span>
      ))}
    </div>
  )
}