// app.js — interactions: theme, typing, nav, reveal, active link, mobile menu

document.addEventListener("DOMContentLoaded", () => {
  /* Elements */
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  const typingEl = document.getElementById("typing");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const menuToggle = document.getElementById("menu-toggle");

  /* 1) Theme (persist) */
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") body.classList.add("dark"), themeToggle.textContent = "☀️";
  else themeToggle.textContent = "🌙";

  themeToggle.addEventListener("click", () => {
    const dark = body.classList.toggle("dark");
    themeToggle.textContent = dark ? "☀️" : "🌙";
    localStorage.setItem("theme", dark ? "dark" : "light");
  });

  /* 2) Typing effect (simple) */
  (function typingEffect(){
    const text = "Hello I'm Dhanushraj";
    let i = 0;
    typingEl.textContent = "";
    const speed = 70;
    const timer = setInterval(() => {
      typingEl.textContent += text.charAt(i);
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
  })();

  /* 3) Mobile menu toggle */
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    body.classList.toggle("nav-open");
  });

  // Close mobile nav when a link is clicked
  document.getElementById("nav-list").addEventListener("click", (e) => {
    if (e.target.matches(".nav-link") && body.classList.contains("nav-open")) {
      body.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* 4) Smooth scroll for nav links */
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${targetId}`);
      }
    });
  });

  /* 5) IntersectionObserver: reveal on scroll + active nav highlight
       - rootMargin adjusted so a section becomes active when roughly centered
       - Guarantees no nav shows active on load until you scroll into a section
  */
  const observerOptions = {
    root: null,
    rootMargin: "-30% 0px -30% 0px",
    threshold: 0
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute("id");
      if (entry.isIntersecting) {
        // reveal animation
        entry.target.classList.add("active");
        // set active link
        navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
      } else {
        // remove reveal (optional)
        entry.target.classList.remove("active");
      }
    });
  }, observerOptions);

  sections.forEach(s => io.observe(s));

  /* 6) Footer year */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
