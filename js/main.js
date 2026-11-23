"use strict";

document.documentElement.classList.add("js-enabled");

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const repoGrid = document.querySelector("#repo-grid");
const githubUsername = "hunter-zen-RU";
const languageColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572a5",
  Java: "#b07219",
  Kotlin: "#a97bff",
  HTML: "#e34c26",
  CSS: "#563d7c",
  PHP: "#4f5d95",
  C: "#555555"
};

function createRepoCard(repo) {
  const card = document.createElement("article");
  card.className = "repo-card";

  const heading = document.createElement("h4");
  const link = document.createElement("a");
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = repo.name;
  heading.append(link);

  const description = document.createElement("p");
  description.textContent = repo.description || "A public project from the HUNRUTECH founder.";

  const meta = document.createElement("div");
  meta.className = "repo-meta";

  const language = document.createElement("span");
  language.className = "repo-language";
  if (repo.language) {
    const dot = document.createElement("i");
    dot.className = "language-dot";
    dot.setAttribute("aria-hidden", "true");
    dot.style.backgroundColor = languageColors[repo.language] || "#00f0ff";
    language.append(dot, document.createTextNode(repo.language));
  } else {
    language.textContent = "Open source";
  }

  const stars = document.createElement("span");
  stars.className = "repo-stars";
  stars.setAttribute("aria-label", `${repo.stargazers_count} stars`);
  stars.textContent = `★ ${repo.stargazers_count}`;

  meta.append(language, stars);
  card.append(heading, description, meta);
  return card;
}

async function loadRepositories() {
  if (!repoGrid) return;

  try {
    const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100&type=public`, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

    const repositories = await response.json();
    const visibleRepositories = repositories.filter((repo) => !repo.fork).slice(0, 6);
    repoGrid.replaceChildren();

    if (visibleRepositories.length === 0) {
      const emptyState = document.createElement("p");
      emptyState.className = "repo-state mono";
      emptyState.textContent = "No public repositories to show just yet.";
      repoGrid.append(emptyState);
      return;
    }

    visibleRepositories.forEach((repo) => repoGrid.append(createRepoCard(repo)));
  } catch (error) {
    console.error("Unable to load public GitHub repositories:", error);
    const errorState = document.createElement("p");
    errorState.className = "repo-state mono";
    errorState.textContent = "Repositories could not be loaded right now. Visit the GitHub profile to explore public work.";
    const profileLink = document.createElement("a");
    profileLink.href = `https://github.com/${githubUsername}?tab=repositories`;
    profileLink.target = "_blank";
    profileLink.rel = "noopener noreferrer";
    profileLink.textContent = " Open GitHub ↗";
    errorState.append(profileLink);
    repoGrid.replaceChildren(errorState);
  }
}

loadRepositories();

const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");

if (contactForm instanceof HTMLFormElement) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const message = String(formData.get("message")).trim();
    const subject = encodeURIComponent(`HUNRUTECH project inquiry from ${name}`);
    const body = encodeURIComponent(`Hi HUNRUTECH,\n\n${message}\n\nName: ${name}\nEmail: ${email}`);

    if (formNote) formNote.textContent = "Your email app should open with the inquiry ready to send. Add the recipient before sending.";
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  });
}

const yearElement = document.querySelector("#current-year");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());
