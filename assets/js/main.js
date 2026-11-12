(function () {
  "use strict";
  var Q = window.QH4 || {};
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header sólido ao rolar ---------- */
  var topo = document.querySelector(".topo");
  function onScrollTopo() { if (topo) topo.classList.toggle("is-solido", window.scrollY > 40); }
  onScrollTopo();
  window.addEventListener("scroll", onScrollTopo, { passive: true });

  /* ---------- Scroll reveal ---------- */
  var alvos = document.querySelectorAll(".rv, .dif");
  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visivel"); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    alvos.forEach(function (el) { io.observe(el); });
  } else {
    alvos.forEach(function (el) { el.classList.add("is-visivel"); });
  }

  /* ---------- Parallax leve no hero ---------- */
  var heroImg = document.querySelector(".hero__foto img");
  if (heroImg && !reduz) {
    var tick = false;
    window.addEventListener("scroll", function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 700);
        heroImg.style.transform = "translateY(" + (-y * 0.06) + "px)";
        tick = false;
      });
    }, { passive: true });
  }

  /* ---------- Serviços: lista troca a foto ---------- */
  var itens = document.querySelectorAll(".servico");
  var fotos = document.querySelectorAll(".servicos__palco img");
  var legenda = document.querySelector(".servicos__palco figcaption");
  function ativa(i) {
    itens.forEach(function (b, k) { b.setAttribute("aria-selected", k === i ? "true" : "false"); });
    fotos.forEach(function (f, k) { f.classList.toggle("is-ativa", k === i); });
    if (legenda && itens[i]) legenda.textContent = itens[i].textContent.trim();
  }
  itens.forEach(function (b, i) {
    b.addEventListener("mouseenter", function () { ativa(i); });
    b.addEventListener("focus", function () { ativa(i); });
    b.addEventListener("click", function () { ativa(i); });
  });
  if (itens.length) ativa(0);

  /* ---------- Trilha: linha de corte que avança com o scroll ---------- */
  var trilha = document.querySelector(".trilha");
  var corte = document.querySelector(".trilha__corte");
  var etapas = document.querySelectorAll(".etapa");
  function atualizaTrilha() {
    if (!trilha || !corte) return;
    var r = trilha.getBoundingClientRect();
    var vh = window.innerHeight;
    var alvo = vh * 0.55;
    var p = Math.max(0, Math.min(1, (alvo - r.top) / r.height));
    corte.style.height = "calc((100% - .8rem) * " + p.toFixed(4) + ")";
    etapas.forEach(function (e) {
      var er = e.getBoundingClientRect();
      e.classList.toggle("is-passou", er.top < alvo);
    });
  }
  if (trilha) {
    atualizaTrilha();
    window.addEventListener("scroll", atualizaTrilha, { passive: true });
    window.addEventListener("resize", atualizaTrilha);
  }

  /* ---------- Lightbox da galeria ---------- */
  var box = document.getElementById("lightbox");
  if (box && typeof box.showModal === "function") {
    var boxImg = box.querySelector("img");
    document.querySelectorAll(".galeria__item").forEach(function (b) {
      b.addEventListener("click", function () {
        var im = b.querySelector("img");
        boxImg.src = im.getAttribute("data-full") || im.currentSrc || im.src;
        boxImg.alt = im.alt;
        box.showModal();
        if (Q.track) Q.track("galeria_open", {});
      });
    });
    box.addEventListener("click", function (e) { if (e.target === box || e.target.classList.contains("lightbox__in")) box.close(); });
    box.querySelector(".lightbox__fechar").addEventListener("click", function () { box.close(); });
  }

  /* ---------- Formulário ---------- */
  var form = document.getElementById("form-orcamento");
  if (!form) return;
  var btn = form.querySelector("button[type=submit]");
  var tel = form.elements["whatsapp"];
  var iniciou = false;

  function mascara(v) {
    v = v.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) return "(" + v.slice(0, 2) + ") " + v.slice(2, v.length - 4) + "-" + v.slice(-4);
    if (v.length > 2) return "(" + v.slice(0, 2) + ") " + v.slice(2);
    return v;
  }
  function valida() {
    var digitos = tel.value.replace(/\D/g, "");
    tel.setCustomValidity(digitos.length === 10 || digitos.length === 11 ? "" : "Digite o DDD e o número, com 10 ou 11 dígitos.");
    btn.disabled = !form.checkValidity();
  }
  tel.addEventListener("input", function () { tel.value = mascara(tel.value); });
  form.addEventListener("input", function () {
    if (!iniciou) { iniciou = true; if (Q.track) Q.track("form_start", {}); }
    valida();
  });
  form.addEventListener("change", valida);
  valida();

  function utms() {
    var out = {}, p = new URLSearchParams(window.location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"].forEach(function (k) { if (p.get(k)) out[k] = p.get(k); });
    return out;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    valida();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var d = {
      nome: form.elements["nome"].value.trim(),
      whatsapp: form.elements["whatsapp"].value.trim(),
      cidade: form.elements["cidade"].value.trim(),
      servico: form.elements["servico"].value,
      mensagem: form.elements["mensagem"].value.trim()
    };
    btn.disabled = true;
    btn.textContent = "Enviando...";
    if (Q.track) Q.track("generate_lead", { servico: d.servico, form_tipo: Q.webhook ? "webhook" : "whatsapp_direto" });
    if (Q.conversaoLead && !Q.webhook) Q.conversaoLead(); // com webhook, a conversão dispara no obrigado.html

    if (Q.webhook) {
      var corpo = new URLSearchParams(Object.assign({}, d, utms(), { lp: Q.lp, pagina: location.href, data: new Date().toISOString() }));
      fetch(Q.webhook, { method: "POST", mode: "no-cors", body: corpo })
        .catch(function () {})
        .then(function () { window.location.href = Q.paginaObrigado; });
      setTimeout(function () { window.location.href = Q.paginaObrigado; }, 2500);
    } else {
      var linhas = [
        "Olá! Vim pelo site da Marmoraria Freitas e quero um orçamento.",
        "",
        "Nome: " + d.nome,
        "WhatsApp: " + d.whatsapp,
        "Cidade ou bairro: " + d.cidade,
        "O que preciso: " + d.servico
      ];
      if (d.mensagem) linhas.push("Detalhes: " + d.mensagem);
      window.location.href = Q.waLink(linhas.join("\n"));
    }
  });
})();
