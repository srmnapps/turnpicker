import { useState, useCallback } from 'react'

const LS_KEY = 'roller_v4'
const MIN_P = 2
const MAX_P = 10

function makeState(n, names) {
  return {
    n, names,
    pool: Array.from({ length: n }, (_, i) => i + 1),
    results: Array(n).fill(null),
    cur: 0,
    history: [],
    done: false,
    autoIdx: null,
  }
}

function saveToLS(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)) } catch {}
}

function loadFromLS() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) } catch { return null }
}

export function useGameState() {
  const [state, setStateRaw] = useState(() => {
    const saved = loadFromLS()
    return (saved && saved.n >= MIN_P) ? saved : null
  })
  const [spinning, setSpinning] = useState(false)
  const [toast, setToast] = useState('')
  const [playerCount, setPlayerCount] = useState(4)

  function setState(newState) {
    setStateRaw(newState)
    saveToLS(newState)
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  const startGame = useCallback((n, existing = null) => {
    const names = Array.from({ length: n }, (_, i) => `Player ${i + 1}`)
    const s = existing ?? makeState(n, names)
    setState(s)
  }, [])

  const resetGame = useCallback(() => {
    localStorage.removeItem(LS_KEY)
    setStateRaw(null)
    setSpinning(false)
    setPlayerCount(4)
  }, [])

  const commitSpin = useCallback((value) => {
    setStateRaw(prev => {
      if (!prev) return prev
      const history = [...prev.history, {
        cur: prev.cur, value,
        pool: [...prev.pool],
        results: [...prev.results],
        autoIdx: prev.autoIdx,
      }]
      const pool = prev.pool.filter(v => v !== value)
      const results = [...prev.results]
      results[prev.cur] = value
      const next = { ...prev, pool, results, history, cur: prev.cur + 1 }
      saveToLS(next)
      return next
    })
  }, [])

  const commitAutoAssign = useCallback((value) => {
    setStateRaw(prev => {
      if (!prev) return prev
      const history = [...prev.history, {
        cur: prev.cur, value,
        pool: [...prev.pool],
        results: [...prev.results],
        autoIdx: prev.autoIdx,
      }]
      const results = [...prev.results]
      results[prev.cur] = value
      const next = { ...prev, pool: [], results, history, cur: prev.cur + 1, autoIdx: prev.cur }
      saveToLS(next)
      return next
    })
  }, [])

  const finishGame = useCallback(() => {
    setStateRaw(prev => {
      if (!prev) return prev
      const next = { ...prev, done: true }
      saveToLS(next)
      return next
    })
    showToast('🎉 Turn order confirmed!')
  }, [])

  const doUndo = useCallback(() => {
    setStateRaw(prev => {
      if (!prev || prev.history.length === 0) return prev
      const history = [...prev.history]
      const snap = history.pop()
      const next = {
        ...prev,
        results: snap.results,
        pool: snap.pool,
        cur: snap.cur,
        autoIdx: snap.autoIdx,
        done: false,
        history,
      }
      saveToLS(next)
      return next
    })
    showToast('↩ Last roll undone')
  }, [])

  return {
    state, spinning, setSpinning,
    toast, playerCount, setPlayerCount,
    startGame, resetGame,
    commitSpin, commitAutoAssign, finishGame,
    doUndo,
    MIN_P, MAX_P,
  }
}