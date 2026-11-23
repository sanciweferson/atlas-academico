"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { BookOpen, Check, Eye, Focus, Monitor, Moon, RotateCcw, Settings2, Sun, Type } from "lucide-react"
import {
  DEFAULT_READING_PREFERENCES, type ReadingPreferences,
  readReadingPreferences, saveReadingPreferences,
} from "@/lib/atlas-reading-preferences"
import styles from "./configuracoes.module.css"

type ThemeChoice = "light" | "dark" | "system"
const themes: { value: ThemeChoice; title: string; detail: string; icon: typeof Sun }[] = [
  { value: "light", title: "Claro", detail: "Ambiente iluminado", icon: Sun },
  { value: "dark", title: "Escuro", detail: "Visual de baixo brilho", icon: Moon },
  { value: "system", title: "Sistema", detail: "Segue o dispositivo", icon: Monitor },
]

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [prefs, setPrefs] = useState<ReadingPreferences>(DEFAULT_READING_PREFERENCES)

  useEffect(() => {
    setMounted(true)
    setPrefs(readReadingPreferences())
  }, [])

  function updatePrefs(next: ReadingPreferences) {
    setPrefs(next)
    saveReadingPreferences(next)
  }

  const chosenTheme = mounted ? theme : undefined

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <span className="eyebrow">Seu ambiente de estudo</span>
        <h1 className="page-title">Configurações</h1>
        <p className="muted">Personalize a aparência do Atlas e a leitura das aulas. Suas escolhas ficam salvas neste navegador.</p>
      </header>

      <section className={styles.card} aria-labelledby="settings-tema">
        <div className={styles.cardHeading}>
          <span className={styles.headingIcon}><Settings2 size={20} aria-hidden="true" /></span>
          <div>
            <h2 id="settings-tema">Aparência</h2>
            <p>Escolha como a interface será exibida.</p>
          </div>
        </div>
        <div className={styles.themeGrid} role="group" aria-label="Tema da interface">
          {themes.map(({ value, title, detail, icon: Icon }) => (
            <button key={value} type="button" onClick={() => setTheme(value)}
              className={`${styles.themeChoice} ${chosenTheme === value ? styles.selected : ""}`}
              aria-pressed={chosenTheme === value}>
              <Icon size={22} aria-hidden="true" />
              <span className={styles.themeText}><strong>{title}</strong><small>{detail}</small></span>
              {chosenTheme === value && <Check size={18} className={styles.check} aria-hidden="true" />}
            </button>
          ))}
        </div>
        <p className={styles.hint}>Sistema acompanha o tema configurado no Windows, Android ou outro dispositivo.</p>
      </section>

      <section className={styles.card} aria-labelledby="settings-leitura">
        <div className={styles.cardHeading}>
          <span className={styles.headingIcon}><Type size={20} aria-hidden="true" /></span>
          <div>
            <h2 id="settings-leitura">Leitura das aulas</h2>
            <p>Adapte o texto para estudar com mais conforto.</p>
          </div>
        </div>
        <div className={styles.controlRow}>
          <label htmlFor="atlas-font-size">Tamanho do texto da aula <strong>{prefs.fontSize} px</strong></label>
          <input id="atlas-font-size" type="range" min="14" max="22" step="1"
            value={prefs.fontSize} onChange={(e) => updatePrefs({ ...prefs, fontSize: Number(e.target.value) })}
            className={styles.range} />
          <div className={styles.rangeLabels}><span>Menor</span><span>Maior</span></div>
        </div>
        <div className={styles.controlRow}>
          <label htmlFor="atlas-line-height">Espaçamento entre linhas</label>
          <select id="atlas-line-height" className={styles.select} value={prefs.lineHeight}
            onChange={(e) => updatePrefs({ ...prefs, lineHeight: Number(e.target.value) })}>
            <option value="1.5">Compacto</option>
            <option value="1.7">Confortável</option>
            <option value="1.9">Amplo</option>
          </select>
        </div>
        <div className={styles.preview} aria-label="Prévia das preferências de leitura">
          <span className={styles.previewLabel}><BookOpen size={15} aria-hidden="true" /> Prévia de leitura</span>
          <p style={{ fontSize: prefs.fontSize, lineHeight: prefs.lineHeight }}>
            Aprender programação exige prática, curiosidade e constância. Cada aula é uma oportunidade de construir conhecimento.
          </p>
        </div>
      </section>

      <section className={styles.card} aria-labelledby="settings-foco">
        <div className={styles.cardHeading}>
          <span className={styles.headingIcon}><Focus size={20} aria-hidden="true" /></span>
          <div><h2 id="settings-foco">Modo foco</h2><p>Reduza as distrações durante as aulas.</p></div>
        </div>
        <label className={styles.toggleRow} htmlFor="atlas-focus-mode">
          <span className={styles.toggleText}>
            <strong><Eye size={18} aria-hidden="true" /> Ativar modo foco</strong>
            <small>Nas páginas de aula, oculta a sidebar desktop e amplia a área de leitura. O cabeçalho permanece acessível.</small>
          </span>
          <input id="atlas-focus-mode" type="checkbox" checked={prefs.focusMode}
            onChange={(e) => updatePrefs({ ...prefs, focusMode: e.target.checked })} />
        </label>
      </section>

      <div className={styles.bottomRow}>
        <p>As preferências de leitura são armazenadas apenas neste navegador.</p>
        <button type="button" className={styles.reset} onClick={() => updatePrefs({ ...DEFAULT_READING_PREFERENCES })}>
          <RotateCcw size={16} aria-hidden="true" /> Restaurar leitura
        </button>
      </div>
    </div>
  )
}
