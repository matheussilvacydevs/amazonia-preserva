# Amazônia Preserva — Next.js

Reconstrução do site original com o mesmo layout, conteúdo educativo, quiz solo e novo multiplayer. O multiplayer usa funções PostgreSQL transacionais para evitar respostas duplicadas, garantir que cada jogador tenha seu próprio registro e avançar sem depender de resets entre rodadas. Realtime acelera as atualizações e polling de 2s funciona como fallback.

## Instalação no Termux ou VPS

```bash
npm install
cp .env.example .env.local
# Edite .env.local com a chave pública do projeto Supabase (não use service_role)
# Execute supabase/schema.sql no SQL Editor do projeto Supabase
npm run dev
```

Abra `http://localhost:3000`. Para produção, configure as mesmas variáveis no serviço de hospedagem e use `npm run build && npm start`. **GitHub Pages não executa Next.js com servidor**; hospede em uma VPS ou serviço compatível. Esta versão usa Next.js para a interface e Supabase para o backend transacional.

## Testes

```bash
npm test
npm run build
```

Crie uma sala nova e teste em três aparelhos ou três perfis independentes do navegador. Duas abas do mesmo perfil compartilham a mesma sessão anônima e, por isso, representam o mesmo jogador. Testes reais com seu Supabase e com os três aparelhos ainda são necessários.

## Observações

- O banco novo usa `ap_rooms` e `ap_players`, sem alterar as tabelas antigas.
- Para atualizar o site antigo, não substitua `index.html` pelo código Next.js: implante o projeto como aplicação Next.js.
- O anfitrião pode avançar manualmente assim que a pergunta encerra. O avanço automático ocorre após 4 segundos do resultado no cliente anfitrião, condicionado à validação transacional do servidor.
