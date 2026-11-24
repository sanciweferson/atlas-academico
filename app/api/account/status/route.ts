// ATLAS V3.1 — PACOTE 21C.1: diagnostico de sessao, sem operacoes destrutivas.
import { NextResponse } from "next/server"
import { getAtlasVerifiedUser } from "@/lib/atlas-account-auth-server"

export const dynamic = "force-dynamic"

export async function GET() {
  const headers = {
    "Cache-Control": "no-store, private",
    "Vary": "Cookie",
  }

  try {
    const user = await getAtlasVerifiedUser()
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401, headers })
    }
    // Nunca retorna email, UUID ou tokens: basta verificar se ha sessao valida.
    return NextResponse.json({ authenticated: true }, { status: 200, headers })
  } catch {
    // Falha de configuracao/sessao nao libera acesso.
    return NextResponse.json(
      { authenticated: false, error: "Falha ao verificar a sessao." },
      { status: 503, headers },
    )
  }
}
