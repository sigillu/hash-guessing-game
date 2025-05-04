// js/router.js
export async function loadSection(name) {
  try {
    const res = await fetch(`partials/${name}.html`);
    if (!res.ok) throw new Error(`Cannot load ${name}.html`);
    const html = await res.text();
    document.getElementById('gameContainer').innerHTML = html;
    // Debug
    console.log(`Loaded section: ${name}`);
    // call section initializer if defined
    const fn = window[`init_${name}`];
    if (typeof fn === 'function') {
      console.log(`Initializing: init_${name}`);
      fn();
    }
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
