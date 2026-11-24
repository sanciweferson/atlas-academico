"use client"

// ATLAS V3.1 — painel traduzido. Exclusao continua DESATIVADA ate conclusao da seguranca.
import { ShieldAlert, Trash2 } from "lucide-react"
import { useAtlasLanguage } from "@/lib/atlas-i18n"

const labels = {
  "pt-BR": {
    security: "Conta e segurança", intro: "Gerencie a segurança da sua conta no Atlas Acadêmico.",
    title: "Excluir minha conta",
    body: "Quando disponível, a exclusão exigirá confirmação de identidade por e-mail. A conta será suspensa por 30 dias, com possibilidade de recuperação durante esse prazo.",
    action: "Solicitar exclusão",
    note: "Funcionalidade em preparação. Este botão está desativado e nenhuma conta pode ser excluída por esta tela.",
  },
  en: {
    security: "Account and security", intro: "Manage the security of your Atlas Acadêmico account.",
    title: "Delete my account",
    body: "When available, account deletion will require email identity verification. The account will be suspended for 30 days, during which recovery will be possible.",
    action: "Request account deletion",
    note: "This feature is being developed. This button is disabled and no account can be deleted from this page.",
  },
  es: {
    security: "Cuenta y seguridad", intro: "Gestiona la seguridad de tu cuenta de Atlas Acadêmico.",
    title: "Eliminar mi cuenta",
    body: "Cuando esté disponible, la eliminación requerirá verificar la identidad por correo electrónico. La cuenta se suspenderá durante 30 días y podrá recuperarse en ese plazo.",
    action: "Solicitar eliminación",
    note: "Esta función está en desarrollo. El botón está desactivado y no se puede eliminar ninguna cuenta desde esta página.",
  },
} as const

export default function AtlasAccountDeletionPreview() {
  const { language } = useAtlasLanguage()
  const copy = labels[language]
  return (
    <section className="atlas-v31-account-delete-preview" aria-labelledby="atlas-v31-account-delete-preview-title">
      <div className="atlas-v31-account-delete-preview-heading">
        <ShieldAlert size={22} aria-hidden="true" />
        <div>
          <h2 id="atlas-v31-account-delete-preview-title">{copy.security}</h2>
          <p>{copy.intro}</p>
        </div>
      </div>
      <div className="atlas-v31-account-delete-preview-danger">
        <h3><Trash2 size={18} aria-hidden="true" /> {copy.title}</h3>
        <p>{copy.body}</p>
        <button type="button" disabled aria-describedby="atlas-v31-account-delete-preview-note">
          {copy.action}
        </button>
        <p className="atlas-v31-account-delete-preview-note" id="atlas-v31-account-delete-preview-note">
          {copy.note}
        </p>
      </div>
    </section>
  )
}
