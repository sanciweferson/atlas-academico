"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Coffee, Sparkles, BookOpen } from "lucide-react"
import { browserSupabase } from "@/lib/supabase"

type Greeting = { salutation: string; phrase: string }
function localGreeting(hour: number): Greeting {
  if (hour >= 5 && hour < 12) return { salutation: "Bom dia", phrase: "Um café com código e uma aula por vez. Que tal continuar?" }
  if (hour >= 12 && hour < 18) return { salutation: "Boa tarde", phrase: "Hora de aprender algo novo, no seu ritmo." }
  return { salutation: "Boa noite", phrase: "Um pouco de estudo com constância faz diferença." }
}

export default function AtlasWelcome() {
  const [greeting, setGreeting] = useState<Greeting | null>(null)
  const [firstName, setFirstName] = useState("")

  useEffect(() => {
    let active = true
    setGreeting(localGreeting(new Date().getHours()))
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
      } catch {
        if (active) setFirstName("")
      }
    }
    void load()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { void load() })
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  return (
    <section className="atlas-v3-welcome" aria-label="Boas-vindas ao Atlas">
      <span className="atlas-v3-welcome-eyebrow"><Sparkles size={15} aria-hidden="true" /> SEU ESPAÇO DE APRENDIZAGEM</span>
      <div className="atlas-v3-welcome-layout">
        <div>
          <h2>{greeting ? `${greeting.salutation}${firstName ? `, ${firstName}` : ""}!` : "Bem-vindo ao Atlas!"}</h2>
          <p>{greeting?.phrase ?? "Sua próxima conquista começa com uma aula."}</p>
        </div>
        <Link className="atlas-v3-welcome-action" href="/estudo"><BookOpen size={18} aria-hidden="true" /> Continuar estudando</Link>
      </div>
      <span className="atlas-v3-welcome-foot"><Coffee size={15} aria-hidden="true" /> Aprender sem pressa, mas com propósito.</span>
    </section>
  )
}
