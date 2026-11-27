"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen, Layers3 } from "lucide-react"
import { useAtlasLanguage, type AtlasLanguage } from "@/lib/atlas-i18n"

type Course = {
  code: string
  title: string
  requirements: string
  modules: { title: string; topics: string[] }[]
}
type Language = AtlasLanguage

const words = {
  "pt-BR": { back: "Voltar ao catálogo", subject: "DISCIPLINA", modules: "módulos", lessons: "aulas redigidas", programme: "Programa curricular", heading: "Módulos e aulas", topics: "tópicos de estudo", lesson: "Aula", extended: "Capítulo ampliado", written: "Introdução redigida", planned: "Conteúdo em planejamento" },
  en: { back: "Back to catalog", subject: "SUBJECT", modules: "modules", lessons: "written lessons", programme: "Curriculum", heading: "Modules and lessons", topics: "study topics", lesson: "Lesson", extended: "Expanded chapter", written: "Written introduction", planned: "Content being planned" },
  es: { back: "Volver al catálogo", subject: "ASIGNATURA", modules: "módulos", lessons: "lecciones redactadas", programme: "Programa curricular", heading: "Módulos y lecciones", topics: "temas de estudio", lesson: "Lección", extended: "Capítulo ampliado", written: "Introducción redactada", planned: "Contenido en planificación" },
} satisfies Record<Language, Record<string, string>>

// Apenas C00 está mapeada nesta etapa. Outras disciplinas mantêm os títulos originais.
const c00Modules = {
  en: [
    { title: "Foundations of Computational Thinking and Tools", topics: ["Definitions and terminology", "Historical context and applications", "Fundamental concepts and examples", "Limits and conceptual errors"] },
    { title: "Theory and models", topics: ["Formal models and assumptions", "Reasoning and justifications", "Case analysis and counterexamples", "Relationship to prerequisites"] },
    { title: "Methods and tools", topics: ["Techniques and procedures", "Reading documentation and primary sources", "Progressive exercises", "Diagnosing errors"] },
    { title: "Applications and project", topics: ["Integrative problem", "Implementation or demonstration appropriate to the subject", "Testing and documentation", "Comparing alternatives"] },
    { title: "Mastery assessment", topics: ["New theoretical exam", "Oral or written explanation", "Transfer to a new problem", "Review after 7 and 30 days"] },
  ],
  es: [
    { title: "Fundamentos del pensamiento computacional y herramientas", topics: ["Definiciones y terminología", "Contexto histórico y aplicaciones", "Conceptos fundamentales y ejemplos", "Límites y errores conceptuales"] },
    { title: "Teoría y modelos", topics: ["Modelos formales y supuestos", "Razonamiento y justificaciones", "Análisis de casos y contraejemplos", "Relación con los requisitos previos"] },
    { title: "Métodos y herramientas", topics: ["Técnicas y procedimientos", "Lectura de documentación y fuentes primarias", "Ejercicios progresivos", "Diagnóstico de errores"] },
    { title: "Aplicaciones y proyecto", topics: ["Problema integrador", "Implementación o demostración según la disciplina", "Pruebas y documentación", "Comparación de alternativas"] },
    { title: "Evaluación del dominio", topics: ["Prueba teórica inédita", "Explicación oral o escrita", "Transferencia a un problema nuevo", "Repaso después de 7 y 30 días"] },
  ],
}
const c00CourseTitle = { en: "Computational Thinking and Tools", es: "Pensamiento computacional y herramientas" }

export default function AtlasDisciplineModules({ course, writtenIds, extendedIds }: {
  course: Course
  writtenIds: string[]
  extendedIds: string[]
}) {
  const { language } = useAtlasLanguage()
  const labels = words[language]
  const written = new Set(writtenIds)
  const extended = new Set(extendedIds)
  const translatedModules = course.code === "C00" && language !== "pt-BR" ? c00Modules[language] : null
  const title = course.code === "C00" && language !== "pt-BR" ? c00CourseTitle[language] : course.title
  const count = writtenIds.length

  return <div className="space-y-7">
    <Link href="/catalogo" className="back-link"><ArrowLeft size={16}/>{labels.back}</Link>
    <section className="panel space-y-4">
      <span className="eyebrow">{labels.subject} {course.code}</span>
      <h1 className="page-title">{title}</h1>
      <p className="muted">{course.requirements}</p>
      <div className="flex gap-2 flex-wrap">
        <span className="pill"><Layers3 size={14} className="inline mr-1"/>{course.modules.length} {labels.modules}</span>
        <span className="pill"><BookOpen size={14} className="inline mr-1"/>{count} {labels.lessons}</span>
      </div>
    </section>
    <div className="flex justify-between gap-3 items-center"><div>
      <span className="eyebrow">{labels.programme}</span>
      <h2 className="section-title">{labels.heading}</h2>
    </div></div>
    {course.modules.map((module, i) => {
      const display = translatedModules?.[i]
      return <details key={i} className="module-card" open={i === 0}>
        <summary className="module-summary">
          <span className="module-index">{String(i + 1).padStart(2, "0")}</span>
          <span className="flex-1">
            <strong className="block">{display?.title ?? module.title}</strong>
            <small className="muted">{module.topics.length} {labels.topics}</small>
          </span>
          <span className="module-plus">+</span>
        </summary>
        <div className="module-body">
          {module.topics.map((topic, j) => {
            const id = `${course.code}-${i}-${j}`
            const isWritten = written.has(id)
            const isExtended = extended.has(id)
            return <Link key={id} href={`/aula/${id}`} className="lesson-row">
              <div className="flex-1">
                <p className="font-medium">{labels.lesson} {String(j + 1).padStart(2, "0")} · {display?.topics[j] ?? topic}</p>
                <span className={`text-xs mt-1 inline-block ${isWritten ? "text-emerald-600 dark:text-emerald-400" : "muted"}`}>
                  {isExtended ? labels.extended : isWritten ? labels.written : labels.planned}
                </span>
              </div>
              <ArrowRight size={17} className="muted" />
            </Link>
          })}
        </div>
      </details>
    })}
  </div>
}
