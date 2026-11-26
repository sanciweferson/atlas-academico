"use client"

import Link from "next/link"
import { ArrowRight, BookOpenText, Calculator, Code2, FlaskConical, Globe2, GraduationCap, Landmark, Languages, Scale, type LucideIcon } from "lucide-react"
import { useAtlasLanguage } from "@/lib/atlas-i18n"
import styles from "./catalogo.module.css"

type SubjectKey = "portugues" | "matematica" | "ingles" | "ciencias" | "historia" | "geografia" | "direito"
type Subject = { key: SubjectKey; Icon: LucideIcon }
const upcoming: Subject[] = [
  { key: "portugues", Icon: BookOpenText },
  { key: "matematica", Icon: Calculator },
  { key: "ingles", Icon: Languages },
  { key: "ciencias", Icon: FlaskConical },
  { key: "historia", Icon: Landmark },
  { key: "geografia", Icon: Globe2 },
  { key: "direito", Icon: Scale },
]

const copy = {
  "pt-BR": {
    kicker: "BIBLIOTECA ACADÊMICA", heading: "Explorar disciplinas",
    intro: "Escolha uma área do conhecimento. Programação já possui unidades e aulas para explorar; as demais disciplinas estão em preparação.",
    available: "DISPONÍVEL", soon: "EM BREVE", programming: "Programação",
    programmingDetail: "Fundamentos, Web, JavaScript, backend, engenharia de software e IA",
    enter: "Explorar Programação", note: "Novas disciplinas serão disponibilizadas à medida que seus conteúdos forem revisados.",
    names: { portugues: "Português", matematica: "Matemática", ingles: "Inglês", ciencias: "Ciências", historia: "História", geografia: "Geografia", direito: "Direito" },
  },
  en: {
    kicker: "ACADEMIC LIBRARY", heading: "Explore subjects",
    intro: "Choose a field of study. Programming already has units and lessons to explore; other subjects are being prepared.",
    available: "AVAILABLE", soon: "COMING SOON", programming: "Programming",
    programmingDetail: "Foundations, Web, JavaScript, backend, software engineering and AI",
    enter: "Explore Programming", note: "More subjects will be available as their lessons are reviewed.",
    names: { portugues: "Portuguese", matematica: "Mathematics", ingles: "English", ciencias: "Science", historia: "History", geografia: "Geography", direito: "Law" },
  },
  es: {
    kicker: "BIBLIOTECA ACADÉMICA", heading: "Explorar asignaturas",
    intro: "Elige un área de estudio. Programación ya tiene unidades y lecciones; las demás asignaturas están en preparación.",
    available: "DISPONIBLE", soon: "PRÓXIMAMENTE", programming: "Programación",
    programmingDetail: "Fundamentos, Web, JavaScript, backend, ingeniería de software e IA",
    enter: "Explorar Programación", note: "Habrá más asignaturas a medida que revisemos sus contenidos.",
    names: { portugues: "Portugués", matematica: "Matemáticas", ingles: "Inglés", ciencias: "Ciencias", historia: "Historia", geografia: "Geografía", direito: "Derecho" },
  },
} as const

export default function Catalogo() {
  const { language } = useAtlasLanguage()
  const t = copy[language]
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <span className={styles.eyebrow}><GraduationCap size={16} aria-hidden="true" /> {t.kicker}</span>
        <h1>{t.heading}</h1>
        <p>{t.intro}</p>
      </header>
      <div className={styles.grid} aria-label={t.heading}>
        <Link href="/catalogo/programacao" className={`${styles.card} ${styles.activeCard}`}>
          <div className={styles.cardTop}>
            <span className={`${styles.iconTile} ${styles.activeIcon}`}><Code2 size={26} aria-hidden="true" /></span>
            <span className={styles.available}>{t.available}</span>
          </div>
          <h2>{t.programming}</h2>
          <p>{t.programmingDetail}</p>
          <span className={styles.cardAction}>{t.enter} <ArrowRight size={17} aria-hidden="true" /></span>
        </Link>
        {upcoming.map(({ key, Icon }) => (
          <article key={key} className={`${styles.card} ${styles.upcomingCard}`} aria-label={`${t.names[key]} — ${t.soon}`}>
            <div className={styles.cardTop}>
              <span className={styles.iconTile}><Icon size={25} aria-hidden="true" /></span>
              <span className={styles.soon}>{t.soon}</span>
            </div>
            <h2>{t.names[key]}</h2>
            <p>{t.note}</p>
          </article>
        ))}
      </div>
      <p className={styles.note}>{t.note}</p>
    </div>
  )
}
