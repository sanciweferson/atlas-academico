# Atlas Acadêmico — Next.js V2

Migração evolutiva do projeto V1. Preserva o currículo de 81 unidades, as 37 aulas introdutórias, os capítulos anteriores e a integração Supabase opcional.

## Requisitos
- Ubuntu no WSL 2, Node.js 20.9+ (preferencialmente LTS 22 ou superior), npm.
- O conteúdo público funciona **sem** `.env.local` e sem conta Supabase.

## Instalação
```bash
cd ~/projetos/atlas-academico/atlas_next_v2
npm install
npm run dev
```
Acesse http://localhost:3000.

## Supabase (opcional nesta fase)
```bash
cp .env.example .env.local
```
Preencha a URL e a chave publicável/anon do projeto. Execute `supabase/schema.sql` no SQL Editor do Supabase antes de usar o caderno sincronizado. Nunca exponha a service_role em variáveis `NEXT_PUBLIC_*`.

## O que há na V2
- Novo layout responsivo com temas claro/escuro, navegação móvel e acessibilidade básica.
- Catálogo com busca e ordenação pedagógica provisória.
- Páginas de aulas com navegação, teoria, capítulos e fontes primárias.
- Banco de exercícios com tentativas salvas localmente e gabaritos recolhidos quando existentes.
- Caderno local sem necessidade de login; exportação/importação de backup em `Meu estudo`.
- A autenticação e notas remotas do V1 permanecem disponíveis, mas exigem Supabase.

## Limites importantes
- Não é uma biblioteca universitária integral. São 81 unidades **catalogadas**, 37 aulas introdutórias e um subconjunto de capítulos aprofundados.
- As questões sem gabarito são explicitamente identificadas. A avaliação não atribui nota automática a respostas discursivas.
- O armazenamento local é por origem/navegador, não sincronizado. Exporte backups.
- Esta versão não implementa um CMS administrativo nem proteção server-side completa do painel. Não a trate como pronta para produção pública.

## Verificação
```bash
npm run lint
npm run build
```

## Atualização sem perder sua V1
Extraia o ZIP ao lado da pasta `atlas_next_v1`, criando `atlas_next_v2`. Não substitua seu `.env.local`. Se desejar usar o mesmo Supabase, copie **apenas no seu computador** as variáveis da V1 para a V2. Não envie credenciais pelo chat.
