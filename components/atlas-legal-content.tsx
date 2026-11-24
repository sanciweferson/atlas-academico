import Link from "next/link"
import { BookOpenCheck, Cookie, FileText, ShieldCheck, Info } from "lucide-react"

type Section = { title: string; paragraphs?: string[]; points?: string[] }
const updated = "23 de novembro de 2026"

const documents: Record<"termos" | "privacidade" | "cookies", { title: string; summary: string; sections: Section[] }> = {
  termos: {
    title: "Termos de Uso",
    summary: "Condições gerais de acesso e utilização do Atlas Acadêmico.",
    sections: [
      { title: "1. Sobre a plataforma", paragraphs: [
        "O Atlas Acadêmico é um projeto independente de apoio aos estudos, com materiais educacionais, exercícios e funcionalidades de organização pessoal. O acesso e os recursos disponibilizados podem mudar durante o desenvolvimento da plataforma.",
        "Os conteúdos têm finalidade educacional. O Atlas não garante aprovação em exames, certificação, formação profissional ou resultados individuais específicos.",
      ] },
      { title: "2. Cadastro e acesso", paragraphs: [
        "Alguns recursos exigem cadastro, confirmação do endereço de e-mail e autenticação. A pessoa usuária deve informar dados corretos e proteger suas credenciais, evitando compartilhá-las.",
        "O cadastro, a recuperação de senha e o gerenciamento de sessão utilizam o serviço de autenticação do Supabase. Para informações sobre dados pessoais, consulte a Política de Privacidade.",
      ] },
      { title: "3. Uso adequado", points: [
        "Utilizar os recursos respeitando outras pessoas, a legislação aplicável e as medidas de segurança da plataforma.",
        "Não tentar acessar contas de terceiros, contornar controles de autenticação nem prejudicar a disponibilidade do serviço.",
        "Não reproduzir materiais protegidos por direitos autorais sem autorização quando ela for exigida.",
      ] },
      { title: "4. Anotações e organização pessoal", paragraphs: [
        "A plataforma disponibiliza anotações relacionadas à conta e recursos locais de agenda, favoritos, respostas de exercícios e preferências. Informações armazenadas exclusivamente no navegador podem desaparecer quando os dados do navegador forem apagados ou quando outro dispositivo for utilizado.",
        "Recomenda-se manter cópias de informações importantes. O funcionamento dos lembretes locais depende das permissões e da disponibilidade do navegador e não equivale a um serviço garantido de notificações em segundo plano.",
      ] },
      { title: "5. Disponibilidade e links externos", paragraphs: [
        "O Atlas poderá passar por manutenções, correções, interrupções temporárias e evolução de funcionalidades. Não há compromisso de disponibilidade ininterrupta nesta fase do projeto.",
        "Links para redes sociais e sites de terceiros levam a serviços com condições e políticas próprias, sobre os quais o Atlas não exerce controle.",
      ] },
      { title: "6. Alterações e contato", paragraphs: [
        "Estes termos podem ser atualizados para refletir mudanças do projeto e das normas aplicáveis. A data da última revisão será exibida nesta página.",
        "Para dúvidas sobre a plataforma e solicitações relacionadas ao uso, utilize os canais de contato indicados nesta página. Estas condições ainda precisam ser revistas antes da publicação definitiva.",
      ] },
    ],
  },
  privacidade: {
    title: "Política de Privacidade",
    summary: "Como o Atlas Acadêmico utiliza dados de conta e preferências de estudo.",
    sections: [
      { title: "1. Responsável e alcance", paragraphs: [
        "O Atlas Acadêmico é um projeto educacional independente. Esta política descreve funcionalidades verificadas no código da plataforma, sem substituir a avaliação das configurações reais dos provedores de infraestrutura.",
        "Solicitações relacionadas a dados pessoais podem ser enviadas ao e-mail público indicado nesta página. A identificação formal do responsável e os procedimentos de atendimento ainda precisam de validação antes da publicação definitiva.",
      ] },
      { title: "2. Quais dados são tratados", points: [
        "Conta: e-mail, nome informado no cadastro, identificador de usuário e dados de autenticação gerenciados pelo Supabase.",
        "Anotações: conteúdo escrito pelo usuário, identificação da aula associada e data de atualização, quando sincronizados com sua conta.",
        "Fotos de perfil: a imagem enviada é armazenada no Supabase Storage e associada à conta. A pessoa usuária pode trocar ou remover a foto pela página de perfil.",
        "Respostas dos exercícios: textos digitados, tentativas registradas e estado de consulta aos gabaritos ficam no armazenamento local do navegador, separados na interface por conta ou visitante. Não são sincronizados automaticamente com o Supabase.",
        "No dispositivo: agenda de estudos, favoritos, preferências visuais, idioma selecionado e estados locais de funcionalidades, conforme a implementação disponível.",
        "Dados técnicos de acesso: provedores de hospedagem e autenticação podem tratar registros técnicos necessários a segurança, operação e diagnóstico; os detalhes e prazos dependem das respectivas configurações e políticas.",
      ] },
      { title: "3. Por que os dados são utilizados", paragraphs: [
        "Os dados de conta permitem cadastrar, autenticar e recuperar acesso. As anotações permitem apresentar ao usuário seus registros de estudo. Dados locais preservam preferências e recursos de organização no navegador.",
        "As bases legais aplicáveis, como execução de contrato e outras hipóteses previstas na LGPD, devem ser avaliadas por finalidade. Consentimento, quando legalmente necessário, não é substituído pela simples leitura desta página.",
      ] },
      { title: "4. Prestadores de serviço e links externos", paragraphs: [
        "A implementação utiliza Supabase para autenticação e armazenamento de informações de conta e anotações; o site é hospedado na Vercel. Os serviços podem realizar tratamentos técnicos relacionados à entrega e segurança da aplicação.",
        "Ao abrir links para GitHub, Instagram, YouTube, LinkedIn ou Facebook, a pessoa deixa o Atlas e passa a se relacionar também com as políticas dessas plataformas.",
      ] },
      { title: "5. Armazenamento, segurança e conservação", paragraphs: [
        "Informações de conta e anotações podem ser mantidas pelos serviços associados à conta, enquanto os recursos locais permanecem neste navegador até serem apagados, substituídos ou perdidos. Este rascunho não define um prazo de retenção de dados do servidor, que precisa ser estabelecido pelo responsável.",
        "O projeto utiliza mecanismos de autenticação, mas nenhuma tecnologia garante proteção absoluta. Eventuais incidentes serão avaliados conforme as regras aplicáveis.",
      ] },
      { title: "6. Direitos da pessoa titular", paragraphs: [
        "A Lei Geral de Proteção de Dados Pessoais prevê direitos como confirmação de tratamento, acesso, correção e, nas hipóteses cabíveis, eliminação ou portabilidade. Utilize o e-mail indicado nesta página; os procedimentos e prazos de atendimento ainda precisam de validação.",
        "Apagar cookies e armazenamento local pelo navegador pode excluir informações guardadas no dispositivo, mas não é, por si só, uma solicitação de exclusão dos dados vinculados à conta no Supabase.",
      ] },
      { title: "7. Atualizações", paragraphs: [
        "A política deve ser revista sempre que forem incluídos provedores, novas formas de rastreamento, funcionalidades de coleta, mecanismos de exportação ou exclusão de conta e mudanças relevantes no tratamento de dados.",
      ] },
    ],
  },
  cookies: {
    title: "Política de Cookies",
    summary: "Entenda o uso de cookies de sessão e do armazenamento local no Atlas.",
    sections: [
      { title: "1. Cookies e armazenamento local não são a mesma coisa", paragraphs: [
        "Cookies são informações que o navegador armazena e pode enviar ao site em requisições. O armazenamento local (localStorage e sessionStorage) guarda dados no dispositivo e pode ser utilizado por scripts da própria página.",
        "O Atlas utiliza a biblioteca @supabase/ssr no navegador para a autenticação, que gerencia a sessão por meio de cookies, além de funcionalidades que mantêm preferências e agendamentos em armazenamento local.",
      ] },
      { title: "2. Tecnologias identificadas", points: [
        "Cookies de autenticação Supabase: necessários ao funcionamento de login e sessão, conforme a configuração e o ciclo de autenticação do serviço.",
        "Armazenamento local: preferências de leitura e tema, idioma da interface, agenda, favoritos, respostas dos exercícios e registros locais de notificações.",
        "Armazenamento de sessão: estado temporário de interface, como a abertura do menu no celular.",
        "Terceiros: serviços externos acessados por links próprios podem utilizar cookies segundo suas políticas.",
      ] },
      { title: "3. Consentimento e outras finalidades", paragraphs: [
        "Esta versão do código não identifica a instalação deliberada de um mecanismo próprio de cookies para publicidade comportamental. Isso não equivale a uma auditoria da hospedagem nem garante a inexistência de outros tratamentos pelos provedores.",
        "Cookies estritamente necessários podem seguir regime distinto de cookies opcionais. Se forem implementadas ferramentas de análise, publicidade ou rastreamento não essencial, a política e os controles de consentimento deverão ser reavaliados antes de ativá-las.",
      ] },
      { title: "4. Como controlar ou apagar dados", paragraphs: [
        "É possível controlar cookies e apagar dados do site nas configurações do navegador. Ao excluir cookies de autenticação, você poderá precisar fazer login novamente. Ao limpar o armazenamento local, poderão ser apagados agenda, favoritos e preferências guardados apenas naquele dispositivo.",
        "Desativar cookies necessários pode impedir o login. A opção de escolher o idioma ou o tema apenas altera preferências locais; não representa consentimento para rastreamento de terceiros.",
      ] },
      { title: "5. Revisão da política", paragraphs: [
        "O responsável pelo projeto deverá validar os cookies reais de produção com as ferramentas de desenvolvedor do navegador e revisar esta página sempre que a arquitetura ou fornecedores forem alterados.",
      ] },
    ],
  },
}

