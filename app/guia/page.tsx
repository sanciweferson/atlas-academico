"use client"

import Link from "next/link"
import { ArrowRight, BookOpenCheck, CircleHelp, Compass, Info, Sparkles } from "lucide-react"
import { useAtlasLanguage, type AtlasLanguage } from "@/lib/atlas-i18n"

type Localized = Record<AtlasLanguage, string>
type Step = { title: Localized; body: Localized; href: string; action: Localized }
const t = (pt: string, en: string, es: string): Localized => ({ "pt-BR": pt, en, es })

const steps: Step[] = [
  {
    title: t("Conheça a plataforma", "Explore the platform", "Explora la plataforma"),
    body: t("Abra o catálogo, conheça as disciplinas e veja quais aulas já possuem conteúdo. Você pode explorar as aulas sem criar uma conta.", "Open the catalog, browse subjects and check which lessons already have content. You can explore lessons without an account.", "Abre el catálogo, conoce las asignaturas y revisa qué lecciones ya tienen contenido. Puedes explorar sin una cuenta."),
    href: "/catalogo", action: t("Abrir catálogo", "Open catalog", "Abrir catálogo"),
  },
  {
    title: t("Crie sua conta, se quiser", "Create an account if you want", "Crea una cuenta si quieres"),
    body: t("A conta é opcional para ler aulas. Ela permite configurar seu perfil e acessar anotações associadas à sua conta. Após cadastrar-se, confirme o e-mail recebido.", "An account is optional for reading lessons. It lets you manage your profile and account-linked notes. After signing up, confirm your email.", "La cuenta es opcional para leer las lecciones. Permite administrar tu perfil y notas asociadas. Después de registrarte, confirma tu correo."),
    href: "/cadastro", action: t("Criar conta", "Sign up", "Crear cuenta"),
  },
  {
    title: t("Estude uma aula por vez", "Study one lesson at a time", "Estudia una lección a la vez"),
    body: t("Escolha uma disciplina e abra a aula desejada. Parte do material ainda está em elaboração; uma aula marcada como pendente não deve ser considerada pronta.", "Choose a subject and open a lesson. Some material is still being developed; a lesson marked pending is not complete.", "Elige una asignatura y abre una lección. Parte del contenido sigue en desarrollo; una lección pendiente no está terminada."),
    href: "/estudo", action: t("Como estudar", "How to study", "Cómo estudiar"),
  },
  {
    title: t("Planeje seus horários", "Plan your study times", "Planifica tus horarios"),
    body: t("Na Agenda, busque uma aula pelo nome ou disciplina, escolha data e horário e salve a sessão. A agenda fica neste navegador, não é sincronizada automaticamente entre dispositivos.", "In the planner, search for a lesson, choose a date and time and save the session. Plans stay in this browser and do not automatically sync across devices.", "En la agenda, busca una lección, elige fecha y hora y guarda la sesión. Los planes quedan en este navegador y no se sincronizan automáticamente."),
    href: "/agenda", action: t("Abrir Agenda", "Open planner", "Abrir agenda"),
  },
  {
    title: t("Ative avisos, se desejar", "Enable reminders if you wish", "Activa avisos si quieres"),
    body: t("Autorize notificações no navegador para receber lembretes das sessões. Atualmente, esses avisos dependem de o site estar aberto ou ativo; não são notificações push permanentes.", "Allow browser notifications to receive session reminders. Currently they rely on the site being open or active; they are not persistent background push notifications.", "Permite notificaciones para recibir recordatorios. Actualmente dependen de que el sitio esté abierto o activo; no son avisos push permanentes en segundo plano."),
    href: "/notificacoes", action: t("Configurar avisos", "Set up reminders", "Configurar avisos"),
  },
  {
    title: t("Acompanhe sessões e favoritos", "Track sessions and favorites", "Sigue sesiones y favoritos"),
    body: t("Marque uma sessão como concluída na Agenda e consulte o resumo em Progresso. Isso indica organização de estudo, não certificação de domínio da aula. Favoritos também são locais ao navegador.", "Mark a session complete in the planner and view its summary in Progress. This tracks study activity, not mastery certification. Favorites are also stored locally in the browser.", "Marca una sesión como completada y consulta Progreso. Esto registra la actividad, no certifica dominio de la lección. Los favoritos también son locales al navegador."),
    href: "/progresso", action: t("Ver progresso", "View progress", "Ver progreso"),
  },
  {
    title: t("Personalize sua experiência", "Customize your experience", "Personaliza tu experiencia"),
    body: t("Nas Configurações, altere o tema, o tamanho do texto, o modo foco e o idioma da interface. A tradução ainda é parcial: as aulas e alguns formulários continuam em português.", "In Settings, change theme, reading size, focus mode and interface language. Translation is still partial: lessons and some forms remain in Portuguese.", "En Configuración puedes cambiar el tema, el tamaño del texto, el modo de concentración y el idioma. La traducción sigue siendo parcial: lecciones y algunos formularios están en portugués."),
    href: "/configuracoes", action: t("Abrir configurações", "Open settings", "Abrir configuración"),
  },
]

