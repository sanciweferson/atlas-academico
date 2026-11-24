"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, BookOpenCheck, ChevronDown, CircleHelp, Search, X } from "lucide-react"
import { useAtlasLanguage, type AtlasLanguage } from "@/lib/atlas-i18n"

type Category = "first" | "account" | "learning" | "data"
type Localized = Record<AtlasLanguage, string>
type Question = { category: Category; question: Localized; answer: Localized }
const t = (pt: string, en: string, es: string): Localized => ({ "pt-BR": pt, en, es })
const categories: Record<Category, Localized> = {
  first: t("Primeiros passos", "Getting started", "Primeros pasos"),
  account: t("Conta e acesso", "Account and access", "Cuenta y acceso"),
  learning: t("Aulas e planejamento", "Lessons and planning", "Lecciones y planificación"),
  data: t("Privacidade e preferências", "Privacy and preferences", "Privacidad y preferencias"),
}
const questions: Question[] = [
  { category: "first", question: t("Preciso criar uma conta para estudar?", "Do I need an account to study?", "¿Necesito una cuenta para estudiar?"), answer: t("Não. O catálogo e as aulas disponíveis podem ser consultados sem login. A conta é útil para perfil e anotações associadas ao usuário.", "No. You can browse the catalog and available lessons without signing in. An account supports your profile and user-linked notes.", "No. Puedes ver el catálogo y las lecciones disponibles sin iniciar sesión. La cuenta sirve para el perfil y notas asociadas.") },
  { category: "first", question: t("Todas as aulas já estão prontas?", "Are all lessons complete?", "¿Todas las lecciones están completas?"), answer: t("Ainda não. O Atlas está em desenvolvimento e identifica conteúdos pendentes. Verifique cada aula antes de considerá-la concluída.", "Not yet. Atlas is still being developed and identifies pending content. Check each lesson before considering it complete.", "Todavía no. Atlas está en desarrollo e identifica contenido pendiente. Comprueba cada lección antes de darla por completada.") },
  { category: "first", question: t("Por onde devo começar?", "Where should I begin?", "¿Por dónde empiezo?"), answer: t("Abra o Guia da Plataforma, depois explore as disciplinas no Catálogo. Escolha uma aula introdutória e avance no seu ritmo.", "Open the Platform Guide, then explore subjects in the Catalog. Choose an introductory lesson and progress at your own pace.", "Abre la Guía de la plataforma, luego explora las asignaturas. Elige una lección introductoria y avanza a tu ritmo.") },
  { category: "account", question: t("Como confirmo o cadastro por e-mail?", "How do I confirm my email?", "¿Cómo confirmo mi correo?"), answer: t("Após criar a conta, abra a mensagem de confirmação do Supabase enviada ao seu e-mail. Confira a pasta de spam, se necessário. O link deve abrir o Atlas publicado.", "After signing up, open the Supabase confirmation email. Check spam if needed. The link should open the published Atlas website.", "Después del registro, abre el correo de confirmación de Supabase. Revisa spam si hace falta. El enlace debe abrir Atlas.") },
  { category: "account", question: t("Esqueci minha senha. Como recupero o acesso?", "I forgot my password. How do I get back in?", "Olvidé mi contraseña. ¿Cómo recupero el acceso?"), answer: t("Em Entrar, selecione ‘Esqueci minha senha’. Informe seu e-mail, abra o link de recuperação e escolha uma nova senha. Depois, faça login.", "On Sign in, select ‘Forgot my password’. Enter your email, open the recovery link and choose a new password. Then sign in.", "En Iniciar sesión, elige ‘Olvidé mi contraseña’. Introduce tu correo, abre el enlace y crea una contraseña nueva. Luego inicia sesión.") },
  { category: "account", question: t("Posso colocar uma foto no perfil?", "Can I add a profile photo?", "¿Puedo agregar una foto al perfil?"), answer: t("Sim, após entrar na conta. Em Meu perfil, escolha da galeria ou use a câmera, ajuste o recorte e salve. A foto é armazenada no Supabase.", "Yes, after signing in. In My profile, choose from the gallery or use the camera, crop and save. Photos are stored in Supabase.", "Sí, después de iniciar sesión. En Mi perfil, elige una foto o usa la cámara, recorta y guarda. Se almacena en Supabase.") },
  { category: "learning", question: t("Como encontro uma aula específica?", "How do I find a specific lesson?", "¿Cómo encuentro una lección específica?"), answer: t("Abra o Catálogo para navegar por disciplinas. Na Agenda, a seleção de aulas também possui pesquisa por nome ou disciplina, inclusive sem digitar acentos.", "Browse subjects in the Catalog. In the planner, the lesson picker also searches by title or subject, even without accents.", "Consulta las asignaturas en el Catálogo. En la agenda, puedes buscar lecciones por título o asignatura, incluso sin acentos.") },
  { category: "learning", question: t("O progresso significa que domino uma aula?", "Does progress mean I have mastered a lesson?", "¿El progreso significa que domino una lección?"), answer: t("Não. O painel Progresso resume sessões marcadas como concluídas, sessões planejadas e favoritos. Não concede aprovação nem certificação de domínio automaticamente.", "No. Progress summarizes completed sessions, planned sessions and favorites. It does not automatically certify lesson mastery.", "No. Progreso resume sesiones completadas, previstas y favoritos. No certifica automáticamente el dominio de una lección.") },
  { category: "learning", question: t("Por que minha Agenda não aparece em outro aparelho?", "Why is my planner missing on another device?", "¿Por qué no aparece mi agenda en otro dispositivo?"), answer: t("Agenda, sessões e favoritos são armazenados no navegador atual. Mesmo com login, esses dados ainda não são sincronizados automaticamente entre aparelhos.", "Planner entries, sessions and favorites are stored in your current browser. They do not yet sync across devices, even with an account.", "Agenda, sesiones y favoritos se guardan en el navegador actual. Todavía no se sincronizan entre dispositivos aunque inicies sesión.") },
  { category: "learning", question: t("As notificações funcionam com o site fechado?", "Do notifications work with the site closed?", "¿Funcionan los avisos con el sitio cerrado?"), answer: t("Atualmente, os lembretes são verificados enquanto o Atlas está aberto ou ativo no navegador e requerem permissão de notificação. Notificações push em segundo plano ainda não foram implementadas.", "Currently, reminders are checked while Atlas is open or active in the browser and notification permission is required. Background push is not yet implemented.", "Actualmente los avisos se comprueban mientras Atlas está abierto o activo en el navegador y requieren permiso. Los avisos push en segundo plano aún no están implementados.") },
  { category: "data", question: t("Onde são armazenadas minhas informações?", "Where is my information stored?", "¿Dónde se guarda mi información?"), answer: t("Conta, perfil, foto e anotações ligadas à conta usam Supabase. Favoritos, Agenda e preferências usam o armazenamento local do navegador. Veja a Política de Privacidade, que ainda está em revisão.", "Account, profile, photo and user notes use Supabase. Favorites, planner and preferences use local browser storage. See the Privacy Policy, which is still being reviewed.", "Cuenta, perfil, foto y notas de usuario usan Supabase. Favoritos, agenda y preferencias usan almacenamiento local. Consulta la Política de privacidad, todavía en revisión.") },
  { category: "data", question: t("O que acontece se eu limpar os dados do navegador?", "What if I clear browser data?", "¿Qué ocurre si borro los datos del navegador?"), answer: t("Favoritos, sessões e preferências guardados localmente podem ser perdidos. Os dados associados à conta no Supabase são separados desse armazenamento.", "Locally stored favorites, sessions and preferences can be lost. Data associated with your Supabase account is stored separately.", "Los favoritos, las sesiones y las preferencias locales se pueden perder. Los datos vinculados a la cuenta en Supabase se almacenan por separado.") },
  { category: "data", question: t("Posso trocar o idioma do Atlas?", "Can I change Atlas language?", "¿Puedo cambiar el idioma de Atlas?"), answer: t("Sim. Vá a Configurações e escolha português, inglês ou espanhol. A tradução da interface ainda é parcial e o conteúdo didático permanece principalmente em português.", "Yes. Open Settings and choose Portuguese, English or Spanish. Interface translation is still partial and lesson content remains primarily in Portuguese.", "Sí. En Configuración elige portugués, inglés o español. La traducción todavía es parcial y las lecciones siguen principalmente en portugués.") },
]
const ui = {
  "pt-BR": { kicker: "CENTRAL DE AJUDA", title: "Perguntas frequentes", lead: "Respostas práticas para começar a usar o Atlas Acadêmico.", search: "Pesquisar perguntas", placeholder: "Ex.: senha, agenda, notificações...", all: "Todas", results: "perguntas encontradas", empty: "Nenhuma resposta encontrada. Experimente outra palavra.", guide: "Novo no Atlas?", guideDesc: "Siga nosso guia de primeiros passos.", action: "Abrir guia" },
  en: { kicker: "HELP CENTER", title: "Frequently asked questions", lead: "Practical answers to get started with Atlas Acadêmico.", search: "Search questions", placeholder: "E.g. password, planner, notifications...", all: "All", results: "questions found", empty: "No matching answers. Try a different search.", guide: "New to Atlas?", guideDesc: "Follow our getting-started guide.", action: "Open guide" },
  es: { kicker: "CENTRO DE AYUDA", title: "Preguntas frecuentes", lead: "Respuestas prácticas para empezar a usar Atlas Acadêmico.", search: "Buscar preguntas", placeholder: "Ej.: contraseña, agenda, avisos...", all: "Todas", results: "preguntas encontradas", empty: "No se encontraron respuestas. Prueba otra búsqueda.", guide: "¿Nuevo en Atlas?", guideDesc: "Sigue nuestra guía de primeros pasos.", action: "Abrir guía" },
}
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()