const icons = { termos: FileText, privacidade: ShieldCheck, cookies: Cookie }
export default function AtlasLegalContent({ kind }: { kind: "termos" | "privacidade" | "cookies" }) {
  const page = documents[kind]
  const Icon = icons[kind]
  return (
    <article className="atlas-v31-legal" lang="pt-BR">
      <header className="atlas-v31-legal-head">
        <span className="atlas-v31-legal-icon"><Icon size={26} aria-hidden="true" /></span>
        <span className="eyebrow">ATLAS ACADÊMICO • DOCUMENTOS</span>
        <h1 className="page-title">{page.title}</h1>
        <p className="muted">{page.summary}</p>
        <p className="atlas-v31-legal-date">Última revisão do rascunho: {updated}</p>
      </header>
      <div className="atlas-v31-legal-note" role="note"><Info size={20} aria-hidden="true" /><p><strong>Documento em revisão.</strong> Texto preliminar baseado no funcionamento atual do Atlas. O contato foi informado, mas ainda é necessário definir prazos de retenção, validar a identificação do responsável e conferir os serviços utilizados antes da publicação definitiva.</p></div>
      <section className="atlas-v31-legal-contact" aria-label="Contato do Atlas">
        <strong>Contato, suporte e privacidade</strong>
        <p>Para questões sobre dados pessoais, utilize preferencialmente o e-mail. O WhatsApp é um canal alternativo de contato.</p>
        <div className="atlas-v31-contact-links">
          <a href="mailto:sanciw45@gmail.com">E-mail: sanciw45@gmail.com</a>
          <a href="https://wa.me/5585985637557" target="_blank" rel="noopener noreferrer">WhatsApp: (85) 98563-7557</a>
        </div>
      </section>
      <div className="atlas-v31-legal-body">
        {page.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((p) => <p key={p}>{p}</p>)}
            {section.points && <ul>{section.points.map((p) => <li key={p}>{p}</li>)}</ul>}
          </section>
        ))}
      </div>
      <nav className="atlas-v31-legal-nav" aria-label="Outros documentos">
        <Link href="/termos"><FileText size={17}/> Termos de Uso</Link>
        <Link href="/privacidade"><ShieldCheck size={17}/> Privacidade</Link>
        <Link href="/cookies"><Cookie size={17}/> Cookies</Link>
        <Link href="/"><BookOpenCheck size={17}/> Voltar ao Atlas</Link>
      </nav>
    </article>
  )
}
