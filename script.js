(function () {
  "use strict";

  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function closeNav() {
    links.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("no-scroll", open);
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }

  var revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealTargets.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox.querySelector(".lightbox__img");
  var lightboxCaption = lightbox.querySelector(".lightbox__caption");
  var items = Array.prototype.map.call(
    document.querySelectorAll(".gallery__item"),
    function (btn) {
      return {
        src: btn.getAttribute("data-full"),
        caption: btn.getAttribute("data-caption"),
        alt: btn.querySelector("img").alt
      };
    }
  );
  var current = 0;

  function show() {
    lightboxImg.src = items[current].src;
    lightboxImg.alt = items[current].alt;
    lightboxCaption.textContent = items[current].caption;
  }

  function openLightbox(index) {
    current = index;
    show();
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
    lightbox.querySelector(".lightbox__close").focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.classList.remove("no-scroll");
  }

  if (lightbox && items.length) {
    document.querySelectorAll(".gallery__item").forEach(function (btn, index) {
      btn.addEventListener("click", function () {
        openLightbox(index);
      });
    });

    lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
    lightbox
      .querySelector(".lightbox__next")
      .addEventListener("click", function () {
        current = (current + 1) % items.length;
        show();
      });
    lightbox
      .querySelector(".lightbox__prev")
      .addEventListener("click", function () {
        current = (current - 1 + items.length) % items.length;
        show();
      });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (lightbox && !lightbox.hidden) {
        closeLightbox();
      } else {
        closeNav();
      }
    }
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "ArrowRight") {
      current = (current + 1) % items.length;
      show();
    } else if (e.key === "ArrowLeft") {
      current = (current - 1 + items.length) % items.length;
      show();
    }
  });

  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var button = form.querySelector('[type="submit"]');
      button.disabled = true;
      button.textContent = "Sending...";
      status.classList.remove("is-error");
      status.textContent = "";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            status.textContent =
              "Thanks! Your request is on its way — I'll reply within 24 hours.";
          } else {
            throw new Error("Request failed");
          }
        })
        .catch(function () {
          status.classList.add("is-error");
          status.textContent =
            "Something went wrong sending your message. Please email me directly.";
        })
        .finally(function () {
          button.disabled = false;
          button.textContent = "Send Request";
        });
    });
  }
})();
