// ATLAS V3.1 — PACOTE 21B: infraestrutura de identidade no servidor.
// Ainda não autoriza exclusão, suspensão ou reativação de contas.
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getAtlasVerifiedUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error("Supabase não configurado no servidor.")

  const cookieStore = await cookies()
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        // Uso exclusivo em contextos que permitem escrever cookies (Route Handlers).
        // Falhas de persistência precisam chegar ao chamador: não prosseguir silenciosamente.
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })

  // getUser consulta o Auth server: não confia em dados não verificados de getSession().
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return { id: data.user.id, email: data.user.email ?? null }
}
