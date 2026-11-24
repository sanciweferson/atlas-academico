"use client"

// ATLAS V3.1 — PACOTE 09: FOTO DO PERFIL
import Link from "next/link"
import * as Dialog from "@radix-ui/react-dialog"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { ArrowLeft, Camera, Check, ImagePlus, LoaderCircle, RotateCcw, Save, Trash2, UserRound, X } from "lucide-react"
import { useAtlasLanguage } from "@/lib/atlas-i18n"
import { browserSupabase } from "@/lib/supabase"

type Profile = { full_name: string | null; avatar_path: string | null }
type CropSelection = { url: string; image: HTMLImageElement }
const BUCKET = "avatars"
const VIEW = 264
const OUTPUT = 512
const MAX_SOURCE = 12 * 1024 * 1024
const MAX_UPLOAD = 2 * 1024 * 1024
const clamp = (value: number) => Math.min(1, Math.max(-1, value))

export default function PerfilPage() {
  const { tr } = useAtlasLanguage()
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [avatarPath, setAvatarPath] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [crop, setCrop] = useState<CropSelection | null>(null)
  const [zoom, setZoom] = useState(1)
  const [cropX, setCropX] = useState(0)
  const [cropY, setCropY] = useState(0)
  const galleryRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null)

  useEffect(() => {
    let active = true
    const s = browserSupabase()
    if (!s) { setMessage("Configure o Supabase para acessar seu perfil."); setLoading(false); return }
    async function load() {
      try {
        const { data: { user } } = await s!.auth.getUser()
        if (!active) return
        if (!user) { setLoading(false); return }
        setUserId(user.id)
        setEmail(user.email ?? "")
        const { data, error } = await s!.from("profiles").select("full_name, avatar_path").eq("id", user.id).maybeSingle<Profile>()
        if (!active) return
        if (error) setMessage("Não foi possível carregar o perfil. Confira as permissões da tabela profiles.")
        setFullName(data?.full_name ?? String(user.user_metadata?.full_name ?? ""))
        setAvatarPath(data?.avatar_path ?? null)
      } catch {
        if (active) setMessage("Não foi possível carregar o perfil. Verifique sua conexão.")
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    const s = browserSupabase()
    if (!s || !avatarPath) { setAvatarUrl(null); return }
    void s.storage.from(BUCKET).createSignedUrl(avatarPath, 3600).then(({ data }) => {
      if (active) setAvatarUrl(data?.signedUrl ?? null)
    }).catch(() => { if (active) setAvatarUrl(null) })
    return () => { active = false }
  }, [avatarPath])

  // Libera o objeto temporário quando o usuário fecha ou troca a imagem.
  useEffect(() => () => { if (crop) URL.revokeObjectURL(crop.url) }, [crop])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const s = browserSupabase()
    if (!s || !userId || busy) return
    if (fullName.trim().length < 3) { setMessage("Informe um nome com pelo menos 3 caracteres."); return }
    setBusy(true); setMessage("")
    try {
      const { error } = await s.from("profiles").upsert({ id: userId, full_name: fullName.trim() }, { onConflict: "id" })
      setMessage(error ? `Erro ao salvar: ${error.message}` : "Nome atualizado com sucesso.")
    } catch { setMessage("Não foi possível salvar. Verifique sua conexão.") }
    finally { setBusy(false) }
  }

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file || busy) return
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage("Formato não suportado. Escolha uma foto JPG, PNG ou WebP.")
      return
    }
    if (file.size > MAX_SOURCE) {
      setMessage("A foto original deve ter no máximo 12 MB.")
      return
    }
    setMessage("")
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      if (image.naturalWidth < 128 || image.naturalHeight < 128) {
        URL.revokeObjectURL(url)
        setMessage("Escolha uma imagem de pelo menos 128 × 128 pixels.")
        return
      }
      setZoom(1); setCropX(0); setCropY(0)
      setCrop({ url, image })
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      setMessage("Não foi possível abrir esta imagem. Experimente JPG, PNG ou WebP.")
    }
    image.src = url
  }

  const ratio = crop ? VIEW / Math.min(crop.image.naturalWidth, crop.image.naturalHeight) : 1
  const drawnWidth = crop ? crop.image.naturalWidth * ratio * zoom : VIEW
  const drawnHeight = crop ? crop.image.naturalHeight * ratio * zoom : VIEW
  const overflowX = Math.max(0, (drawnWidth - VIEW) / 2)
  const overflowY = Math.max(0, (drawnHeight - VIEW) / 2)

  function dragStart(event: React.PointerEvent<HTMLDivElement>) {
    if (!crop) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { x: event.clientX, y: event.clientY, cx: cropX, cy: cropY }
  }
  function dragMove(event: React.PointerEvent<HTMLDivElement>) {
    const origin = dragRef.current
    if (!origin) return
    if (overflowX > 0) setCropX(clamp(origin.cx + (event.clientX - origin.x) / overflowX))
    if (overflowY > 0) setCropY(clamp(origin.cy + (event.clientY - origin.y) / overflowY))
  }

  async function saveCroppedPhoto() {
    const s = browserSupabase()
    if (!s || !userId || !crop || busy) return
    setBusy(true); setMessage("")
    let newPath: string | null = null
    try {
      const canvas = document.createElement("canvas")
      canvas.width = OUTPUT; canvas.height = OUTPUT
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("O navegador não disponibilizou o processamento da imagem.")
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, OUTPUT, OUTPUT)
      const scale = OUTPUT / Math.min(crop.image.naturalWidth, crop.image.naturalHeight) * zoom
      const width = crop.image.naturalWidth * scale
      const height = crop.image.naturalHeight * scale
      const x = (OUTPUT - width) / 2 + cropX * Math.max(0, (width - OUTPUT) / 2)
      const y = (OUTPUT - height) / 2 + cropY * Math.max(0, (height - OUTPUT) / 2)
      ctx.drawImage(crop.image, x, y, width, height)
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.87))
      if (!blob || blob.size > MAX_UPLOAD) throw new Error("Não foi possível gerar a imagem final dentro do limite de 2 MB.")
      newPath = `${userId}/${crypto.randomUUID()}.jpg`
      const { error: uploadError } = await s.storage.from(BUCKET).upload(newPath, blob, { contentType: "image/jpeg", upsert: false })
      if (uploadError) throw new Error(`Falha no envio: ${uploadError.message}`)
      const { error: saveError } = await s.from("profiles").upsert({ id: userId, avatar_path: newPath }, { onConflict: "id" })
      if (saveError) throw new Error(`Falha ao salvar foto: ${saveError.message}`)
      const previous = avatarPath
      setAvatarPath(newPath)
      setCrop(null)
      setMessage("Foto atualizada com sucesso. Seu novo avatar será exibido nos dispositivos conectados à sua conta.")
      if (previous && previous !== newPath) {
        // Falha na limpeza da imagem antiga não deve invalidar o salvamento atual.
        void s.storage.from(BUCKET).remove([previous])
      }
    } catch (error) {
      // Se o banco não confirmou a nova foto, remove o arquivo recém-enviado.
      if (newPath) {
        const { data } = await s.from("profiles").select("avatar_path").eq("id", userId).maybeSingle<{ avatar_path: string | null }>()
        if (data?.avatar_path !== newPath) void s.storage.from(BUCKET).remove([newPath])
      }
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar a foto. Tente novamente.")
    } finally { setBusy(false) }
  }

  async function removeAvatar() {
    const s = browserSupabase()
    if (!s || !userId || !avatarPath || busy) return
    setBusy(true); setMessage("")
    try {
      const previous = avatarPath
      const { error } = await s.from("profiles").update({ avatar_path: null }).eq("id", userId)
      if (error) { setMessage(`Erro ao remover foto: ${error.message}`); return }
      setAvatarPath(null)
      void s.storage.from(BUCKET).remove([previous])
      setMessage("Foto removida.")
    } catch { setMessage("Não foi possível remover sua foto. Verifique sua conexão.") }
    finally { setBusy(false) }
  }

  if (loading) return <div className="panel atlas-profile-card">Carregando seu perfil...</div>
  if (!userId) return <div className="panel atlas-profile-card"><h1 className="text-2xl font-bold">Meu perfil</h1><p>Entre na sua conta para visualizar e editar seu perfil.</p><Link className="btn" href="/login">Entrar</Link>{message && <p role="status">{message}</p>}</div>

  return <div className="atlas-profile-layout">
    {/* ATLAS V3.1 — PACOTE 10: CABEÇALHO DO PERFIL */}
    <div className="atlas-profile-heading atlas-v31-profile-heading">
      <Link className="atlas-v31-back-link" href="/"><ArrowLeft size={17} aria-hidden="true" />{tr("Voltar ao início")}</Link>
      <span className="eyebrow">{tr("MINHA CONTA")}</span>
      <h1 className="page-title">{tr("Meu perfil")}</h1>
      <p className="muted">{tr("Personalize suas informações no Atlas Acadêmico.")}</p>
    </div>
    <div className="panel atlas-profile-card">
      <div className="atlas-avatar-section">
        <div className="atlas-avatar-circle">{avatarUrl ? <img src={avatarUrl} alt="Sua foto de perfil" /> : <UserRound size={54}/>}</div>
        <div className="atlas-v31-photo-actions">
          <h2 className="text-xl font-bold">Foto de perfil</h2>
          <p className="muted text-sm">JPG, PNG ou WebP. Foto original até 12 MB; a versão salva terá até 2 MB.</p>
          <div className="atlas-avatar-buttons">
            <button className="btn" type="button" disabled={busy} onClick={() => galleryRef.current?.click()}><ImagePlus size={17} aria-hidden="true" /> Escolher da galeria</button>
            <button className="btn-secondary" type="button" disabled={busy} onClick={() => cameraRef.current?.click()}><Camera size={17} aria-hidden="true" /> Usar câmera</button>
            {avatarPath && <button type="button" className="btn-secondary" onClick={() => void removeAvatar()} disabled={busy}><Trash2 size={17} aria-hidden="true" /> Remover</button>}
          </div>
          <p className="muted text-xs mt-2">A opção de câmera depende das permissões e do navegador do dispositivo.</p>
          <input ref={galleryRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} className="atlas-visually-hidden" tabIndex={-1} aria-hidden="true" />
          <input ref={cameraRef} type="file" accept="image/jpeg,image/png,image/webp" capture="user" onChange={chooseFile} className="atlas-visually-hidden" tabIndex={-1} aria-hidden="true" />
        </div>
      </div>
      <form className="atlas-profile-form" onSubmit={(event) => void save(event)}>
        <label>Nome completo<input className="field" autoComplete="name" maxLength={120} required value={fullName} onChange={(event) => setFullName(event.target.value)} /></label>
        <label>E-mail<input className="field" type="email" value={email} readOnly aria-describedby="atlas-email-help" /></label>
        <p id="atlas-email-help" className="muted text-sm">O e-mail está vinculado à autenticação da sua conta.</p>
        <button type="submit" className="btn" disabled={busy}><Save size={17} aria-hidden="true" /> Salvar alterações</button>
      </form>
      {message && <p className="atlas-auth-message" role="status">{message}</p>}
    </div>

    <Dialog.Root open={Boolean(crop)} onOpenChange={(open) => { if (!open && !busy) setCrop(null) }}>
      <Dialog.Portal>
        <Dialog.Overlay className="atlas-v31-photo-overlay" />
        <Dialog.Content className="atlas-v31-photo-dialog" onEscapeKeyDown={(event) => { if (busy) event.preventDefault() }} onPointerDownOutside={(event) => { if (busy) event.preventDefault() }}>
          <div className="atlas-v31-photo-heading">
            <div><Dialog.Title>Enquadrar foto de perfil</Dialog.Title><Dialog.Description>Arraste a imagem ou use os controles para ajustar o recorte circular.</Dialog.Description></div>
            <Dialog.Close type="button" className="atlas-v31-photo-close" aria-label="Fechar" disabled={busy}><X size={20} /></Dialog.Close>
          </div>
          {crop && <>
            <div className="atlas-v31-photo-stage" role="img" aria-label="Prévia da foto recortada"
              onPointerDown={dragStart} onPointerMove={dragMove} onPointerUp={() => { dragRef.current = null }} onPointerCancel={() => { dragRef.current = null }}>
              <img src={crop.url} alt="" draggable={false} style={{width: drawnWidth, height: drawnHeight, left: (VIEW - drawnWidth) / 2 + cropX * overflowX, top: (VIEW - drawnHeight) / 2 + cropY * overflowY}} />
              <div className="atlas-v31-photo-circle" aria-hidden="true" />
            </div>
            <div className="atlas-v31-photo-sliders">
              <label htmlFor="atlas-photo-zoom">Ampliação <strong>{Math.round(zoom * 100)}%</strong></label>
              <input id="atlas-photo-zoom" type="range" min={1} max={3} step={0.05} value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
              <label htmlFor="atlas-photo-x">Posição horizontal</label>
              <input id="atlas-photo-x" type="range" min={-1} max={1} step={0.02} value={cropX} disabled={overflowX < 1} onChange={(event) => setCropX(Number(event.target.value))} />
              <label htmlFor="atlas-photo-y">Posição vertical</label>
              <input id="atlas-photo-y" type="range" min={-1} max={1} step={0.02} value={cropY} disabled={overflowY < 1} onChange={(event) => setCropY(Number(event.target.value))} />
              <button type="button" className="atlas-v31-photo-reset" disabled={busy} onClick={() => { setZoom(1); setCropX(0); setCropY(0) }}><RotateCcw size={15} aria-hidden="true" /> Centralizar foto</button>
            </div>
          </>}
          <div className="atlas-v31-photo-dialog-actions">
            <button type="button" className="btn-secondary" disabled={busy} onClick={() => setCrop(null)}>Cancelar</button>
            <button type="button" className="btn" disabled={!crop || busy} onClick={() => void saveCroppedPhoto()}>
              {busy ? <LoaderCircle size={17} className="atlas-spin" aria-hidden="true" /> : <Check size={17} aria-hidden="true" />} Salvar foto
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
}
