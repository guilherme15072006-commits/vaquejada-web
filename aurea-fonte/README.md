# Áurea — protótipo navegável

Fintech premium com a identidade **Liquid Gold Glass** (ouro líquido sob vidro). **100% mock**: sem backend, sem dinheiro real e sem integrações externas.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # gera export estático em out/ (Cloudflare Pages: build "npm run build", saída "out")
npm run typecheck
```

- Comece em `/splash`. Login: botão **"Preencher dados de demonstração"** (CPF 123.456.789-09 / senha ouro123) ou biometria simulada.
- `/design-system` mostra tokens e todos os componentes.
- Estado no Zustand e salvo no localStorage (com fallback em memória). Perfil → "Restaurar dados fictícios" volta ao início.

## Estrutura
- `app/(auth)` splash, onboarding, login · `app/(app)` home, cofres, cofres/novo, cofres/detalhe?id=, ouro, pix, social, ia, score, cartao, extrato, perfil
- `components/glass` GlassPanel, LiquidFill, GoldButton, GlassButton, GoldNumber, GlassTabBar, GlassSheet, Avatar, Toast, ShimmerSkeleton, Orb, Ingot
- `components/effects` WaterRefraction, GoldDust, Ripple, SpecularHighlight · `components/charts` GoldLineChart, CategoryRing
- `lib/mock` dados fictícios + IA por intenções · `lib/store` Zustand · `styles/tokens.css`

## Decisões
- Detalhe do cofre usa `/cofres/detalhe?id=` em vez de `/cofres/[id]`: com export estático, cofres criados pelo usuário dariam 404 numa rota dinâmica.
- Rendimento sempre "estimado" com aviso de simulação; nenhuma tela menciona apostas.
- "Reduzir transparência"/"Reduzir movimento" no Perfil, e respeito a `prefers-reduced-motion` / `prefers-reduced-transparency`.
