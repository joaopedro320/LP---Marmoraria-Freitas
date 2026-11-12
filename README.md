# LP Marmoraria Freitas | padrão QH4

Landing page da Marmoraria Freitas (Cleiton do Carmo Freitas, região de Vargem Grande Paulista/SP).
Produto: Low Ticket Stones. Stack: HTML + CSS + JS puro, sem build. Fontes Poppins (títulos) + Inter (corpo), porque o briefing não pediu fonte. Paleta verde e cinza, fundo mesclado (grafite, pedra clara e verde profundo).

## Estrutura

```
index.html            LP principal
obrigado.html         página de obrigado (noindex): redireciona pro WhatsApp em 4s
404.html              página de erro personalizada (noindex)
vercel.json           cleanUrls, cache e headers
robots.txt  sitemap.xml  site.webmanifest  favicon.svg
TRACKING-QH4.md       guia dos slots de rastreamento
assets/css/style.css
assets/js/tracking.js  CONFIG da LP (WhatsApp, webhook, conversões) + eventos
assets/js/main.js      interações e formulário
assets/img/            fotos reais do cliente em WebP (+ og-marmoraria-freitas.jpg)
assets/video/          corte-pedra.mp4 (540x960, 269 KB, sem áudio)
assets/icons/          icon-192.png, icon-512.png
```

## Como publicar na Vercel (plano gratuito)

1. Descompacte o zip e envie a pasta (ou arraste na Vercel). Framework: "Other". Sem build command, output = raiz.
2. Conecte o domínio e confira se o canonical/OG/sitemap batem com ele (ver pendências).
3. Teste: formulário, botão flutuante, `/obrigado`, uma URL inexistente (404).

## Pendências antes de publicar

- [ ] **Domínio:** o cliente ainda não tem domínio nem site. Troque `https://marmorariafreitas.com.br/` (placeholder) em `index.html` (canonical, og:url, og:image, twitter:image, JSON-LD), `obrigado.html`, `robots.txt` e `sitemap.xml` pelo domínio real.
- [ ] **GTM, Pixel e demais códigos:** colar nos slots `[QH4 SLOT 1 a 8]` (ver TRACKING-QH4.md).
- [ ] **WhatsApp:** já configurado com o número do briefing, (11) 97525-5326, em `assets/js/tracking.js`. Confirmar com o Cleiton.
- [ ] **Apps Script (opcional):** colar a URL em `webhook` no tracking.js. Com ele vazio, o formulário monta a mensagem completa e manda direto pro WhatsApp.
- [ ] **Instagram da QH4 no rodapé:** link `instagram.com/qh4growth` (conferir o @ oficial).
- [ ] **Identidade em aberto (kickoff):** a fachada, o site e o GMN são da Cipola e o Cleiton quer os dois nomes juntos. A LP usa só "Freitas" (wordmark em texto, sem logo, pois o cliente não tem). Se a definição for incluir ou migrar pra Cipola, ajustar header, rodapé, título e JSON-LD.
- [ ] **Endereço e cidade:** não há endereço no briefing. O JSON-LD tem só cidade/UF (Vargem Grande Paulista, SP). Conferir a cidade e incluir endereço quando existir.
- [ ] **GMN:** quando o perfil da Freitas existir, adicionar `sameAs` e o link de avaliações no JSON-LD.
- [ ] **Depoimentos:** o cliente não tem avaliações ainda, então a LP não tem seção de depoimentos. Adicionar quando houver.

## Fonte do conteúdo

Só o que está no briefing (Google Forms) e no resumo do contrato. Nada inventado: sem anos de mercado, números, garantias ou materiais específicos. Usado: história (trabalhava para outra empresa, primeiros trabalhos, decisão de abrir por conta própria, quase dois anos por conta), serviços listados, 4 diferenciais, público (arquitetos, engenheiros, casais e solteiros), horário (seg a qui 8h às 18h, sex 8h às 17h) e dúvidas mais comuns (prazo, preço, materiais). As respostas do FAQ não informam preço nem prazo em número, porque o briefing não traz.
Fotos: pasta "02. Imagens" do cliente. As legendas/alt descrevem só o que se vê.

## Rastreamento (dataLayer)

`whatsapp_click` (com `wa_local`: header, hero, rodape, flutuante, obrigado, 404), `form_start`, `generate_lead`, `thank_you_view`, `galeria_open`. Detalhes em TRACKING-QH4.md.

## Script do IVO (Funil do LIA & IVO)

Instalado antes do `</body>` da index e do obrigado (não na 404), com `data-lp="lp-marmoraria-freitas"`.

## Checklist de SEO e entrega

- [x] title e meta description com cidade e nicho
- [x] Headline com "Marmoraria" e "perto de você"
- [x] JSON-LD HomeAndConstructionBusiness + FAQPage
- [x] Open Graph completo + Twitter Card + canonical
- [x] robots.txt, sitemap.xml, site.webmanifest, favicon
- [x] width/height nas imagens (CLS), lazy-load fora do hero, preload da imagem do hero
- [x] vercel.json, obrigado.html, 404.html personalizada
- [x] Botão flutuante de WhatsApp fixo à direita
- [x] Formulário: botão nasce desabilitado, valida e só libera com tudo preenchido
- [x] prefers-reduced-motion respeitado, foco visível, mobile testado em 390px
