import { useEffect, useRef } from 'react'

const COLS = [
  '#22d3ee','#a78bfa','#fb7185','#fbbf24','#34d399','#fb923c','#67e8f9','#fcd34d'
]

export default function Confetti({ active }) {
  const wrap = useRef(null)

  useEffect(() => {
    if (!active || !wrap.current) return
    wrap.current.innerHTML = ''
    for (let i = 0; i < 48; i++) {
      const c = document.createElement('div')
      c.className = 'confetto'
      const size = 5 + Math.random() * 7
      c.style.cssText =
        `left:${Math.random() * 100}%;` +
        `background:${COLS[i % COLS.length]};` +
        `width:${size}px;height:${size * (1.2 + Math.random())}px;` +
        `opacity:${.75 + Math.random() * .25};` +
        `border-radius:${Math.random() > .5 ? '50%' : '2px'};` +
        `animation-duration:${1.1 + Math.random() * 1.6}s;` +
        `animation-delay:${Math.random() * .7}s;` +
        `transform:rotate(${Math.random() * 360}deg);`
      wrap.current.appendChild(c)
    }
  }, [active])

  return <div ref={wrap} className="confetti-wrap" />
}