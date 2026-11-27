import { notFound } from "next/navigation"
import curriculum from "@/lib/curriculum.json"
import lessons from "@/lib/lessons.json"
import chapters from "@/lib/chapters.json"
import AtlasDisciplineModules from "@/components/atlas-discipline-modules"

export default async function Disciplina({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const course = curriculum.find(item => item.code === code)
  if (!course) notFound()

  const writtenIds: string[] = []
  const extendedIds: string[] = []
  course.modules.forEach((module, i) => {
    module.topics.forEach((_, j) => {
      const id = `${course.code}-${i}-${j}`
      if (Object.prototype.hasOwnProperty.call(lessons, id)) writtenIds.push(id)
      if (Object.prototype.hasOwnProperty.call(chapters, id)) extendedIds.push(id)
    })
  })

  return <AtlasDisciplineModules course={course} writtenIds={writtenIds} extendedIds={extendedIds} />
}
