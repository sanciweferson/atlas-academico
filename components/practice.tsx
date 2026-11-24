"use client"

import { useEffect, useRef, useState } from "react"
import { BookOpenCheck, Check, ChevronDown, Download, ShieldAlert } from "lucide-react"
import { browserSupabase } from "@/lib/supabase"

type Question = { kind: string; prompt: string; answer: string | null }
type Attempt = {
  responses: Record<number, string>
  revealed: Record<number, boolean>
  submitted: boolean
}
type Identity =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; scope: string }

const emptyAttempt = (): Attempt => ({ responses: {}, revealed: {}, submitted: false })

function parseAttempt(value: unknown): Attempt {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Formato de respostas inválido")
  }
  const data = value as Record<string, unknown>
  const responses: Record<number, string> = {}
  const revealed: Record<number, boolean> = {}
  if (data.responses && typeof data.responses === "object" && !Array.isArray(data.responses)) {
    Object.entries(data.responses).forEach(([key, value]) => {
      const number = Number(key)
      if (Number.isSafeInteger(number) && number >= 0 && number < 1000 && typeof value === "string") {
        responses[number] = value
      }
    })
  }
  if (data.revealed && typeof data.revealed === "object" && !Array.isArray(data.revealed)) {
    Object.entries(data.revealed).forEach(([key, value]) => {
      const number = Number(key)
      if (Number.isSafeInteger(number) && number >= 0 && number < 1000 && typeof value === "boolean") {
        revealed[number] = value
      }
    })
  }
  return { responses, revealed, submitted: data.submitted === true }
}

function readAttempt(key: string): { data: Attempt; error: string | null } {
  try {
    const raw = window.localStorage.getItem(key)
    return { data: raw === null ? emptyAttempt() : parseAttempt(JSON.parse(raw)), error: null }
  } catch {
    return { data: emptyAttempt(), error: "Não foi possível ler as respostas salvas. Os dados existentes não serão substituídos." }
  }
}

export default function Practice({ lessonId, questions }: { lessonId: string; questions: Question[] }) {
  const [identity, setIdentity] = useState<Identity>({ status: "loading" })

  useEffect(() => {
    let active = true
    let version = 0
    const supabase = browserSupabase()
    if (!supabase) {
      setIdentity({ status: "ready", scope: "visitante" })
      return
    }

    async function verifyIdentity() {
      const request = ++version
      setIdentity({ status: "loading" })
      try {
        // Uma sessão inexistente é um visitante válido, não uma falha de autenticação.
        // getSession() aqui serve apenas para detectar ausência de sessão no cliente.
        // Nunca usamos o usuário do getSession() para identificar uma conta.
        const { data: sessionData, error: sessionError } = await supabase!.auth.getSession()
        if (!active || request !== version) return
        if (sessionError) {
          setIdentity({ status: "error" })
          return
        }
        if (!sessionData.session) {
          setIdentity({ status: "ready", scope: "visitante" })
          return
        }
        // Sessão presente: só a resposta validada pelo servidor identifica a conta.
        const { data, error } = await supabase!.auth.getUser()
        if (!active || request !== version) return
        if (error || !data.user) {
          setIdentity({ status: "error" })
        } else {
          setIdentity({ status: "ready", scope: `usuario:${data.user.id}` })
        }
      } catch {
        if (active && request === version) setIdentity({ status: "error" })
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (!active || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") return
      if (event === "SIGNED_OUT") {
        version += 1
        setIdentity({ status: "ready", scope: "visitante" })
      } else if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        // Esconde imediatamente as respostas da conta anterior.
        const currentVersion = ++version
        setIdentity({ status: "loading" })
        // Deferimos getUser para fora do callback do Supabase Auth.
        Promise.resolve().then(() => {
          if (active && currentVersion === version) void verifyIdentity()
        })
      }
    })
    void verifyIdentity()
    return () => { active = false; version += 1; subscription.unsubscribe() }
  }, [])

  if (identity.status === "loading") {
    return <section id="avaliacao" className="panel" role="status">Carregando suas respostas...</section>
  }
  if (identity.status === "error") {
    return <section id="avaliacao" className="panel" role="alert">
      Não foi possível verificar a conta. Recarregue a página para tentar novamente. Nenhuma resposta foi modificada.
    </section>
  }

  return (
    <PracticeWorkspace
      key={`${identity.scope}:${lessonId}`}
      scope={identity.scope}
      lessonId={lessonId}
      questions={questions}
    />
  )
}

