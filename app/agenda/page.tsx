"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { CalendarDays, Check, Clock3, Trash2, RotateCcw, BellRing } from "lucide-react"
import { atlasLessons, findAtlasLesson } from "@/lib/atlas-study-index"
import { useAtlasLocalStudy } from "@/lib/atlas-local-study"
import AtlasTimePicker from "@/components/atlas-time-picker"
import AtlasLessonPicker from "@/components/atlas-lesson-picker"

const suggestedTimes = ["07:30", "09:00", "12:30", "15:00", "19:00"]
const pad = (number: number) => String(number).padStart(2, "0")
const localDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const localTime = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`
const displayDate = (iso: string) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short" }).format(new Date(iso))

export default function AgendaPage() {
  const { sessions, ready, createSession, removeSession, setSessionComplete, storageError } = useAtlasLocalStudy()
  const [lessonId, setLessonId] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [minimumDate, setMinimumDate] = useState("")
  const [note, setNote] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => { setMinimumDate(localDate(new Date())) }, [])

  function chooseDay(offset: number) {
    const selected = new Date()
    selected.setDate(selected.getDate() + offset)
    setDate(localDate(selected))
    setMessage("")
  }

  function chooseTestTime() {
    const selected = new Date(Date.now() + 2 * 60_000 + 15_000)
    setDate(localDate(selected))
    setTime(localTime(selected))
    setMessage("Teste preparado para daqui a aproximadamente 2 minutos. Clique em Salvar agendamento e ative as notificações na Central de avisos.")
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const when = `${date}T${time}`
    const timeStamp = new Date(when).getTime()
    if (!lessonId || !date || !time || !Number.isFinite(timeStamp) || timeStamp <= Date.now()) {
      setMessage("Escolha uma aula, um dia e um horário futuro.")
      return
    }
    if (createSession(lessonId, when, note)) {
      setDate(""); setTime(""); setNote("")
      setMessage("Sessão salva neste navegador. Para alertas do dispositivo, abra Notificações e permita os avisos.")
    } else setMessage("Não foi possível salvar. Verifique a data e o armazenamento do navegador.")
  }

  const selectedDate = date && time ? new Date(`${date}T${time}`) : null
  const selectedValid = selectedDate !== null && Number.isFinite(selectedDate.getTime())
  const ordered = [...sessions].sort((a, b) => a.startsAt.localeCompare(b.startsAt))

  return (
    <div className="atlas-v3-study-page">
      <header>
        <span className="eyebrow">PLANEJAMENTO</span>
        <h1 className="page-title">Agenda de estudos</h1>
        <p className="muted mt-2">Escolha uma aula, defina o dia e personalize o horário. Os agendamentos continuam salvos apenas neste navegador.</p>
      </header>

      <form className="panel atlas-v3-study-form atlas-v3-agenda-form" onSubmit={submit}>
        <h2><CalendarDays size={20} aria-hidden="true" /> Agendar uma aula</h2>
        <label htmlFor="atlas-agenda-lesson">Aula</label>
        <AtlasLessonPicker id="atlas-agenda-lesson" value={lessonId} onChange={(selected) => { setLessonId(selected); setMessage("") }} />

        <div className="atlas-v3-date-time-grid">
          <div className="atlas-v3-date-time-control">
            <label htmlFor="atlas-agenda-day"><CalendarDays size={16} aria-hidden="true" /> Data</label>
            <input id="atlas-agenda-day" className="field" type="date" required min={minimumDate || undefined} value={date} onChange={(event) => { setDate(event.target.value); setMessage("") }} />
            <div className="atlas-v3-agenda-chips" role="group" aria-label="Datas rápidas">
              <button type="button" onClick={() => chooseDay(0)} className="atlas-v3-agenda-chip">Hoje</button>
              <button type="button" onClick={() => chooseDay(1)} className="atlas-v3-agenda-chip">Amanhã</button>
            </div>
          </div>
          <div className="atlas-v3-date-time-control">
            <label htmlFor="atlas-agenda-time"><Clock3 size={16} aria-hidden="true" /> Horário</label>
            <AtlasTimePicker id="atlas-agenda-time" value={time} onChange={(selected) => { setTime(selected); setMessage("") }} />
            <div className="atlas-v3-agenda-chips" role="group" aria-label="Horários sugeridos">
              {suggestedTimes.map((value) => <button key={value} type="button" className="atlas-v3-agenda-chip" aria-pressed={time === value} onClick={() => { setTime(value); setMessage("") }}>{value}</button>)}
            </div>
          </div>
        </div>

        <button type="button" className="atlas-v3-agenda-test" onClick={chooseTestTime}><BellRing size={17} aria-hidden="true" /> Preparar teste para daqui a 2 minutos</button>
        {selectedDate !== null && selectedValid && <p className="atlas-v3-agenda-preview" role="status"><Check size={17} aria-hidden="true" /> Horário escolhido: <strong>{displayDate(selectedDate.toISOString())}</strong></p>}

        <label htmlFor="atlas-agenda-note">Observação (opcional)</label>
        <textarea id="atlas-agenda-note" className="field" maxLength={280} rows={3} placeholder="Ex.: revisar conceitos e resolver 5 exercícios" value={note} onChange={(event) => setNote(event.target.value)} />
        <div className="atlas-v3-agenda-submit">
          <button type="submit" className="btn" disabled={!ready || !atlasLessons.length}>Salvar agendamento</button>
          <Link href="/notificacoes" className="text-link">Configurar notificações</Link>
        </div>
        {message && <p role="status" className="muted text-sm">{message}</p>}
        <p className="muted text-sm">Escolha o horário no formato de 24 horas (00:00 a 23:59). O calendário de datas continua sendo o controle do navegador.</p>
      </form>

      <section aria-labelledby="atlas-agenda-lista">
        <div className="atlas-v3-study-section-heading"><h2 id="atlas-agenda-lista">Sessões agendadas</h2><Link className="text-link" href="/notificacoes">Ver avisos</Link></div>
        {!ready ? <p role="status">Carregando agenda...</p> : ordered.length === 0 ? <p className="panel muted">Nenhuma sessão agendada.</p> : (
          <div className="atlas-v3-study-cards">{ordered.map((session) => {
            const lesson = findAtlasLesson(session.lessonId)
            return <article key={session.id} className="panel atlas-v3-study-card">
              <span className="eyebrow">{session.complete ? "CONCLUÍDA" : "PLANEJADA"}</span>
              <h3>{lesson?.title ?? session.lessonId}</h3>
              <p className="muted text-sm">{displayDate(session.startsAt)}</p>
              {session.note && <p className="muted text-sm">{session.note}</p>}
              <div className="atlas-v3-study-actions">
                <Link href={`/aula/${encodeURIComponent(session.lessonId)}`} className="btn-secondary">Abrir aula</Link>
                <button type="button" className="btn-secondary" onClick={() => setSessionComplete(session.id, !session.complete)}>
                  {session.complete ? <RotateCcw size={16} aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
                  {session.complete ? "Reabrir" : "Concluir"}
                </button>
                <button type="button" className="atlas-v3-study-icon-button" aria-label="Excluir agendamento" onClick={() => removeSession(session.id)}><Trash2 size={18} aria-hidden="true" /></button>
              </div>
            </article>
          })}</div>
        )}
      </section>
      {storageError && <p role="alert">{storageError}</p>}
    </div>
  )
}
