"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import {
  Moon,
  Sun,
  GraduationCap,
  Menu,
  X,
  Home,
  BookOpen,
  NotebookPen,
  LayoutDashboard,
  LogIn,
  UserRound,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { browserSupabase } from "@/lib/supabase"
const STORAGE_KEY = "atlas-sidebar-open"

const links = [
  { href: "/", label: "Início", icon: Home },
  { href: "/catalogo", label: "Disciplinas", icon: BookOpen },
  { href: "/estudo", label: "Meu estudo", icon: NotebookPen },
  { href: "/painel", label: "Painel", icon: LayoutDashboard },
  { href: "/login", label: "Entrar", icon: LogIn },
  { href: "/perfil", label: "Meu perfil", icon: UserRound },
]

export default function Nav() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [authStatus, setAuthStatus] = useState<
    "loading" | "authenticated" | "anonymous"
  >("loading")
  const pathname = usePathname()
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)

  // Restaura o estado da aba antes de começar a gravar mudanças.
  useEffect(() => {
    try {
      setOpen(sessionStorage.getItem(STORAGE_KEY) === "true")
    } catch {
      // O menu ainda funciona se o armazenamento estiver indisponível.
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      sessionStorage.setItem(STORAGE_KEY, String(open))
    } catch {
      // Falhas no armazenamento não impedem abrir/fechar o menu.
    }
  }, [mounted, open])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    openButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
        openButtonRef.current?.focus()
        return
      }

      if (event.key !== "Tab") return
      const focusable = Array.from(
        sidebarRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ) ?? [],
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    const supabase = browserSupabase()

    if (!supabase) {
      setAuthStatus("anonymous")
      return
    }

    let active = true

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return

      setAuthStatus(session?.user ? "authenticated" : "anonymous")
    })

    void supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!active) return

        setAuthStatus(!error && data.user ? "authenticated" : "anonymous")
      })
      .catch(() => {
        if (active) setAuthStatus("anonymous")
      })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const visibleLinks = links.filter(({ href }) => {
    if (href === "/login") {
      return authStatus === "anonymous"
    }

    if (href === "/perfil") {
      return authStatus === "authenticated"
    }

    return true
  })
  const closeMenu = () => setOpen(false)
  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark")

  return (
    <>
      <header
        className={`site-header atlas-header ${open ? "atlas-header-menu-open" : ""}`}
      >
        <nav className="shell nav-inner atlas-nav-inner">
          <Link href="/" className="brand atlas-brand" onClick={closeMenu}>
            <span className="brand-icon">
              <GraduationCap size={22} />
            </span>
            <span>
              Atlas <span className="brand-accent">Acadêmico</span>
              <small>LABORATÓRIO DE APRENDIZAGEM</small>
            </span>
          </Link>

          <div className="desktop-links">
            {visibleLinks.slice(1).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={"nav-link " + (pathname === href ? "active" : "")}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="atlas-nav-actions">
            <button
              type="button"
              className="icon-button desktop-theme-button"
              aria-label="Alternar tema"
              title="Alternar tema"
              onClick={toggleTheme}
            >
              {mounted && resolvedTheme === "dark" ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>
            <button
              ref={openButtonRef}
              type="button"
              className={`icon-button mobile-menu atlas-menu-toggle ${open ? "is-open" : ""}`}
              aria-label={open ? "Fechar menu lateral" : "Abrir menu lateral"}
              aria-expanded={open}
              aria-controls="atlas-sidebar"
              onClick={() => setOpen((previous) => !previous)}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div className="atlas-sidebar-layer">
          <button
            type="button"
            className="atlas-sidebar-backdrop"
            aria-label="Fechar menu lateral"
            tabIndex={-1}
            onClick={closeMenu}
          />
          <aside
            ref={sidebarRef}
            id="atlas-sidebar"
            className="atlas-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
          >
            <div className="atlas-sidebar-header">
              <h2>Menu</h2>
              <div className="atlas-sidebar-actions">
                <button
                  type="button"
                  className="atlas-sidebar-icon-button"
                  aria-label="Alternar tema"
                  title="Alternar tema"
                  onClick={toggleTheme}
                >
                  {mounted && resolvedTheme === "dark" ? (
                    <Sun size={23} />
                  ) : (
                    <Moon size={23} />
                  )}
                </button>
              </div>
            </div>
            <div className="atlas-sidebar-scroll">
              <div className="atlas-sidebar-links">
                {visibleLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={
                      "atlas-sidebar-link " +
                      (pathname === href ? "is-active" : "")
                    }
                    onClick={closeMenu}
                  >
                    <Icon size={23} strokeWidth={1.8} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
