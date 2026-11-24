import type { Metadata } from "next"
import AtlasLegalContent from "@/components/atlas-legal-content"
export const metadata: Metadata = { title: "Cookies | Atlas Acadêmico" }
export default function CookiesPage() { return <AtlasLegalContent kind="cookies" /> }
