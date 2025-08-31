# gift-karine

Carta digital animada para Karine — tema preto/roxo, corações flutuando, texto com efeito de digitação e música de fundo iniciada ao toque em "Começar". Projeto 100% estático (HTML/CSS/JS puro), mobile-first.

## Estrutura
```
/gift-karine/
  index.html
  styles.css
  script.js
  /assets/
    /audio/musica.m4a
    /icons/favicon.svg
```

## Conteúdo
- Título: "Karine, meu amor"
- Texto com efeito de digitação (com botão "Mostrar tudo").
- Data no rodapé: "29 de agosto de 2025".
- Assinatura: "Com todo meu amor do seu querido namorado Wesley".
- Controles: Play/Pause, Loop e Reduzir animação (respeita `prefers-reduced-motion`).

## Áudio
Coloque o arquivo M4A em `assets/audio/musica.m4a`.
- Substitua o arquivo atual por outro com o mesmo nome (mantendo o codec m4a) para trocar a música.
- Em iOS/Android o áudio só toca após gesto do usuário (clique/toque em "Começar").

## Publicação (Vercel — recomendado)
1. Acesse https://vercel.com e crie uma conta (ou faça login).
2. Clique em "Add New..." → "Project" → aba "Import Third-Party" → "Upload".
3. Arraste a pasta `gift-karine` (ou suba o `gift-karine.zip`).
4. Em "Framework Preset" escolha "Other" (projeto estático). Salve e conclua o deploy.
5. Abra a URL gerada e teste em celular (iOS Safari e Android Chrome).

### Domínio personalizado
- Em Project Settings → Domains → Add, aponte seu domínio. 
- Para cache: um `vercel.json` já está incluído com cache longo para assets e `no-cache` para HTML.

## Alternativa: GitHub Pages
1. Crie um repositório (ex.: `gift-karine`).
2. Faça commit de todos os arquivos da pasta `gift-karine/` na raiz do repo.
3. Em Settings → Pages, selecione "Deploy from a branch" e escolha `main`/`root`.
4. A URL será `https://seu-usuario.github.io/gift-karine/`.

> Dica: se publicar em subpasta (GitHub Pages), confirme que os caminhos relativos (ex.: `assets/...`) não mudaram. Como usamos caminhos relativos, deve funcionar sem ajustes.

## Acessibilidade e performance
- `lang="pt-BR"`, foco visível, labels ARIA e `aria-live` para o status do áudio.
- `prefers-reduced-motion` respeitado; botão "Reduzir animação" para controle manual.
- Tipografia carregada com `font-display=swap`.
- CSS/JS únicos, sem frameworks.

## Customização rápida
- Cores: altere variáveis CSS em `styles.css` (começam com `--` no `:root`).
- Quantidade de corações: ajuste `heartsCount` em `script.js`.
- Velocidade de digitação: ajuste `typingSpeed` em `script.js` (ms por letra).
- Título, texto, data e assinatura: `index.html` (título) e `script.js` (texto da carta).

## Testes
- iOS Safari: confirme que o áudio inicia após tocar em "Começar". Se bloquear, o botão permanece e um aviso aparece.
- Android Chrome: idem.

Boa publicação e felicidades! 💜
