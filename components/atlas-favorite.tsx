"use client"

import { Bookmark, BookmarkCheck } from "lucide-react"
import { useAtlasLocalStudy } from "@/lib/atlas-local-study"

export default function AtlasFavorite({ lessonId }: { lessonId: string }) {
  const { favorites, ready, toggleFavorite, storageError } = useAtlasLocalStudy()
  const saved = favorites.includes(lessonId)
  return (
    <div>
      <button type="button" className="btn-secondary" aria-pressed={saved}
        disabled={!ready} onClick={() => toggleFavorite(lessonId)}>
        {saved ? <BookmarkCheck size={18} aria-hidden="true" /> : <Bookmark size={18} aria-hidden="true" />}
        {saved ? "Remover dos favoritos" : "Salvar nos favoritos"}
      </button>
      {storageError && <p role="alert" className="muted text-xs mt-2">{storageError}</p>}
    </div>
  )
}
