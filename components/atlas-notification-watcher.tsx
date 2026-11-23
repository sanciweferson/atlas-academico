"use client"

import { useEffect, useRef } from "react"
import { useAtlasLocalStudy } from "@/lib/atlas-local-study"
import { findAtlasLesson } from "@/lib/atlas-study-index"
import { showAtlasSystemNotification } from "@/lib/atlas-device-notifications"

const SHOWN_KEY = "atlas-v3-notification-shown-ids"

export default function AtlasNotificationWatcher() {
  const { sessions, ready } = useAtlasLocalStudy()
  const running = useRef(false)

  useEffect(() => {
    if (!ready) return
    let disposed = false

    const check = async () => {
      if (disposed || running.current || typeof Notification === "undefined" || Notification.permission !== "granted") return
      running.current = true
      try {
        const now = Date.now()
        let shown: string[] = []
        try {
          const stored: unknown = JSON.parse(localStorage.getItem(SHOWN_KEY) || "[]")
          if (Array.isArray(stored)) shown = stored.filter((value): value is string => typeof value === "string").slice(-500)
        } catch { /* memória opcional */ }

        // Evita notificar compromissos antigos. Tolera alguma suspensão do navegador.
        const pending = sessions.filter((session) => {
          const startsAt = Date.parse(session.startsAt)
          return !session.complete && !shown.includes(session.id) && startsAt <= now && startsAt >= now - 30 * 60_000
        }).sort((a, b) => a.startsAt.localeCompare(b.startsAt)).slice(0, 3)

        for (const session of pending) {
          if (disposed) break
          const title = findAtlasLesson(session.lessonId)?.title ?? "Sua aula agendada"
          const success = await showAtlasSystemNotification("Hora de estudar!", `Sua sessão começou: ${title}`, `atlas-session-${session.id}`, `/aula/${encodeURIComponent(session.lessonId)}`)
          if (success) {
            shown.push(session.id)
            try { localStorage.setItem(SHOWN_KEY, JSON.stringify(shown.slice(-500))) } catch { /* armazenamento opcional */ }
          } else break
        }
      } finally { running.current = false }
    }

    void check()
    const interval = window.setInterval(() => void check(), 15_000)
    const onVisible = () => { if (!document.hidden) void check() }
    document.addEventListener("visibilitychange", onVisible)
    window.addEventListener("focus", onVisible)
    return () => { disposed = true; window.clearInterval(interval); document.removeEventListener("visibilitychange", onVisible); window.removeEventListener("focus", onVisible) }
  }, [ready, sessions])

  return null
}
