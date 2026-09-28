/* =========================================================
   Sahara Tijol, portfolio script

   Three small jobs:
     1. The paper/night theme toggle, remembered between visits
     2. Marking the contents entry for the section you're reading
     3. The year in the colophon

   There's no mobile menu to manage: under 1020px the rail becomes a
   header and the contents list becomes a plain row of links.
   ========================================================= */

/* ---------- 1. THEME TOGGLE ----------
   The theme lives on <html data-theme="paper"> or "night", and the CSS
   reads it. The choice is saved so it survives a refresh.

   localStorage throws in private browsing or with cookies blocked, so
   every read and write is wrapped in try/catch. The site works without it. */

const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeWord = document.getElementById('themeWord');
const STORAGE_KEY = 'theme';

function setTheme(theme) {
  root.setAttribute('data-theme', theme);

  // The button names where it will take you, not where you are.
  const next = theme === 'paper' ? 'night' : 'paper';
  themeWord.textContent = next === 'night' ? 'Night' : 'Paper';
  themeToggle.setAttribute('aria-label', `Switch to the ${next} theme`);

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (err) {
    // Storage isn't available. Not worth stopping over.
  }
}

themeToggle.addEventListener('click', () => {
  setTheme(root.getAttribute('data-theme') === 'paper' ? 'night' : 'paper');
});

// Match the button's label to whichever theme loaded.
setTheme(root.getAttribute('data-theme') || 'paper');

/* ---------- 2. ACTIVE CONTENTS ENTRY ----------
   IntersectionObserver reports when a section crosses the viewport. The
   rootMargin trims the top and bottom so a section only counts as
   "current" once it reaches roughly the middle of the screen. */

const entries = Array.from(document.querySelectorAll('.contents-list a[href^="#"]'));
const sections = entries
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver(
    (observed) => {
      observed.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entries.forEach((link) => {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- 3. YEAR ---------- */

document.getElementById('year').textContent = new Date().getFullYear();
