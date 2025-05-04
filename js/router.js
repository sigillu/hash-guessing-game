// js/router.js
export async function loadSection(name) {
  try {
    const res = await fetch(`partials/${name}.html`);
    if (!res.ok) throw new Error(`Cannot load ${name}.html`);
    const html = await res.text();
    const container = document.getElementById('gameContainer');
    container.innerHTML = html;
    // Unhide the section if it has 'hidden' class
    const sectionEl = container.querySelector(`#${name}`);
    if (sectionEl && sectionEl.classList.contains('hidden')) {
      sectionEl.classList.remove('hidden');
    }
    // Debug log
    console.log(`Loaded and displayed section: ${name}`);
    // Call section initializer if it exists
    const fn = window[`init_${name}`];
    if (typeof fn === 'function') fn();
  } catch (e) {
    console.error(e);
  }
}

function handleHash() {
  const section = location.hash.replace('#/', '') || 'lesson';
  loadSection(section);
}

export function initRouting() {
  window.addEventListener('hashchange', handleHash);
  handleHash();
}
