// js/router.js
export async function loadSection(name) {
  try {
    const res = await fetch(`partials/${name}.html`);
    if (!res.ok) throw new Error(`Cannot load ${name}.html`);
    document.getElementById('gameContainer').innerHTML = await res.text();
  } catch (e) {
    console.error(e);
  }
}

function handleHash() {
  // default to 'lesson' if no hash is provided
  const section = location.hash.replace('#/', '') || 'lesson';
  loadSection(section);
}

export function initRouting() {
  window.addEventListener('hashchange', handleHash);
  handleHash();
}
