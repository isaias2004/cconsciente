/* Cuidar Consciente — lógica del sitio (sin dependencias).
   Los contenidos se editan en la carpeta /data, no acá. */
(function () {
  "use strict";

  var CONFIG = window.CONFIG || {};
  var PROFESIONALES = window.PROFESIONALES || [];
  var NOVEDADES = window.NOVEDADES || [];

  /* ---------- utilidades ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "class") node.className = attrs[k];
      else if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function parseFecha(str) {
    // "2026-10-30" -> fecha local (evita el corrimiento por zona horaria)
    var p = String(str).split("-");
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  function formatFecha(str) {
    return parseFecha(str).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  }

  function iniciales(nombre) {
    var limpio = nombre.replace(/^(lic\.|dra?\.|mg\.|psic\.)\s*/i, "");
    return limpio.split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
  }

  function urlSegura(url) {
    return /^(https?:|mailto:|tel:)/i.test(url) ? url : "#";
  }

  /* ---------- iconos de redes ---------- */
  var ICONOS = {
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
    whatsapp: '<path d="M3.5 20.5l1.4-4.3A8.6 8.6 0 1 1 8 19.3l-4.5 1.2z"/><path d="M9 8.5c0 3.2 3.3 6.5 6.5 6.5l1-1.6-2.100-1-.9.8c-.9-.4-1.700-1.200-2.100-2.100l.8-.9-1-2.100L9 8.500z"/>',
    facebook: '<path d="M14 21v-8h2.800l.5-3.400H14V7.500c0-1 .5-1.700 1.800-1.700h1.600V3c-.4 0-1.400-.2-2.500-.2-2.500 0-4.200 1.500-4.200 4.200v2.600H7.800V13h2.900v8H14z"/>',
    tiktok: '<path d="M14 3.500v11.200a3.700 3.700 0 1 1-3.700-3.700"/><path d="M14 3.500c.3 2.600 1.900 4.200 4.500 4.400"/>',
    youtube: '<rect x="2.500" y="5.500" width="19" height="13" rx="4"/><path d="M10.300 9.300v5.400l4.600-2.700-4.600-2.700z" fill="currentColor"/>',
    linkedin: '<path d="M6 9.500V20M6 5.500v.01M11 20v-6.200a3 3 0 0 1 6 0V20M11 9.500V20"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.500 7.500l8.500 6 8.500-6"/>',
    web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.600 2.700 3.800 5.700 3.800 9s-1.200 6.300-3.800 9c-2.600-2.700-3.800-5.700-3.800-9S9.400 5.700 12 3z"/>'
  };

  /* ---------- barra superior y menú móvil ---------- */
  var topbar = document.getElementById("topbar");
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");

  function cerrarMenu() {
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menú");
  }
  menuBtn.addEventListener("click", function () {
    var abierto = nav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(abierto));
    menuBtn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") cerrarMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrarMenu(); });
  window.addEventListener("scroll", function () {
    topbar.classList.toggle("is-scrolled", window.scrollY > 8);
  }, { passive: true });

  /* ---------- respiración del hero ---------- */
  var breathWord = document.getElementById("breathWord");
  var inhala = true;
  setInterval(function () {
    inhala = !inhala;
    breathWord.textContent = inhala ? "Inhalá" : "Exhalá";
  }, 4000);

  /* ---------- equipo ---------- */
  var teamGrid = document.getElementById("teamGrid");
  PROFESIONALES.forEach(function (p) {
    var foto = el("div", { class: "person__photo" });
    var fallback = function () {
      foto.textContent = "";
      foto.appendChild(el("div", { class: "person__initials", text: iniciales(p.nombre), "aria-hidden": "true" }));
    };
    if (p.foto) {
      var img = el("img", { src: p.foto, alt: "Foto de " + p.nombre, loading: "lazy", width: "480", height: "600" });
      img.addEventListener("error", fallback);
      foto.appendChild(img);
    } else {
      fallback();
    }
    teamGrid.appendChild(el("article", { class: "person" }, [
      foto,
      el("h3", { text: p.nombre }),
      p.rol ? el("p", { class: "person__role", text: p.rol }) : null,
      el("p", { class: "person__bio", text: p.descripcion })
    ]));
  });

  /* ---------- novedades ---------- */
  var feed = document.getElementById("feed");
  var filtersBox = document.getElementById("filters");
  var moreBtn = document.getElementById("moreBtn");
  var POR_PAGINA = 4;

  var posts = NOVEDADES.slice().sort(function (a, b) {
    return parseFecha(b.fecha) - parseFecha(a.fecha);
  });
  var etiquetaActiva = "Todas";
  var visibles = POR_PAGINA;

  function postNode(n) {
    var cuerpo = Array.isArray(n.texto) ? n.texto : [n.texto];
    var textoBox = el("div", { class: "post__text" }, cuerpo.map(function (t) { return el("p", { text: t }); }));
    var meta = el("div", { class: "post__meta" }, [
      el("time", { datetime: n.fecha, text: formatFecha(n.fecha) }),
      n.etiqueta ? el("span", { class: "tag", text: n.etiqueta }) : null
    ]);
    var body = el("div", { class: "post__body" }, [meta, el("h3", { text: n.titulo }), textoBox]);
    if (n.enlace && n.enlace.url) {
      var a = el("a", { class: "post__link", href: urlSegura(n.enlace.url), text: n.enlace.texto || "Más información" });
      if (/^https?:/i.test(n.enlace.url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      body.appendChild(a);
    }
    var art = el("article", { class: "post" });
    if (n.imagen) {
      var img = el("img", { class: "post__img", src: n.imagen, alt: n.imagenAlt || "", loading: "lazy" });
      img.addEventListener("error", function () { img.remove(); });
      art.appendChild(img);
    }
    art.appendChild(body);
    return art;
  }

  function renderFeed() {
    var lista = posts.filter(function (n) { return etiquetaActiva === "Todas" || n.etiqueta === etiquetaActiva; });
    feed.textContent = "";
    if (!lista.length) {
      feed.appendChild(el("p", { class: "empty", text: "Todavía no hay novedades en esta categoría." }));
    }
    lista.slice(0, visibles).forEach(function (n) { feed.appendChild(postNode(n)); });
    moreBtn.hidden = lista.length <= visibles;
  }

  function renderFiltros() {
    var etiquetas = ["Todas"];
    posts.forEach(function (n) { if (n.etiqueta && etiquetas.indexOf(n.etiqueta) === -1) etiquetas.push(n.etiqueta); });
    if (etiquetas.length <= 2) { filtersBox.hidden = true; return; }
    etiquetas.forEach(function (t) {
      var b = el("button", { class: "chip", type: "button", "aria-pressed": String(t === etiquetaActiva), text: t });
      b.addEventListener("click", function () {
        etiquetaActiva = t;
        visibles = POR_PAGINA;
        Array.prototype.forEach.call(filtersBox.children, function (c) {
          c.setAttribute("aria-pressed", String(c === b));
        });
        renderFeed();
      });
      filtersBox.appendChild(b);
    });
  }

  moreBtn.addEventListener("click", function () { visibles += POR_PAGINA; renderFeed(); });
  renderFiltros();
  renderFeed();

  /* ---------- redes ---------- */
  var socialList = document.getElementById("socialList");
  (CONFIG.redes || []).forEach(function (r) {
    var icono = el("span", { class: "social__icon", "aria-hidden": "true" });
    icono.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" focusable="false">' + (ICONOS[r.icono] || ICONOS.web) + "</svg>";
    var a = el("a", { href: urlSegura(r.url) }, [
      icono,
      el("span", {}, [
        el("span", { class: "social__name", text: r.nombre }),
        r.usuario ? el("span", { class: "social__user", text: r.usuario }) : null
      ])
    ]);
    if (/^https?:/i.test(r.url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    socialList.appendChild(el("li", {}, [a]));
  });

  /* ---------- contacto y pie ---------- */
  var cta = document.getElementById("ctaContacto");
  if (CONFIG.contactoUrl) {
    cta.href = urlSegura(CONFIG.contactoUrl);
    if (/^https?:/i.test(CONFIG.contactoUrl)) { cta.target = "_blank"; cta.rel = "noopener noreferrer"; }
  }
  document.getElementById("footerNote").textContent = CONFIG.notaPie || "";
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- sección activa en el menú ---------- */
  if ("IntersectionObserver" in window) {
    var links = {};
    Array.prototype.forEach.call(nav.querySelectorAll("a"), function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.toggle("is-active", k === en.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }
})();
