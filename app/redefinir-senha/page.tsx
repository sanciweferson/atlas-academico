"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { ArrowLeft, Eye, EyeOff, GraduationCap, LoaderCircle, LockKeyhole } from "lucide-react"
import { browserSupabase } from "@/lib/supabase"

export default function RedefinirSenha() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const supabase = browserSupabase()
    if (!supabase) {
      setMessage("Autenticação indisponível. Tente novamente mais tarde.")
      setChecking(false)
      return
    }
    let active = true
    // Um link válido estabelece uma sessão de recuperação.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session) {
        setReady(true)
        setChecking(false)
      } else if (event === "SIGNED_OUT") {
        setReady(false)
        setChecking(false)
      }
    })
    // Também permite atualizar a página depois que o link já autenticou a sessão.
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) setMessage("Não foi possível validar seu link. Solicite outro e-mail.")
      setReady(!error && Boolean(data.session))
      setChecking(false)
    }).catch(() => {
      if (active) {
        setMessage("Não foi possível validar seu link. Solicite outro e-mail.")
        setChecking(false)
      }
    })
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setMessage("")
    if (password !== confirm) {
      setMessage("As senhas não coincidem.")
      return
    }
    if (password.length < 6) {
      setMessage("A nova senha precisa ter pelo menos 6 caracteres.")
      return
    }
    const supabase = browserSupabase()
    if (!supabase) {
      setMessage("Não foi possível conectar à autenticação.")
      return
    }
    setBusy(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setMessage(error.message)
        return
      }
      setPassword("")
      setConfirm("")
      setMessage("Senha atualizada! Redirecionando para o login...")
      // A sessão criada pelo link de recuperação não deve manter o aluno conectado.
      const { error: signOutError } = await supabase.auth.signOut({ scope: "local" })
      if (signOutError) {
        setMessage("Senha atualizada, mas não foi possível encerrar a sessão de recuperação. Saia da conta antes de entrar com a nova senha.")
        return
      }
      router.replace("/login?senha=atualizada")
    } catch {
      setMessage("Ocorreu um erro de conexão. Tente novamente.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="atlas-auth-layout">
      <section className="atlas-auth-intro">
        <span className="atlas-auth-emblem"><GraduationCap size={28} aria-hidden="true" /></span>
        <span className="eyebrow">PROTEÇÃO DA SUA CONTA</span>
        <h1>Crie uma nova senha.</h1>
        <p>Escolha uma senha que ainda não tenha utilizado. O Atlas confirmará a alteração antes de voltar ao login.</p>
        <div className="atlas-auth-feature">Nunca compartilhe o link de recuperação nem sua senha com outras pessoas.</div>
      </section>

      <section className="atlas-auth-card" aria-labelledby="redefinir-titulo">
        <h2 id="redefinir-titulo">Redefinir senha</h2>
        <p className="muted">Digite e confirme sua nova senha.</p>
        {checking ? (
          <p className="atlas-auth-message" role="status">Validando seu link de recuperação...</p>
        ) : ready ? (
          <form className="atlas-auth-form" onSubmit={submit}>
            <label>
              Nova senha
              <span className="atlas-input-wrap">
                <LockKeyhole size={18} aria-hidden="true" />
                <input className="field" type={visible ? "text" : "password"} autoComplete="new-password"
                  minLength={6} required placeholder="Sua nova senha" value={password}
                  onChange={event => setPassword(event.target.value)} />
                <button type="button" className="atlas-password-toggle"
                  aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setVisible(current => !current)}>
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            <label>
              Confirmar nova senha
              <span className="atlas-input-wrap">
                <LockKeyhole size={18} aria-hidden="true" />
                <input className="field" type={visible ? "text" : "password"} autoComplete="new-password"
                  minLength={6} required placeholder="Repita sua nova senha" value={confirm}
                  onChange={event => setConfirm(event.target.value)} />
              </span>
            </label>
            <button className="btn atlas-auth-submit" disabled={busy} type="submit">
              {busy && <LoaderCircle className="atlas-spin" size={19} aria-hidden="true" />}
              {busy ? "Salvando..." : "Salvar nova senha"}
            </button>
            {message && <p className="atlas-auth-message" role="status">{message}</p>}
          </form>
        ) : (
          <div className="atlas-auth-form">
            <p className="atlas-auth-message" role="alert">{message || "Este link não está ativo ou expirou. Solicite um novo e-mail de recuperação."}</p>
            <Link className="btn atlas-auth-submit" href="/recuperar-senha">Pedir outro link</Link>
          </div>
        )}
        <p className="atlas-auth-switch"><Link href="/login"><ArrowLeft size={16} aria-hidden="true" /> Voltar ao login</Link></p>
      </section>
    </div>
  )
}
