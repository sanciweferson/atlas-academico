"use client"
import Link from "next/link"
import { useMemo, useState } from "react"
import curriculum from "@/lib/curriculum.json"
import lessons from "@/lib/lessons.json"
import { ArrowLeft, ArrowRight, Search } from "lucide-react"
import AtlasDisciplineIcon from "@/components/atlas-discipline-icon"
import { useAtlasLanguage } from "@/lib/atlas-i18n"
type Course = (typeof curriculum)[number]
const priority = [
  "C00",
  "M01",
  "M02",
  "M03",
  "M04",
  "M05",
  "M06",
  "M09",
  "M10",
  "M11",
  "M14",
  "M16",
  "M17A",
  "M18",
  "M65",
  "M20",
]

/* ATLAS-P26D-CATALOGO-I18N */
type CatalogLang = "pt-BR" | "en" | "es"
const catalogCopy: Record<CatalogLang, {
  back: string; eyebrow: string; heading: string; introStart: string; introEnd: string
  search: string; sortLabel: string; pedagogical: string; code: string; alphabetical: string
  found: string; modules: string; lessons: string; open: string
  originalTitlesNotice: string
}> = {
  "pt-BR": {
    back: "Todas as disciplinas", eyebrow: "Biblioteca de disciplinas", heading: "Catálogo acadêmico",
    introStart: "Explore as", introEnd: "unidades do currículo. A sequência recomendada é provisória e não substitui a análise individual dos pré-requisitos.",
    search: "Buscar por nome ou código...", sortLabel: "Ordenação do catálogo", pedagogical: "Ordem recomendada",
    code: "Código original", alphabetical: "Ordem alfabética", found: "unidades encontradas",
    modules: "módulos", lessons: "aulas redigidas", open: "Abrir disciplina",
    originalTitlesNotice: "",
  },
  en: {
    back: "All subjects", eyebrow: "Subject library", heading: "Academic catalog",
    introStart: "Explore the", introEnd: "curriculum units. The recommended sequence is provisional and does not replace an individual review of prerequisites.",
    search: "Search by name or code...", sortLabel: "Catalog sorting", pedagogical: "Recommended order",
    code: "Original code", alphabetical: "Alphabetical order", found: "units found",
    modules: "modules", lessons: "written lessons", open: "Open subject",
    originalTitlesNotice: "Some subject names remain in Portuguese while translations are reviewed.",
  },
  es: {
    back: "Todas las asignaturas", eyebrow: "Biblioteca de asignaturas", heading: "Catálogo académico",
    introStart: "Explora las", introEnd: "unidades del plan de estudios. El orden recomendado es provisional y no sustituye la revisión individual de los requisitos previos.",
    search: "Buscar por nombre o código...", sortLabel: "Orden del catálogo", pedagogical: "Orden recomendado",
    code: "Código original", alphabetical: "Orden alfabético", found: "unidades encontradas",
    modules: "módulos", lessons: "lecciones redactadas", open: "Abrir asignatura",
    originalTitlesNotice: "Algunos nombres de asignaturas siguen en portugués mientras se revisan sus traducciones.",
  },
}
// Somente titulos completos confirmados no curriculo original.
// Titulos truncados no JSON nao sao completados por suposicao.
const catalogTitles: Record<string, Partial<Record<CatalogLang, string>>> = {
  C00: { en: "Computational Thinking and Tools", es: "Pensamiento computacional y herramientas" },
  C01: { en: "Discrete Mathematics and Proofs", es: "Matemáticas discretas y demostraciones" },
  C02: { en: "Theory of Computation and Formal Languages", es: "Teoría de la computación y lenguajes formales" },
  C03: { en: "Requirements Engineering", es: "Ingeniería de requisitos" },
  C09: { en: "Real-World Systems and Operations", es: "Sistemas reales y operaciones" },
  C11: { en: "Data Engineering", es: "Ingeniería de datos" },
  M01: { en: "Internet, Web, and How the Web Works", es: "Internet, Web y cómo funciona la Web" },
  M02: { en: "HTML: Semantics and Accessibility", es: "HTML: semántica y accesibilidad" },
  M03: { en: "CSS and Interface Engineering", es: "CSS e ingeniería de interfaces" },
  M04: { en: "JavaScript Fundamentals", es: "Fundamentos de JavaScript" },
  M05: { en: "Objects, Arrays, Prototypes, and Classes", es: "Objetos, arreglos, prototipos y clases" },
  M06: { en: "JavaScript in Depth", es: "JavaScript en profundidad" },
  M10: { en: "Data Structures", es: "Estructuras de datos" },
  M13: { en: "Operating Systems", es: "Sistemas operativos" },
  M14: { en: "Git, GitHub and Workflow", es: "Git, GitHub y flujo de trabajo" },
  M15: { en: "Software Engineering", es: "Ingeniería de software" },
  M18: { en: "React", es: "React" },
  M20: { en: "Next.js", es: "Next.js" },
  M21: { en: "Node.js", es: "Node.js" },
  M22: { en: "APIs and Backend", es: "API y backend" },
  M23: { en: "Databases", es: "Bases de datos" },
  M27: { en: "Linux and Infrastructure", es: "Linux e infraestructura" },
  M28: { en: "Docker", es: "Docker" },
  M29: { en: "CI/CD", es: "CI/CD" },
  M30: { en: "Cloud", es: "Nube" },
  M31: { en: "Kubernetes", es: "Kubernetes" },
  M32: { en: "Infrastructure as Code", es: "Infraestructura como código" },
  M33: { en: "Distributed Systems", es: "Sistemas distribuidos" },
  M35: { en: "Resilience", es: "Resiliencia" },
  M36: { en: "Distributed Transactions", es: "Transacciones distribuidas" },
  M37: { en: "Observability", es: "Observabilidad" },
  M38: { en: "Reliability Engineering", es: "Ingeniería de fiabilidad" },
  M39: { en: "System Design", es: "Diseño de sistemas" },
  M40: { en: "Linear Algebra", es: "Álgebra lineal" },
  M41: { en: "Calculus", es: "Cálculo" },
  M43: { en: "Optimization", es: "Optimización" },
  M44: { en: "Machine Learning", es: "Aprendizaje automático" },
  M45: { en: "Neural Networks", es: "Redes neuronales" },
  M49: { en: "Transformer Internals", es: "Funcionamiento interno de Transformers" },
  M50: { en: "LLM Training", es: "Entrenamiento de LLM" },
  M51: { en: "LLM Inference", es: "Inferencia de LLM" },
  M52: { en: "LLM Integration", es: "Integración de LLM" },
  M55: { en: "RAG", es: "RAG" },
  M56: { en: "AI Agents", es: "Agentes de IA" },
  M58: { en: "AI Safety and Security", es: "Seguridad de IA" },
  M59: { en: "MLOps", es: "MLOps" },
  M60: { en: "AI Infrastructure", es: "Infraestructura de IA" },
  M61: { en: "AI Systems Architecture", es: "Arquitectura de sistemas de IA" },
  M62: { en: "AI Reliability", es: "Fiabilidad de IA" },
  M63: { en: "AI Cost Engineering", es: "Ingeniería de costos de IA" },
  M64: { en: "AI Architecture Trade-offs", es: "Compromisos de arquitectura de IA" },
  M65: { en: "React Native and Expo — Mobile Development", es: "React Native y Expo — Desarrollo móvil" },
}

