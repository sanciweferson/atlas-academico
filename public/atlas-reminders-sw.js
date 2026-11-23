/* Worker restrito a avisos locais; não faz cache nem intercepta requisições. */
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const maybeUrl = event.notification.data && event.notification.data.url
  const url = typeof maybeUrl === "string" && maybeUrl.startsWith("/") && !maybeUrl.startsWith("//") ? maybeUrl : "/agenda"
  const target = new URL(url, self.location.origin).href
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true })
    for (const client of windows) {
      if (new URL(client.url).origin === self.location.origin && "focus" in client) {
        await client.focus()
        if ("navigate" in client) await client.navigate(target)
        return
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(target)
  })())
})
