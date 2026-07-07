/* =========================================================
   LLWeb — Interactions
   ========================================================= */
(function () {
  "use strict";

  /* ----- Menu mobile ----- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("menu");

  function closeMenu() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Ouvrir le menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });

    // Refermer après un clic sur un lien
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Refermer avec la touche Échap
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* ----- Ombre de l'en-tête au défilement ----- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----- Apparition au défilement ----- */
  const reveals = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ----- Année du pied de page ----- */
  const annee = document.getElementById("annee");
  if (annee) annee.textContent = new Date().getFullYear();

  /* ----- Formulaire de contact (envoi via Web3Forms → contact@llweb.fr) ----- */
  // Clé d'accès Web3Forms (publique par conception : elle ne permet que
  // d'envoyer vers l'adresse configurée). À récupérer sur https://web3forms.com
  const WEB3FORMS_ACCESS_KEY = "REMPLACEZ_PAR_VOTRE_CLE";

  const form = document.getElementById("form-contact");
  const note = document.getElementById("form-note");

  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        note.textContent = "Merci de remplir les champs obligatoires.";
        note.className = "form-note error";
        const firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (WEB3FORMS_ACCESS_KEY === "REMPLACEZ_PAR_VOTRE_CLE") {
        note.textContent = "Le formulaire n'est pas encore activé. Écrivez-nous à contact@llweb.fr.";
        note.className = "form-note error";
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const btnLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi en cours…";
      note.textContent = "";
      note.className = "form-note";

      const data = new FormData(form);
      data.append("access_key", WEB3FORMS_ACCESS_KEY);
      data.append("from_name", "Site llweb.fr");
      data.append("subject", "Nouvelle demande via llweb.fr : " + form.nom.value);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (resp) { return resp.json(); })
        .then(function (json) {
          if (json.success) {
            note.textContent = "Merci ! Votre demande a bien été envoyée. Nous vous répondons sous 48 h.";
            note.className = "form-note ok";
            form.reset();
          } else {
            throw new Error(json.message || "échec de l'envoi");
          }
        })
        .catch(function () {
          note.textContent = "L'envoi a échoué. Réessayez, ou écrivez-nous à contact@llweb.fr.";
          note.className = "form-note error";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = btnLabel;
        });
    });
  }
})();

/* =========================================================
   Aperçu de site : mini-fenêtre + lightbox avec transition
   ========================================================= */
