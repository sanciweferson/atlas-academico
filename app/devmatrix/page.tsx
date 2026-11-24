"use client"

import Link from "next/link"
import { useState, type KeyboardEvent } from "react"
import { ArrowLeft, ArrowRight, BookOpen, Braces, ClipboardCheck, Code2, ExternalLink, FileCode2, Github, Layers3 } from "lucide-react"

const tabs = [
  { id: "geral", label: "Visão geral", heading: "Um ambiente complementar para aprender JavaScript", description: "O DevMatrix é uma plataforma independente dedicada ao estudo de JavaScript, com documentação, aulas, exercícios e projetos. A navegação a seguir apresenta as áreas e direciona você para o próprio DevMatrix." },
  { id: "aulas", label: "Aulas", heading: "Aulas e percursos de JavaScript", description: "Estude conceitos da linguagem e retome os assuntos conforme seu ritmo. O conteúdo é aberto no ambiente do DevMatrix." },
  { id: "exercicios", label: "Exercícios", heading: "Pratique e verifique o raciocínio", description: "Use os exercícios da plataforma complementar para praticar JavaScript. O Atlas não importa nem atribui nota às respostas feitas lá." },
  { id: "projetos", label: "Projetos", heading: "Aprendizado aplicado", description: "Explore os exemplos e projetos de programação disponíveis no DevMatrix e leve o que aprender para aplicações próprias." },
  { id: "documentacao", label: "Documentação", heading: "Material de consulta em JavaScript", description: "Consulte a documentação organizada do DevMatrix durante seus estudos, sem substituir o currículo ou o histórico local do Atlas." },
  { id: "repositorio", label: "Repositório", heading: "Código do projeto no GitHub", description: "Veja a implementação do DevMatrix no repositório público do projeto. Não há integração de contas nem sincronização entre plataformas." },
] as const

export default function DevMatrixPage() {
  const [active, setActive] = useState(0)
  const current = tabs[active]
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = tabs.length - 1
    else return
    event.preventDefault()
    setActive(next)
    document.getElementById(`atlas-dmx-tab-${next}`)?.focus()
  }
  return (
    <div className="atlas-v31-dmx-page">
      <nav aria-label="Caminho" className="atlas-v31-dmx-breadcrumb"><Link href="/">Início</Link><span aria-hidden="true">›</span><span>DevMatrix</span></nav>
      <header className="atlas-v31-dmx-intro">
        <div className="atlas-v31-dmx-heading"><span className="atlas-v31-dmx-emblem"><Code2 size={28} aria-hidden="true" /></span><div><span className="atlas-v31-dmx-kicker">ATLAS ACADÊMICO + DEVMATRIX</span><h1>DevMatrix</h1></div></div>
        <p>Documentação, aulas, exercícios e projetos em JavaScript. Uma experiência de aprendizagem complementar, em uma plataforma independente.</p>
        <div className="atlas-v31-dmx-actions"><Link href="/devmatrix/abrir" className="atlas-v31-dmx-button">Conheça o DevMatrix <ArrowRight size={17} aria-hidden="true" /></Link><Link href="/" className="atlas-v31-dmx-secondary"><ArrowLeft size={16} aria-hidden="true" /> Voltar ao Atlas</Link></div>
      </header>
      <div className="atlas-v31-dmx-tablist" role="tablist" aria-label="Sobre o DevMatrix">
        {tabs.map((t, i) => <button key={t.id} id={`atlas-dmx-tab-${i}`} type="button" role="tab" aria-selected={i === active} aria-controls="atlas-dmx-panel" tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)} onKeyDown={(e) => onTabKey(e, i)}>{t.label}</button>)}
      </div>
      <section id="atlas-dmx-panel" className="atlas-v31-dmx-tabpanel" role="tabpanel" aria-labelledby={`atlas-dmx-tab-${active}`} tabIndex={0}>
        <span className="atlas-v31-dmx-panel-icon" aria-hidden="true">{active === 0 ? <Braces size={27} /> : active === 1 ? <BookOpen size={27} /> : active === 2 ? <ClipboardCheck size={27} /> : active === 3 ? <Layers3 size={27} /> : active === 4 ? <FileCode2 size={27} /> : <Github size={27} />}</span>
        <h2>{current.heading}</h2><p>{current.description}</p>
        {active === 5 ? <a className="atlas-v31-dmx-button" href="https://github.com/sanciweferson/devmatrix" target="_blank" rel="noopener noreferrer">Abrir repositório <ExternalLink size={16} aria-hidden="true" /></a> : <Link href="/devmatrix/abrir" className="atlas-v31-dmx-button">Acessar o DevMatrix <ExternalLink size={16} aria-hidden="true" /></Link>}
      </section>
      <p className="atlas-v31-dmx-disclaimer">Ao continuar, você sairá do Atlas Acadêmico. Login, preferências, anotações e progresso não são sincronizados entre as duas plataformas.</p>
    </div>
  )
}
