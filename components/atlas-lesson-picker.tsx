"use client"

import { useMemo, useRef, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { BookOpen, Check, ChevronsUpDown, Search, X } from "lucide-react"
import { atlasLessons, findAtlasLesson } from "@/lib/atlas-study-index"

type Props = { id: string; value: string; onChange: (id: string) => void }

const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()

export default function AtlasLessonPicker({ id, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)
  const selected = findAtlasLesson(value)
  const filtered = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean)
    return atlasLessons.filter((lesson) => {
      const haystack = normalize(`${lesson.discipline} ${lesson.title}`)
      return terms.every((term) => haystack.includes(term))
    })
  }, [query])

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (next) setQuery("")
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button id={id} type="button" className="field atlas-v31-lesson-trigger"
          aria-label={selected ? `Aula: ${selected.discipline} — ${selected.title}. Alterar aula` : "Selecionar uma aula"}>
          <BookOpen size={19} aria-hidden="true" />
          <span>{selected ? `${selected.discipline} — ${selected.title}` : "Pesquisar e selecionar uma aula"}</span>
          <ChevronsUpDown size={18} aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="atlas-v31-dialog-overlay" />
        <Dialog.Content className="atlas-v31-dialog-content atlas-v31-lesson-dialog"
          onOpenAutoFocus={(event) => { event.preventDefault(); searchRef.current?.focus() }}>
          <div className="atlas-v31-time-heading">
            <Dialog.Title>Selecionar uma aula</Dialog.Title>
            <Dialog.Close type="button" className="atlas-v31-time-close" aria-label="Fechar pesquisa de aulas"><X size={21}/></Dialog.Close>
          </div>
          <Dialog.Description className="atlas-v31-dialog-description">
            Pesquise pelo nome da aula ou da disciplina e escolha um resultado.
          </Dialog.Description>
          <div className="atlas-v31-lesson-search">
            <Search size={19} aria-hidden="true" />
            <input ref={searchRef} className="field" type="search" value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: HTML, algoritmo, CSS..." aria-label="Pesquisar aulas"
              autoComplete="off" />
          </div>
          <p className="atlas-v31-lesson-counter" role="status">
            {filtered.length} {filtered.length === 1 ? "aula encontrada" : "aulas encontradas"}
            {filtered.length > 70 ? ". Mostrando as primeiras 70; refine a pesquisa." : "."}
          </p>
          <div className="atlas-v31-lesson-results" role="group" aria-label="Resultados de aulas">
            {filtered.length === 0 && <p className="atlas-v31-lesson-empty">Nenhuma aula encontrada. Tente outro termo.</p>}
            {filtered.slice(0, 70).map((lesson) => (
              <button type="button" key={lesson.id}
                className={`atlas-v31-lesson-result${value === lesson.id ? " is-selected" : ""}`}
                onClick={() => { onChange(lesson.id); setOpen(false) }}
                aria-pressed={value === lesson.id}>
                <span><small>{lesson.discipline}</small><strong>{lesson.title}</strong></span>
                {value === lesson.id && <Check size={19} aria-hidden="true" />}
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
