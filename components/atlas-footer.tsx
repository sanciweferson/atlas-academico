import Link from "next/link"
import { GraduationCap, Facebook, Instagram, Youtube, Linkedin, Github } from "lucide-react"

const sociais = [
  { nome: "Facebook", icon: Facebook },
  { nome: "Instagram", icon: Instagram },
  { nome: "YouTube", icon: Youtube },
  { nome: "LinkedIn", icon: Linkedin },
  { nome: "GitHub", icon: Github },
]

export default function AtlasFooter() {
  return (
    <footer className="site-footer atlas-v3-footer" aria-label="Rodapé do Atlas Acadêmico">
      <div className="shell atlas-v3-footer-contents">
        <div className="atlas-v3-footer-about">
          <div className="atlas-v3-footer-brand"><GraduationCap size={22} aria-hidden="true" /> <strong>Atlas Acadêmico</strong></div>
          <p>Seu campus digital. Aprenda, pratique e evolua no seu ritmo.</p>
          <small>Conteúdo em desenvolvimento. O domínio de cada assunto requer estudo e avaliação individual.</small>
        </div>
        <nav aria-label="Links da plataforma" className="atlas-v3-footer-group">
          <strong>Plataforma</strong>
          <Link href="/">Início</Link>
          <Link href="/catalogo">Disciplinas</Link>
          <Link href="/estudo">Meus estudos</Link>
          <Link href="/configuracoes">Configurações</Link>
        </nav>
        <section aria-label="Informações legais" className="atlas-v3-footer-group">
          <strong>Informações legais</strong>
          <span>Termos de Uso</span>
          <span>Política de Privacidade</span>
          <span>Política de Cookies</span>
          <small>Documentos em preparação; os links serão ativados após revisão.</small>
        </section>
        <section aria-label="Redes sociais" className="atlas-v3-footer-group atlas-v3-footer-social">
          <strong>Redes sociais</strong>
          <div className="atlas-v3-social-icons">
            {sociais.map(({ nome, icon: Icon }) => (
              <span key={nome} title={`${nome}: link oficial pendente`} aria-label={`${nome}: link ainda não configurado`} className="atlas-v3-social-placeholder">
                <Icon size={19} aria-hidden="true" />
              </span>
            ))}
          </div>
          <small>Conectaremos os perfis oficiais quando você fornecer os endereços.</small>
        </section>
      </div>
      <div className="shell atlas-v3-footer-end"><span>© {new Date().getFullYear()} Atlas Acadêmico</span><span>Feito para estudar com autonomia.</span></div>
    </footer>
  )
}
