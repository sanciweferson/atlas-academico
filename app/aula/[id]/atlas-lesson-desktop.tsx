"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, ArrowRight, BookOpen, BrainCircuit, Check, ChevronDown,
  ClipboardCheck, ClipboardList, FileText, GraduationCap, Library,
  Lightbulb, ListTree, NotebookPen, Target,
} from "lucide-react"
import AtlasModuleExercises from "@/components/atlas-module-exercises"
import module01ExerciseSets from "@/lib/atlas-module01-exercise-sets.json"
import module0205ExerciseSets from "@/lib/atlas-module02-05-exercise-sets.json"
import type { ExerciseSet } from "@/lib/atlas-exercise-types"
import LocalNotes from "@/components/local-notes"
import AtlasFavorite from "@/components/atlas-favorite"
import styles from "./atlas-lesson-desktop.module.css"
import { useC00Interface } from "@/lib/atlas-c00-interface"
import lesson01Translations from "@/lib/atlas-c00-lesson01-locales.json"
import lesson02Translations from "@/lib/atlas-c00-lesson02-locales.json"
import lesson03Translations from "@/lib/atlas-c00-lesson03-locales.json"
import lesson04Translations from "@/lib/atlas-c00-lesson04-locales.json"
import module02Lesson01Translations from "@/lib/atlas-c00-module02-lesson01-locales.json"

const moduleExerciseSets = { ...module01ExerciseSets, ...module0205ExerciseSets }

type Lesson = {
  definition?: string
  deep?: string
  example?: string
  code?: string
  reading?: string
  exercise?: string
  pitfall?: string
  questions?: string[]
}
type Chapter = { title?: string; sections?: { title: string; body: string }[]; code?: string; questions?: string[] }
type Question = { kind: string; prompt: string; answer: string | null }
type Module = { title: string; topics: string[] }
type Tab = "aula" | "exercicios" | "avaliacao" | "anotacoes" | "referencias"

const TABS: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: "aula", label: "Aula", icon: BookOpen },
  { id: "exercicios", label: "Exercícios", icon: ClipboardList },
  { id: "avaliacao", label: "Avaliação", icon: ClipboardCheck },
  { id: "anotacoes", label: "Anotações", icon: NotebookPen },
  { id: "referencias", label: "Referências", icon: Library },
]


// Nomes curriculares exibidos no menu. IDs e rotas permanecem invariáveis.
const C00_NAV_TRANSLATIONS = {
  en: [
    { title: "Foundations of computational thinking and tools", topics: ["Definitions and terminology", "Historical context and applications", "Fundamental concepts and examples", "Limits and conceptual misconceptions"] },
    { title: "Theory and models", topics: ["Formal models and assumptions", "Reasoning and justifications", "Case analysis and counterexamples", "Connection to prerequisites"] },
    { title: "Methods and tools", topics: ["Techniques and procedures", "Reading documentation and primary sources", "Progressive exercises", "Diagnosing errors"] },
    { title: "Applications and project", topics: ["Integrative problem", "Implementation or demonstration for the subject", "Testing and documentation", "Comparing alternatives"] },
    { title: "Mastery assessment", topics: ["New theoretical exam", "Oral or written explanation", "Transfer to a new problem", "Review after 7 and 30 days"] },
  ],
  es: [
    { title: "Fundamentos del pensamiento computacional y herramientas", topics: ["Definiciones y terminología", "Contexto histórico y aplicaciones", "Conceptos fundamentales y ejemplos", "Límites y errores conceptuales"] },
    { title: "Teoría y modelos", topics: ["Modelos formales y supuestos", "Razonamiento y justificaciones", "Análisis de casos y contraejemplos", "Relación con los prerrequisitos"] },
    { title: "Métodos y herramientas", topics: ["Técnicas y procedimientos", "Lectura de documentación y fuentes primarias", "Ejercicios progresivos", "Diagnóstico de errores"] },
    { title: "Aplicaciones y proyecto", topics: ["Problema integrador", "Implementación o demostración según la disciplina", "Pruebas y documentación", "Comparación de alternativas"] },
    { title: "Evaluación del dominio", topics: ["Examen teórico inédito", "Explicación oral o escrita", "Transferencia a un nuevo problema", "Repaso después de 7 y 30 días"] },
  ],
} as const

