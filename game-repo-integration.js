/* Adds the games in Patrickmango49/game to McCrack without touching the existing catalogue.
   Game titles, descriptions, and artwork are read from each game's own HTML source when possible. */
(() => {
  const OWNER = 'Patrickmango49';
  const REPO = 'game';
  const BRANCH = 'main';
  const PAGES_ROOT = 'https://' + OWNER.toLowerCase() + '.github.io/' + REPO + '/';
  const API_ROOT = 'https://api.github.com/repos/' + OWNER + '/' + REPO;
  const grid = document.getElementById('gameRepoGrid');
  if (!grid) return;

  const ignored = new Set(['.git', '.github', '.vscode', 'assets', 'images', 'img', 'css', 'js', 'fonts', 'audio', 'video', 'build', 'dist', 'node_modules']);
  const pretty = value => String(value || '').replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeSlug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const attr = (doc, selector, name) => doc.querySelector(selector)?.getAttribute(name)?.trim() || '';

  function buildTile(folder, source) {
    const fallbackName = pretty(folder.name);
    const titleTag = source.title || '';
    const heading = source.heading || '';
    const name = (titleTag && !/^(game|index|home|play|untitled)$/i.test(titleTag) ? titleTag : '') || heading || fallbackName;
    const url = PAGES_ROOT + folder.path.split('/').map(encodeURIComponent).join('/') + '/';
    const img = source.image || '';
    const desc = source.description || (name + ' — browser game discovered in the game repository. Open the source page for the original game and its instructions.');
    const id = 'repo-game-' + safeSlug(folder.path);
    const imageMarkup = img
      ? '<img loading="lazy" src="' + escapeHtml(img) + '" alt="" onerror="this.remove()">'
      : '';
    return '<button type="button" class="media-tile repo-game-tile" id="' + escapeHtml(id) +
      '" data-src="' + escapeHtml(url) + '" data-source-url="' + escapeHtml(url) +
      '" data-local-src="' + escapeHtml('games/' + folder.path.split('/').map(encodeURIComponent).join('/') + '/index.html') +
      '" data-description="' + escapeHtml(desc) + '" data-repo-path="' + escapeHtml(folder.path) +
      '" aria-label="Play ' + escapeHtml(name) + '">' +
      imageMarkup + '<span>' + escapeHtml(name) + '</span></button>';
  }

  async function readSource(folder) {
    const rawUrl = 'https://raw.githubusercontent.com/' + OWNER + '/' + REPO + '/' + BRANCH + '/' +
      folder.path.split('/').map(encodeURIComponent).join('/') + '/index.html';
    try {
      const response = await fetch(rawUrl, { cache: 'no-store' });
      if (!response.ok) return { title: '', heading: '', description: '', image: '' };
      const text = await response.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const title = (doc.querySelector('title')?.textContent || '').trim();
      const heading = (doc.querySelector('h1')?.textContent || doc.querySelector('h2')?.textContent || '').trim();
      const description = attr(doc, 'meta[name="description"]', 'content') ||
        attr(doc, 'meta[property="og:description"]', 'content') ||
        attr(doc, 'meta[name="twitter:description"]', 'content');
      let image = attr(doc, 'meta[property="og:image"]', 'content') ||
        attr(doc, 'meta[name="twitter:image"]', 'content');
      if (!image) image = doc.querySelector('img[src]')?.getAttribute('src') || '';
      if (image) {
        try { image = new URL(image, PAGES_ROOT + folder.path.split('/').map(encodeURIComponent).join('/') + '/').href; }
        catch (_) { image = ''; }
      }
      return { title, heading, description, image };
    } catch (_) {
      return { title: '', heading: '', description: '', image: '' };
    }
  }

  function renderGroups(cards) {
    if (!cards.length) {
      grid.innerHTML = '<div class="media-row"><p class="repo-games-loading">No additional game folders were found in the source repository.</p></div>';
      return;
    }
    const rows = [];
    for (let i = 0; i < cards.length; i += 5) {
      rows.push('<div class="media-row" data-row="repo-' + (i / 5 + 1) + '">' + cards.slice(i, i + 5).join('') + '</div>');
    }
    grid.innerHTML = rows.join('');
    const count = document.createElement('p');
    count.className = 'repo-games-count';
    count.textContent = cards.length + ' additional games found in Patrickmango49/game.';
    grid.insertAdjacentElement('beforebegin', count);
  }

  async function load() {
    try {
      const response = await fetch(API_ROOT + '/contents/?ref=' + encodeURIComponent(BRANCH) + '&per_page=100', { cache: 'no-store' });
      if (!response.ok) throw new Error('GitHub returned ' + response.status);
      const root = await response.json();
      if (!Array.isArray(root)) throw new Error('Unexpected repository response');
      const folders = root.filter(item => item.type === 'dir' && !ignored.has(String(item.name).toLowerCase()));
      const cards = [];
      let cursor = 0;
      async function worker() {
        while (cursor < folders.length) {
          const folder = folders[cursor++];
          const source = await readSource(folder);
          cards.push({ sortName: (source.title || source.heading || pretty(folder.name)).toLowerCase(), html: buildTile(folder, source) });
        }
      }
      await Promise.all(Array.from({ length: Math.min(4, folders.length) }, worker));
      cards.sort((a, b) => a.sortName.localeCompare(b.sortName));
      renderGroups(cards.map(card => card.html));
    } catch (error) {
      grid.innerHTML = '<div class="media-row"><p class="repo-games-loading">Could not load the source repository right now. Existing McCrack games still work. ' +
        escapeHtml(error.message || '') + '</p></div>';
    }
  }
  load();
})();