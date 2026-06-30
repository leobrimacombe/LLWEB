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

  /* ----- Formulaire de contact (démonstration) ----- */
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

      // TODO : brancher l'envoi réel (e-mail, Formspree, API…).
      // Pour l'instant, on simule un envoi réussi.
      note.textContent = "Merci ! Votre demande a bien été prise en compte. Nous vous répondons sous 48 h.";
      note.className = "form-note ok";
      form.reset();
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
