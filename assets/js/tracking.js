/* ==========================================================================
   [QH4 SLOT 7] CONFIGURAÇÃO DA LP | Marmoraria Freitas
   Edite só este bloco. Todo o resto da LP lê daqui.
   ========================================================================== */
window.QH4 = {
  /* WhatsApp que recebe os leads (DDI + DDD + número, só dígitos) */
  whatsapp: "5511975255326",

  /* URL do Google Apps Script (Web App) que grava o lead na planilha.
     Vazio = o formulário monta a mensagem completa e envia direto pro WhatsApp.
     Preenchido = envia pro Apps Script, abre obrigado.html e redireciona pro WhatsApp. */
  webhook: "",

  /* Mensagens do WhatsApp */
  mensagemPadrao: "Olá! Vim pelo site da Marmoraria Freitas e quero fazer um orçamento.",
  mensagemObrigado: "Olá, acabei de preencher o formulário no site. Aguardo mais informações.",

  /* Rótulos de conversão (deixe vazio para não disparar)
     googleAds: "AW-XXXXXXXXX/XXXXXXXXXXXX"  | metaEvento: "Lead" */
  conversao: {
    googleAdsWhatsapp: "",
    googleAdsLead: "",
    metaEventoWhatsapp: "Contact",
    metaEventoLead: "Lead"
  },

  /* Página de obrigado */
  paginaObrigado: "obrigado.html",
  segundosRedirecionar: 4,

  /* Nome da LP (aparece em eventos e no webhook) */
  lp: "lp-marmoraria-freitas"
};

(function () {
  "use strict";
  var Q = window.QH4;
  window.dataLayer = window.dataLayer || [];

  Q.track = function (evento, params) {
    var p = params || {};
    p.event = evento;
    p.lp = Q.lp;
    window.dataLayer.push(p);
  };

  Q.waLink = function (msg) {
    return "https://wa.me/" + Q.whatsapp + "?text=" + encodeURIComponent(msg || Q.mensagemPadrao);
  };

  function conversaoWhats() {
    if (typeof window.gtag === "function" && Q.conversao.googleAdsWhatsapp) {
      window.gtag("event", "conversion", { send_to: Q.conversao.googleAdsWhatsapp });
    }
    if (typeof window.fbq === "function" && Q.conversao.metaEventoWhatsapp) {
      window.fbq("track", Q.conversao.metaEventoWhatsapp);
    }
  }

  /* Todo link com data-wa="local" vira link de WhatsApp rastreado */
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var local = el.getAttribute("data-wa");
    el.setAttribute("href", Q.waLink(el.getAttribute("data-msg") || Q.mensagemPadrao));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
    el.addEventListener("click", function () {
      Q.track("whatsapp_click", { wa_local: local });
      conversaoWhats();
    });
  });

  Q.conversaoLead = function () {
    if (typeof window.gtag === "function" && Q.conversao.googleAdsLead) {
      window.gtag("event", "conversion", { send_to: Q.conversao.googleAdsLead });
    }
    if (typeof window.fbq === "function" && Q.conversao.metaEventoLead) {
      window.fbq("track", Q.conversao.metaEventoLead);
    }
  };
})();
