"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ClipboardList } from "lucide-react"
import { atlasLessons } from "@/lib/atlas-study-index"

export default function ExerciciosPage() {
  const [query, setQuery] = useState("")
  const available = useMemo(() => atlasLessons.filter((lesson) => lesson.questions > 0), [])
  const visible = available.filter((lesson) => `${lesson.title} ${lesson.discipline} ${lesson.id}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="atlas-v3-study-page">
    <header><span className="eyebrow">PRÁTICA</span><h1 className="page-title">Exercícios e avaliações</h1>
      <p className="muted mt-2">Acesse exercícios reais das aulas já redigidas. As questões discursivas não recebem nota automática.</p></header>
    <label htmlFor="atlas-exercises-filter">Buscar exercícios</label>
    <input id="atlas-exercises-filter" className="field" placeholder="Disciplina, aula ou código" value={query} onChange={(e) => setQuery(e.target.value)} />
    <p className="muted text-sm">{visible.length} aulas com exercícios encontradas</p>
    {visible.length === 0 ? <p className="panel muted">Nenhum exercício encontrado. Tente outra busca.</p> : (
      <div className="atlas-v3-study-cards">{visible.map((lesson) => <article key={lesson.id} className="panel atlas-v3-study-card">
        <span className="eyebrow">{lesson.discipline}</span><h2>{lesson.title}</h2>
        <p className="muted text-sm"><ClipboardList size={15} aria-hidden="true" /> {lesson.questions} questões</p>
        <Link className="btn-secondary" href={`/aula/${encodeURIComponent(lesson.id)}#avaliacao`}>Responder exercícios</Link>
      </article>)}</div>
    )}
  </div>
}
