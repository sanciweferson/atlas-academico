"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type AtlasLanguage = "pt-BR" | "en" | "es"
const KEY = "atlas-v31-interface-language"
const valid = (value: string | null): value is AtlasLanguage => value === "pt-BR" || value === "en" || value === "es"

/* Nesta etapa, traduzimos navegação, rodapé e o núcleo de Configurações.
   As aulas e documentos legais continuam em português e são identificados como tal. */
const dictionary: Record<"en" | "es", Record<string, string>> = {
  en: {
    "Boas-vindas ao Atlas": "Welcome to Atlas",
    "SEU ESPAÇO DE APRENDIZAGEM": "YOUR LEARNING SPACE",
    "Bom dia": "Good morning",
    "Boa tarde": "Good afternoon",
    "Boa noite": "Good evening",
    "Bem-vindo ao Atlas!": "Welcome to Atlas!",
    "Um café com código e uma aula por vez. Que tal continuar?": "A coffee, some code and one lesson at a time. Ready to continue?",
    "Hora de aprender algo novo, no seu ritmo.": "Time to learn something new, at your own pace.",
    "Um pouco de estudo com constância faz diferença.": "A little consistent study makes a difference.",
    "Sua próxima conquista começa com uma aula.": "Your next milestone starts with a lesson.",
    "Relógio local": "Local clock",
    "Horário local": "Local time",
    "Continuar estudando": "Continue studying",
    "Aprender sem pressa, mas com propósito.": "Learn without rushing, but with purpose.",
    "Consistência não é motivação — é decisão.": "Consistency is not motivation — it is a decision.",
    "Todo sênior já ficou travado exatamente onde você está agora.": "Every senior developer has been stuck right where you are now.",
    "Scriptorium: onde o código vira conhecimento.": "Scriptorium: where code becomes knowledge.",
    "Entender o porquê vale mais que memorizar o como.": "Understanding why matters more than memorizing how.",
    "O dev que sabe depurar vale mais que o que nunca erra.": "A developer who can debug is more valuable than one who claims never to err.",
    "O código de ontem te explica o erro de hoje.": "Yesterday's code explains today's bug.",
    "Seu campus digital de tecnologia": "Your digital technology campus",
    "Aprenda os fundamentos.": "Learn the fundamentals.",
    "Construa o futuro.": "Build the future.",
    "Um atlas de Ciência da Computação, Engenharia de Software e IA: teoria, exemplos, exercícios e revisões, no seu ritmo.": "An atlas of Computer Science, Software Engineering and AI: theory, examples, exercises and review, at your own pace.",
    "Explorar disciplinas": "Explore subjects",
    "Organizar meus estudos": "Organize my studies",
    "Acesse as aulas sem configurar o Supabase. O login é opcional nesta etapa.": "Explore lessons without setting up Supabase. Signing in is optional at this stage.",
    "TRILHA DE APRENDIZAGEM": "LEARNING PATH",
    "Pensamento computacional": "Computational thinking",
    "HTML semântico": "Semantic HTML",
    "CSS moderno": "Modern CSS",
    "Unidades curriculares": "Curriculum units",
    "Aulas introdutórias redigidas": "Introductory lessons written",
    "Capítulos ampliados": "Expanded chapters",
    "Comece por aqui": "Start here",
    "Trilhas em destaque": "Featured learning paths",
    "Escolha uma disciplina e expanda os módulos para visualizar cada aula.": "Choose a subject and expand its modules to see each lesson.",
    "Ver catálogo completo": "View full catalog",
    "Explorar disciplina": "Explore subject",
    "Transparência acadêmica": "Academic transparency",
    "Conteúdo real, sem prometer o que ainda não existe.": "Real content, without promising what does not exist yet.",
    "O catálogo preserva 81 unidades. Apenas parte das aulas foi redigida; páginas pendentes são identificadas. O estudo é livre, e as provas não atribuem domínio automático.": "The catalog contains 81 units. Only some lessons are written; unfinished pages are labeled. Study is self-directed, and assessments do not award automatic mastery.",
    "Como estudar": "How to study",
    "Abstração, decomposição, algoritmos e raciocínio.": "Abstraction, decomposition, algorithms and reasoning.",
    "Estrutura, significado e acessibilidade na Web.": "Structure, meaning and accessibility on the Web.",
    "Cascata, tipografia, layouts e responsividade.": "Cascade, typography, layouts and responsiveness.",
    "Linguagem, execução, funções e fundamentos.": "Language, execution, functions and fundamentals.",
    "CSS e interfaces": "CSS and interfaces",
    "Guia da plataforma": "Platform guide", "Perguntas frequentes": "FAQ",
    "Voltar ao início": "Back to home", "MINHA CONTA": "MY ACCOUNT", "Personalize suas informações no Atlas Acadêmico.": "Customize your information in Atlas Acadêmico.",
    "PRINCIPAL": "MAIN", "APRENDIZAGEM": "LEARNING", "CONTA E SISTEMA": "ACCOUNT AND SYSTEM",
    "Início": "Home", "Disciplinas": "Subjects", "Meus estudos": "My studies",
    "Exercícios": "Exercises", "Progresso": "Progress", "Agenda de estudos": "Study planner",
    "Favoritos": "Favorites", "Notificações": "Notifications", "Painel": "Dashboard",
    "Meu perfil": "My profile", "Entrar": "Sign in", "Configurações": "Settings",
    "Sair da conta": "Sign out", "Saindo...": "Signing out...",
    "NAVEGAÇÃO": "NAVIGATION", "Recolher menu lateral": "Collapse sidebar", "Expandir menu lateral": "Expand sidebar",
    "Plataforma": "Platform", "Informações legais": "Legal information", "Redes sociais": "Social media",
    "Termos de Uso": "Terms of Use", "Política de Privacidade": "Privacy Policy",
    "Política de Cookies": "Cookie Policy", "Seu campus digital. Aprenda, pratique e evolua no seu ritmo.": "Your digital campus. Learn, practice and progress at your own pace.",
    "Conteúdo em desenvolvimento. O domínio de cada assunto requer estudo e avaliação individual.": "Content under development. Mastery requires study and individual assessment.",
    "Conheça os perfis e canais do criador do Atlas Acadêmico.": "Discover the Atlas Acadêmico creator's profiles and channels.",
    "Leia nossos documentos sobre uso e privacidade.": "Read our use and privacy documents (available in Portuguese).",
    "Feito para estudar com autonomia.": "Made for independent learning.",
    "Seu ambiente de estudo": "Your learning environment", "Aparência": "Appearance", "Claro": "Light",
    "Escuro": "Dark", "Sistema": "System", "Ambiente iluminado": "Bright theme",
    "Visual de baixo brilho": "Low-brightness theme", "Segue o dispositivo": "Matches your device",
    "Leitura das aulas": "Lesson reading", "Modo foco": "Focus mode",
    "Idioma da interface": "Interface language", "Idioma": "Language", "Português (Brasil)": "Portuguese (Brazil)",
    "Inglês": "English", "Espanhol": "Spanish", "Prévia de leitura": "Reading preview",
    "Tamanho do texto da aula": "Lesson text size", "Espaçamento entre linhas": "Line spacing",
    "Menor": "Smaller", "Maior": "Larger", "Compacto": "Compact", "Confortável": "Comfortable", "Amplo": "Spacious",
    "Ativar modo foco": "Enable focus mode", "Restaurar leitura": "Reset reading settings",
    "Esqueci minha senha": "Forgot my password", "Sair da sua conta?": "Sign out of your account?",
    "Cancelar": "Cancel", "Sim, sair da conta": "Yes, sign out",
    "Você será desconectado do Atlas Acadêmico. Para acessar sua conta novamente, será necessário entrar com suas credenciais.": "You will be signed out of Atlas Acadêmico. Sign in again to access your account.",
    "Não foi possível sair. Tente novamente.": "Could not sign out. Please try again.",
    "Não foi possível sair. Verifique sua conexão.": "Could not sign out. Check your connection.",
  },
  es: {
    "Boas-vindas ao Atlas": "Bienvenida a Atlas",
    "SEU ESPAÇO DE APRENDIZAGEM": "TU ESPACIO DE APRENDIZAJE",
    "Bom dia": "Buenos días",
    "Boa tarde": "Buenas tardes",
    "Boa noite": "Buenas noches",
    "Bem-vindo ao Atlas!": "¡Bienvenido a Atlas!",
    "Um café com código e uma aula por vez. Que tal continuar?": "Un café, algo de código y una lección a la vez. ¿Continuamos?",
    "Hora de aprender algo novo, no seu ritmo.": "Hora de aprender algo nuevo, a tu ritmo.",
    "Um pouco de estudo com constância faz diferença.": "Un poco de estudio constante marca la diferencia.",
    "Sua próxima conquista começa com uma aula.": "Tu próximo logro empieza con una lección.",
    "Relógio local": "Reloj local",
    "Horário local": "Hora local",
    "Continuar estudando": "Seguir estudiando",
    "Aprender sem pressa, mas com propósito.": "Aprende sin prisa, pero con propósito.",
    "Consistência não é motivação — é decisão.": "La constancia no es motivación: es una decisión.",
    "Todo sênior já ficou travado exatamente onde você está agora.": "Todo desarrollador sénior se ha atascado justo donde estás ahora.",
    "Scriptorium: onde o código vira conhecimento.": "Scriptorium: donde el código se convierte en conocimiento.",
    "Entender o porquê vale mais que memorizar o como.": "Comprender el porqué vale más que memorizar el cómo.",
    "O dev que sabe depurar vale mais que o que nunca erra.": "Quien sabe depurar vale más que quien nunca reconoce errores.",
    "O código de ontem te explica o erro de hoje.": "El código de ayer explica el error de hoy.",
    "Seu campus digital de tecnologia": "Tu campus digital de tecnología",
    "Aprenda os fundamentos.": "Aprende los fundamentos.",
    "Construa o futuro.": "Construye el futuro.",
    "Um atlas de Ciência da Computação, Engenharia de Software e IA: teoria, exemplos, exercícios e revisões, no seu ritmo.": "Un atlas de Informática, Ingeniería de Software e IA: teoría, ejemplos, ejercicios y repasos, a tu ritmo.",
    "Explorar disciplinas": "Explorar asignaturas",
    "Organizar meus estudos": "Organizar mis estudios",
    "Acesse as aulas sem configurar o Supabase. O login é opcional nesta etapa.": "Explora las lecciones sin configurar Supabase. El inicio de sesión es opcional por ahora.",
    "TRILHA DE APRENDIZAGEM": "RUTA DE APRENDIZAJE",
    "Pensamento computacional": "Pensamiento computacional",
    "HTML semântico": "HTML semántico",
    "CSS moderno": "CSS moderno",
    "Unidades curriculares": "Unidades curriculares",
    "Aulas introdutórias redigidas": "Lecciones introductorias redactadas",
    "Capítulos ampliados": "Capítulos ampliados",
    "Comece por aqui": "Empieza aquí",
    "Trilhas em destaque": "Rutas destacadas",
    "Escolha uma disciplina e expanda os módulos para visualizar cada aula.": "Elige una asignatura y expande sus módulos para ver cada lección.",
    "Ver catálogo completo": "Ver catálogo completo",
    "Explorar disciplina": "Explorar asignatura",
    "Transparência acadêmica": "Transparencia académica",
    "Conteúdo real, sem prometer o que ainda não existe.": "Contenido real, sin prometer lo que aún no existe.",
    "O catálogo preserva 81 unidades. Apenas parte das aulas foi redigida; páginas pendentes são identificadas. O estudo é livre, e as provas não atribuem domínio automático.": "El catálogo contiene 81 unidades. Solo algunas lecciones están redactadas; las páginas pendientes están identificadas. El estudio es libre y las pruebas no otorgan dominio automáticamente.",
    "Como estudar": "Cómo estudiar",
    "Abstração, decomposição, algoritmos e raciocínio.": "Abstracción, descomposición, algoritmos y razonamiento.",
    "Estrutura, significado e acessibilidade na Web.": "Estructura, significado y accesibilidad en la Web.",
    "Cascata, tipografia, layouts e responsividade.": "Cascada, tipografía, diseños y adaptación a pantallas.",
    "Linguagem, execução, funções e fundamentos.": "Lenguaje, ejecución, funciones y fundamentos.",
    "CSS e interfaces": "CSS e interfaces",
    "Guia da plataforma": "Guía de la plataforma", "Perguntas frequentes": "Preguntas frecuentes",
    "Voltar ao início": "Volver al inicio", "MINHA CONTA": "MI CUENTA", "Personalize suas informações no Atlas Acadêmico.": "Personaliza tu información en Atlas Acadêmico.",
    "PRINCIPAL": "PRINCIPAL", "APRENDIZAGEM": "APRENDIZAJE", "CONTA E SISTEMA": "CUENTA Y SISTEMA",
    "Início": "Inicio", "Disciplinas": "Asignaturas", "Meus estudos": "Mis estudios",
    "Exercícios": "Ejercicios", "Progresso": "Progreso", "Agenda de estudos": "Agenda de estudios",
    "Favoritos": "Favoritos", "Notificações": "Notificaciones", "Painel": "Panel",
    "Meu perfil": "Mi perfil", "Entrar": "Iniciar sesión", "Configurações": "Configuración",
    "Sair da conta": "Cerrar sesión", "Saindo...": "Cerrando sesión...",
    "NAVEGAÇÃO": "NAVEGACIÓN", "Recolher menu lateral": "Contraer menú lateral", "Expandir menu lateral": "Expandir menú lateral",
    "Plataforma": "Plataforma", "Informações legais": "Información legal", "Redes sociais": "Redes sociales",
    "Termos de Uso": "Términos de uso", "Política de Privacidade": "Política de privacidad",
    "Política de Cookies": "Política de cookies", "Seu campus digital. Aprenda, pratique e evolua no seu ritmo.": "Tu campus digital. Aprende, practica y avanza a tu ritmo.",
    "Conteúdo em desenvolvimento. O domínio de cada assunto requer estudo e avaliação individual.": "Contenido en desarrollo. Dominar cada tema requiere estudio y evaluación individual.",
    "Conheça os perfis e canais do criador do Atlas Acadêmico.": "Conoce los perfiles y canales del creador de Atlas Acadêmico.",
    "Leia nossos documentos sobre uso e privacidade.": "Consulta nuestros documentos de uso y privacidad (en portugués).",
    "Feito para estudar com autonomia.": "Creado para estudiar de forma autónoma.",
    "Seu ambiente de estudo": "Tu entorno de estudio", "Aparência": "Apariencia", "Claro": "Claro",
    "Escuro": "Oscuro", "Sistema": "Sistema", "Ambiente iluminado": "Tema luminoso",
    "Visual de baixo brilho": "Tema de bajo brillo", "Segue o dispositivo": "Sigue tu dispositivo",
    "Leitura das aulas": "Lectura de lecciones", "Modo foco": "Modo de concentración",
    "Idioma da interface": "Idioma de la interfaz", "Idioma": "Idioma", "Português (Brasil)": "Portugués (Brasil)",
    "Inglês": "Inglés", "Espanhol": "Español", "Prévia de leitura": "Vista previa de lectura",
    "Tamanho do texto da aula": "Tamaño del texto", "Espaçamento entre linhas": "Espaciado entre líneas",
    "Menor": "Menor", "Maior": "Mayor", "Compacto": "Compacto", "Confortável": "Cómodo", "Amplo": "Amplio",
    "Ativar modo foco": "Activar modo de concentración", "Restaurar leitura": "Restablecer lectura",
    "Esqueci minha senha": "Olvidé mi contraseña", "Sair da sua conta?": "¿Cerrar sesión?",
    "Cancelar": "Cancelar", "Sim, sair da conta": "Sí, cerrar sesión",
    "Você será desconectado do Atlas Acadêmico. Para acessar sua conta novamente, será necessário entrar com suas credenciais.": "Se cerrará tu sesión en Atlas Acadêmico. Para volver a entrar, usa tus credenciales.",
    "Não foi possível sair. Tente novamente.": "No se pudo cerrar sesión. Inténtalo de nuevo.",
    "Não foi possível sair. Verifique sua conexão.": "No se pudo cerrar sesión. Revisa tu conexión.",
  },
}

type ContextValue = { language: AtlasLanguage; setLanguage: (language: AtlasLanguage) => void; tr: (portuguese: string) => string }
const Context = createContext<ContextValue>({ language: "pt-BR", setLanguage: () => {}, tr: (text) => text })

export function AtlasLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AtlasLanguage>("pt-BR")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try { const saved = localStorage.getItem(KEY); if (valid(saved)) setLanguage(saved) } catch { /* optional */ }
    setLoaded(true)
    const sync = (event: StorageEvent) => {
      if (event.key === KEY && valid(event.newValue)) setLanguage(event.newValue)
    }
    window.addEventListener("storage", sync)
    return () => window.removeEventListener("storage", sync)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem(KEY, language) } catch { /* optional */ }
    // A tradução integral das páginas ainda está em andamento: o documento segue pt-BR.
  }, [language, loaded])

  const context = useMemo<ContextValue>(() => ({
    language, setLanguage,
    tr: (text: string) => language === "pt-BR" ? text : dictionary[language]?.[text] ?? text,
  }), [language])
  return <Context.Provider value={context}>{children}</Context.Provider>
}

export const useAtlasLanguage = () => useContext(Context)
