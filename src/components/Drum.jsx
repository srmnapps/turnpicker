import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'

const REPEAT = 20
const FACE_H = 64
const DRUM_H = 320

const Drum = forwardRef(function Drum({ n }, ref) {
  const drumEl = useRef(null)

  useEffect(() => { build() }, [n])

  function build() {
    const el = drumEl.current
    if (!el) return
    el.innerHTML = ''
    for (let r = 0; r < REPEAT; r++) {
      for (let i = 1; i <= n; i++) {
        const f = document.createElement('div')
        f.className = 'drum-face'
        f.dataset.val = i
        const strike = document.createElement('div')
        strike.className = 'face-strike'
        f.appendChild(strike)
        f.appendChild(document.createTextNode(i))
        el.appendChild(f)
      }
    }
    el.style.transition = 'none'
    el.style.transform = 'translateY(0)'
  }

  function spinTo(num, instant = false) {
    const el = drumEl.current
    if (!el) return Promise.resolve()

    const faces = el.querySelectorAll('.drum-face')
    const matches = []
    faces.forEach((f, i) => { if (Number(f.dataset.val) === num) matches.push(i) })

    // pick from middle third to avoid edge clipping
    const mid = matches.filter(i => i > n * 4 && i < n * (REPEAT - 4))
    const pick = mid[Math.floor(Math.random() * mid.length)] ?? matches[Math.floor(Math.random() * matches.length)]

    const centreY = DRUM_H / 2 - FACE_H / 2
    const target = centreY - pick * FACE_H

    if (instant) {
      el.style.transition = 'none'
      el.style.transform = `translateY(${target}px)`
      applyActiveStyle(faces, num)
      return Promise.resolve()
    }

    return new Promise(resolve => {
      const spins = 6 + Math.random() * 4
      const extra = spins * n * FACE_H
      const duration = 1900 + Math.random() * 600

      el.classList.add('spinning')
      const tick = startTick(faces)

      el.style.transition = `transform ${duration}ms cubic-bezier(.12,.82,.2,1)`
      el.style.transform = `translateY(${target - extra}px)`

      setTimeout(() => {
        clearInterval(tick)

        // settle: overshoot then snap
        el.style.transition = 'transform 280ms cubic-bezier(.34,1.56,.64,1)'
        el.style.transform = `translateY(${target + 10}px)`

        setTimeout(() => {
          el.style.transition = 'transform 220ms cubic-bezier(.25,.1,.25,1)'
          el.style.transform = `translateY(${target}px)`
          el.classList.remove('spinning')
          applyActiveStyle(faces, num)
          highlightWinner(faces, num)
          resolve()
        }, 140)
      }, duration)
    })
  }

  function applyActiveStyle(faces, num) {
    faces.forEach(f => {
      f.style.color = Number(f.dataset.val) === num ? 'var(--text)' : ''
      f.style.fontSize = Number(f.dataset.val) === num ? '3rem' : ''
    })
  }

  function startTick(faces) {
    let i = 0
    return setInterval(() => {
      faces.forEach(f => f.classList.remove('tick'))
      if (faces[i]) faces[i].classList.add('tick')
      i = (i + 1) % faces.length
    }, 45)
  }

  function highlightWinner(faces, num) {
    faces.forEach(f => {
      if (Number(f.dataset.val) === num) {
        f.classList.add('winner')
        setTimeout(() => f.classList.remove('winner'), 900)
      }
    })
  }

  function markUsed(num) {
    drumEl.current?.querySelectorAll('.drum-face').forEach(f => {
      if (Number(f.dataset.val) === num) {
        f.style.color = ''
        f.style.fontSize = ''
        f.classList.add('used')
      }
    })
  }

  function unmarkUsed(num) {
    drumEl.current?.querySelectorAll('.drum-face').forEach(f => {
      if (Number(f.dataset.val) === num) f.classList.remove('used')
    })
  }

  function resetPosition() {
    const el = drumEl.current
    if (!el) return
    el.style.transition = 'none'
    el.style.transform = 'translateY(0)'
  }

  useImperativeHandle(ref, () => ({ spinTo, markUsed, unmarkUsed, build, resetPosition }))

  return (
    <div className="drum-scene">
      <div className="drum-shade-l" />
      <div className="drum-shade-r" />
      <div className="drum" ref={drumEl} />
      <div className="drum-window" />
    </div>
  )
})

export default Drum