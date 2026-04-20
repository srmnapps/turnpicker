export default function PoolPills({ pool, n }) {
  return (
    <div className="pool-card">
      <div className="pool-title">Remaining Pool</div>
      <div className="pills-wrap">
        {Array.from({ length: n }, (_, i) => i + 1).map(num => {
          const avail = pool.includes(num)
          return (
            <div
              key={num}
              className={`pill${avail ? ' avail' : ''}`}
              title={avail ? `Turn ${num} available` : `Turn ${num} taken`}
            >
              {num}
            </div>
          )
        })}
      </div>
    </div>
  )
}