export default function AtlasLessonDesktop({ lessonId, courseTitle, topicTitle, moduleTitle, modules, lesson, chapter, questions }: {
  lessonId: string
  courseTitle: string
  topicTitle: string
  moduleTitle: string
  modules: Module[]
  lesson?: Lesson
  chapter?: Chapter
  questions: Question[]
}) {
  const { language, t } = useC00Interface()
  // Traduções piloto das Aulas 01 e 02; IDs, gabaritos e respostas preservados.
  const localized = language === "en" || language === "es"
    ? lessonId === "C00-0-0" ? lesson01Translations.locales[language]
      : lessonId === "C00-0-1" ? lesson02Translations.locales[language]
      : lessonId === "C00-0-2" ? lesson03Translations.locales[language]
      : lessonId === "C00-0-3" ? lesson04Translations.locales[language]
      : lessonId === "C00-1-0" ? module02Lesson01Translations.locales[language]
      : null
    : null
  const shownLesson: Lesson | undefined = localized?.lesson ?? lesson
  const shownChapter: Chapter | undefined = localized?.chapter ?? chapter
  const shownSet: ExerciseSet | undefined = (localized?.exercise_set as unknown as ExerciseSet | undefined) ?? (moduleExerciseSets as unknown as Record<string, ExerciseSet>)[lessonId]
  const shownTopicTitle = localized?.chapter.title ?? topicTitle
  const translatedNavigation = language === "en" || language === "es" ? C00_NAV_TRANSLATIONS[language] : null
  const visibleModuleTitle = translatedNavigation?.[Number(/^.+-(\d+)-\d+$/.exec(lessonId)?.[1] ?? 0)]?.title ?? moduleTitle
  const navTopic = (mi: number, ti: number, fallback: string) => translatedNavigation?.[mi]?.topics[ti] ?? fallback
  const localText = (pt: string, en: string, es: string) => language === "en" ? en : language === "es" ? es : pt
  const shownCourseTitle = localized?.exercise_set.course ?? courseTitle
  const translationDraftNotice = language === "en"
    ? "Pilot translation: educational review is still pending."
    : "Traducción piloto: la revisión pedagógica está pendiente."

  const [tab, setTab] = useState<Tab>("aula")
  // A secao selecionada faz parte da URL e sobrevive ao F5 em cada aula.
  useEffect(() => {
    const restore = () => {
      const selected = new URLSearchParams(window.location.search).get("aba")
      setTab(TABS.some(item => item.id === selected) ? selected as Tab : "aula")
    }
    restore()
    window.addEventListener("popstate", restore)
    return () => window.removeEventListener("popstate", restore)
  }, [lessonId])
  function selectTab(next: Tab) {
    setTab(next)
    const url = new URL(window.location.href)
    if (next === "aula") url.searchParams.delete("aba")
    else url.searchParams.set("aba", next)
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash)
  }
  const match = /^(.+)-(\d+)-(\d+)$/.exec(lessonId)
  const moduleIndex = Number(match?.[2] ?? 0)
  const topicIndex = Number(match?.[3] ?? 0)
  const nextId = modules[moduleIndex]?.topics[topicIndex + 1]
    ? `${match?.[1]}-${moduleIndex}-${topicIndex + 1}`
    : modules[moduleIndex + 1]?.topics[0]
      ? `${match?.[1]}-${moduleIndex + 1}-0`
      : null
  const prevId = topicIndex > 0
    ? `${match?.[1]}-${moduleIndex}-${topicIndex - 1}`
    : moduleIndex > 0 && modules[moduleIndex - 1].topics.length
      ? `${match?.[1]}-${moduleIndex - 1}-${modules[moduleIndex - 1].topics.length - 1}`
      : null
  const nextTopic = nextId ? (modules[moduleIndex]?.topics[topicIndex + 1] ? navTopic(moduleIndex, topicIndex + 1, modules[moduleIndex].topics[topicIndex + 1]) : navTopic(moduleIndex + 1, 0, modules[moduleIndex + 1]?.topics[0] ?? "")) : null
  const prevTopic = prevId ? (topicIndex > 0 ? navTopic(moduleIndex, topicIndex - 1, modules[moduleIndex].topics[topicIndex - 1]) : navTopic(moduleIndex - 1, modules[moduleIndex - 1].topics.length - 1, modules[moduleIndex - 1].topics.at(-1) ?? "")) : null

  return (
    <div className={styles.root}>
      <div className={styles.grid}>
        <aside className={styles.courseSide} aria-label="Navegação do curso">
          <section className={styles.card}>
            <div className={styles.courseHeading}>
              <span className={styles.courseIcon}><BrainCircuit aria-hidden="true" size={32} /></span>
              <div><strong>{shownCourseTitle}</strong><p>{t("Trilha de fundamentos")}</p></div>
            </div>
            <p className={styles.courseNote}>{t("Navegue livremente pelas aulas. Nenhuma está bloqueada.")}</p>
          </section>
          <nav className={`${styles.card} ${styles.courseNavigation}`} aria-label="Módulos e aulas">
            {modules.map((module, mi) => (
              <details key={mi} open={mi === moduleIndex ? true : undefined}>
                <summary> {localText("Módulo", "Module", "Módulo")} {String(mi + 1).padStart(2,"0")} — {translatedNavigation?.[mi]?.title ?? module.title} <ChevronDown size={16} aria-hidden="true" /></summary>
                <div className={styles.courseLinks}>
                  {module.topics.map((topic, ti) => {
                    const id = `${match?.[1]}-${mi}-${ti}`
                    return (
                      <Link key={id} href={`/aula/${id}`} className={`${styles.courseLink} ${id === lessonId ? styles.current : ""}`} aria-current={id === lessonId ? "page" : undefined}>
                        <span className={styles.lessonDot}>{String(ti + 1).padStart(2,"0")}</span>
                        <span>{navTopic(mi, ti, topic)}</span>
                      </Link>
                    )
                  })}
                </div>
              </details>
            ))}
          </nav>
        </aside>

        <div className={styles.lessonMain} aria-label="Conteúdo da aula">
          <nav className={styles.breadcrumb} aria-label="Caminho da aula">
            <Link href="/catalogo" className={styles.breadcrumbLink} title="Voltar para o catálogo de cursos"><ArrowLeft size={15} aria-hidden="true" /> {t("Cursos")}</Link>
            <span className={styles.breadcrumbSeparator} aria-hidden="true">›</span>
            <Link href="/disciplina/C00" className={styles.breadcrumbLink} title="Voltar à visão geral da disciplina"><BookOpen size={15} aria-hidden="true" /> <span>{shownCourseTitle}</span></Link>
          </nav>
          <header className={styles.hero}>
            <div className={styles.heroIcon}><BrainCircuit size={41} aria-hidden="true" /></div>
            <div className={styles.heroText}>
              <div className={styles.chips}><span className={styles.chipOutline}>{visibleModuleTitle}</span></div>
              <h1>{shownChapter?.title || shownTopicTitle}</h1>
              <p>{shownLesson?.definition || t("Conteúdo didático em preparação e validação.")}</p>
              <AtlasFavorite lessonId={lessonId} />
            </div>
          </header>

          <div className={styles.tabStrip} role="tablist" aria-label="Seções da aula">
            {TABS.map(({id, label, icon: Icon}) => (
              <button type="button" key={id} id={`atlas-tab-${id}`} role="tab" aria-selected={tab === id} aria-controls={`atlas-panel-${id}`} tabIndex={tab === id ? 0 : -1} className={tab === id ? styles.selectedTab : ""} onClick={() => selectTab(id)}>
                <Icon size={16} aria-hidden="true" />{t(label)}
              </button>
            ))}
          </div>

          {language !== "pt-BR" && !localized && <div role="status" className={styles.card}>{t("Português não traduzido")}</div>}
          {localized && <div role="status" className={styles.card}>{translationDraftNotice}</div>}
          <section id="atlas-panel-aula" role="tabpanel" aria-labelledby="atlas-tab-aula" hidden={tab !== "aula"} className={styles.tabPanel}>
            <div className={styles.objectives}>
              <h2><Target size={20} aria-hidden="true" /> {t("Objetivos da aula")}</h2>
              <ul>
                {((shownLesson?.questions?.length ? shownLesson.questions : [localText("Compreender os conceitos da aula.", "Understand the lesson concepts.", "Comprender los conceptos de la lección."), localText("Relacionar os conceitos a exemplos.", "Connect concepts with examples.", "Relacionar los conceptos con ejemplos."), localText("Analisar casos e justificar decisões.", "Analyze cases and justify decisions.", "Analizar casos y justificar decisiones.")])).map(goal => <li key={goal}><Check size={17} aria-hidden="true" /> {goal}</li>)}
              </ul>
            </div>
            {shownLesson?.deep && <section className={styles.textSection}>
              <h2><span className={styles.number}>1</span> {shownTopicTitle}</h2>
              <p>{shownLesson.deep}</p>
              {lessonId === "C00-0-0" && !localized && <div className={styles.pillars} aria-label="Estratégias do pensamento computacional">
                {[["Decomposição", "Dividir problemas"],["Padrões", "Identificar semelhanças"],["Abstração", "Selecionar o essencial"],["Algoritmos", "Organizar os passos"]].map(([name, detail]) => <div key={name} className={styles.pillar}><BrainCircuit size={21} aria-hidden="true" /><strong>{name}</strong><small>{detail}</small></div>)}
              </div>}
            </section>}
            {shownChapter?.sections?.map((section, idx) => (
              <section className={styles.textSection} key={`${idx}-${section.title}`}>
                <h2><span className={styles.number}>{idx + 2}</span> {section.title}</h2>
                <p>{section.body}</p>
              </section>
            ))}
            {shownLesson?.example && <section className={styles.example}>
              <h2><Lightbulb size={20} aria-hidden="true" /> {t("Estudo de caso")}</h2>
              <p>{shownLesson.example}</p>
            </section>}
            {(shownLesson?.code || shownChapter?.code) && <section className={styles.textSection}>
              <h2><span className={styles.number}>{(shownChapter?.sections?.length ?? 0) + 2}</span> {t("Exemplo de algoritmo")}</h2>
              <div className={styles.codeBox}><div className={styles.codeHeader}><FileText size={16} aria-hidden="true"/> {localText("Pseudocódigo — exemplo didático", "Pseudocode — educational example", "Pseudocódigo — ejemplo didáctico")}</div><pre>{shownChapter?.code ?? shownLesson?.code}</pre></div>
            </section>}
            {shownLesson?.exercise && <div className={styles.example}><strong>{t("Exercício orientador")}</strong><p>{shownLesson.exercise}</p></div>}
          </section>

          <section id="atlas-panel-exercicios" role="tabpanel" aria-labelledby="atlas-tab-exercicios" hidden={tab !== "exercicios"} className={styles.tabPanel}>
            {Object.prototype.hasOwnProperty.call(moduleExerciseSets, lessonId)
              ? <AtlasModuleExercises set={shownSet!} />
              : <div className={styles.card}>{t("Ainda não há exercícios cadastrados para esta aula.")}</div>}
          </section>
          <section id="atlas-panel-avaliacao" role="tabpanel" aria-labelledby="atlas-tab-avaliacao" hidden={tab !== "avaliacao"} className={styles.tabPanel}>
            <div className={styles.card}><h2><ClipboardCheck size={22} aria-hidden="true" />{localText("Avaliação de domínio", "Mastery assessment", "Evaluación del dominio")}</h2><p>{localText("Esta interface será integrada depois da análise e aprovação do protótipo de avaliação do Claude. Suas respostas atuais continuam na aba Exercícios. Nenhuma nota ou aprovação automática será inventada.", "This interface will be integrated after review and approval of the assessment prototype. Your existing answers remain in the Exercises tab. No grade or automatic approval will be fabricated.", "Esta interfaz se integrará después de revisar y aprobar el prototipo de evaluación. Tus respuestas actuales permanecen en la pestaña Ejercicios. No se inventará ninguna calificación ni aprobación automática.")}</p></div>
          </section>
          <section id="atlas-panel-anotacoes" role="tabpanel" aria-labelledby="atlas-tab-anotacoes" hidden={tab !== "anotacoes"} className={styles.tabPanel}>
            <LocalNotes id={lessonId} />
          </section>
          <section id="atlas-panel-referencias" role="tabpanel" aria-labelledby="atlas-tab-referencias" hidden={tab !== "referencias"} className={styles.tabPanel}>
            <div className={styles.card}><h2><Library size={22} aria-hidden="true" />{localText("Referências existentes", "Existing references", "Referencias existentes")}</h2><p>{shownLesson?.reading || "Ainda não há referências verificadas cadastradas para esta aula."}</p><small>{localText("As fontes serão revisadas conforme o Prompt Mestre de Conteúdo V1.0, antes de sua publicação definitiva.", "Sources will be reviewed before final publication, following Content Master Prompt V1.0.", "Las fuentes se revisarán antes de su publicación definitiva, conforme al Prompt Maestro de Contenido V1.0.")}</small></div>
          </section>


        </div>

        <aside className={styles.summarySide} aria-label="Resumo da aula">
          <section className={styles.card}><h2><ListTree size={21} aria-hidden="true" /> {t("Nesta aula você verá")}</h2><ol className={styles.summaryList}><li>{shownTopicTitle}</li>{shownChapter?.sections?.map(s => <li key={s.title}>{s.title}</li>)}{(shownLesson?.code || shownChapter?.code) && <li>{t("Exemplo de algoritmo")}</li>}</ol></section>
          <section className={`${styles.card} ${styles.tip}`}><h2><GraduationCap size={21} aria-hidden="true" /> {t("Importante")}</h2><p>{shownLesson?.pitfall || "Defina o problema, seus limites e os critérios antes de escolher uma solução."}</p></section>
        </aside>

        <nav className={styles.bottomNav} aria-label="Navegação entre aulas">
          <Link href="/disciplina/C00" className={styles.navCard} aria-label="Voltar à visão geral do curso">
            <ListTree aria-hidden="true" />
            <span><small>Voltar</small><strong className={styles.navDesktopText}>Visão geral do curso</strong><strong className={styles.navMobileText}>Visão geral</strong></span>
          </Link>
          {prevId ? (
            <Link href={`/aula/${prevId}`} className={styles.navCard} aria-label={`Aula anterior: ${prevTopic}`}>
              <ArrowLeft aria-hidden="true" />
              <span><small>Aula anterior</small><strong className={styles.navDesktopText}>{prevTopic}</strong><strong className={styles.navMobileText}>Anterior</strong></span>
            </Link>
          ) : (
            <span className={`${styles.navCard} ${styles.disabled}`} aria-disabled="true" title="Você está na primeira aula">
              <ArrowLeft aria-hidden="true" />
              <span><small>Aula anterior</small><strong className={styles.navDesktopText}>Você está na primeira aula</strong><strong className={styles.navMobileText}>Primeira aula</strong></span>
            </span>
          )}
          {nextId ? (
            <Link href={`/aula/${nextId}`} className={`${styles.navCard} ${styles.next}`} aria-label={`Próxima aula: ${nextTopic}`}>
              <span><small>Próxima aula</small><strong className={styles.navDesktopText}>{nextTopic}</strong><strong className={styles.navMobileText}>Próxima aula</strong></span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <span className={`${styles.navCard} ${styles.disabled}`} aria-disabled="true" title="Fim do curso">
              <span><small>Próxima aula</small><strong className={styles.navDesktopText}>Fim do curso</strong><strong className={styles.navMobileText}>Fim do curso</strong></span>
            </span>
          )}
        </nav>
      </div>
    </div>
  )
}
