"use client"

import Link from "next/link"
import { Bookmark, Trash2 } from "lucide-react"
import { useAtlasLocalStudy } from "@/lib/atlas-local-study"
import { findAtlasLesson } from "@/lib/atlas-study-index"

export default function FavoritosPage() {
  const { favorites, ready, toggleFavorite, storageError } = useAtlasLocalStudy()
  return (
    <div className="atlas-v3-study-page">
      <header><span className="eyebrow">MINHA BIBLIOTECA</span><h1 className="page-title">Favoritos</h1>
        <p className="muted mt-2">Suas aulas favoritas ficam salvas neste navegador e separadas por conta.</p></header>
      {!ready ? <p role="status">Carregando seus favoritos...</p> : favorites.length === 0 ? (
        <div className="panel atlas-v3-study-empty"><Bookmark size={26} aria-hidden="true" /><h2>Nenhuma aula favorita ainda</h2>
          <p>Abra uma aula e clique em “Salvar nos favoritos”.</p><Link className="btn" href="/catalogo">Explorar aulas</Link></div>
      ) : <div className="atlas-v3-study-cards">{favorites.map((id) => {
        const lesson = findAtlasLesson(id)
        return <article key={id} className="panel atlas-v3-study-card">
          <span className="eyebrow">{lesson?.discipline ?? "Aula do Atlas"}</span><h2>{lesson?.title ?? id}</h2>
          <div className="atlas-v3-study-actions"><Link className="btn-secondary" href={`/aula/${encodeURIComponent(id)}`}>Abrir aula</Link>
            <button type="button" className="atlas-v3-study-icon-button" aria-label={`Remover ${lesson?.title ?? id} dos favoritos`} onClick={() => toggleFavorite(id)}><Trash2 size={19} /></button></div>
        </article>
      })}</div>}
      {storageError && <p role="alert">{storageError}</p>}
    </div>
  )
}