function PracticeWorkspace({ scope, lessonId, questions }: {
  scope: string; lessonId: string; questions: Question[]
}) {
  // A chave antiga (sem conta) é mantida INTACTA para recuperação manual.
  const storageKey = `atlas:practice:${scope}:${lessonId}`
  const legacyKey = `atlas:practice:${lessonId}`
  const [initial] = useState(() => readAttempt(storageKey))
  const [responses, setResponses] = useState<Record<number, string>>(initial.data.responses)
  const [revealed, setRevealed] = useState<Record<number, boolean>>(initial.data.revealed)
  const [submitted, setSubmitted] = useState(initial.data.submitted)
  const [storageError, setStorageError] = useState(initial.error || "")
  const [legacyAvailable, setLegacyAvailable] = useState(() => {
    try { return window.localStorage.getItem(legacyKey) !== null } catch { return false }
  })
  const [legacyConfirmed, setLegacyConfirmed] = useState(false)
  const [pasteWarnings, setPasteWarnings] = useState<Record<number, boolean>>({})
  const pasteTimers = useRef<Record<number, number>>({})

  useEffect(() => {
    if (initial.error) return // Evita sobrescrever dados que não puderam ser lidos.
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ responses, submitted, revealed }))
      setStorageError("")
    } catch {
      setStorageError("O navegador não permitiu salvar as respostas. Exporte o texto antes de sair da página.")
    }
  }, [responses, submitted, revealed, storageKey, initial.error])

  useEffect(() => {
    const timers = pasteTimers.current
    return () => { Object.values(timers).forEach(timer => window.clearTimeout(timer)) }
  }, [])

  function warnAboutPaste(index: number) {
    setPasteWarnings(previous => ({ ...previous, [index]: true }))
    window.clearTimeout(pasteTimers.current[index])
    pasteTimers.current[index] = window.setTimeout(() => {
      setPasteWarnings(previous => ({ ...previous, [index]: false }))
      delete pasteTimers.current[index]
    }, 3000)
  }

  function importLegacy() {
    const hasProgress = submitted || Object.values(responses).some(text => text.trim().length > 0)
      || Object.values(revealed).some(Boolean)
    if (!legacyConfirmed || !legacyAvailable || hasProgress || initial.error) return
    const legacy = readAttempt(legacyKey)
    if (legacy.error) { setStorageError("Não foi possível recuperar as respostas antigas."); return }
    setResponses(legacy.data.responses)
    setRevealed(legacy.data.revealed)
    setSubmitted(legacy.data.submitted)
    setLegacyAvailable(false)
    setLegacyConfirmed(false)
    // O registro antigo continua intocado: não é migrado nem apagado automaticamente.
  }

  const answered = questions.filter((_, index) => responses[index]?.trim()).length
  const hasProgress = submitted || Object.values(responses).some(text => text.trim().length > 0)
    || Object.values(revealed).some(Boolean)

  function exportAnswers() {
    const lines = questions.map((q, index) =>
      `${index + 1}. ${q.kind}\n${q.prompt}\n\nMinha resposta:\n${responses[index] || "(não respondida)"}\n`
    ).join("\n---\n\n")
    const blob = new Blob([`Atlas Acadêmico — ${lessonId}\n\n${lines}`], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `atlas-${lessonId}-respostas.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return <section className="space-y-5" id="avaliacao">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <span className="eyebrow">Laboratório de domínio</span>
        <h2 className="text-2xl font-bold mt-2">Exercícios e avaliação</h2>
        <p className="muted text-sm mt-2">Responda antes de consultar os comentários. Questões discursivas não recebem nota automática.</p>
      </div>
      <div className="pill">{answered}/{questions.length} respondidas</div>
    </div>
    <p className="muted text-sm">Exercício autoral: escreva sua resposta. Colar ou arrastar texto nos campos de resposta está desativado. O caderno pessoal continua permitindo colagem.</p>
    <p className="muted text-sm">As respostas ficam neste navegador, separadas por conta na interface. Em dispositivo compartilhado, os dados locais não têm a proteção de um armazenamento privado no servidor.</p>
    {storageError && <p className="panel" role="alert">{storageError}</p>}
    {legacyAvailable && !hasProgress && !initial.error && <div className="panel space-y-3">
      <strong>Respostas antigas encontradas neste navegador</strong>
      <p className="muted text-sm">Há uma tentativa salva antes da separação por conta. Ela pode pertencer a outra pessoa que usou este navegador. Não será importada automaticamente nem apagada.</p>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" className="mt-1" checked={legacyConfirmed} onChange={event => setLegacyConfirmed(event.target.checked)} />
        <span>Confirmo que as respostas antigas são minhas e quero importá-las para este perfil do navegador.</span>
      </label>
      <button type="button" className="btn-secondary" disabled={!legacyConfirmed} onClick={importLegacy}>
        Importar minhas respostas antigas
      </button>
    </div>}
    <div className="progress-track"><div className="progress-fill" style={{ width: `${questions.length ? 100 * answered / questions.length : 0}%` }} /></div>
    {questions.map((q, index) => <article className="panel space-y-4" key={index}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="eyebrow">Questão {String(index + 1).padStart(2, "0")} · {q.kind}</span>
        {responses[index]?.trim() && <span className="text-xs muted flex gap-1 items-center"><Check size={13} /> Rascunho salvo</span>}
      </div>
      <p className="text-base font-medium leading-7">{q.prompt}</p>
      <label className="sr-only" htmlFor={`resp-${index}`}>Sua resposta à questão {index + 1}</label>
      <textarea id={`resp-${index}`}
        className={`field min-h-32${pasteWarnings[index] ? " atlas-v31-paste-input-warning" : ""}`}
        placeholder="Escreva sua resposta e justifique o raciocínio..."
        value={responses[index] || ""}
        onChange={event => { setResponses(previous => ({ ...previous, [index]: event.target.value })); setSubmitted(false) }}
        onPaste={event => { event.preventDefault(); warnAboutPaste(index) }}
        onDrop={event => { event.preventDefault(); warnAboutPaste(index) }}
        onBeforeInput={event => {
          const inputType = (event.nativeEvent as InputEvent).inputType
          if (inputType === "insertFromPaste" || inputType === "insertFromDrop") {
            event.preventDefault()
            warnAboutPaste(index)
          }
        }}
        aria-describedby={pasteWarnings[index] ? `atlas-v31-paste-warning-${index}` : undefined}
      />
      {pasteWarnings[index] && <p id={`atlas-v31-paste-warning-${index}`} className="atlas-v31-paste-feedback-field" role="status">
        <ShieldAlert size={18} aria-hidden="true" />
        <span><strong>Questão {String(index + 1).padStart(2, "0")}:</strong> Colar ou arrastar texto não é permitido nesta resposta. Digite com suas próprias palavras.</span>
      </p>}
      <details className="answer-details" open={!!revealed[index]} onToggle={event => {
        const isOpen = event.currentTarget.open
        setRevealed(previous => previous[index] === isOpen ? previous : ({ ...previous, [index]: isOpen }))
      }}>
        <summary className="cursor-pointer flex gap-2 items-center text-sm font-semibold">
          <ChevronDown size={16} /> {q.answer ? "Conferir gabarito comentado" : "Orientação de revisão"}
        </summary>
        <div className="pt-3 muted leading-7">{q.answer || "Esta questão exige análise individual. Compare sua resposta com a teoria, identifique pressupostos e peça uma correção argumentada ao professor ou à IA."}</div>
      </details>
    </article>)}
    <div className="panel flex flex-wrap gap-3 items-center justify-between">
      <div><strong>{submitted ? "Tentativa registrada" : "Finalize sua tentativa"}</strong>
        <p className="muted text-sm mt-1">Seu texto fica neste navegador. Não equivale a aprovação automática.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-secondary" onClick={exportAnswers}><Download size={16} /> Exportar respostas</button>
        <button type="button" className="btn" disabled={answered !== questions.length} onClick={() => setSubmitted(true)}><BookOpenCheck size={16} /> Registrar tentativa</button>
      </div>
    </div>
  </section>
}
