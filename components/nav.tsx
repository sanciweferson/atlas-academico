"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import {
  BarChart3,
  Bell, BookOpen,
  Bookmark,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogIn,
  Menu,
  Moon,
  NotebookPen,
  Search,
  LogOut, Settings,
  Sun,
  UserRound,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { browserSupabase } from "@/lib/supabase"

const COLLAPSED_KEY = "atlas-v3-desktop-collapsed"
const MOBILE_OPEN_KEY = "atlas-v3-mobile-open"
type NavItem = { href?: string; label: string; icon: LucideIcon }
type NavSection = { title: string; items: NavItem[] }

const navSections: NavSection[] = [
  {
    title: "PRINCIPAL",
    items: [
      { href: "/", label: "Início", icon: Home },
      { href: "/catalogo", label: "Disciplinas", icon: BookOpen },
      { href: "/estudo", label: "Meus estudos", icon: NotebookPen },
    ],
  },
  {
    title: "APRENDIZAGEM",
    items: [
      { href: "/exercicios", label: "Exercícios", icon: ClipboardList },
      { href: "/progresso", label: "Progresso", icon: BarChart3 },
      { href: "/agenda", label: "Agenda de estudos", icon: CalendarDays },
      { href: "/favoritos", label: "Favoritos", icon: Bookmark },
      { href: "/notificacoes", label: "Notificações", icon: Bell },
    ],
  },
  {
    title: "CONTA E SISTEMA",
    items: [
      { href: "/painel", label: "Painel", icon: LayoutDashboard },
      { href: "/perfil", label: "Meu perfil", icon: UserRound },
      { href: "/login", label: "Entrar", icon: LogIn },
      { href: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
]
export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const [logoutBusy, setLogoutBusy] = useState(false)
  const [logoutError, setLogoutError] = useState("")
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "anonymous">("loading")
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobilePanelRef = useRef<HTMLElement>(null)
  const previousPathRef = useRef(pathname)


useEffect(() => {
  try {
    setCollapsed(localStorage.getItem(COLLAPSED_KEY) === "true")
  } catch {
    /* armazenamento opcional */
  }

  try {
    setMobileOpen(sessionStorage.getItem(MOBILE_OPEN_KEY) === "true")
  } catch {
    /* armazenamento opcional */
  }

  setMounted(true)
}, [])

useEffect(() => {
  if (!mounted) return

  try {
    sessionStorage.setItem(MOBILE_OPEN_KEY, String(mobileOpen))
  } catch {
    /* armazenamento opcional */
  }
}, [mobileOpen, mounted])


  useEffect(() => {
    if (!mounted) return
    try { localStorage.setItem(COLLAPSED_KEY, String(collapsed)) } catch { /* storage opcional */ }
    document.documentElement.classList.toggle("atlas-v3-collapsed", collapsed)
    return () => document.documentElement.classList.remove("atlas-v3-collapsed")
  }, [collapsed, mounted])

  useEffect(() => {
    if (previousPathRef.current !== pathname) {
      previousPathRef.current = pathname
      setMobileOpen(false)
    }
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const first = mobilePanelRef.current?.querySelector<HTMLElement>("button, a[href]")
    first?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setMobileOpen(false)
        menuButtonRef.current?.focus()
      }
      if (event.key !== "Tab") return
      const focusables = Array.from(mobilePanelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [])
      if (!focusables.length) return
      const firstFocusable = focusables[0]
      const lastFocusable = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === firstFocusable) { event.preventDefault(); lastFocusable.focus() }
      if (!event.shiftKey && document.activeElement === lastFocusable) { event.preventDefault(); firstFocusable.focus() }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown) }
  }, [mobileOpen])

  useEffect(() => {
    const supabase = browserSupabase()
    if (!supabase) { setAuthStatus("anonymous"); return }
    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setAuthStatus(session?.user ? "authenticated" : "anonymous")
    })
    void supabase.auth.getUser().then(({ data, error }) => {
      if (active) setAuthStatus(!error && data.user ? "authenticated" : "anonymous")
    }).catch(() => { if (active) setAuthStatus("anonymous") })
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark")
  const themeLabel = mounted && resolvedTheme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"

  async function signOutFromSidebar() {
    const supabase = browserSupabase()
    if (!supabase || logoutBusy) return
    if (!window.confirm("Deseja sair da sua conta do Atlas Acadêmico?")) return
    setLogoutBusy(true)
    setLogoutError("")
    try {
      const { error } = await supabase.auth.signOut()
      if (error) { setLogoutError("Não foi possível sair. Tente novamente."); return }
      setAuthStatus("anonymous")
      setMobileOpen(false)
      router.push("/")
      router.refresh()
    } catch {
      setLogoutError("Não foi possível sair. Verifique sua conexão.")
    } finally {
      setLogoutBusy(false)
    }
  }

  const renderLinks = (closeOnNavigate: boolean) => navSections.map(({ title, items }) => {
    const visibleItems = items.filter(({ href }) =>
      href === "/login" ? authStatus === "anonymous" :
      href === "/perfil" ? authStatus === "authenticated" : true
    )
    if (!visibleItems.length) return null

    return (
      <div className="atlas-v3-nav-section" key={title}>
        <span className="atlas-v3-nav-section-title">{title}</span>
        {visibleItems.map(({ href, label, icon: Icon }) =>
          href ? (
            <Link
              key={href}
              href={href}
              title={label}
              aria-current={isActive(href) ? "page" : undefined}
              className={`atlas-v3-link${isActive(href) ? " is-active" : ""}`}
              onClick={closeOnNavigate ? () => setMobileOpen(false) : undefined}
            >
              <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
              <span className="atlas-v3-link-label">{label}</span>
            </Link>
          ) : (
            <span key={label} className="atlas-v3-link atlas-v3-link-disabled" aria-disabled="true" title={`${label} — em breve`}>
              <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
              <span className="atlas-v3-link-label">{label}<small className="atlas-v3-link-soon">Em breve</small></span>
            </span>
          )
        )}
        {title === "CONTA E SISTEMA" && authStatus === "authenticated" && (
          <>
            <button type="button" className="atlas-v3-link atlas-v3-logout"
              title="Sair da conta" aria-label="Sair da conta" disabled={logoutBusy}
              onClick={() => void signOutFromSidebar()}>
              <LogOut size={20} strokeWidth={1.9} aria-hidden="true" />
              <span className="atlas-v3-link-label">{logoutBusy ? "Saindo..." : "Sair da conta"}</span>
            </button>
            {logoutError && <p role="alert" className="atlas-v3-logout-error">{logoutError}</p>}
          </>
        )}
      </div>
    )
  })

  return (
    <>
      <header className="atlas-v3-header">
        <div className="atlas-v3-header-inner">
          <Link href="/" className="atlas-v3-brand">
            <span className="atlas-v3-logo">
              <GraduationCap size={22} aria-hidden="true" />
            </span>
            <span>
              Atlas <strong>Acadêmico</strong>
              <small>SEU CAMPUS DIGITAL</small>
            </span>
          </Link>
          <div className="atlas-v3-header-actions">
            <Link
              href="/catalogo"
              className="atlas-v3-icon atlas-v3-desktop-action"
              aria-label="Pesquisar disciplinas"
              title="Pesquisar disciplinas"
            >
              <Search size={20} aria-hidden="true" />
            </Link>

            <Link
              href={authStatus === "authenticated" ? "/perfil" : "/login"}
              className="atlas-v3-icon atlas-v3-desktop-action"
              aria-label={
                authStatus === "authenticated" ? "Meu perfil" : "Entrar"
              }
              title={authStatus === "authenticated" ? "Meu perfil" : "Entrar"}
            >
              <UserRound size={20} aria-hidden="true" />
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              className="atlas-v3-icon atlas-v3-mobile-trigger"
              aria-label="Abrir menu"
              aria-expanded={mobileOpen}
              aria-controls="atlas-v3-mobile-panel"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={23} />
            </button>
          </div>
        </div>
      </header>

      <aside
        className="atlas-v3-desktop-sidebar"
        aria-label="Navegação principal"
      >
        <div className="atlas-v3-sidebar-top">
          <span className="atlas-v3-sidebar-heading">NAVEGAÇÃO</span>
          <button
            type="button"
            className="atlas-v3-icon atlas-v3-collapse-button"
            aria-label={
              collapsed ? "Expandir menu lateral" : "Recolher menu lateral"
            }
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? <ChevronRight size={19} /> : <ChevronLeft size={19} />}
          </button>
        </div>
        <nav className="atlas-v3-sidebar-links" aria-label="Páginas do Atlas">
          {renderLinks(false)}
        </nav>
        <div className="atlas-v3-sidebar-bottom">
          <span className="atlas-v3-sidebar-bottom-text">Atlas Acadêmico</span>
          <span className="atlas-v3-status-dot" />
        </div>
      </aside>

      {mobileOpen && (
        <div className="atlas-v3-mobile-layer">
          <button
            className="atlas-v3-mobile-backdrop"
            type="button"
            aria-label="Fechar menu"
            tabIndex={-1}
            onClick={() => {
              setMobileOpen(false)
              menuButtonRef.current?.focus()
            }}
          />
          <aside
            ref={mobilePanelRef}
            id="atlas-v3-mobile-panel"
            className="atlas-v3-mobile-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
          >
            <div className="atlas-v3-mobile-heading">
              <span className="atlas-v3-mobile-title">Menu do Atlas</span>
              <button
                type="button"
                className="atlas-v3-icon"
                aria-label="Fechar menu"
                onClick={() => {
                  setMobileOpen(false)
                  menuButtonRef.current?.focus()
                }}
              >
                <X size={22} />
              </button>
            </div>

            <nav
              className="atlas-v3-sidebar-links"
              aria-label="Páginas do Atlas"
            >
              {renderLinks(true)}
            </nav>

            <div className="atlas-v3-mobile-footer">
              <span>Estude no seu ritmo.</span>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
