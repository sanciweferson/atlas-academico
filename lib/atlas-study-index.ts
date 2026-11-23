import curriculum from "@/lib/curriculum.json"
import lessons from "@/lib/lessons.json"
import questionBank from "@/lib/question-bank.json"

export type AtlasLesson = { id: string; title: string; discipline: string; questions: number }
const existing = lessons as Record<string, unknown>
const questions = questionBank as Record<string, unknown[]>

export const atlasLessons: AtlasLesson[] = curriculum.flatMap((course) =>
  course.modules.flatMap((module, moduleIndex) =>
    module.topics.flatMap((title, topicIndex) => {
      const id = `${course.code}-${moduleIndex}-${topicIndex}`
      return Object.prototype.hasOwnProperty.call(existing, id)
        ? [{ id, title, discipline: course.title, questions: questions[id]?.length ?? 0 }]
        : []
    }),
  ),
)

export function findAtlasLesson(id: string) {
  return atlasLessons.find((item) => item.id === id)
}
