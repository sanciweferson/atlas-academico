import Link from "next/link"
import { ArrowRight, Braces, Code2, ExternalLink, Sparkles } from "lucide-react"

/** O Atlas permanece independente do DevMatrix; nenhuma conta ou dado é compartilhado. */
export default function AtlasDevMatrixCard() {
  return (
    <section className="atlas-v31-dmx-card" aria-labelledby="atlas-v31-dmx-card-title">
      <div className="atlas-v31-dmx-card-content">
        <span className="atlas-v31-dmx-kicker"><Sparkles size={16} aria-hidden="true" /> INTEGRAÇÃO EDUCACIONAL</span>
        <h2 id="atlas-v31-dmx-card-title"><Code2 size={28} aria-hidden="true" /> Conheça o DevMatrix</h2>
        <p>Documentação, aulas, exercícios e projetos em JavaScript. Explore um ambiente complementar de estudos, em um projeto independente do Atlas.</p>
        <div className="atlas-v31-dmx-card-actions">
          <Link className="atlas-v31-dmx-button" href="/devmatrix">Explorar integração <ArrowRight size={18} aria-hidden="true" /></Link>
          <Link className="atlas-v31-dmx-secondary" href="/devmatrix/abrir">Acessar DevMatrix <ExternalLink size={16} aria-hidden="true" /></Link>
        </div>
      </div>
      <div className="atlas-v31-dmx-decor" aria-hidden="true"><Braces size={76} strokeWidth={1.2} /><span>JS</span></div>
    </section>
  )
}
