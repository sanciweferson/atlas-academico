import type { LucideIcon } from "lucide-react"
import {
  Activity, BookOpen, Bot, Boxes, Brain, BrainCircuit, Braces,
  Calculator, ChartNoAxesCombined, ClipboardCheck, Cloud, Code2, Cpu,
  Database, Dices, FlaskConical, Gauge, GitBranch, Globe,
  KeyRound, Layers3, ListTree, LockKeyhole, MessageSquare,
  Network, Palette, Puzzle, Repeat2, Rocket, Search, Server,
  Shield, ShieldCheck, Sigma, SlidersHorizontal,
  Terminal, Users, Workflow,
} from "lucide-react"

// Distintivos SVG locais, sem dependências externas ou chamadas de rede.
// Marcas comerciais pertencem a seus titulares; não implicam afiliação.
type Brand = "react" | "native" | "javascript" | "typescript" | "next" |
  "node" | "git" | "docker" | "python" | "html" | "css" | "expo" | "mongodb" | "supabase"

const brands: Record<string, Brand> = {
  C10: "python",
  M02: "html", M03: "css", M04: "javascript", M06: "javascript",
  M07: "javascript", M08: "javascript", M14: "git",
  M17: "typescript", M18: "react", M20: "next", M21: "node",
  M28: "docker", M48: "python", M65: "native",
}

const topicIcons: Record<string, LucideIcon> = {
  C00: BrainCircuit, C01: Sigma, C02: Cpu, C03: ClipboardCheck,
  C04: Users, C05: Braces, C06: FlaskConical, C07: Workflow,
  C08: Boxes, C09: Activity, C11: Database, C12: ChartNoAxesCombined,
  C13: Bot, C14: ShieldCheck, C15: Globe, C16: Palette,
  M01: Globe, M05: Boxes, M09: Globe, M10: ListTree,
  M11: BrainCircuit, M12: Layers3, M13: Terminal, M15: Workflow,
  M16: ClipboardCheck, M19: Repeat2, M22: Server, M23: Database,
  M24: Globe, M25: KeyRound, M26: LockKeyhole, M27: Terminal,
  M29: GitBranch, M30: Cloud, M31: Boxes, M32: Code2,
  M33: Network, M34: MessageSquare, M35: ShieldCheck, M36: Repeat2,
  M37: Activity, M38: Gauge, M39: Workflow, M40: Sigma,
  M41: Calculator, M42: Dices, M43: SlidersHorizontal, M44: Brain,
  M45: Network, M46: Gauge, M47: Layers3, M49: BrainCircuit,
  M50: Cpu, M51: Rocket, M52: Code2, M53: Bot,
  M54: Database, M55: Search, M56: Bot, M57: ClipboardCheck,
  M58: Shield, M59: Workflow, M60: Cloud, M61: Network,
  M62: ShieldCheck, M63: ChartNoAxesCombined, M64: Puzzle,
}

