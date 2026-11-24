"use client"

import { useAtlasLanguage } from "@/lib/atlas-i18n"
import AtlasLanguageChoices from "@/components/atlas-language-choices"
import AtlasAccessibilityCenter from "@/components/atlas-accessibility-center"
import styles from "./configuracoes.module.css"

export default function ConfiguracoesPage() {
  const { tr } = useAtlasLanguage()
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <span className="eyebrow">{tr("Seu ambiente de estudo")}</span>
        <h1 className="page-title">{tr("Configurações")}</h1>
        <p className="muted">Ajuste a acessibilidade, a aparência e o idioma do Atlas. Suas preferências ficam salvas neste navegador.</p>
      </header>
      <AtlasAccessibilityCenter />
      <AtlasLanguageChoices />
    </div>
  )
}
