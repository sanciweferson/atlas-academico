"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  applyReadingPreferences, readReadingPreferences, READING_PREFERENCES_EVENT,
} from "@/lib/atlas-reading-preferences"

/** Aplica preferências salvas em todas as páginas, sem substituir o ThemeProvider existente. */
export default function AtlasReadingPreferences() {
  const pathname = usePathname()
  useEffect(() => {
    function sync() {
      const prefs = readReadingPreferences()
      applyReadingPreferences(prefs)
      const lesson = pathname.startsWith("/aula/")
      document.documentElement.classList.toggle("atlas-v3-lesson-route", lesson)
      document.documentElement.classList.toggle("atlas-v3-focus-mode", lesson && prefs.focusMode)
    }
    sync()
    window.addEventListener(READING_PREFERENCES_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(READING_PREFERENCES_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [pathname])
  return null
}
