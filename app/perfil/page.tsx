"use client"

import Link from "next/link"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { Camera, LogOut, Save, Trash2, UserRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { browserSupabase } from "@/lib/supabase"

type Profile = { full_name: string | null; avatar_path: string | null }
const BUCKET = "avatars"

export default function PerfilPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [avatarPath, setAvatarPath] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    let active = true
    const s = browserSupabase()
    if (!s) { setMessage("Configure o Supabase para acessar seu perfil."); setLoading(false); return }
    async function load() {
      const {data:{user}} = await s!.auth.getUser()
      if (!active) return
      if (!user) { setLoading(false); return }
      setUserId(user.id)
      setEmail(user.email ?? "")
      const {data, error} = await s!.from("profiles").select("full_name, avatar_path").eq("id",user.id).maybeSingle<Profile>()
      if (!active) return
      if (error) setMessage("Não foi possível carregar o perfil. Confira se o SQL de atualização foi executado.")
      setFullName(data?.full_name ?? String(user.user_metadata?.full_name ?? ""))
      setAvatarPath(data?.avatar_path ?? null)
      setLoading(false)
    }
    void load()
    return () => {active=false}
  }, [])

  useEffect(() => {
    let active = true
    const s = browserSupabase()
    if (!s || !avatarPath) { setAvatarUrl(null); return }
    void s.storage.from(BUCKET).createSignedUrl(avatarPath, 3600).then(({data})=>{
      if (active) setAvatarUrl(data?.signedUrl ?? null)
    })
    return () => {active=false}
  }, [avatarPath])

  async function save(event: FormEvent) {
    event.preventDefault()
    const s = browserSupabase()
    if (!s || !userId) return
    if (fullName.trim().length < 3) {setMessage("Informe um nome com pelo menos 3 caracteres.");return}
    setBusy(true);setMessage("")
    const {error}=await s.from("profiles").upsert({id:userId,full_name:fullName.trim()},{onConflict:"id"})
    setBusy(false)
    setMessage(error ? `Erro ao salvar: ${error.message}` : "Nome atualizado com sucesso.")
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file=event.target.files?.[0]
    event.target.value=""
    const s=browserSupabase()
    if (!file || !s || !userId) return
    const allowed=["image/jpeg","image/png","image/webp"]
    if (!allowed.includes(file.type)) {setMessage("Escolha uma imagem JPG, PNG ou WebP.");return}
    if (file.size > 2*1024*1024) {setMessage("A imagem deve ter até 2 MB.");return}
    const extension= file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp"
    const path=`${userId}/${crypto.randomUUID()}.${extension}`
    setBusy(true);setMessage("")
    const {error:uploadError}=await s.storage.from(BUCKET).upload(path,file,{contentType:file.type,upsert:false})
    if (uploadError) {setBusy(false);setMessage(`Falha no envio: ${uploadError.message}`);return}
    const {error:saveError}=await s.from("profiles").upsert({id:userId,avatar_path:path},{onConflict:"id"})
    if (saveError) {
      await s.storage.from(BUCKET).remove([path])
      setMessage(`Falha ao salvar foto: ${saveError.message}`)
    } else {
      const oldPath=avatarPath
      setAvatarPath(path)
      if(oldPath) await s.storage.from(BUCKET).remove([oldPath])
      setMessage("Foto atualizada com sucesso.")
    }
    setBusy(false)
  }

  async function removeAvatar() {
    const s=browserSupabase()
    if(!s || !userId || !avatarPath)return
    setBusy(true)
    const oldPath=avatarPath
    const {error}=await s.from("profiles").update({avatar_path:null}).eq("id",userId)
    if(error) setMessage(`Erro ao remover foto: ${error.message}`)
    else {
      setAvatarPath(null)
      await s.storage.from(BUCKET).remove([oldPath])
      setMessage("Foto removida.")
    }
    setBusy(false)
  }

  async function signOut() {
    const s=browserSupabase()
    if(!s)return
    await s.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  if(loading) return <div className="panel atlas-profile-card">Carregando seu perfil...</div>
  if(!userId) return <div className="panel atlas-profile-card"><h1 className="text-2xl font-bold">Meu perfil</h1><p>Entre na sua conta para visualizar e editar seu perfil.</p><Link className="btn" href="/login">Entrar</Link>{message && <p role="status">{message}</p>}</div>
  return <div className="atlas-profile-layout">
    <div className="atlas-profile-heading"><span className="eyebrow">MINHA CONTA</span><h1 className="page-title">Meu perfil</h1><p className="muted">Personalize suas informações no Atlas Acadêmico.</p></div>
    <div className="panel atlas-profile-card">
      <div className="atlas-avatar-section">
        <div className="atlas-avatar-circle">{avatarUrl ? <img src={avatarUrl} alt="Sua foto de perfil"/> : <UserRound size={54}/>}</div>
        <div><h2 className="text-xl font-bold">Foto de perfil</h2><p className="muted text-sm">JPG, PNG ou WebP, até 2 MB.</p><div className="atlas-avatar-buttons"><label className="btn atlas-avatar-upload"><Camera size={17}/> {avatarPath ? "Trocar foto" : "Adicionar foto"}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>void upload(e)} disabled={busy} className="atlas-visually-hidden"/></label>{avatarPath && <button type="button" className="btn-secondary" onClick={()=>void removeAvatar()} disabled={busy}><Trash2 size={17}/> Remover</button>}</div></div>
      </div>
      <form className="atlas-profile-form" onSubmit={save}><label>Nome completo<input className="field" autoComplete="name" maxLength={120} required value={fullName} onChange={e=>setFullName(e.target.value)}/></label><label>E-mail<input className="field" type="email" value={email} readOnly aria-describedby="atlas-email-help"/></label><p id="atlas-email-help" className="muted text-sm">O e-mail está vinculado à autenticação da sua conta.</p><button type="submit" className="btn" disabled={busy}><Save size={17}/> Salvar alterações</button></form>
      {message && <p className="atlas-auth-message" role="status">{message}</p>}
      <div className="atlas-profile-footer"><button type="button" className="atlas-auth-text-button" onClick={()=>void signOut()}><LogOut size={17}/> Sair da conta</button></div>
    </div>
  </div>
}
