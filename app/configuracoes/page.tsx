"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Accessibility, ArrowLeft, ChevronRight, FileText, Languages,
  LockKeyhole, ShieldCheck, type LucideIcon,
} from "lucide-react"
import { useAtlasLanguage } from "@/lib/atlas-i18n"
import AtlasLanguageChoices from "@/components/atlas-language-choices"
import AtlasAccessibilityCenter from "@/components/atlas-accessibility-center"
import AtlasAccountDeletionPreview from "@/components/atlas-account-deletion-preview"
import styles from "./configuracoes.module.css"

type Panel = "appearance" | "language" | "security"
type SettingRow = {
  id: string
  title: string
  detail: string
  Icon: LucideIcon
  href?: string
  panel?: Panel
}

const copy = {
  "pt-BR": {
    kicker: "SEU AMBIENTE DE ESTUDO", title: "Configurações",
    intro: "Gerencie sua conta e personalize o Atlas. Algumas preferências são salvas apenas neste dispositivo.",
    preferences: "PREFERÊNCIAS", account: "CONTA E PRIVACIDADE", back: "Voltar às configurações",
    appearance: "Aparência e acessibilidade", appearanceDetail: "Tema, contraste, leitura e navegação",
    language: "Idioma", languageDetail: "Português, inglês e espanhol",
    notifications: "Notificações", notificationsDetail: "Lembretes e avisos de estudo",
    profile: "Meu perfil", profileDetail: "Dados de cadastro e foto",
    security: "Conta e segurança", securityDetail: "Exclusão de conta em preparação",
    privacy: "Privacidade", privacyDetail: "Como protegemos seus dados",
    terms: "Termos de uso", termsDetail: "Condições de utilização do Atlas",
  },
  en: {
    kicker: "YOUR STUDY SPACE", title: "Settings",
    intro: "Manage your account and personalize Atlas. Some preferences are saved only on this device.",
    preferences: "PREFERENCES", account: "ACCOUNT AND PRIVACY", back: "Back to settings",
    appearance: "Appearance and accessibility", appearanceDetail: "Theme, contrast, reading and navigation",
    language: "Language", languageDetail: "Portuguese, English and Spanish",
    notifications: "Notifications", notificationsDetail: "Study reminders and updates",
    profile: "My profile", profileDetail: "Account details and avatar",
    security: "Account and security", securityDetail: "Account deletion is being prepared",
    privacy: "Privacy", privacyDetail: "How we protect your data",
    terms: "Terms of use", termsDetail: "Atlas usage conditions",
  },
  es: {
    kicker: "TU ESPACIO DE ESTUDIO", title: "Configuración",
    intro: "Gestiona tu cuenta y personaliza Atlas. Algunas preferencias se guardan solo en este dispositivo.",
    preferences: "PREFERENCIAS", account: "CUENTA Y PRIVACIDAD", back: "Volver a configuración",
    appearance: "Apariencia y accesibilidad", appearanceDetail: "Tema, contraste, lectura y navegación",
    language: "Idioma", languageDetail: "Portugués, inglés y español",
    notifications: "Notificaciones", notificationsDetail: "Recordatorios y avisos de estudio",
    profile: "Mi perfil", profileDetail: "Datos de registro y avatar",
    security: "Cuenta y seguridad", securityDetail: "Eliminación de cuenta en preparación",
    privacy: "Privacidad", privacyDetail: "Cómo protegemos tus datos",
    terms: "Términos de uso", termsDetail: "Condiciones de uso de Atlas",
  },
} as const

export default function ConfiguracoesPage() {
  const { language } = useAtlasLanguage()
  const text = copy[language]
  const [panel, setPanel] = useState<Panel | null>(null)

  const groups: { title: string; rows: SettingRow[] }[] = [
    {
      title: text.preferences,
      rows: [
        { id: "appearance", title: text.appearance, detail: text.appearanceDetail, Icon: Accessibility, panel: "appearance" },
        { id: "language", title: text.language, detail: text.languageDetail, Icon: Languages, panel: "language" },
      ],
    },
    {
      title: text.account,
      rows: [
        { id: "security", title: text.security, detail: text.securityDetail, Icon: LockKeyhole, panel: "security" },
        { id: "privacy", title: text.privacy, detail: text.privacyDetail, Icon: ShieldCheck, href: "/privacidade" },
        { id: "terms", title: text.terms, detail: text.termsDetail, Icon: FileText, href: "/termos" },
      ],
    },
  ]

  const panelInfo = panel === "appearance"
    ? { title: text.appearance, detail: text.appearanceDetail }
    : panel === "language"
      ? { title: text.language, detail: text.languageDetail }
      : { title: text.security, detail: text.securityDetail }

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <span className={styles.kicker}>{text.kicker}</span>
        <h1 className={styles.title}>{text.title}</h1>
        <p className={styles.subtitle}>{text.intro}</p>
      </header>

      {panel === null ? (
        <div className={styles.settingsHome}>
          {groups.map((group) => (
            <section key={group.title} className={styles.listGroup} aria-label={group.title}>
              <h2 className={styles.groupTitle}>{group.title}</h2>
              <div className={styles.list}>
                {group.rows.map(({ id, title, detail, Icon, href, panel: target }) => {
                  const content = (
                    <>
                      <span className={styles.rowIcon}><Icon size={20} aria-hidden="true" /></span>
                      <span className={styles.rowText}>
                        <strong>{title}</strong>
                        <small>{detail}</small>
                      </span>
                      <ChevronRight size={19} className={styles.chevron} aria-hidden="true" />
                    </>
                  )
                  return href ? (
                    <Link key={id} className={styles.settingRow} href={href}>{content}</Link>
                  ) : (
                    <button key={id} type="button" className={styles.settingRow}
                      onClick={() => { if (target) setPanel(target) }}>
                      {content}
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.panelView}>
          <button type="button" className={styles.backButton} onClick={() => setPanel(null)}>
            <ArrowLeft size={18} aria-hidden="true" /> {text.back}
          </button>
          <div className={styles.panelHeading}>
            <h2>{panelInfo.title}</h2>
            <p>{panelInfo.detail}</p>
          </div>
          <div className={styles.panelContent}>
            {panel === "appearance" && <AtlasAccessibilityCenter />}
            {panel === "language" && <AtlasLanguageChoices />}
            {panel === "security" && <AtlasAccountDeletionPreview />}
          </div>
        </div>
      )}
    </div>
  )
}