(function () {
  "use strict";

  const card = document.getElementById("demo-open");
  const lightbox = document.getElementById("demo-lightbox");
  if (!card || !lightbox) return;

  const DEMO_URL = "https://vindemo.vercel.app/";
  const modal = lightbox.querySelector(".demo-modal");
  const modalFrame = lightbox.querySelector(".demo-modal-frame");
  const viewport = card.querySelector(".demo-viewport");
  const thumbFrame = card.querySelector(".demo-frame");
  const closers = lightbox.querySelectorAll("[data-demo-close]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lastFocus = null;

  /* ----- Mise à l'échelle « bureau » de la miniature ----- */
  const BASE_W = 1280;
  function scaleThumb() {
    if (!viewport || !thumbFrame) return;
    const w = viewport.clientWidth;
    const h = viewport.clientHeight;
    if (!w || !h) return;
    const scale = w / BASE_W;
    thumbFrame.style.width = BASE_W + "px";
    thumbFrame.style.height = h / scale + "px";
    thumbFrame.style.transform = "scale(" + scale + ")";
  }
  if ("ResizeObserver" in window) {
    new ResizeObserver(scaleThumb).observe(viewport);
  } else {
    window.addEventListener("resize", scaleThumb, { passive: true });
  }
  scaleThumb();
  if (thumbFrame) thumbFrame.addEventListener("load", scaleThumb);

  /* ----- Anti-vol de focus : le site distant peut prendre le focus à son
     chargement, ce qui fait défiler la page jusqu'à l'iframe. On garde la
     position de scroll et on neutralise immédiatement. ----- */
  let pageY = window.scrollY;
  window.addEventListener("scroll", function () { pageY = window.scrollY; }, { passive: true });
  window.addEventListener("blur", function () {
    if (document.activeElement === thumbFrame) {
      thumbFrame.blur();
      window.scrollTo(0, pageY);
    }
  });

  /* ----- Chargement de l'aperçu uniquement quand la carte approche de
     l'écran (évite le chargement lointain qui provoquait le saut) ----- */
  if (thumbFrame && thumbFrame.dataset.src) {
    if ("IntersectionObserver" in window) {
      const loadObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            thumbFrame.src = thumbFrame.dataset.src;
            loadObs.disconnect();
          }
        });
      }, { rootMargin: "120px" });
      loadObs.observe(thumbFrame);
    } else {
      thumbFrame.src = thumbFrame.dataset.src;
    }
  }

  /* ----- Transition FLIP (la miniature s'agrandit vers la modale) ----- */
  function flip(toThumb) {
    const thumb = card.getBoundingClientRect();
    modal.style.transform = "none";
    const target = modal.getBoundingClientRect();
    const sx = thumb.width / target.width;
    const sy = thumb.height / target.height;
    const tx = thumb.left - target.left;
    const ty = thumb.top - target.top;
    const inverted = "translate(" + tx + "px," + ty + "px) scale(" + sx + "," + sy + ")";
    if (toThumb) {
      modal.style.transform = inverted; // identité -> miniature (fermeture)
    } else {
      modal.style.transition = "none"; // place sur la miniature sans animer
      modal.style.transform = inverted;
      void modal.offsetWidth; // reflow
      modal.style.transition = "";
      requestAnimationFrame(function () {
        lightbox.classList.add("open");
        modal.style.transform = ""; // -> identité (ouverture)
      });
    }
  }

  function getFocusable() {
    return Array.prototype.slice
      .call(lightbox.querySelectorAll('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'))
      .filter(function (el) { return el.offsetParent !== null; });
  }

  function onKeydown(e) {
    if (e.key === "Escape") { e.preventDefault(); closeDemo(); return; }
    if (e.key === "Tab") {
      const f = getFocusable();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function openDemo() {
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";

    if (modalFrame.getAttribute("src") !== DEMO_URL) {
      modalFrame.setAttribute("src", DEMO_URL);
    }

    if (reduceMotion) {
      lightbox.classList.add("open");
    } else {
      flip(false);
    }

    document.addEventListener("keydown", onKeydown);
    const closeBtn = lightbox.querySelector(".demo-close");
    window.setTimeout(function () { if (closeBtn) closeBtn.focus(); }, reduceMotion ? 0 : 80);
  }

  function closeDemo() {
    document.removeEventListener("keydown", onKeydown);
    let finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      modal.removeEventListener("transitionend", onEnd);
      lightbox.hidden = true;
      lightbox.classList.remove("open", "loaded");
      modal.style.transform = "";
      document.body.style.overflow = "";
      modalFrame.setAttribute("src", "about:blank"); // libère la ressource
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function onEnd(e) {
      if (e.target === modal && e.propertyName === "transform") finish();
    }

    if (reduceMotion) {
      lightbox.classList.remove("open");
      finish();
      return;
    }
    lightbox.classList.remove("open"); // estompe le voile
    flip(true);                        // ramène la modale vers la miniature
    modal.addEventListener("transitionend", onEnd);
    window.setTimeout(finish, 650);    // filet de sécurité
  }

  card.addEventListener("click", openDemo);
  closers.forEach(function (el) { el.addEventListener("click", closeDemo); });
  modalFrame.addEventListener("load", function () {
    if (modalFrame.getAttribute("src") !== "about:blank") lightbox.classList.add("loaded");
  });
})();

/* =========================================================
   Curseur « viseur » qui pointe vers la démo (section Pourquoi)
   ========================================================= */
(function () {
  "use strict";
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const section = document.getElementById("pourquoi");
  const target = document.getElementById("demo-open");
  if (!section || !target) return;

  const aim = document.createElement("div");
  aim.className = "aim";
  aim.setAttribute("aria-hidden", "true");
  aim.innerHTML =
    '<span class="aim-inner">' +
    '<span class="aim-ring"></span>' +
    '<span class="aim-rot"><span class="aim-arrow">' +
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
    "</span></span>" +
    '<span class="aim-label">Voir la démo</span>' +
    "</span>";
  document.body.appendChild(aim);

  let mx = 0, my = 0, raf = null, visible = false, acc = 0;

  function render() {
    raf = null;
    aim.style.transform = "translate(" + mx + "px," + my + "px)";
    const r = target.getBoundingClientRect();
    const ang =
      (Math.atan2(r.top + r.height / 2 - my, r.left + r.width / 2 - mx) * 180) / Math.PI;
    // garde le chemin le plus court (évite le tour complet au passage ±180°)
    const delta = ((((ang - acc) % 360) + 540) % 360) - 180;
    acc += delta;
    aim.style.setProperty("--angle", acc.toFixed(1) + "deg");
  }
  function show() { if (!visible) { visible = true; aim.classList.add("show"); } }
  function hide() { if (visible) { visible = false; aim.classList.remove("show"); } }

  section.addEventListener("mousemove", function (e) {
    mx = e.clientX;
    my = e.clientY;
    // masque le viseur sur tout élément interactif (démo, CTA, liens…)
    if (e.target.closest("a, button")) { hide(); } else { show(); }
    if (!raf) raf = requestAnimationFrame(render);
  });
  section.addEventListener("mouseleave", hide);
})();
