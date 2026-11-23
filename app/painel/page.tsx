"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, NotebookPen } from "lucide-react"
import { browserSupabase } from "@/lib/supabase"

type Note = { lesson_id: string; body: string; updated_at: string }
export default function Painel() {
  const [authenticated, setAuthenticated] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [ready, setReady] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let active = true
    async function load() {
      const supabase = browserSupabase()
      if (!supabase) { if (active) setReady(true); return }
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (!active) return
        if (error || !user) { setAuthenticated(false); setReady(true); return }
        setAuthenticated(true)
        const result = await supabase.from("lesson_notes")
          .select("lesson_id,body,updated_at")
          .order("updated_at", { ascending: false })
        if (!active) return
        if (result.error) setErrorMessage("Não foi possível carregar suas anotações agora.")
        else setNotes((result.data || []) as Note[])
      } catch {
        if (active) setErrorMessage("Não foi possível conectar ao serviço de anotações.")
      } finally {
        if (active) setReady(true)
      }
    }
    void load()
    return () => { active = false }
  }, [])

  return (
    <div className="atlas-v3-dashboard space-y-6">
      <header>
        <span className="eyebrow">SEU ACOMPANHAMENTO</span>
        <h1 className="page-title">Meu painel</h1>
        <p className="muted mt-2">Acompanhe suas anotações e retome as aulas quando quiser.</p>
      </header>
      {!ready ? <p role="status">Carregando...</p> : !authenticated ? (
        <div className="panel">Entre na sua conta para acessar as anotações salvas. <Link href="/login" className="text-link">Fazer login</Link></div>
      ) : (
        <>
          <section className="atlas-v3-dashboard-metric panel" aria-label="Resumo das anotações">
            <span className="atlas-v3-dashboard-metric-icon"><NotebookPen size={23} aria-hidden="true" /></span>
            <div><strong>{notes.length}</strong><span>Aulas com anotações salvas</span></div>
          </section>
          {errorMessage && <p role="alert" className="muted">{errorMessage}</p>}
          <section aria-labelledby="atlas-notes-title">
            <div className="atlas-v3-dashboard-section-head"><h2 id="atlas-notes-title">Minhas anotações</h2><Link className="text-link" href="/catalogo">Ver disciplinas</Link></div>
            {notes.length === 0 ? <div className="panel"><BookOpen size={20} aria-hidden="true" /><p className="muted mt-2">Você ainda não tem anotações salvas.</p></div> : (
              <div className="atlas-v3-dashboard-notes">
                {notes.map((note) => (
                  <Link href={`/aula/${encodeURIComponent(note.lesson_id)}`} key={note.lesson_id} className="panel atlas-v3-dashboard-note">
                    <strong>Aula {note.lesson_id}</strong>
                    <p className="muted text-sm mt-2 line-clamp-2">{note.body}</p>
                    <small>Retomar aula</small>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