const ui = {
  "pt-BR": { kicker: "COMECE POR AQUI", title: "Guia da plataforma", lead: "Seu passo a passo para aproveitar o Atlas Acadêmico, mesmo na primeira visita.", steps: "Como usar o Atlas", note: "Importante", noteText: "O Atlas está em desenvolvimento. Aulas, traduções e recursos ainda podem estar incompletos. Seus favoritos e agendamentos ficam neste navegador; as anotações da conta utilizam o Supabase.", questions: "Ainda tem dúvidas?", help: "Encontre respostas por assunto e pesquise no FAQ.", faq: "Ver perguntas frequentes" },
  en: { kicker: "START HERE", title: "Platform guide", lead: "A step-by-step guide to using Atlas Acadêmico, even on your first visit.", steps: "How to use Atlas", note: "Important", noteText: "Atlas is under development. Lessons, translations and features may still be incomplete. Favorites and schedules stay in this browser; account notes use Supabase.", questions: "Still have questions?", help: "Find answers by topic and search the FAQ.", faq: "Open FAQ" },
  es: { kicker: "EMPIEZA AQUÍ", title: "Guía de la plataforma", lead: "Una guía paso a paso para usar Atlas Acadêmico desde tu primera visita.", steps: "Cómo usar Atlas", note: "Importante", noteText: "Atlas está en desarrollo. Lecciones, traducciones y funciones pueden estar incompletas. Favoritos y agenda quedan en este navegador; las notas de la cuenta usan Supabase.", questions: "¿Tienes dudas?", help: "Busca respuestas por tema en las preguntas frecuentes.", faq: "Ver preguntas frecuentes" },
}

export default function GuiaPage() {
  const { language } = useAtlasLanguage()
  const copy = ui[language] ?? ui["pt-BR"]
  return (
    <div className="atlas-v31-help-page">
      <header className="atlas-v31-help-hero">
        <span className="eyebrow"><Compass size={16} aria-hidden="true" /> {copy.kicker}</span>
        <h1 className="page-title">{copy.title}</h1>
        <p className="muted">{copy.lead}</p>
        <Link className="btn-secondary atlas-v31-help-hero-link" href="/faq"><CircleHelp size={17} aria-hidden="true" /> FAQ <ArrowRight size={16} aria-hidden="true" /></Link>
      </header>
      <section aria-labelledby="atlas-guide-steps">
        <h2 id="atlas-guide-steps" className="atlas-v31-help-heading"><BookOpenCheck size={22} aria-hidden="true" /> {copy.steps}</h2>
        <ol className="atlas-v31-guide-list">
          {steps.map((step, index) => (
            <li key={step.href} className="atlas-v31-guide-step panel">
              <span className="atlas-v31-guide-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{step.title[language]}</h3><p className="muted">{step.body[language]}</p>
                <Link className="atlas-v31-help-action" href={step.href}>{step.action[language]} <ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <aside className="atlas-v31-help-note"><Info size={21} aria-hidden="true" /><div><strong>{copy.note}</strong><p>{copy.noteText}</p></div></aside>
      <section className="panel atlas-v31-help-end"><Sparkles size={25} aria-hidden="true" /><div><h2>{copy.questions}</h2><p className="muted">{copy.help}</p></div><Link className="btn" href="/faq">{copy.faq} <ArrowRight size={16} aria-hidden="true" /></Link></section>
    </div>
  )
}
