"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, BellRing, CheckCircle2, RefreshCw, ShieldCheck, ShieldAlert } from "lucide-react"
import { findAtlasLesson } from "@/lib/atlas-study-index"
import { useAtlasLocalStudy } from "@/lib/atlas-local-study"
import { showAtlasSystemNotification } from "@/lib/atlas-device-notifications"

type PermissionState = NotificationPermission | "unsupported" | "checking"

export default function NotificacoesPage() {
  const { sessions, ready, setSessionComplete } = useAtlasLocalStudy()
  const [now, setNow] = useState(0)
  const [permission, setPermission] = useState<PermissionState>("checking")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setNow(Date.now())
    setPermission(window.isSecureContext && "Notification" in window ? Notification.permission : "unsupported")
  }, [])

  async function enable() {
    if (permission === "unsupported") return
    setBusy(true)
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      setMessage(result === "granted" ? "Permissão concedida. Agora você pode testar um aviso." : result === "denied" ? "O navegador bloqueou os avisos. Altere a permissão nas configurações do site, se desejar." : "A permissão não foi concedida.")
    } catch {
      setMessage("Este navegador não conseguiu solicitar permissão de notificações.")
    } finally { setBusy(false) }
  }

  async function test() {
    if (permission !== "granted") return
    setBusy(true)
    try {
      const shown = await showAtlasSystemNotification("Teste do Atlas Acadêmico", "Se esta mensagem apareceu, seu navegador conseguiu mostrar um aviso do Atlas.", "atlas-v3-test-notification", "/notificacoes")
      setMessage(shown ? "Teste enviado ao navegador. Veja as notificações do sistema." : "Não foi possível exibir o aviso neste navegador. Verifique as permissões e a compatibilidade do dispositivo.")
    } catch { setMessage("Não foi possível realizar o teste neste dispositivo.") }
    finally { setBusy(false) }
  }

  const due = sessions.filter((item) => !item.complete && new Date(item.startsAt).getTime() <= now).sort((a,b) => b.startsAt.localeCompare(a.startsAt))
  const upcoming = sessions.filter((item) => !item.complete && new Date(item.startsAt).getTime() > now && new Date(item.startsAt).getTime() <= now + 24 * 3600 * 1000).sort((a,b) => a.startsAt.localeCompare(b.startsAt))

  return (
    <div className="atlas-v3-study-page">
      <header><span className="eyebrow">SEUS AVISOS</span><h1 className="page-title">Notificações</h1>
        <p className="muted mt-2">Acompanhe os horários de estudo e, nos navegadores compatíveis, permita alertas do sistema enquanto o Atlas estiver aberto.</p></header>

      <section className="panel atlas-v3-notification-permission" aria-labelledby="atlas-notification-permission-title">
        <div className="atlas-v3-notification-permission-head">
          <span className="atlas-v3-notification-icon"><BellRing size={24} aria-hidden="true" /></span>
          <div><h2 id="atlas-notification-permission-title">Avisos no dispositivo</h2>
            <p className="muted text-sm">Permita as notificações e faça um teste antes de agendar uma aula.</p></div>
        </div>
        <p className="atlas-v3-notification-status" role="status">
          {permission === "granted" ? <><CheckCircle2 size={17} aria-hidden="true" /> Permissão ativa</> : permission === "denied" ? <><ShieldAlert size={17} aria-hidden="true" /> Bloqueada pelo navegador</> : permission === "unsupported" ? <><ShieldAlert size={17} aria-hidden="true" /> Indisponível neste ambiente</> : <><ShieldCheck size={17} aria-hidden="true" /> {permission === "default" ? "Aguardando sua permissão" : "Verificando compatibilidade..."}</>}
        </p>
        <div className="atlas-v3-notification-actions">
          <button type="button" className="btn" disabled={busy || permission === "unsupported" || permission === "granted" || permission === "denied" || permission === "checking"} onClick={() => void enable()}>Permitir notificações</button>
          <button type="button" className="btn-secondary" disabled={busy || permission !== "granted"} onClick={() => void test()}>Testar notificação agora</button>
          <Link href="/agenda" className="text-link">Abrir agenda</Link>
        </div>
        {message && <p className="muted text-sm" role="status">{message}</p>}
        <p className="muted text-sm">Os lembretes automáticos desta versão exigem que o Atlas continue aberto em pelo menos uma aba. Navegadores podem atrasar temporizadores. Com o site fechado, ainda não há envio push. No celular, a compatibilidade depende do navegador e do sistema.</p>
      </section>

      <div className="atlas-v3-study-section-heading"><h2><Bell size={20} aria-hidden="true" /> Central de avisos</h2>
        <button className="btn-secondary" type="button" onClick={() => setNow(Date.now())}><RefreshCw size={16} aria-hidden="true" /> Atualizar</button></div>
      {!ready ? <p role="status">Carregando avisos...</p> : due.length + upcoming.length === 0 ? (
        <div className="panel atlas-v3-study-empty"><Bell size={26} aria-hidden="true" /><h2>Nenhum aviso pendente</h2><p>Agende uma sessão para começar.</p><Link href="/agenda" className="btn">Abrir agenda</Link></div>
      ) : <div className="atlas-v3-study-cards">{[...due, ...upcoming].map((session) => {
        const overdue = new Date(session.startsAt).getTime() <= now
        return <article className="panel atlas-v3-study-card" key={session.id}>
          <span className="eyebrow">{overdue ? "HORÁRIO ATINGIDO" : "PRÓXIMAS 24 HORAS"}</span>
          <h2>{findAtlasLesson(session.lessonId)?.title ?? session.lessonId}</h2>
          <p className="muted text-sm">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(session.startsAt))}</p>
          <div className="atlas-v3-study-actions"><Link href={`/aula/${encodeURIComponent(session.lessonId)}`} className="btn-secondary">Ir para a aula</Link>
            <button className="btn-secondary" type="button" onClick={() => setSessionComplete(session.id, true)}>Marcar como concluída</button></div>
        </article>
      })}</div>}
    </div>
  )
}
