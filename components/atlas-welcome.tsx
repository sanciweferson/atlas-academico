"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock3, Coffee, Sparkles, BookOpen, Quote } from "lucide-react"
import { browserSupabase } from "@/lib/supabase"
import { useAtlasLanguage } from "@/lib/atlas-i18n"

type Greeting = { salutation: string; phrase: string }
function localGreeting(hour: number): Greeting {
  if (hour >= 5 && hour < 12) return { salutation: "Bom dia", phrase: "Um café com código e uma aula por vez. Que tal continuar?" }
  if (hour >= 12 && hour < 18) return { salutation: "Boa tarde", phrase: "Hora de aprender algo novo, no seu ritmo." }
  return { salutation: "Boa noite", phrase: "Um pouco de estudo com constância faz diferença." }
}

const phrases = [
  "Consistência não é motivação — é decisão.",
  "Todo sênior já ficou travado exatamente onde você está agora.",
  "Scriptorium: onde o código vira conhecimento.",
  "Entender o porquê vale mais que memorizar o como.",
  "O dev que sabe depurar vale mais que o que nunca erra.",
  "O código de ontem te explica o erro de hoje."
]

export default function AtlasWelcome() {
  const { language, tr } = useAtlasLanguage()
  const [now, setNow] = useState<Date | null>(null)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [firstName, setFirstName] = useState("")

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const clock = window.setInterval(tick, 1000)
    const phrasesTimer = window.setInterval(() => setPhraseIndex((previous) => (previous + 1) % phrases.length), 12000)
    return () => { window.clearInterval(clock); window.clearInterval(phrasesTimer) }
  }, [])

  useEffect(() => {
    let active = true
    const supabase = browserSupabase()
    if (!supabase) return
    async function load() {
      try {
        const { data: { user } } = await supabase!.auth.getUser()
        if (!active) return
        if (!user) { setFirstName(""); return }
        const { data } = await supabase!.from("profiles")
          .select("full_name").eq("id", user.id).maybeSingle<{ full_name: string | null }>()
        if (!active) return
        const name = data?.full_name || String(user.user_metadata?.full_name || "")
        setFirstName(name.trim().split(/\s+/)[0]?.slice(0, 35) || "")
      } catch { if (active) setFirstName("") }
    }
    void load()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { void load() })
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  const greeting = now ? localGreeting(now.getHours()) : null
  const locale = language === "en" ? "en-US" : language === "es" ? "es-ES" : "pt-BR"
  const dateText = now ? new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(now) : ""
  const timeText = now ? new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now) : "--:--:--"

  return (
    <section className="atlas-v3-welcome" aria-label={tr("Boas-vindas ao Atlas")}>
      <span className="atlas-v3-welcome-eyebrow"><Sparkles size={15} aria-hidden="true" /> {tr("SEU ESPAÇO DE APRENDIZAGEM")}</span>
      <div className="atlas-v3-welcome-layout">
        <div className="atlas-v31-welcome-main">
          <h2>{greeting ? `${tr(greeting.salutation)}${firstName ? `, ${firstName}` : ""}!` : tr("Bem-vindo ao Atlas!")}</h2>
          <p>{greeting ? tr(greeting.phrase) : tr("Sua próxima conquista começa com uma aula.")}</p>
          <div className="atlas-v31-welcome-phrase" aria-live="off">
            <Quote size={16} aria-hidden="true" />
            <span>{tr(phrases[phraseIndex])}</span>
          </div>
        </div>
        <div className="atlas-v31-welcome-side">
          <div className="atlas-v31-clock" aria-label={tr("Relógio local")}>
            <span className="atlas-v31-clock-heading"><Clock3 size={15} aria-hidden="true" /> {tr("Horário local")}</span>
            <strong suppressHydrationWarning>{timeText}</strong>
            <time className="atlas-v31-clock-date">{dateText}</time>
          </div>
          <Link className="atlas-v3-welcome-action" href="/estudo"><BookOpen size={18} aria-hidden="true" /> {tr("Continuar estudando")}</Link>
        </div>
      </div>
      <span className="atlas-v3-welcome-foot"><Coffee size={15} aria-hidden="true" /> {tr("Aprender sem pressa, mas com propósito.")}</span>
    </section>
  )
}
