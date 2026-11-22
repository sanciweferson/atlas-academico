"use client"

import { useEffect, useState } from "react"
import { Save } from "lucide-react"
import { browserSupabase } from "@/lib/supabase"
import * as Dialog from "@radix-ui/react-dialog"

type CloudNote = {
  body: string
}

function noteStorageKey(
  type: "notes" | "recovery",
  lessonId: string,
  userId: string | null,
): string {
  const owner = userId ? `user:${userId}` : "guest"

  return `atlas:${type}:${owner}:${lessonId}`
}

export default function LocalNotes({ id }: { id: string }) {
  const [note, setNote] = useState("")
  const [localNote, setLocalNote] = useState("")
  const [cloudNote, setCloudNote] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [status, setStatus] = useState("")
  const [recoveryDraft, setRecoveryDraft] = useState<string | null>(null)
  const [legacyNote, setLegacyNote] = useState<string | null>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importConfirmed, setImportConfirmed] = useState(false)
  const userStorageKey = noteStorageKey("notes", id, userId)
  const userRecoveryKey = noteStorageKey("recovery", id, userId)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setReady(false)
      setStatus("")
      setConflict(false)
      setUserId(null)
      setCloudNote(null)
      setRecoveryDraft(null)
      setNote("")
      setLocalNote("")
      setLegacyNote(null)
      const supabase = browserSupabase()
      let uid: string | null = null

      if (supabase) {
        try {
          const { data, error } = await supabase.auth.getUser()

          if (cancelled) return

          if (error) {
            setStatus(
              "Não foi possível verificar sua sessão. Recarregue a página.",
            )
            return
          }

          uid = data.user?.id ?? null
        } catch {
          if (!cancelled) {
            setStatus("Falha ao verificar a sessão. Recarregue a página.")
          }
          return
        }
      }

      if (cancelled) return

      const noteKey = noteStorageKey("notes", id, uid)
      const draftKey = noteStorageKey("recovery", id, uid)
      try {
        const oldNote = localStorage.getItem(`atlas:notes:${id}`)

        if (!cancelled) {
          setLegacyNote(oldNote)
        }
      } catch {
        if (!cancelled) {
          setStatus("Não foi possível verificar as anotações antigas.")
        }
      }

      let stored = ""

      try {
        stored = localStorage.getItem(noteKey) ?? ""

        const previousDraft = localStorage.getItem(draftKey)
        if (previousDraft !== null) {
          setRecoveryDraft(previousDraft)
        }
      } catch {
        if (!cancelled) {
          setStatus("Não foi possível ler os dados deste navegador.")
        }
        return
      }

      if (cancelled) return

      setUserId(uid)
      setLocalNote(stored)
      setNote(stored)

      if (!uid || !supabase) {
        setReady(true)
        return
      }

      try {
        const { data, error } = await supabase
          .from("lesson_notes")
          .select("body")
          .eq("user_id", uid)
          .eq("lesson_id", id)
          .maybeSingle<CloudNote>()

        if (cancelled) return

        if (error) {
          setStatus("Não foi possível consultar a nuvem: " + error.message)
          return
        }

        const remote = data?.body ?? null
        setCloudNote(remote)

        if (remote !== null && stored && remote !== stored) {
          setConflict(true)
          setStatus("Existem anotações diferentes no navegador e na nuvem.")
        } else if (remote !== null && !stored) {
          setNote(remote)
          setStatus("Anotação carregada da sua conta.")
        }

        setReady(true)
      } catch {
        if (!cancelled) {
          setStatus("Não foi possível consultar a nuvem.")
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [id])

  function saveLocal(value: string): boolean {
    try {
      localStorage.setItem(userStorageKey, value)
      setLocalNote(value)
      return true
    } catch {
      setStatus("Erro ao salvar neste navegador.")
      return false
    }
  }

  async function save() {
    if (busy || !ready || conflict) return

    setBusy(true)
    setStatus("")

    try {
      if (!userId) {
        if (saveLocal(note)) {
          setStatus("Anotação salva neste navegador.")
        }
        return
      }

      const supabase = browserSupabase()

      if (!supabase) {
        setStatus("Supabase indisponível. Nenhuma alteração foi feita.")
        return
      }

      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (authError || authData.user?.id !== userId) {
        setStatus("Sua sessão mudou. Recarregue a página antes de salvar.")
        return
      }

      const { data: current, error: readError } = await supabase
        .from("lesson_notes")
        .select("body")
        .eq("user_id", userId)
        .eq("lesson_id", id)
        .maybeSingle<CloudNote>()

      if (readError) {
        setStatus("Não foi possível verificar a anotação na nuvem.")
        return
      }

      const currentBody = current?.body ?? null

      if (currentBody !== cloudNote) {
        setCloudNote(currentBody)
        setConflict(true)
        setStatus(
          "A anotação na nuvem mudou. Escolha qual versão deseja manter.",
        )
        return
      }

      const { error: saveError } = await supabase
        .from("lesson_notes")
        .upsert(
          { user_id: userId, lesson_id: id, body: note },
          { onConflict: "user_id,lesson_id" },
        )

      if (saveError) {
        setStatus("Erro ao salvar na nuvem: " + saveError.message)
        return
      }

      setCloudNote(note)

      if (saveLocal(note)) {
        setStatus("Anotação salva na sua conta e neste navegador.")
      } else {
        setStatus("Anotação salva na nuvem, mas não neste navegador.")
      }
    } catch {
      setStatus("Ocorreu um erro. Tente novamente.")
    } finally {
      setBusy(false)
    }
  }

  function confirmReplacement(nextNote: string): boolean {
    if (note === nextNote) return true

    const originalDraft = note

    if (originalDraft) {
      const copied = window.confirm(
        "Atenção: escolher esta versão substituirá o texto exibido.\n\n" +
          "Antes de continuar, copie seu rascunho para um lugar seguro.\n\n" +
          "Clique em OK somente se já guardou o texto. " +
          "Clique em Cancelar para voltar sem alterar nada.",
      )

      if (!copied) {
        setStatus("Operação cancelada. Seu rascunho foi preservado.")
        return false
      }

      setRecoveryDraft(originalDraft)

      try {
        localStorage.setItem(userRecoveryKey, originalDraft)
      } catch {
        setStatus(
          "Não foi possível criar o backup no navegador. " +
            "Copie seu rascunho antes de continuar.",
        )
        return false
      }
    }

    return true
  }

  function chooseLocal() {
    if (!confirmReplacement(localNote)) return

    setNote(localNote)
    setConflict(false)
    setStatus("Versão local selecionada. Clique em Salvar para sincronizar.")
  }

  function chooseCloud() {
    if (cloudNote === null) return
    if (!confirmReplacement(cloudNote)) return

    setNote(cloudNote)
    setConflict(false)
    setStatus("Versão da nuvem selecionada. Clique em Salvar para sincronizar.")
  }

function importLegacyNote() {
  if (
    !ready ||
    busy ||
    conflict ||
    !importDialogOpen ||
    !importConfirmed ||
    legacyNote === null
  ) {
    return
  }

  if (note === legacyNote) {
    setStatus("A anotação antiga já está no editor.")
    setImportDialogOpen(false)
    setImportConfirmed(false)
    return
  }

  // Preserva o rascunho atual antes de substituí-lo.
  if (!confirmReplacement(legacyNote)) return

  setNote(legacyNote)
  setImportDialogOpen(false)
  setImportConfirmed(false)

  setStatus(
    "Anotação antiga carregada no editor. " +
      "Clique em Salvar anotação para sincronizar.",
  )
}

  return (
    <section className="panel space-y-3">
      <h2 className="text-xl font-bold">Caderno pessoal</h2>

      <p className="muted text-sm">
        {userId
          ? "Suas anotações podem ser sincronizadas com sua conta."
          : "Sem login, suas anotações ficam neste navegador."}
      </p>

      {ready && legacyNote !== null && (
        <div className="space-y-3 rounded-lg border p-4">
          <h3 className="font-bold">Anotação antiga encontrada</h3>

          <p className="muted text-sm">
            Encontramos uma anotação criada antes da separação dos dados por
            usuário. Confira o conteúdo e confirme que ela pertence à sua conta
            antes de importar.
          </p>

          <textarea
            className="field min-h-32"
            aria-label="Visualização da anotação antiga"
            value={legacyNote}
            readOnly
          />

          <p className="muted text-xs">
            A anotação original será preservada durante a importação.
          </p>

          <button
            type="button"
            className="pill"
            onClick={() => {
              setImportConfirmed(false)
              setImportDialogOpen(true)
            }}
            disabled={!ready || busy || conflict}
          >
            Importar anotação antiga
          </button>
        </div>
      )}

      {conflict && (
        <div className="space-y-3 rounded-lg border p-4">
          <p className="font-bold">Duas versões encontradas</p>

          <p className="muted text-sm">
            Escolha qual versão deseja usar. Nenhuma será substituída até você
            confirmar o salvamento.
          </p>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="pill" onClick={chooseLocal}>
              Usar versão local
            </button>

            <button type="button" className="pill" onClick={chooseCloud}>
              Usar versão da nuvem
            </button>
          </div>
        </div>
      )}

      <textarea
        className="field min-h-40"
        aria-label="Anotações da aula"
        value={note}
        onChange={(event) => {
          setNote(event.target.value)
          setStatus("")
        }}
        placeholder="Anote dúvidas, exemplos e justificativas..."
        disabled={!ready || busy || conflict}
      />

      <button
        type="button"
        className="btn"
        onClick={() => void save()}
        disabled={!ready || busy || conflict}
      >
        <Save size={16} />
        {busy ? "Salvando..." : "Salvar anotação"}
      </button>

      {status && (
        <p role="status" className="text-sm muted">
          {status}
        </p>
      )}

      {recoveryDraft !== null && (
        <div className="space-y-3 rounded-lg border p-4">
          <h3 className="font-bold">Rascunho para recuperação</h3>

          <p className="muted text-sm">
            Este texto foi preservado temporariamente antes da substituição.
            Copie-o antes de fechar a página.
          </p>

          <textarea
            className="field min-h-32"
            aria-label="Rascunho para recuperação"
            value={recoveryDraft}
            readOnly
          />

          <button
            type="button"
            className="pill"
            onClick={() => {
              setNote(recoveryDraft)
              setRecoveryDraft(null)
              setStatus("Rascunho restaurado no editor. Ainda não foi salvo.")
            }}
          >
            Restaurar rascunho no editor
          </button>
        </div>
      )}

      <Dialog.Root
        open={importDialogOpen}
        onOpenChange={(open) => {
          setImportDialogOpen(open)
          if (!open) setImportConfirmed(false)
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />

          <Dialog.Content
            aria-describedby="legacy-import-description"
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 space-y-5 rounded-2xl border border-white/10 bg-slate-950 p-6 text-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Dialog.Title className="text-xl font-bold">
                  Importar anotação antiga
                </Dialog.Title>
                <p className="text-sm text-slate-400">
                  Recuperação de dados · Atlas Acadêmico
                </p>
              </div>

              <Dialog.Close
                className="rounded-lg px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Fechar janela"
              >
                ✕
              </Dialog.Close>
            </div>

            <Dialog.Description
              id="legacy-import-description"
              className="text-sm leading-relaxed text-slate-300"
            >
              Encontramos uma anotação criada antes da separação por usuário.
              Confira o conteúdo antes de importá-la.
            </Dialog.Description>

            <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Pré-visualização
              </p>

              <div className="max-h-40 overflow-y-auto whitespace-pre-wrap break-words text-sm">
                {legacyNote}
              </div>
            </div>

            <p className="text-sm text-slate-300">
              A anotação original será preservada. A importação não salvará
              automaticamente o conteúdo na nuvem.
            </p>

            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={importConfirmed}
                onChange={(event) => setImportConfirmed(event.target.checked)}
                className="mt-1 h-4 w-4 accent-indigo-500"
              />
              <span>Confirmo que esta anotação pertence à minha conta.</span>
            </label>

            <div className="flex flex-wrap justify-end gap-3">
              <Dialog.Close
                type="button"
                className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
              >
                Cancelar
              </Dialog.Close>

              <button
                type="button"
                disabled={!importConfirmed || !ready || busy || conflict}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={
                 importLegacyNote
                }
              >
                Confirmar importação
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  )
}
