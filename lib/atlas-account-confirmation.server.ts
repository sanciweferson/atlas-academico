// ATLAS V3.1 — Pacote 21C.2: base criptografica, NAO conectada a nenhuma rota.
// Somente servidor. Nao importar em componentes client-side.
// NAO e um mecanismo de confirmacao completo: exige persistencia atomica,
// rate limit, tentativa maxima, envio de email, validacao de sessao e bloqueio RLS.
import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto"

export const ATLAS_CONFIRMATION_TTL_MS = 10 * 60 * 1000

export type AtlasConfirmationChallenge = {
  userId: string
  requestId: string
  nonce: string
  digest: string
  expiresAt: number
}

function requireSecret(secret: string): void {
  // O futuro segredo deve ser aleatorio, exclusivamente do servidor, >= 32 bytes.
  if (Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("Segredo de confirmacao nao configurado com seguranca")
  }
}

function digestCode(
  secret: string,
  userId: string,
  requestId: string,
  nonce: string,
  code: string,
): string {
  // O comprimento dos campos impede ambiguidade de concatenacao.
  const payload = JSON.stringify(["atlas-account-delete-v1", userId, requestId, nonce, code])
  return createHmac("sha256", secret).update(payload).digest("hex")
}

export function createAtlasConfirmationChallenge(
  userId: string,
  requestId: string,
  secret: string,
  now = Date.now(),
): { code: string; challenge: AtlasConfirmationChallenge } {
  requireSecret(secret)
  if (!userId || !requestId || !Number.isFinite(now)) {
    throw new Error("Identidade, solicitacao ou horario invalidos")
  }
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0")
  const nonce = randomBytes(24).toString("hex")
  return {
    code, // Entregar apenas ao provedor de e-mail; jamais registrar em logs.
    challenge: {
      userId,
      requestId,
      nonce,
      digest: digestCode(secret, userId, requestId, nonce, code),
      expiresAt: now + ATLAS_CONFIRMATION_TTL_MS,
    },
  }
}

export function verifyAtlasConfirmationCode(
  challenge: AtlasConfirmationChallenge,
  userId: string,
  requestId: string,
  candidate: string,
  secret: string,
  now = Date.now(),
): boolean {
  requireSecret(secret)
  if (!Number.isFinite(now) || now >= challenge.expiresAt ||
      challenge.userId !== userId || challenge.requestId !== requestId ||
      !/^\d{6}$/.test(candidate) || !/^[a-f0-9]{64}$/.test(challenge.digest)) {
    return false
  }
  const expected = Buffer.from(challenge.digest, "hex")
  const actual = Buffer.from(digestCode(secret, userId, requestId, challenge.nonce, candidate), "hex")
  return timingSafeEqual(expected, actual)
}
