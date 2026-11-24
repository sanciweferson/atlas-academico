"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Accessibility, BookOpen, Check, Eye, Focus, Keyboard, Monitor, Moon, RotateCcw, Settings2, Sun } from "lucide-react"
import {
  DEFAULT_READING_PREFERENCES,
  type ReadingPreferences,
  readReadingPreferences,
  saveReadingPreferences,
} from "@/lib/atlas-reading-preferences"

type Tab = "visao" | "leitura" | "navegacao" | "experiencia"
type ThemeChoice = "light" | "dark" | "system"
const tabs: { id: Tab; title: string; icon: typeof Eye }[] = [
  { id: "visao", title: "Visão", icon: Eye },
  { id: "leitura", title: "Leitura", icon: BookOpen },
  { id: "navegacao", title: "Navegação", icon: Keyboard },
  { id: "experiencia", title: "Experiência", icon: Settings2 },
]
const themes: { value: ThemeChoice; title: string; icon: typeof Sun }[] = [
  { value: "light", title: "Claro", icon: Sun },
  { value: "dark", title: "Escuro", icon: Moon },
  { value: "system", title: "Sistema", icon: Monitor },
]

export default function AtlasAccessibilityCenter() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState<Tab>("visao")
  const [prefs, setPrefs] = useState<ReadingPreferences>(DEFAULT_READING_PREFERENCES)

  useEffect(() => {
    setMounted(true)
    setPrefs(readReadingPreferences())
  }, [])

  function update(partial: Partial<ReadingPreferences>) {
    const next = { ...prefs, ...partial }
    setPrefs(next)
    saveReadingPreferences(next)
  }

  function reset() {
    const defaults = { ...DEFAULT_READING_PREFERENCES }
    setPrefs(defaults)
    saveReadingPreferences(defaults)
    // O tema e o idioma são preferências independentes; não são apagados.
  }

  const chosen = mounted ? theme : undefined
  return (
    <section className="atlas-a11y" aria-labelledby="atlas-a11y-title">
      <header className="atlas-a11y-header">
        <span className="atlas-a11y-icon"><Accessibility size={24} aria-hidden="true" /></span>
        <div>
          <h2 id="atlas-a11y-title">Central de Acessibilidade</h2>
          <p className="muted">Personalize a leitura e a navegação. Os ajustes são feitos neste dispositivo.</p>
        </div>
      </header>
      <div className="atlas-a11y-layout">
        <nav className="atlas-a11y-tabs" aria-label="Categorias de acessibilidade">
          {tabs.map(({ id, title, icon: Icon }) => (
            <button key={id} type="button" aria-pressed={active === id}
              className={`atlas-a11y-tab ${active === id ? "atlas-a11y-tab-active" : ""}`}
              onClick={() => setActive(id)}>
              <Icon size={19} aria-hidden="true" /><span>{title}</span>
            </button>
          ))}
        </nav>
        <div className="atlas-a11y-content" aria-live="off">
          {active === "visao" && <section aria-labelledby="a11y-vision-title">
            <h3 id="a11y-vision-title">Ajustes de visão</h3>
            <div className="atlas-a11y-field">
              <label htmlFor="a11y-font">Tamanho da fonte nas aulas: <strong>{prefs.fontSize} px</strong></label>
              <input id="a11y-font" type="range" min="14" max="22" step="1" value={prefs.fontSize}
                onChange={(event) => update({ fontSize: Number(event.target.value) })} />
              <div className="atlas-a11y-range-label"><span>A−</span><span>A</span><span>A+</span></div>
            </div>
            <label className="atlas-a11y-toggle">
              <span><strong>Alto contraste</strong><small>Ativa cores escuras com texto e realces de alto contraste.</small></span>
              <input type="checkbox" checked={prefs.highContrast} onChange={event => update({ highContrast: event.target.checked })} />
            </label>
            <div className="atlas-a11y-field">
              <span className="atlas-a11y-label">Tema da interface</span>
              <div className="atlas-a11y-theme-grid" role="group" aria-label="Tema da interface">
                {themes.map(({ value, title, icon: Icon }) => (
                  <button key={value} type="button" aria-pressed={chosen === value}
                    className={`atlas-a11y-theme ${chosen === value ? "atlas-a11y-theme-selected" : ""}`}
                    onClick={() => setTheme(value)}>
                    <Icon size={20} aria-hidden="true" /> {title}
                    {chosen === value && <Check size={16} aria-hidden="true" />}
                  </button>
                ))}
              </div>
              <p className="muted atlas-a11y-note">O alto contraste se sobrepõe temporariamente às cores do tema escolhido.</p>
            </div>
          </section>}

          {active === "leitura" && <section aria-labelledby="a11y-reading-title">
            <h3 id="a11y-reading-title">Ajustes de leitura</h3>
            <div className="atlas-a11y-field">
              <label htmlFor="a11y-line-height">Espaçamento entre linhas das aulas</label>
              <select id="a11y-line-height" value={prefs.lineHeight}
                onChange={event => update({ lineHeight: Number(event.target.value) })}>
                <option value={1.5}>Compacto</option><option value={1.7}>Confortável</option><option value={1.9}>Amplo</option>
              </select>
            </div>
            <div className="atlas-a11y-field">
              <label htmlFor="a11y-spacing">Espaçamento entre letras das aulas</label>
              <select id="a11y-spacing" value={prefs.letterSpacing}
                onChange={event => update({ letterSpacing: Number(event.target.value) })}>
                <option value={0}>Padrão</option><option value={0.3}>Leve</option><option value={0.6}>Médio</option><option value={1}>Amplo</option>
              </select>
            </div>
            <div className="atlas-a11y-preview" aria-label="Prévia de leitura">
              <span className="atlas-a11y-preview-label"><BookOpen size={16} aria-hidden="true" /> Prévia</span>
              <p style={{ fontSize: prefs.fontSize, lineHeight: prefs.lineHeight, letterSpacing: `${prefs.letterSpacing}px` }}>
                Aprender programação exige prática, curiosidade e constância. Cada aula é uma oportunidade de construir conhecimento.
              </p>
            </div>
          </section>}

          {active === "navegacao" && <section aria-labelledby="a11y-navigation-title">
            <h3 id="a11y-navigation-title">Ajustes de navegação</h3>
            <label className="atlas-a11y-toggle">
              <span><strong>Destacar foco do teclado</strong><small>Realça o elemento selecionado ao navegar usando Tab.</small></span>
              <input type="checkbox" checked={prefs.enhancedFocus} onChange={event => update({ enhancedFocus: event.target.checked })} />
            </label>
            <label className="atlas-a11y-toggle">
              <span><strong>Reduzir animações</strong><small>Diminui transições e movimentos decorativos, sem desativar as funcionalidades.</small></span>
              <input type="checkbox" checked={prefs.reduceMotion} onChange={event => update({ reduceMotion: event.target.checked })} />
            </label>
            <p className="muted atlas-a11y-note">O Atlas continua acessível por teclado mesmo com o destaque extra desligado. As configurações de movimento do dispositivo também são respeitadas.</p>
          </section>}

          {active === "experiencia" && <section aria-labelledby="a11y-experience-title">
            <h3 id="a11y-experience-title">Experiência de estudo</h3>
            <label className="atlas-a11y-toggle">
              <span><strong><Focus size={17} aria-hidden="true" /> Ativar modo foco</strong><small>Nas páginas de aula, esconde a barra lateral do computador para ampliar a leitura.</small></span>
              <input type="checkbox" checked={prefs.focusMode} onChange={event => update({ focusMode: event.target.checked })} />
            </label>
            <div className="atlas-a11y-reset">
              <p className="muted">Restaura apenas acessibilidade e leitura. Seu tema, idioma, anotações, agenda e favoritos serão mantidos.</p>
              <button type="button" onClick={reset}><RotateCcw size={17} aria-hidden="true" /> Restaurar ajustes de acessibilidade</button>
            </div>
          </section>}
        </div>
      </div>
    </section>
  )
}
