document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Hero role rotator (word-by-word typewriter) ---------- */
  const roleEl = document.getElementById("roleRotator");
  if (roleEl) {
    const roles = ["Full Stack Web Developer", "Front-End Developer", "DevOps Enthusiast"];
    let roleIndex = 0;

    function typeWords(words, onDone) {
      let i = 0;
      roleEl.textContent = "";
      const interval = setInterval(() => {
        roleEl.textContent = words.slice(0, i + 1).join(" ");
        i++;
        if (i >= words.length) {
          clearInterval(interval);
          setTimeout(onDone, 1300);
        }
      }, 260);
    }

    function eraseWords(words, onDone) {
      let i = words.length;
      const interval = setInterval(() => {
        i--;
        roleEl.textContent = words.slice(0, i).join(" ");
        if (i <= 0) {
          clearInterval(interval);
          setTimeout(onDone, 300);
        }
      }, 200);
    }

    function cycleRoles() {
      const words = roles[roleIndex].split(" ");
      typeWords(words, () => {
        eraseWords(words, () => {
          roleIndex = (roleIndex + 1) % roles.length;
          cycleRoles();
        });
      });
    }
    cycleRoles();
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

  const setActiveLink = () => {
    let currentId = "";
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        currentId = section.id;
      }
    });
    navAnchors.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + currentId);
    });
  };
  document.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Project filter ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.style.display = show ? "flex" : "none";
      });
    });
  });

  /* ---------- Modal (images / video) ---------- */
  const modalOverlay = document.getElementById("modalOverlay");
  const modalBox = document.getElementById("modalBox");
  const modalContent = document.getElementById("modalContent");
  const modalClose = document.getElementById("modalClose");

  function openModal(type, src, title) {
    modalBox.classList.remove("modal-video", "modal-image");
    modalContent.innerHTML = "";

    if (type === "video") {
      modalBox.classList.add("modal-video");
      modalContent.innerHTML = `
        <video controls playsinline preload="auto">
          <source src="${src}">
          Your browser does not support this video.
        </video>
        <p class="modal-video-error" style="display:none; color:#f2c2c2; background:#000; padding:16px 20px; font-size:0.9rem; text-align:center;"></p>
      `;

      const videoEl = modalContent.querySelector("video");
      const errorEl = modalContent.querySelector(".modal-video-error");

      videoEl.addEventListener("error", () => {
        errorEl.style.display = "block";
        errorEl.textContent =
          "This video could not be loaded. Check that the file \"" + src +
          "\" exists with that exact name, and that it is a standard H.264 MP4 file.";
      });

      videoEl.play().catch(() => {
        /* Controls stay visible, so the user can press play manually. */
      });
    } else if (type === "image") {
      modalBox.classList.add("modal-image");
      modalContent.innerHTML = `<img src="${src}" alt="${title || ""}">`;
    } else if (type === "resume") {
      modalBox.classList.add("modal-resume");
      modalContent.innerHTML = `
        <img src="${src}" alt="${title || "CV"}">
        <a class="btn btn-primary modal-download-btn" href="${src}" download>Download CV</a>
      `;
    }

    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.classList.remove("open");
    modalContent.innerHTML = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-modal]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const type = el.dataset.modal;
      const src = el.dataset.src;
      const title = el.dataset.title;
      openModal(type, src, title);
    });
  });

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("open")) closeModal();
  });

});
