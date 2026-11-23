"use client"

import Link from "next/link"
import { Bookmark, CalendarCheck, CalendarDays, NotebookPen } from "lucide-react"
import { useAtlasLocalStudy } from "@/lib/atlas-local-study"

export default function ProgressoPage() {
  const { favorites, sessions, ready } = useAtlasLocalStudy()
  const completed = sessions.filter((session) => session.complete).length
  const planned = sessions.filter((session) => !session.complete).length
  return <div className="atlas-v3-study-page">
    <header><span className="eyebrow">ACOMPANHAMENTO</span><h1 className="page-title">Meu progresso</h1>
      <p className="muted mt-2">Resumo da organização dos seus estudos neste navegador. Concluir uma sessão não significa dominar a aula.</p></header>
    {!ready ? <p role="status">Carregando progresso...</p> : (
      <div className="atlas-v3-study-metrics">
        <div className="panel"><CalendarCheck size={24} aria-hidden="true"/><strong>{completed}</strong><span>Sessões concluídas</span></div>
        <div className="panel"><CalendarDays size={24} aria-hidden="true"/><strong>{planned}</strong><span>Sessões planejadas</span></div>
        <div className="panel"><Bookmark size={24} aria-hidden="true"/><strong>{favorites.length}</strong><span>Aulas favoritas</span></div>
      </div>
    )}
    <div className="panel atlas-v3-study-links"><NotebookPen size={22} aria-hidden="true"/><div><h2>Minhas anotações</h2>
      <p className="muted text-sm">Confira suas anotações sincronizadas no Painel, quando estiver conectado.</p></div>
      <Link className="btn-secondary" href="/painel">Abrir painel</Link></div>
    <div className="atlas-v3-study-actions"><Link className="btn" href="/agenda">Planejar estudos</Link><Link className="btn-secondary" href="/exercicios">Praticar exercícios</Link></div>
  </div>
}
