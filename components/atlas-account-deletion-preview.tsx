// ATLAS V3.1 — PACOTE 21D: somente prévia visual. NÃO ativa exclusão.
import { ShieldAlert, Trash2 } from "lucide-react"

export default function AtlasAccountDeletionPreview() {
  return (
    <section className="atlas-v31-account-delete-preview" aria-labelledby="atlas-v31-account-delete-preview-title">
      <div className="atlas-v31-account-delete-preview-heading">
        <ShieldAlert size={22} aria-hidden="true" />
        <div>
          <h2 id="atlas-v31-account-delete-preview-title">Conta e segurança</h2>
          <p>Gerencie a segurança da sua conta no Atlas Acadêmico.</p>
        </div>
      </div>
      <div className="atlas-v31-account-delete-preview-danger">
        <h3><Trash2 size={18} aria-hidden="true" /> Excluir minha conta</h3>
        <p>Quando disponível, a exclusão exigirá confirmação de identidade por e-mail. A conta será suspensa por 30 dias, com possibilidade de recuperação durante esse prazo.</p>
        <button type="button" disabled aria-describedby="atlas-v31-account-delete-preview-note">
          Solicitar exclusão
        </button>
        <p className="atlas-v31-account-delete-preview-note" id="atlas-v31-account-delete-preview-note">
          Funcionalidade em preparação. Este botão está desativado e nenhuma conta pode ser excluída por esta tela.
        </p>
      </div>
    </section>
  )
}
