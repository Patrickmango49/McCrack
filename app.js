(function () {
  const DEFAULT_TITLE = 'McCrack';
  const DEFAULT_FAVICON = 'https://example.com';
  const defaultWallpaper = 'linear-gradient(170deg, #050505 0%, #1a1a1a 35%, #7d7d7d 70%, #dadada 100%)';

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
    const wallType = localStorage.getItem('mc_wallpaper_type') || 'gradient';
    const wallData = localStorage.getItem('mc_wallpaper_value') || defaultWallpaper;

    document.title = savedTitle;
    ensureFavicon().href = savedFavicon;

    if (wallType === 'url' && wallData) {
      document.body.style.background = `center / cover no-repeat url('${wallData}')`;
    } else if (wallType === 'gradient' && wallData) {
      document.body.style.background = wallData;
    } else {
      document.body.style.background = defaultWallpaper;
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
    const frameWrap = launcher.querySelector('.media-launcher-frame-wrap');

    function clearLoader() {
      loader.classList.add('is-hidden');
    }

    function showLoader() {
      loader.classList.remove('is-hidden');
      window.setTimeout(clearLoader, 4000);
    }

    function fitLauncherToViewport() {
      const viewportWidth = Math.max(320, window.innerWidth - 32);
      const viewportHeight = Math.max(220, window.innerHeight - (fullscreenButton ? 170 : 110));
      const width = Math.min(1200, viewportWidth, viewportHeight * (16 / 9));
      const height = width * (9 / 16);

      frameWrap.style.width = `${Math.floor(width)}px`;
      frameWrap.style.height = `${Math.floor(height)}px`;
    }

    function openLauncher(url) {
      fitLauncherToViewport();
      showLoader();
      frame.src = url;
      launcher.classList.add('is-open');
      document.body.classList.add('launcher-open');
    }

    function closeLauncher() {
      launcher.classList.remove('is-open');
      document.body.classList.remove('launcher-open');
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
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

    window.addEventListener('resize', () => {
      if (!launcher.classList.contains('is-open')) return;
      fitLauncherToViewport();
    });

    if (fullscreenButton) {
      fullscreenButton.addEventListener('click', async () => {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
          return;
        }

        const target = launcher.querySelector('.media-launcher-shell');
        if (target.requestFullscreen) {
          await target.requestFullscreen();
        } else if (target.webkitRequestFullscreen) {
          target.webkitRequestFullscreen();
        }
      });
    }
  }

  function readMediaData(kind) {
    const dataNode = document.getElementById('mediaData');
    if (!dataNode) return [];

    try {
      const parsed = JSON.parse(dataNode.textContent || '[]');
      if (!Array.isArray(parsed)) return [];

      return parsed
        .map((item) => ({
          title: String(item.title || '').trim(),
          image: String(item.image || '').trim(),
          src: String(item.src || '').trim()
        }))
        .filter((item) => item.title && item.image && item.src);
    } catch (error) {
      console.error(`Invalid mediaData JSON on ${kind} page.`, error);
      return [];
    }
  }

  function buildFallbackCards(kind) {
    return Array.from({ length: 10 }, (_, index) => {
      const number = index + 1;
      return {
        title: `${kind} ${number}`,
        image: `https://picsum.photos/seed/${kind.toLowerCase()}-${number}/600/600`,
        src: `https://example.com/${kind.toLowerCase()}-${number}`
      };
    });
  }

  function normalizeMediaCards(kind, mediaItems) {
    const targetCount = 250;
    const trimmed = mediaItems.slice(0, targetCount);
    const needed = targetCount - trimmed.length;

    if (needed <= 0) return trimmed;

    const fallbackCards = Array.from({ length: needed }, (_, index) => {
      const number = trimmed.length + index + 1;
      return {
        title: `${kind} ${number}`,
        image: `https://picsum.photos/seed/${kind.toLowerCase()}-${number}/600/600`,
        src: `https://example.com/${kind.toLowerCase()}-${number}`
      };
    });

    return trimmed.concat(fallbackCards);
  }

  function populateMediaGrid() {
    const mediaGrid = document.querySelector('.media-grid[data-media-kind]');
    if (!mediaGrid) return;

    const kind = mediaGrid.dataset.mediaKind === 'movie' ? 'Movie' : 'Game';
    const mediaItems = readMediaData(kind) || [];
    const cardsToRender = normalizeMediaCards(kind, mediaItems.length ? mediaItems : buildFallbackCards(kind));

    mediaGrid.innerHTML = cardsToRender
      .map(
        (item) => `
        <button class="media-tile" type="button" data-src="${item.src}">
          <img src="${item.image}" alt="${item.title}" />
          <span>${item.title}</span>
        </button>
      `
      )
      .join('');
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
