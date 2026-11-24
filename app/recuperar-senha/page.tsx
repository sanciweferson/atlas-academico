"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { ArrowLeft, GraduationCap, LoaderCircle, Mail, ShieldCheck } from "lucide-react"
import { browserSupabase } from "@/lib/supabase"

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState("")

  async function requestLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const supabase = browserSupabase()
    if (!supabase) {
      setMessage("Não foi possível conectar à autenticação. Tente novamente mais tarde.")
      return
    }
    setBusy(true)
    setMessage("")
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      })
      if (error) {
        setMessage(error.message)
        return
      }
      setSent(true)
      setMessage("Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha. Confira também a pasta de spam.")
    } catch {
      setMessage("Não foi possível enviar a solicitação. Confira sua conexão e tente novamente.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="atlas-auth-layout">
      <section className="atlas-auth-intro">
        <span className="atlas-auth-emblem"><GraduationCap size={28} aria-hidden="true" /></span>
        <span className="eyebrow">SEGURANÇA DA CONTA</span>
        <h1>Vamos recuperar seu acesso.</h1>
        <p>Informe o e-mail da sua conta. Vamos enviar um link seguro para você definir uma nova senha.</p>
        <div className="atlas-auth-feature">Não é necessário informar sua senha antiga.</div>
      </section>

      <section className="atlas-auth-card" aria-labelledby="recuperar-titulo">
        <h2 id="recuperar-titulo">Esqueceu sua senha?</h2>
        <p className="muted">Digite somente seu e-mail para receber as instruções.</p>
        <form className="atlas-auth-form" onSubmit={requestLink}>
          <label>
            E-mail
            <span className="atlas-input-wrap">
              <Mail size={18} aria-hidden="true" />
              <input className="field" type="email" autoComplete="email" maxLength={254} required
                placeholder="voce@exemplo.com" value={email}
                onChange={event => { setEmail(event.target.value); setSent(false); setMessage("") }} />
            </span>
          </label>
          <button className="btn atlas-auth-submit" type="submit" disabled={busy}>
            {busy ? <LoaderCircle className="atlas-spin" size={19} aria-hidden="true" /> : <Mail size={19} aria-hidden="true" />}
            {busy ? "Enviando..." : sent ? "Reenviar instruções" : "Enviar link de recuperação"}
          </button>
          {message && <p className={`atlas-auth-message${sent ? " success" : ""}`} role="status">
            {sent && <ShieldCheck size={18} aria-hidden="true" />} {message}
          </p>}
        </form>
        <p className="atlas-auth-switch">
          <Link href="/login"><ArrowLeft size={16} aria-hidden="true" /> Voltar ao login</Link>
        </p>
      </section>
    </div>
  )
}
