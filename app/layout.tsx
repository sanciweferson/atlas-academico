import type { Metadata } from "next"
import Providers from "@/components/providers"
import Nav from "@/components/nav"
import AtlasNotificationWatcher from "@/components/atlas-notification-watcher"
import AtlasScrollProgress from "@/components/atlas-scroll-progress"
import AtlasFooter from "@/components/atlas-footer"
import AtlasReadingPreferences from "@/components/atlas-reading-preferences"
import "./globals.css"

export const metadata: Metadata = {
  title: "Atlas Acadêmico | Seu campus digital",
  description: "Currículo e aulas de Ciência da Computação, Engenharia de Software e Inteligência Artificial",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>
          <AtlasReadingPreferences />
          <Nav />
          <AtlasNotificationWatcher />
          <AtlasScrollProgress />
          <div className="atlas-v3-page-area">
            <main id="conteudo-principal" className="shell atlas-v3-main">{children}</main>
            <AtlasFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}
