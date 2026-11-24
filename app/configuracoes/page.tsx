"use client"

import { useAtlasLanguage } from "@/lib/atlas-i18n"
import AtlasLanguageChoices from "@/components/atlas-language-choices"
import AtlasAccessibilityCenter from "@/components/atlas-accessibility-center"
import AtlasAccountDeletionPreview from "@/components/atlas-account-deletion-preview"
import styles from "./configuracoes.module.css"

export default function ConfiguracoesPage() {
  const { tr, language } = useAtlasLanguage()
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <span className="eyebrow">{tr("Seu ambiente de estudo")}</span>
        <h1 className="page-title">{tr("Configurações")}</h1>
        <p className="muted">{language === "en"
          ? "Adjust Atlas accessibility, appearance, and language. Your preferences are saved in this browser."
          : language === "es"
            ? "Ajusta la accesibilidad, la apariencia y el idioma de Atlas. Tus preferencias se guardan en este navegador."
            : "Ajuste a acessibilidade, a aparência e o idioma do Atlas. Suas preferências ficam salvas neste navegador."}</p>
      </header>
      <AtlasAccessibilityCenter />
      <AtlasLanguageChoices />
      <AtlasAccountDeletionPreview />
    </div>
  )
}
