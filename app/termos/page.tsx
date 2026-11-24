import type { Metadata } from "next"
import AtlasLegalContent from "@/components/atlas-legal-content"
export const metadata: Metadata = { title: "Termos de Uso | Atlas Acadêmico" }
export default function TermosPage() { return <AtlasLegalContent kind="termos" /> }
