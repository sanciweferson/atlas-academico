"use client"

import Link from "next/link"
import { GraduationCap, Facebook, Instagram, Youtube, Linkedin, Github, Home, BookOpen, NotebookPen, Settings, FileText, ShieldCheck, Cookie, BookOpenCheck, CircleHelp, Mail, MessageCircle } from "lucide-react"
import { useAtlasLanguage } from "@/lib/atlas-i18n"

const sociais = [
  { nome: "GitHub", icon: Github, url: "https://github.com/sanciweferson" },
  { nome: "Instagram", icon: Instagram, url: "https://www.instagram.com/sanciweferson/" },
  { nome: "YouTube", icon: Youtube, url: "https://www.youtube.com/@sanciwefersonmendes742" },
  { nome: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/sanciweferson-mendes-sousa-387018212" },
  { nome: "Facebook", icon: Facebook, url: "https://www.facebook.com/share/1JHaDnPXXT/" },
]

export default function AtlasFooter() {
  const { tr } = useAtlasLanguage()
  return (
    <footer className="site-footer atlas-v3-footer" aria-label="Rodapé do Atlas Acadêmico">
      <div className="shell atlas-v3-footer-contents">
        <div className="atlas-v3-footer-about">
          <div className="atlas-v3-footer-brand"><GraduationCap size={22} aria-hidden="true" /> <strong>Atlas Acadêmico</strong></div>
          <p>{tr("Seu campus digital. Aprenda, pratique e evolua no seu ritmo.")}</p>
          <small>{tr("Conteúdo em desenvolvimento. O domínio de cada assunto requer estudo e avaliação individual.")}</small>
        </div>
        <nav aria-label="Links da plataforma" className="atlas-v3-footer-group">
          <strong>{tr("Plataforma")}</strong>
          <Link className="atlas-v31-footer-link" href="/"><Home aria-hidden="true" size={16}/>{tr("Início")}</Link>
          <Link className="atlas-v31-footer-link" href="/catalogo"><BookOpen aria-hidden="true" size={16}/>{tr("Disciplinas")}</Link>
          <Link className="atlas-v31-footer-link" href="/estudo"><NotebookPen aria-hidden="true" size={16}/>{tr("Meus estudos")}</Link>
          <Link className="atlas-v31-footer-link" href="/configuracoes"><Settings aria-hidden="true" size={16}/>{tr("Configurações")}</Link>
          <Link className="atlas-v31-footer-link" href="/guia"><BookOpenCheck aria-hidden="true" size={16}/>{tr("Guia da plataforma")}</Link>
          <Link className="atlas-v31-footer-link" href="/faq"><CircleHelp aria-hidden="true" size={16}/>{tr("Perguntas frequentes")}</Link>
        </nav>
        <section aria-label="Informações legais" className="atlas-v3-footer-group">
          <strong>{tr("Informações legais")}</strong>
          <Link className="atlas-v31-footer-link" href="/termos"><FileText aria-hidden="true" size={16}/>{tr("Termos de Uso")}</Link>
          <Link className="atlas-v31-footer-link" href="/privacidade"><ShieldCheck aria-hidden="true" size={16}/>{tr("Política de Privacidade")}</Link>
          <Link className="atlas-v31-footer-link" href="/cookies"><Cookie aria-hidden="true" size={16}/>{tr("Política de Cookies")}</Link>
          <small>{tr("Leia nossos documentos sobre uso e privacidade.")}</small>
        </section>
        <section aria-label="Redes sociais" className="atlas-v3-footer-group atlas-v3-footer-social">
          <strong>{tr("Redes sociais")}</strong>
          <div className="atlas-v3-social-icons">
            {sociais.map(({ nome, icon: Icon, url }) => (
              <a
                key={nome}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir ${nome} do criador do Atlas em nova aba`}
                title={`${nome} — abre em nova aba`}
                className="atlas-v31-social-link"
              >
                <Icon size={19} aria-hidden="true" />
              </a>
            ))}
          </div>
          <small>{tr("Conheça os perfis e canais do criador do Atlas Acadêmico.")}</small>
          <div className="atlas-v31-footer-contact-actions" aria-label="Contato com o Atlas">
            <a className="atlas-v31-footer-contact-button" href="mailto:sanciw45@gmail.com" aria-label="Enviar e-mail ao Atlas Acadêmico"><Mail size={19} aria-hidden="true" /><span>E-mail</span></a>
            <a className="atlas-v31-footer-contact-button" href="https://wa.me/5585985637557" target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp do Atlas (nova aba)"><MessageCircle size={19} aria-hidden="true" /><span>WhatsApp</span></a>
          </div>
        </section>
      </div>
      <div className="shell atlas-v3-footer-end"><span>© {new Date().getFullYear()} Atlas Acadêmico</span><span>{tr("Feito para estudar com autonomia.")}</span></div>
    </footer>
  )
}
