export const READING_PREFERENCES_KEY = "atlas-v3-reading-preferences"
export const READING_PREFERENCES_EVENT = "atlas:reading-preferences-changed"

export type ReadingPreferences = {
  fontSize: number
  lineHeight: number
  focusMode: boolean
}

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  fontSize: 16,
  lineHeight: 1.7,
  focusMode: false,
}

export function readReadingPreferences(): ReadingPreferences {
  if (typeof window === "undefined") return { ...DEFAULT_READING_PREFERENCES }
  try {
    const raw = window.localStorage.getItem(READING_PREFERENCES_KEY)
    if (!raw) return { ...DEFAULT_READING_PREFERENCES }
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== "object") return { ...DEFAULT_READING_PREFERENCES }
    const obj = value as Record<string, unknown>
    return {
      fontSize: typeof obj.fontSize === "number" && Number.isFinite(obj.fontSize)
        ? Math.min(22, Math.max(14, Math.round(obj.fontSize))) : 16,
      lineHeight: obj.lineHeight === 1.5 || obj.lineHeight === 1.7 || obj.lineHeight === 1.9
        ? obj.lineHeight : 1.7,
      focusMode: obj.focusMode === true,
    }
  } catch {
    return { ...DEFAULT_READING_PREFERENCES }
  }
}

export function saveReadingPreferences(prefs: ReadingPreferences) {
  if (typeof window === "undefined") return
  try { window.localStorage.setItem(READING_PREFERENCES_KEY, JSON.stringify(prefs)) } catch { /* Opcional */ }
  applyReadingPreferences(prefs)
  window.dispatchEvent(new Event(READING_PREFERENCES_EVENT))
}

export function applyReadingPreferences(prefs: ReadingPreferences) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.style.setProperty("--atlas-reading-font-size", `${prefs.fontSize}px`)
  root.style.setProperty("--atlas-reading-line-height", String(prefs.lineHeight))
}
