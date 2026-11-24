"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { Eye, EyeOff, GraduationCap, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react"
import { browserSupabase } from "@/lib/supabase"

type Mode = "login" | "signup"

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (mode !== "login") return
    const params = new URLSearchParams(window.location.search)
    if (params.get("senha") === "atualizada") {
      setSuccess(true)
      setMessage("Senha atualizada com sucesso! Entre com sua nova senha.")
    }
  }, [mode])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setMessage("")
    setSuccess(false)
    if (mode === "signup" && name.trim().length < 3) {
      setMessage("Informe seu nome completo (pelo menos 3 caracteres).")
      return
    }
    if (mode === "signup" && password !== confirmPassword) {
      setMessage("As senhas não coincidem.")
      return
    }
    const supabase = browserSupabase()
    if (!supabase) { setMessage("Supabase não configurado. Confira as variáveis de ambiente."); return }
    setBusy(true)
    try {
      const result = mode === "login"
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({
            email: email.trim(), password,
            options: { data: { full_name: name.trim() } },
          })
      if (result.error) { setMessage(result.error.message); return }
      if (mode === "signup" && !result.data.session) {
        setSuccess(true)
        setMessage("Cadastro solicitado. Verifique seu e-mail para confirmar a conta. Se já existir uma conta, use a opção Entrar.")
        return
      }
     router.push(mode === "signup" ? "/perfil" : "/")
      router.refresh()
    } catch {
      setMessage("Não foi possível conectar. Tente novamente.")
    } finally { setBusy(false) }
  }

  return (
    <div className="atlas-auth-layout">
      <div className="atlas-auth-intro">
        <span className="atlas-auth-emblem"><GraduationCap size={28} /></span>
        <span className="eyebrow">ATLAS ACADÊMICO</span>
        <h1>{mode === "login" ? "Bem-vindo de volta." : "Comece sua jornada de aprendizagem."}</h1>
        <p>{mode === "login" ? "Continue seus estudos, consulte seu progresso e acompanhe suas disciplinas." : "Crie sua conta para organizar seus estudos e personalizar seu perfil."}</p>
        <div className="atlas-auth-feature">Aprenda no seu ritmo. Seu conhecimento, seu caminho.</div>
      </div>
      <div className="atlas-auth-card">
        <h2>{mode === "login" ? "Entrar na conta" : "Criar minha conta"}</h2>
        <p className="muted">{mode === "login" ? "Informe seus dados para continuar." : "Preencha os campos para começar."}</p>
        <form onSubmit={submit} className="atlas-auth-form">
          {mode === "signup" && <label>Nome completo
            <span className="atlas-input-wrap"><UserRound size={18}/><input className="field" type="text" autoComplete="name" maxLength={120} required placeholder="Seu nome completo" value={name} onChange={e=>setName(e.target.value)}/></span>
          </label>}
          <label>E-mail
            <span className="atlas-input-wrap"><Mail size={18}/><input className="field" type="email" autoComplete="email" required placeholder="voce@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)}/></span>
          </label>
          <label>Senha
            <span className="atlas-input-wrap"><LockKeyhole size={18}/><input className="field" type={visible ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required placeholder="Sua senha" value={password} onChange={e=>setPassword(e.target.value)}/><button className="atlas-password-toggle" type="button" onClick={()=>setVisible(v=>!v)} aria-label={visible ? "Ocultar senha" : "Mostrar senha"}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button></span>
          </label>
          {mode === "signup" && <label>Confirmar senha
            <span className="atlas-input-wrap"><LockKeyhole size={18}/><input className="field" type={visible ? "text" : "password"} autoComplete="new-password" minLength={6} required placeholder="Repita sua senha" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}/></span>
          </label>}
          {mode === "login" && <Link href="/recuperar-senha" className="atlas-auth-text-button">Esqueci minha senha</Link>}
          <button className="btn atlas-auth-submit" type="submit" disabled={busy}>{busy ? <LoaderCircle className="atlas-spin" size={19}/> : null}{mode === "login" ? "Entrar" : "Criar conta"}</button>
          {message && <p className={success ? "atlas-auth-message success" : "atlas-auth-message"} role="status">{message}</p>}
        </form>
        <p className="atlas-auth-switch">{mode === "login" ? "Ainda não tem conta?" : "Já possui uma conta?"} <Link href={mode === "login" ? "/cadastro" : "/login"}>{mode === "login" ? "Criar conta" : "Entrar"}</Link></p>
      </div>
    </div>
  )
}