// Cores neutras/da marca aplicadas em CSS, com contraste próprio em claro/escuro.
const vectorPaths: Partial<Record<Brand, string>> = {
  next: "M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z",
  git: "M13.09 23.549a1.54 1.54 0 0 1-2.18 0L.451 13.089a1.54 1.54 0 0 1 0-2.179l7.191-7.19 2.733 2.733a1.85 1.85 0 0 0 .964 2.326v6.66a1.849 1.849 0 1 0 1.54 0V8.957l2.508 2.508a1.85 1.85 0 1 0 1.09-1.09l-2.634-2.634a1.85 1.85 0 0 0-2.378-2.377L8.73 2.63 10.91.451a1.54 1.54 0 0 1 2.179 0l10.459 10.46a1.54 1.54 0 0 1 0 2.179z",
  expo: "M0 20.084c.043.53.23 1.063.718 1.778.58.849 1.576 1.315 2.303.567.49-.505 5.794-9.776 8.35-13.29a.761.761 0 011.248 0c2.556 3.514 7.86 12.785 8.35 13.29.727.748 1.723.282 2.303-.567.57-.835.728-1.42.728-2.046 0-.426-8.26-15.798-9.092-17.078-.8-1.23-1.044-1.498-2.397-1.542h-1.032c-1.353.044-1.597.311-2.398 1.542C8.267 3.991.33 18.758 0 19.77Z",
  mongodb: "M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z",
  supabase: "M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z",
  html: "M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z",
  python: "M11.858 0c-.978.005-1.913.088-2.736.234C6.7.662 6.26 1.558 6.26 3.21v2.182h5.725v.727H4.111c-1.664 0-3.121 1-3.577 2.903-.526 2.181-.549 3.542 0 5.82.407 1.694 1.379 2.902 3.043 2.902h1.969v-2.616c0-1.89 1.635-3.557 3.576-3.557h5.72c1.591 0 2.862-1.31 2.862-2.91v-5.45c0-1.553-1.309-2.718-2.863-2.977A18 18 0 0 0 11.858 0M8.762 1.755c.591 0 1.074.491 1.074 1.095 0 .601-.483 1.087-1.074 1.087A1.08 1.08 0 0 1 7.688 2.85c0-.604.48-1.095 1.074-1.095m9.656 4.364v2.543c0 1.971-1.671 3.63-3.577 3.63H9.122c-1.566 0-2.862 1.34-2.862 2.91v5.452c0 1.551 1.349 2.464 2.862 2.91 1.813.532 3.55.628 5.72 0 1.44-.418 2.862-1.258 2.862-2.91V18.47h-5.719v-.727h8.582c1.664 0 2.284-1.16 2.862-2.903.598-1.793.573-3.518 0-5.819-.41-1.656-1.196-2.903-2.862-2.903zm-3.216 13.807a1.08 1.08 0 0 1 1.074 1.088c0 .604-.48 1.094-1.074 1.094-.592 0-1.075-.49-1.075-1.094 0-.601.483-1.088 1.075-1.088",
}

function AtomSymbol({ native = false }: { native?: boolean }) {
  return <svg viewBox="0 0 64 64" focusable="false" aria-hidden="true" fill="none">
    <g stroke="currentColor" strokeWidth="2.5">
      <ellipse cx="31" cy="31" rx="25" ry="10" />
      <ellipse cx="31" cy="31" rx="25" ry="10" transform="rotate(60 31 31)" />
      <ellipse cx="31" cy="31" rx="25" ry="10" transform="rotate(120 31 31)" />
    </g>
    <circle cx="31" cy="31" r="4.4" fill="currentColor" />
    {native && <><rect x="43" y="39" width="14" height="22" rx="3" stroke="currentColor" strokeWidth="2.5" fill="#10223d"/><circle cx="50" cy="56.5" r="1" fill="currentColor" /></>}
  </svg>
}

function BrandSymbol({ brand }: { brand: Brand }) {
  if (brand === "react" || brand === "native") return <AtomSymbol native={brand === "native"}/>
  if (brand === "javascript") return <strong className="atlas-v31-discipline-wordmark">JS</strong>
  if (brand === "typescript") return <strong className="atlas-v31-discipline-wordmark">TS</strong>
  if (brand === "css") return <strong className="atlas-v31-discipline-wordmark atlas-v31-discipline-wordmark-css">CSS</strong>
  if (brand === "node") return <strong className="atlas-v31-discipline-wordmark atlas-v31-discipline-wordmark-node">node</strong>
  if (brand === "docker") return <strong className="atlas-v31-discipline-wordmark atlas-v31-discipline-wordmark-docker">🐳</strong>
  const path = vectorPaths[brand]
  return path ? <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" fill="currentColor"><path d={path}/></svg> : <BookOpen size={26} />
}

export default function AtlasDisciplineIcon({ code }: { code: string }) {
  const brand = brands[code]
  const Icon = topicIcons[code] ?? BookOpen
  return <span className="atlas-v31-discipline-icon" data-brand={brand ?? "topic"} aria-hidden="true">
    {brand ? <BrandSymbol brand={brand} /> : <Icon size={25} strokeWidth={1.8} />}
  </span>
}
