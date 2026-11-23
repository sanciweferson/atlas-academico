"use client"

/** Mostra um alerta do sistema quando o navegador autoriza.
 * NÃO envia Web Push e NÃO agenda execução quando todas as abas estão fechadas.
 */
export async function showAtlasSystemNotification(title: string, body: string, tag: string, url: string): Promise<boolean> {
  if (typeof window === "undefined" || !window.isSecureContext || !("Notification" in window) || Notification.permission !== "granted") return false
  const safeUrl = url.startsWith("/") && !url.startsWith("//") ? url : "/agenda"

  if ("serviceWorker" in navigator) {
    try {
      // Escopo isolado para não interferir no futuro service worker da plataforma.
      const worker = await navigator.serviceWorker.register("/atlas-reminders-sw.js", { scope: "/atlas-reminders/" })
      await worker.showNotification(title, { body, tag, icon: "/icon.svg", data: { url: safeUrl } })
      return true
    } catch { /* tenta o aviso simples em navegadores desktop */ }
  }

  try {
    const notification = new Notification(title, { body, tag, icon: "/icon.svg" })
    notification.onclick = () => { window.focus(); window.location.assign(safeUrl) }
    return true
  } catch { return false }
}
