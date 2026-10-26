/* ============================================================
   MINSANTE — Plateforme Étudiante Officielle
   Interactions : menu mobile, header, animations, compteurs,
   onglets du tableau de bord, horloge du téléphone.
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initBurger();
    initReveal();
    initCounters();
    initDashboardTabs();
    initClock();
    initPasswordToggle();
  });

  /* ---------- Header : ombre au scroll ---------- */
  function initHeader() {
    var header = document.getElementById("header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menu mobile ---------- */
  function initBurger() {
    var burger = document.getElementById("burger");
    var links = document.getElementById("navLinks");
    if (!burger || !links) return;

    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Apparition au scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 6) * 0.06 + "s";
      io.observe(el);
    });
  }

  /* ---------- Compteurs animés ---------- */
  function initCounters() {
    var counters = document.querySelectorAll(".count");
    if (!counters.length) return;

    function animate(el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1600;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = value.toLocaleString("fr-FR") + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Onglets du tableau de bord (téléphone) ---------- */
  function initDashboardTabs() {
    var tabs = document.querySelectorAll(".dash__tabs button");
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");

        var name = tab.getAttribute("data-tab");
        var panels = document.querySelectorAll(".dash__panel");
        panels.forEach(function (p) {
          p.classList.toggle("active", p.getAttribute("data-panel") === name);
        });
      });
    });

    var sides = document.querySelectorAll(".dash__side button[data-side]");
    sides.forEach(function (btn) {
      btn.addEventListener("click", function () {
        sides.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
      });
    });
  }

  /* ---------- Horloge (barre de statut du téléphone) ---------- */
  function initClock() {
    var el = document.getElementById("phoneClock");
    if (!el) return;

    function tick() {
      var d = new Date();
      el.textContent = d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
    }
    tick();
    setInterval(tick, 15000);
  }

  /* ---------- Afficher / masquer le mot de passe ---------- */
  function initPasswordToggle() {
    document.querySelectorAll(".password-wrap .toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var input = btn.parentElement.querySelector("input");
        if (!input) return;
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.setAttribute("aria-label", show ? "Masquer le mot de passe" : "Afficher le mot de passe");
        btn.querySelectorAll("use").forEach(function (u) {
          u.setAttribute("href", show ? "#i-lock" : "#i-eye");
        });
      });
    });
  }
})();