export default function Catalogo() {
  const { language } = useAtlasLanguage()
  const t = catalogCopy[language]
  const titleFor = (course: Course) => catalogTitles[course.code]?.[language] ?? course.title
  const [q, setQ] = useState("")
  const [sort, setSort] = useState("pedagogica")
  const courses = useMemo(() => {
    let a = [...curriculum] as Course[]
    if (sort === "pedagogica")
      a.sort((x, y) => {
        const i = priority.indexOf(x.code),
          j = priority.indexOf(y.code)
        return (
          (i < 0 ? 1000 : i) - (j < 0 ? 1000 : j) ||
          x.code.localeCompare(y.code)
        )
      })
    if (sort === "codigo") a.sort((x, y) => x.code.localeCompare(y.code))
    if (sort === "alfabetica") a.sort((x, y) => titleFor(x).localeCompare(titleFor(y), language))
    return a.filter((x) =>
      (titleFor(x) + " " + x.title + " " + x.code).toLocaleLowerCase(language).includes(q.trim().toLocaleLowerCase(language)),
    )
  }, [q, sort, language])
  return (
    <div className="space-y-7">
      <Link href="/catalogo" className="text-link inline-flex items-center gap-2"><ArrowLeft size={17} aria-hidden="true" /> {t.back}</Link>
      <div>
        <span className="eyebrow">{t.eyebrow}</span>
        <h1 className="page-title">{t.heading}</h1>
        <p className="muted mt-3 max-w-2xl">
          {t.introStart} {curriculum.length} {t.introEnd}
        </p>
      </div>
      <div className="panel grid md:grid-cols-[1fr_220px] gap-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />
          <input
            className="field !pl-12"
            placeholder={t.search}
            aria-label={t.search}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          className="field"
          aria-label={t.sortLabel}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="pedagogica">{t.pedagogical}</option>
          <option value="codigo">{t.code}</option>
          <option value="alfabetica">{t.alphabetical}</option>
        </select>
      </div>
      <p className="muted text-sm">{courses.length} {t.found}</p>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((c, i) => {
          const count = c.modules.reduce(
            (n, m, j) =>
              n +
              m.topics.filter((_, k) => `${c.code}-${j}-${k}` in lessons)
                .length,
            0,
          )
          return (
            <Link
              href={"/disciplina/" + encodeURIComponent(c.code)}
              key={c.code}
              className="course-card"
            >
              <div className="flex justify-between items-center">
                <AtlasDisciplineIcon code={c.code} />
                <span className="pill">{c.code}</span>
              </div>
              <h2 className="font-bold text-lg mt-5">{titleFor(c)}</h2>
              <p className="muted text-sm mt-3">
                {c.modules.length} {t.modules} · {count} {t.lessons}
              </p>
              <span className="text-link mt-5 inline-flex">
                {t.open} <ArrowRight size={16} />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
