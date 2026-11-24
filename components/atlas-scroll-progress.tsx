"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { ArrowUp } from "lucide-react"

export default function AtlasScrollProgress() {
  const [percent, setPercent] = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    let pending = false
    const measure = () => {
      const y = Math.max(window.scrollY, document.documentElement.scrollTop, 0)
      const total = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      setPercent(total ? Math.min(100, Math.round((y / total) * 100)) : 100)
      setShow(y > 240 && total > 300)
    }
    const onScroll = () => {
      if (pending) return
      pending = true
      requestAnimationFrame(() => { pending = false; measure() })
    }
    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  if (!show) return null
  return (
    <button
      type="button"
      className="atlas-v31-scroll-top"
      style={{ "--atlas-progress": `${percent}%` } as CSSProperties}
      aria-label={`Voltar ao topo da página. Leitura em ${percent} por cento.`}
      title="Voltar ao topo"
      onClick={() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" })
      }}
    >
      <span className="atlas-v31-scroll-inner" aria-hidden="true"><ArrowUp size={15}/><small>{percent}%</small></span>
    </button>
  )
}