export default function FaqPage() {
  const { language } = useAtlasLanguage()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<Category | "all">("all")
  const copy = ui[language] ?? ui["pt-BR"]
  const result = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean)
    return questions.filter((item) => (category === "all" || category === item.category) && words.every((word) => normalize(`${item.question[language]} ${item.answer[language]} ${categories[item.category][language]}`).includes(word)))
  }, [language, category, query])

  return (
    <div className="atlas-v31-help-page">
      <header className="atlas-v31-help-hero">
        <span className="eyebrow"><CircleHelp size={16} aria-hidden="true" /> {copy.kicker}</span>
        <h1 className="page-title">{copy.title}</h1>
        <p className="muted">{copy.lead}</p>
      </header>
      <div className="panel atlas-v31-faq-search">
        <label htmlFor="atlas-v31-faq-query">{copy.search}</label>
        <div className="atlas-v31-faq-input"><Search size={19} aria-hidden="true" /><input id="atlas-v31-faq-query" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.placeholder} />{query && <button type="button" aria-label="Limpar pesquisa" onClick={() => setQuery("")}><X size={17} aria-hidden="true" /></button>}</div>
        <div className="atlas-v31-faq-filters" role="group" aria-label="Filtrar perguntas por assunto">
          <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>{copy.all}</button>
          {(Object.keys(categories) as Category[]).map((id) => <button type="button" key={id} aria-pressed={category === id} onClick={() => setCategory(id)}>{categories[id][language]}</button>)}
        </div>
      </div>
      <section aria-label={copy.title} className="atlas-v31-faq-results">
        <p className="muted atlas-v31-faq-count" role="status">{result.length} {copy.results}</p>
        {result.length ? result.map((item) => (
          <details className="atlas-v31-faq-item" key={item.question["pt-BR"]}>
            <summary><span>{item.question[language]}</span><ChevronDown size={18} aria-hidden="true" /></summary>
            <div className="atlas-v31-faq-answer"><p>{item.answer[language]}</p></div>
          </details>
        )) : <div className="panel atlas-v31-faq-empty">{copy.empty}</div>}
      </section>
      <section className="panel atlas-v31-help-end"><BookOpenCheck size={26} aria-hidden="true" /><div><h2>{copy.guide}</h2><p className="muted">{copy.guideDesc}</p></div><Link className="btn" href="/guia">{copy.action}<ArrowRight size={16} aria-hidden="true" /></Link></section>
    </div>
  )
}
