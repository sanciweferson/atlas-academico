"use client"
import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { browserSupabase } from "@/lib/supabase"
export default function RedefinirSenha() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    const s = browserSupabase()
    if (!s) return
    void s.auth.getSession().then(({data})=>setReady(Boolean(data.session)))
    const {data:{subscription}}=s.auth.onAuthStateChange((event)=>{
      if(event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true)
    })
    return ()=>subscription.unsubscribe()
  }, [])
  async function submit(e: FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setMessage("As senhas não coincidem."); return }
    const s=browserSupabase(); if(!s)return
    setBusy(true)
    const {error}=await s.auth.updateUser({password})
    setBusy(false)
    setMessage(error ? error.message : "Senha atualizada. Você já pode entrar.")
  }
  return <div className="panel atlas-profile-card"><h1 className="text-3xl font-bold">Redefinir senha</h1><p className="muted">Abra o link enviado ao seu e-mail e escolha uma nova senha.</p>{ready ? <form onSubmit={submit} className="atlas-auth-form"><label>Nova senha<input className="field" type="password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)}/></label><label>Confirmar nova senha<input className="field" type="password" minLength={6} required value={confirm} onChange={e=>setConfirm(e.target.value)}/></label><button className="btn" disabled={busy}>Salvar nova senha</button></form> : <p>Se você já abriu o link de recuperação, aguarde a validação da sessão.</p>}<p role="status">{message}</p><Link href="/login" className="text-link">Voltar ao login</Link></div>
}
