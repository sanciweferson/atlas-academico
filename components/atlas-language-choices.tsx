"use client"

import { Check, Languages } from "lucide-react"
import { useAtlasLanguage, type AtlasLanguage } from "@/lib/atlas-i18n"
import styles from "@/app/configuracoes/configuracoes.module.css"

type LocaleText = Record<AtlasLanguage, string>
const intro: LocaleText = {
  "pt-BR": "Escolha seu idioma. A preferência é salva neste navegador.",
  en: "Choose your language. Your preference is saved in this browser.",
  es: "Elige tu idioma. La preferencia se guarda en este navegador.",
}
const note: LocaleText = {
  "pt-BR": "Tradução da interface ainda parcial. As aulas e os documentos legais continuam em português.",
  en: "Interface translation is still partial. Lessons and legal documents remain in Portuguese.",
  es: "La traducción de la interfaz todavía es parcial. Las lecciones y los documentos legales siguen en portugués.",
}
const heading: LocaleText = {
  "pt-BR": "Idioma da interface",
  en: "Interface language",
  es: "Idioma de la interfaz",
}
const choices: { code: AtlasLanguage; label: string; detail: string }[] = [
  { code: "pt-BR", label: "Português (Brasil)", detail: "Brasil" },
  { code: "en", label: "English", detail: "United States" },
  { code: "es", label: "Español", detail: "España" },
]

// As bandeiras são desenhos SVG locais, não emojis nem recursos externos.
// Assim elas têm aparência uniforme também no Windows e no Android.
function Flag({ code }: { code: AtlasLanguage }) {
  const common = { viewBox: "0 0 48 32", width: 48, height: 32, "aria-hidden": true as const, focusable: "false" as const }
  if (code === "pt-BR") return (
    <svg {...common}>
      <rect width="48" height="32" fill="#159447" />
      <polygon points="24,4 44,16 24,28 4,16" fill="#FFDA44" />
      <circle cx="24" cy="16" r="9" fill="#2549A1" />
      <path d="M15.5 13.7Q23.7 11 32 17.2" stroke="#fff" strokeWidth="2.1" fill="none" />
    </svg>
  )
  if (code === "en") return (
    <svg {...common}>
      <rect width="48" height="32" fill="#fff" />
      {[0, 5, 10, 15, 20, 25, 30].map((y) => <rect key={y} y={y} width="48" height="2.6" fill="#B22234" />)}
      <rect width="21" height="17.2" fill="#3C3B6E" />
      {[3.5, 7.5, 11.5, 15.5].map((x) =>
        [3.8, 7.5, 11.2, 14.9].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.85" fill="white" />)
      )}
    </svg>
  )
  return (
    <svg {...common}>
      <rect width="48" height="32" fill="#AA151B" />
      <rect y="8" width="48" height="16" fill="#F1BF00" />
      <rect x="14.5" y="12" width="5" height="8" rx="0.7" fill="#AA151B" />
      <rect x="15.8" y="10.6" width="2.5" height="2" fill="#AA151B" />
      <rect x="15.7" y="13.3" width="2.6" height="3.4" fill="#fff" />
    </svg>
  )
}

export default function AtlasLanguageChoices() {
  const { language, setLanguage } = useAtlasLanguage()
  return (
    <section className={styles.card} aria-labelledby="settings-idioma">
      <div className={styles.cardHeading}>
        <span className={styles.headingIcon}><Languages size={20} aria-hidden="true" /></span>
        <div>
          <h2 id="settings-idioma">{heading[language]}</h2>
          <p>{intro[language]}</p>
        </div>
      </div>
      <div className={styles.languageGrid} role="group" aria-label={heading[language]}>
        {choices.map(({ code, label, detail }) => (
          <button key={code} type="button" aria-pressed={language === code}
            className={`${styles.languageChoice} ${language === code ? styles.languageChoiceSelected : ""}`}
            onClick={() => setLanguage(code)}>
            <span className={styles.languageFlag}><Flag code={code} /></span>
            <span className={styles.languageName}><strong>{label}</strong><small>{detail}</small></span>
            {language === code && <Check size={19} className={styles.languageCheck} aria-hidden="true" />}
          </button>
        ))}
      </div>
      <p className={styles.hint}>{note[language]}</p>
    </section>
  )
}
