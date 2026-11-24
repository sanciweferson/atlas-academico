import type { Metadata } from "next"
import AtlasLegalContent from "@/components/atlas-legal-content"
export const metadata: Metadata = { title: "Privacidade | Atlas Acadêmico" }
export default function PrivacidadePage() { return <AtlasLegalContent kind="privacidade" /> }
