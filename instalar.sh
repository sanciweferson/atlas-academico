#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
echo 'Atlas Acadêmico V2 — preparando ambiente'
if ! command -v node >/dev/null || ! command -v npm >/dev/null; then echo 'Node.js e npm não encontrados no Ubuntu.'; exit 1; fi
node -e 'const v=process.versions.node.split(".").map(Number);if(v[0]<20||(v[0]===20&&v[1]<9)){console.error("Node.js 20.9+ necessário. Versão: "+process.version);process.exit(1)}'
if [ ! -f package.json ]; then echo 'Execute este script dentro da pasta atlas_next_v2';exit 1;fi
npm install
echo 'Instalação concluída. Para iniciar: npm run dev'
echo 'O conteúdo público funciona sem Supabase. Para login, configure .env.local conforme README.md.'
