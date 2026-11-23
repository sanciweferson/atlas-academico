"use client"
import Link from "next/link"
import { useMemo, useState } from "react"
import curriculum from "@/lib/curriculum.json"
import lessons from "@/lib/lessons.json"
import { ArrowRight, Search, BookOpen } from "lucide-react"
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
  "M20",
]
export default function Catalogo() {
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
    if (sort === "alfabetica") a.sort((x, y) => x.title.localeCompare(y.title))
    return a.filter((x) =>
      (x.title + " " + x.code).toLowerCase().includes(q.toLowerCase()),
    )
  }, [q, sort])
  return (
    <div className="space-y-7">
      <div>
        <span className="eyebrow">Biblioteca de disciplinas</span>
        <h1 className="page-title">Catálogo acadêmico</h1>
        <p className="muted mt-3 max-w-2xl">
          Explore as 81 unidades do currículo. A sequência recomendada é
          provisória e não substitui a análise individual dos pré-requisitos.
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
            placeholder="Buscar por nome ou código..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          className="field"
          aria-label="Ordenação do catálogo"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="pedagogica">Ordem recomendada</option>
          <option value="codigo">Código original</option>
          <option value="alfabetica">Ordem alfabética</option>
        </select>
      </div>
      <p className="muted text-sm">{courses.length} unidades encontradas</p>
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
                <span className="pill">{c.code}</span>
                <BookOpen size={18} className="muted" />
              </div>
              <h2 className="font-bold text-lg mt-5">{c.title}</h2>
              <p className="muted text-sm mt-3">
                {c.modules.length} módulos · {count} aulas redigidas
              </p>
              <span className="text-link mt-5 inline-flex">
                Abrir disciplina <ArrowRight size={16} />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
