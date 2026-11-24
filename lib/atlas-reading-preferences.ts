export const READING_PREFERENCES_KEY = "atlas-v3-reading-preferences"
export const READING_PREFERENCES_EVENT = "atlas:reading-preferences-changed"

export type ReadingPreferences = {
  fontSize: number
  lineHeight: number
  focusMode: boolean
  letterSpacing: number
  highContrast: boolean
  reduceMotion: boolean
  enhancedFocus: boolean
}

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  fontSize: 16,
  lineHeight: 1.7,
  focusMode: false,
  letterSpacing: 0,
  highContrast: false,
  reduceMotion: false,
  enhancedFocus: false,
}

/** Mantém os mesmos dados locais. Campos novos recebem defaults quando não existirem. */
export function readReadingPreferences(): ReadingPreferences {
  if (typeof window === "undefined") return { ...DEFAULT_READING_PREFERENCES }
  try {
    const raw = window.localStorage.getItem(READING_PREFERENCES_KEY)
    if (!raw) return { ...DEFAULT_READING_PREFERENCES }
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== "object") return { ...DEFAULT_READING_PREFERENCES }
    const obj = value as Record<string, unknown>
    const spacing = typeof obj.letterSpacing === "number" ? obj.letterSpacing : 0
    return {
      fontSize: typeof obj.fontSize === "number" && Number.isFinite(obj.fontSize)
        ? Math.min(22, Math.max(14, Math.round(obj.fontSize))) : 16,
      lineHeight: obj.lineHeight === 1.5 || obj.lineHeight === 1.7 || obj.lineHeight === 1.9
        ? obj.lineHeight : 1.7,
      focusMode: obj.focusMode === true,
      letterSpacing: Number.isFinite(spacing) && [0, 0.3, 0.6, 1].includes(spacing) ? spacing : 0,
      highContrast: obj.highContrast === true,
      reduceMotion: obj.reduceMotion === true,
      enhancedFocus: obj.enhancedFocus === true,
    }
  } catch {
    return { ...DEFAULT_READING_PREFERENCES }
  }
}

export function saveReadingPreferences(prefs: ReadingPreferences) {
  if (typeof window === "undefined") return
  // Aplicar o formato normalizado evita persistir valores fora da faixa esperada.
  const validated: ReadingPreferences = {
    fontSize: Math.min(22, Math.max(14, Math.round(prefs.fontSize))),
    lineHeight: [1.5, 1.7, 1.9].includes(prefs.lineHeight) ? prefs.lineHeight : 1.7,
    focusMode: prefs.focusMode === true,
    letterSpacing: [0, 0.3, 0.6, 1].includes(prefs.letterSpacing) ? prefs.letterSpacing : 0,
    highContrast: prefs.highContrast === true,
    reduceMotion: prefs.reduceMotion === true,
    enhancedFocus: prefs.enhancedFocus === true,
  }
  try { window.localStorage.setItem(READING_PREFERENCES_KEY, JSON.stringify(validated)) } catch { /* Opcional */ }
  applyReadingPreferences(validated)
  window.dispatchEvent(new Event(READING_PREFERENCES_EVENT))
}

export function applyReadingPreferences(prefs: ReadingPreferences) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.style.setProperty("--atlas-reading-font-size", `${prefs.fontSize}px`)
  root.style.setProperty("--atlas-reading-line-height", String(prefs.lineHeight))
  root.style.setProperty("--atlas-reading-letter-spacing", `${prefs.letterSpacing ?? 0}px`)
  root.classList.toggle("atlas-v31-high-contrast", prefs.highContrast === true)
  root.classList.toggle("atlas-v31-reduce-motion", prefs.reduceMotion === true)
  root.classList.toggle("atlas-v31-enhanced-focus", prefs.enhancedFocus === true)
}
