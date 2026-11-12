# Rastreamento | LP Marmoraria Freitas

Todos os pontos de colagem estão marcados no código com blocos grandes de comentário `[QH4 SLOT n]`, iguais em `index.html`, `obrigado.html` e `404.html`. Cada bloco traz o título, o que colar e um exemplo.

| Slot | Onde | O que colar |
|---|---|---|
| 1 | `<head>` | GTM (snippet do head) |
| 2 | `<head>` | Meta tags de verificação de domínio (Search Console, Meta) |
| 3 | `<head>` | Meta Pixel direto (só se NÃO usar GTM) |
| 4 | `<head>` | gtag do Google Ads / GA4 direto (só se NÃO usar GTM) |
| 5 | logo após `<body>` | GTM noscript |
| 6 | antes de `</body>` | Scripts de terceiros (Clarity, Hotjar, chat) |
| 7 | `assets/js/tracking.js` | Config: WhatsApp, webhook (Apps Script), rótulos de conversão |
| 8 | `obrigado.html`, antes de `</body>` | Conversão da página de obrigado (Google Ads / Meta) |

Use GTM **ou** os slots 3 e 4, não os dois, para não contar conversão em duplicidade.

## Eventos no dataLayer

| Evento | Quando | Parâmetros |
|---|---|---|
| `whatsapp_click` | clique em qualquer botão de WhatsApp | `wa_local`: header, hero, rodape, flutuante, obrigado, 404 |
| `form_start` | primeira digitação no formulário | |
| `generate_lead` | envio do formulário | `servico`, `form_tipo` (webhook ou whatsapp_direto) |
| `thank_you_view` | abertura do obrigado.html | |
| `galeria_open` | foto ampliada | |

Todos levam `lp: "lp-marmoraria-freitas"`.

## Fluxo do formulário

- `webhook` **vazio** (padrão agora): monta a mensagem com todos os campos e abre o WhatsApp direto.
- `webhook` **preenchido** (URL do Apps Script): envia os dados (com UTMs, gclid e fbclid), abre `obrigado.html` e, em 4s, redireciona pro WhatsApp com "Olá, acabei de preencher o formulário no site. Aguardo mais informações."

## Conversões diretas (sem GTM)

Em `tracking.js`, preencher `conversao.googleAdsWhatsapp` / `googleAdsLead` com `AW-XXXXXXXXX/XXXXXXXXXXXX`. O Meta usa os eventos `Contact` (clique no WhatsApp) e `Lead` (formulário).
