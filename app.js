(function () {
  const DEFAULT_TITLE = 'McCrack';
  const DEFAULT_FAVICON = 'https://example.com';
  const defaultWallpaper = 'gradient';

  function ensureFavicon() {
    let icon = document.querySelector('link[rel="icon"]');
    if (!icon) {
      icon = document.createElement('link');
      icon.rel = 'icon';
      document.head.appendChild(icon);
    }
    return icon;
  }

  function applySettings() {
    const savedTitle = localStorage.getItem('mc_tab_name') || DEFAULT_TITLE;
    const savedFavicon = localStorage.getItem('mc_favicon_url') || DEFAULT_FAVICON;
    const wallType = localStorage.getItem('mc_wallpaper_type') || defaultWallpaper;
    const wallData = localStorage.getItem('mc_wallpaper_value') || '';

    document.title = savedTitle;
    ensureFavicon().href = savedFavicon;

    if (wallType === 'url' && wallData) {
      document.body.style.background = `center / cover no-repeat url('${wallData}')`;
    } else {
      document.body.style.background = 'linear-gradient(170deg, #050505 0%, #1a1a1a 35%, #7d7d7d 70%, #dadada 100%)';
    }
  }

  function setupMediaLauncher() {
    const mediaGrid = document.querySelector('.media-grid[data-media-kind]');
    if (!mediaGrid) return;

    const kind = mediaGrid.dataset.mediaKind === 'movie' ? 'movie' : 'game';
    const launcher = document.createElement('div');
    launcher.className = 'media-launcher';
    launcher.innerHTML = `
      <button class="media-launcher-close" type="button" aria-label="Close player">✕</button>
      <div class="media-launcher-shell">
        <div class="media-launcher-frame-wrap">
          <div class="media-launcher-loader" aria-live="polite">
            <div class="media-launcher-spinner" aria-hidden="true"></div>
            <p>${kind === 'movie' ? 'Loading movie…' : 'Loading game…'}</p>
          </div>
          <iframe id="mediaFrame" src="about:blank" referrerpolicy="no-referrer" allow="autoplay; fullscreen"></iframe>
        </div>
        ${kind === 'game' ? '<button class="media-launcher-fullscreen" type="button">Fullscreen</button>' : ''}
      </div>
    `;

    document.body.appendChild(launcher);

    const closeButton = launcher.querySelector('.media-launcher-close');
    const frame = launcher.querySelector('#mediaFrame');
    const loader = launcher.querySelector('.media-launcher-loader');
    const fullscreenButton = launcher.querySelector('.media-launcher-fullscreen');

    function clearLoader() {
      loader.classList.add('is-hidden');
    }

    function showLoader() {
      loader.classList.remove('is-hidden');
      window.setTimeout(clearLoader, 4000);
    }

    function openLauncher(url) {
      showLoader();
      frame.src = url;
      launcher.classList.add('is-open');
      document.body.classList.add('launcher-open');
    }

    function closeLauncher() {
      launcher.classList.remove('is-open');
      document.body.classList.remove('launcher-open');
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      frame.src = 'about:blank';
    }

    mediaGrid.addEventListener('click', (event) => {
      const tile = event.target.closest('.media-tile[data-src]');
      if (!tile) return;
      event.preventDefault();
      openLauncher(tile.dataset.src);
    });

    frame.addEventListener('load', () => {
      clearLoader();
    });

    closeButton.addEventListener('click', closeLauncher);

    launcher.addEventListener('click', (event) => {
      if (event.target === launcher) {
        closeLauncher();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && launcher.classList.contains('is-open')) {
        closeLauncher();
      }
    });

    if (fullscreenButton) {
      fullscreenButton.addEventListener('click', async () => {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
          return;
        }

        const target = launcher.querySelector('.media-launcher-shell');
        if (target.requestFullscreen) {
          await target.requestFullscreen();
        }
      });
    }
  }

  function populateMediaGrid() {
    const mediaGrid = document.querySelector('.media-grid[data-media-kind]');
    if (!mediaGrid) return;

    const kind = mediaGrid.dataset.mediaKind === 'movie' ? 'Movie' : 'Game';
    const rows = Number.parseInt(mediaGrid.dataset.mediaRows || '50', 10);
    const perRow = Number.parseInt(mediaGrid.dataset.mediaPerRow || '5', 10);
    const totalTiles = rows * perRow;
    const cards = [];

    for (let index = 1; index <= totalTiles; index += 1) {
      cards.push(`
        <button class="media-tile" type="button" data-src="https://example.com/${kind.toLowerCase()}-${index}">
          <img src="https://picsum.photos/seed/${kind.toLowerCase()}-${index}/600/600" alt="${kind} ${index}" />
          <span>${kind} ${index}</span>
        </button>
      `);
    }

    mediaGrid.innerHTML = cards.join('');
  }

  window.mcApp = {
    applySettings,
    populateMediaGrid,
    defaults: { DEFAULT_TITLE, DEFAULT_FAVICON, defaultWallpaper }
  };

  applySettings();
  populateMediaGrid();
  setupMediaLauncher();
})();
