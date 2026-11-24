"use client"

import Link from "next/link"
import { useEffect } from "react"
import { ArrowLeft, ArrowRight, Code2, ExternalLink } from "lucide-react"

const DEVMATRIX_URL = "https://devmatrix-puce.vercel.app"

export default function DevMatrixRedirectPage() {
  useEffect(() => {
    // A navegação externa pode ser bloqueada ou falhar: o botão manual permanece disponível.
    const timer = window.setTimeout(() => window.location.replace(DEVMATRIX_URL), 1900)
    return () => window.clearTimeout(timer)
  }, [])
  return (
    <section className="atlas-v31-dmx-redirect" aria-labelledby="atlas-v31-dmx-redirect-title">
      <div className="atlas-v31-dmx-halo" aria-hidden="true" />
      <div className="atlas-v31-dmx-loading-card">
        <span className="atlas-v31-dmx-loading-logo"><Code2 size={38} aria-hidden="true" /></span>
        <span className="atlas-v31-dmx-kicker">ATLAS ACADÊMICO → DEVMATRIX</span>
        <h1 id="atlas-v31-dmx-redirect-title">Preparando sua próxima experiência...</h1>
        <p>Você será redirecionado para o DevMatrix em instantes.</p>
        <span className="atlas-v31-dmx-spinner" aria-hidden="true" />
        <div className="atlas-v31-dmx-progress" aria-hidden="true"><span /></div>
        <p className="atlas-v31-dmx-short">Você será redirecionado em breve.</p>
        <a className="atlas-v31-dmx-button" href={DEVMATRIX_URL}>Continuar agora <ArrowRight size={17} aria-hidden="true" /></a>
        <a className="atlas-v31-dmx-manual" href={DEVMATRIX_URL} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} aria-hidden="true" /> Se a página não abrir, tente em outra aba</a>
        <Link href="/devmatrix" className="atlas-v31-dmx-return"><ArrowLeft size={15} aria-hidden="true" /> Voltar à integração</Link>
      </div>
    </section>
  )
}
