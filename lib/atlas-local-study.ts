"use client"

import { useEffect, useState } from "react"
import { browserSupabase } from "@/lib/supabase"

const PREFIX = "atlas-v3-study:"
const EVENT = "atlas-v3-study-changed"

export type StudySession = {
  id: string
  lessonId: string
  startsAt: string
  note: string
  complete: boolean
  createdAt: string
}

type StudyData = { favorites: string[]; sessions: StudySession[] }
const EMPTY: StudyData = { favorites: [], sessions: [] }

function read(key: string): StudyData {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return { favorites: [], sessions: [] }
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== "object") return { ...EMPTY }
    const obj = value as Record<string, unknown>
    const favorites = Array.isArray(obj.favorites)
      ? obj.favorites.filter((id): id is string => typeof id === "string" && id.length < 80).slice(0, 300)
      : []
    const sessions = Array.isArray(obj.sessions)
      ? obj.sessions.filter((item): item is StudySession => {
        if (!item || typeof item !== "object") return false
        const s = item as Record<string, unknown>
        return typeof s.id === "string" && typeof s.lessonId === "string"
          && typeof s.startsAt === "string" && !Number.isNaN(Date.parse(s.startsAt))
          && typeof s.note === "string" && typeof s.complete === "boolean"
          && typeof s.createdAt === "string"
      }).slice(0, 200)
      : []
    return { favorites, sessions }
  } catch { return { favorites: [], sessions: [] } }
}

export function useAtlasLocalStudy() {
  const [key, setKey] = useState<string | null>(null)
  const [data, setData] = useState<StudyData>({ favorites: [], sessions: [] })
  const [ready, setReady] = useState(false)
  const [storageError, setStorageError] = useState("")

  useEffect(() => {
    let active = true
    const supabase = browserSupabase()
    if (!supabase) { setKey(`${PREFIX}visitante`); return }
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (active) setKey(`${PREFIX}${user?.id ?? "visitante"}`)
    }).catch(() => { if (active) setKey(`${PREFIX}visitante`) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setKey(`${PREFIX}${session?.user?.id ?? "visitante"}`)
    })
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    if (!key) return
    const reload = () => { setData(read(key)); setReady(true) }
    reload()
    const onStorage = (event: StorageEvent) => { if (event.key === key) reload() }
    const onLocal = (event: Event) => {
      if ((event as CustomEvent<string>).detail === key) reload()
    }
    window.addEventListener("storage", onStorage)
    window.addEventListener(EVENT, onLocal)
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(EVENT, onLocal) }
  }, [key])

  function update(modify: (previous: StudyData) => StudyData) {
    if (!key) return false
    const next = modify(read(key))
    try {
      localStorage.setItem(key, JSON.stringify(next))
      setData(next)
      setStorageError("")
      window.dispatchEvent(new CustomEvent(EVENT, { detail: key }))
      return true
    } catch {
      setStorageError("Não foi possível salvar os dados neste navegador. Verifique o armazenamento disponível.")
      return false
    }
  }

  function toggleFavorite(id: string) {
    return update((old) => ({ ...old, favorites: old.favorites.includes(id)
      ? old.favorites.filter((item) => item !== id)
      : [...old.favorites, id].slice(0, 300) }))
  }
  function createSession(lessonId: string, startsAt: string, note: string) {
    const date = new Date(startsAt)
    if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) return false
    const session: StudySession = {
      id: crypto.randomUUID(), lessonId, startsAt: date.toISOString(),
      note: note.trim().slice(0, 280), complete: false, createdAt: new Date().toISOString(),
    }
    return update((old) => ({ ...old, sessions: [...old.sessions, session].slice(-200) }))
  }
  function setSessionComplete(id: string, complete: boolean) {
    return update((old) => ({ ...old, sessions: old.sessions.map((item) => item.id === id ? { ...item, complete } : item) }))
  }
  // Zera somente indicadores de conclusão local. Não remove sessões,
  // favoritos ou registros sincronizados com o Supabase.
  function resetCompletedSessions() {
    return update((old) => ({
      ...old, sessions: old.sessions.map((item) => item.complete ? { ...item, complete: false } : item),
    }))
  }
  function removeSession(id: string) {
    return update((old) => ({ ...old, sessions: old.sessions.filter((item) => item.id !== id) }))
  }
  return { ...data, ready, storageError, toggleFavorite, createSession, setSessionComplete, removeSession, resetCompletedSessions }
}
