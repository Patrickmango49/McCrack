(function () {
  const DEFAULT_TITLE = '𝕄𝕔ℂ𝕣𝕒𝕔𝕜';
  const DEFAULT_FAVICON = 'favicon.png';
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

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64) || 'item';
  }

  function setupMediaLauncher() {
    const mediaGrid = document.querySelector('.media-grid[data-media-kind], .media-grid[data-media-static]');
    const popularGrid = document.querySelector('.popular-grid');
    if (!mediaGrid && !popularGrid) return;

    const kind = mediaGrid && (mediaGrid.dataset.mediaKind === 'movie' || mediaGrid.dataset.mediaStatic === 'movie') ? 'movie' : 'game';
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
        <button class="media-launcher-fullscreen" type="button">Fullscreen</button>
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
      launcher.classList.remove('is-pre-fullscreen');
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
      frame.src = 'about:blank';
    }

    document.addEventListener('click', (event) => {
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
      if (event.key !== 'Escape' || !launcher.classList.contains('is-open')) return;
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        return;
      }
      closeLauncher();
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

        if (launcher.classList.contains('is-pre-fullscreen')) {
          launcher.classList.remove('is-pre-fullscreen');
          return;
        }

        const target = launcher;
        target.classList.add('is-pre-fullscreen');
        await new Promise((resolve) => window.requestAnimationFrame(resolve));
        await new Promise((resolve) => window.requestAnimationFrame(resolve));

        try {
          if (target.requestFullscreen) {
            await target.requestFullscreen();
          } else if (target.webkitRequestFullscreen) {
            target.webkitRequestFullscreen();
          }
        } catch (error) {
          console.warn('Native fullscreen request was blocked. Keeping page-filling fullscreen mode.', error);
        }
      });
    }

    const clearPreFullscreen = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        launcher.classList.remove('is-pre-fullscreen');
      }
    };
    document.addEventListener('fullscreenchange', clearPreFullscreen);
    document.addEventListener('webkitfullscreenchange', clearPreFullscreen);
  }

  function setupBootFlow() {
    if (window.sessionStorage.getItem('mc_boot_seen') === '1') return;

    const bootOverlay = document.createElement('div');
    bootOverlay.className = 'boot-overlay';
    bootOverlay.innerHTML = `
      <div class="boot-video-stage">
        <video class="boot-video" src="boot.mp4" autoplay muted playsinline preload="auto"></video>
        <button class="boot-skip-btn" type="button">Skip intro</button>
      </div>
      <div class="boot-choice-stage" hidden>
        <h2>Welcome to 𝕄𝕔ℂ𝕣𝕒𝕔𝕜, please choose your destination:</h2>
        <div class="boot-choice-actions">
          <button class="boot-continue-btn" type="button">Actual official McCrack</button>
          <a class="boot-sites-btn" href="https://sites.google.com/view/mccrack12/" target="_blank" rel="noopener noreferrer">McCrack Google Sites version</a>
        </div>
      </div>
    `;

    document.body.appendChild(bootOverlay);
    document.body.classList.add('boot-active');

    const video = bootOverlay.querySelector('.boot-video');
    const skipButton = bootOverlay.querySelector('.boot-skip-btn');
    const continueButton = bootOverlay.querySelector('.boot-continue-btn');
    const videoStage = bootOverlay.querySelector('.boot-video-stage');
    const choiceStage = bootOverlay.querySelector('.boot-choice-stage');

    function showChoiceStage() {
      videoStage.hidden = true;
      choiceStage.hidden = false;
    }

    function finishBootFlow() {
      window.sessionStorage.setItem('mc_boot_seen', '1');
      document.body.classList.remove('boot-active');
      bootOverlay.remove();
    }

    video.addEventListener('ended', showChoiceStage);
    video.addEventListener('error', showChoiceStage);
    skipButton.addEventListener('click', showChoiceStage);
    continueButton.addEventListener('click', finishBootFlow);

    video.play().catch(() => {
      showChoiceStage();
    });
  }

  function readMediaData() {
    const dataNode = document.getElementById('mediaData');
    if (!dataNode) return [];

    try {
      const parsed = JSON.parse(dataNode.textContent || '[]');
      if (!Array.isArray(parsed)) return [];

      return parsed
        .map((item) => ({
          title: String(item.title || '').trim(),
          image: String(item.image || '').trim(),
          src: String(item.src || '').trim(),
          terms: Array.isArray(item.terms) ? item.terms.map((term) => String(term || '').trim()).filter(Boolean) : []
        }))
        .filter((item) => item.title && item.image && item.src);
    } catch (error) {
      console.error('Invalid mediaData JSON on this page.', error);
      return [];
    }
  }

  function populateMediaGrid() {
    const mediaGrid = document.querySelector('.media-grid[data-media-kind]');
    if (!mediaGrid) return;

    const mediaItems = readMediaData();
    mediaGrid.innerHTML = mediaItems
      .map((item, index) => {
        const slug = slugify(item.title);
        const cardId = `${mediaGrid.dataset.mediaKind}-${slug}-${index + 1}`;
        const termsAttr = item.terms.length ? ` data-search-terms="${item.terms.join('|')}"` : '';
        return `
        <button id="${cardId}" class="media-tile" type="button" data-src="${item.src}"${termsAttr}>
          <img src="${item.image}" alt="${item.title}" />
          <span>${item.title}</span>
        </button>
      `;
      })
      .join('');
  }

  function organizeMovieSections() {
    const mediaGrid = document.querySelector('.media-grid[data-media-static="movie"], .media-grid[data-media-kind="movie"]');
    if (!mediaGrid) return;

    const tiles = Array.from(mediaGrid.querySelectorAll('.media-tile'));
    if (!tiles.length) return;

    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    const groupedTiles = new Map();
    const movieSectionKey = (title) => {
      const normalizedTitle = String(title || '').trim();
      if (!normalizedTitle) return '#';

      const words = normalizedTitle.split(/\s+/);
      const startsWithThe = words[0] && words[0].toLowerCase() === 'the';
      const keySource = startsWithThe && words[1] ? words[1] : words[0];
      const firstCharacter = keySource.charAt(0).toUpperCase();

      return /[A-Z]/.test(firstCharacter) ? firstCharacter : '#';
    };

    tiles
      .sort((tileA, tileB) => collator.compare(textFromTile(tileA), textFromTile(tileB)))
      .forEach((tile) => {
        const title = textFromTile(tile);
        const sectionKey = movieSectionKey(title);

        if (!groupedTiles.has(sectionKey)) {
          groupedTiles.set(sectionKey, []);
        }

        groupedTiles.get(sectionKey).push(tile);
      });

    const sectionOrder = Array.from(groupedTiles.keys()).sort((keyA, keyB) => {
      if (keyA === '#') return 1;
      if (keyB === '#') return -1;
      return collator.compare(keyA, keyB);
    });

    mediaGrid.innerHTML = '';

    sectionOrder.forEach((sectionKey) => {
      const section = document.createElement('section');
      section.className = 'movie-section';
      section.setAttribute('aria-label', `${sectionKey} movies`);

      const heading = document.createElement('h2');
      heading.className = 'movie-section-title';
      heading.textContent = sectionKey;

      const sectionGrid = document.createElement('div');
      sectionGrid.className = 'movie-section-grid';

      groupedTiles.get(sectionKey).forEach((tile) => {
        sectionGrid.appendChild(tile);
      });

      section.appendChild(heading);
      section.appendChild(sectionGrid);
      mediaGrid.appendChild(section);
    });
  }

  function setupHashTargeting() {
    const hash = decodeURIComponent(window.location.hash || '').replace('#', '').trim();
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    window.setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('media-tile-target');
      window.setTimeout(() => target.classList.remove('media-tile-target'), 2400);
    }, 120);
  }

  function textFromTile(tile) {
    return (
      tile.querySelector('span')?.textContent?.trim() ||
      tile.getAttribute('aria-label') ||
      tile.querySelector('img')?.alt ||
      tile.textContent?.trim() ||
      ''
    );
  }

  function buildLocalTileEntries(doc, path) {
    const tiles = doc.querySelectorAll('.media-tile[data-src], .popular-tile[data-src]');
    return Array.from(tiles)
      .map((tile, index) => {
        const title = textFromTile(tile);
        if (!title) return null;
        const id = tile.id || `${slugify(title)}-${index + 1}`;
        const customTerms = String(tile.getAttribute('data-search-terms') || '')
          .split('|')
          .map((term) => term.trim())
          .filter(Boolean);
        return {
          href: `${path}#${id}`,
          terms: [title.toLowerCase(), slugify(title), ...customTerms.map((term) => term.toLowerCase())]
        };
      })
      .filter(Boolean);
  }

  function buildMediaDataEntries(doc, path, kind) {
    const dataNode = doc.querySelector('#mediaData');
    if (!dataNode) return [];

    try {
      const parsed = JSON.parse(dataNode.textContent || '[]');
      if (!Array.isArray(parsed)) return [];

      return parsed
        .map((item, index) => {
          const title = String(item.title || '').trim();
          if (!title) return null;
          const cardId = `${kind}-${slugify(title)}-${index + 1}`;
          const extraTerms = Array.isArray(item.terms)
            ? item.terms.map((term) => String(term || '').toLowerCase().trim()).filter(Boolean)
            : [];
          return {
            href: `${path}#${cardId}`,
            terms: [title.toLowerCase(), slugify(title), ...extraTerms]
          };
        })
        .filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  async function readDocFromPage(path) {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    const html = await response.text();
    return new DOMParser().parseFromString(html, 'text/html');
  }

  function setupSiteSearch() {
    const topbarRow = document.querySelector('.topbar-row');
    if (!topbarRow || topbarRow.querySelector('.nav-search')) return;

    const settingsLink = topbarRow.querySelector('.settings-link');
    const toolsWrap = document.createElement('div');
    toolsWrap.className = 'topbar-tools';

    const searchForm = document.createElement('form');
    searchForm.className = 'nav-search';
    searchForm.setAttribute('role', 'search');
    searchForm.innerHTML = '<label class="sr-only" for="siteSearchInput">Search site</label><input id="siteSearchInput" name="q" type="search" placeholder="Search 𝕄𝕔ℂ𝕣𝕒𝕔𝕜..." aria-label="Search 𝕄𝕔ℂ𝕣𝕒𝕔𝕜" />';
    toolsWrap.appendChild(searchForm);

    if (settingsLink) {
      toolsWrap.appendChild(settingsLink);
    }

    topbarRow.appendChild(toolsWrap);

    const siteIndex = [
      { href: 'index.html', terms: ['home', 'main', 'dashboard', 'launchpad', 'mccrack'] },
      { href: 'games.html', terms: ['games', 'game', 'popular', 'roblox', 'gaming'] },
      { href: 'movies.html', terms: ['movies', 'movie', 'films', 'watch'] },
      { href: 'proxies.html', terms: ['proxies', 'proxy', 'web proxy'] },
      { href: 'apps.html', terms: ['apps', 'app', 'bypass', 'unblock', 'restriction'] },
      { href: 'browser.html', terms: ['browser', 'search web', 'internet'] },
      { href: 'chat.html', terms: ['chat', 'messages', 'talk'] },
      { href: 'mccrackos.html', terms: ['mccrackos', 'os', 'tools'] },
      { href: 'more.html', terms: ['more', 'extras', 'additional'] },
      { href: 'settings.html', terms: ['settings', 'theme', 'tab', 'customize'] }
    ];

    let searchableContentPromise;
    async function getSearchableContent() {
      if (searchableContentPromise) return searchableContentPromise;

      searchableContentPromise = (async () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const dynamicEntries = [];

        dynamicEntries.push(...buildLocalTileEntries(document, currentPath));

        const pathsToScan = ['games.html', 'movies.html'].filter((path) => path !== currentPath);

        for (const path of pathsToScan) {
          try {
            const doc = await readDocFromPage(path);
            dynamicEntries.push(...buildLocalTileEntries(doc, path));
            if (!dynamicEntries.some((entry) => entry.href.startsWith(`${path}#`))) {
              const kind = path === 'movies.html' ? 'movie' : 'game';
              dynamicEntries.push(...buildMediaDataEntries(doc, path, kind));
            }
          } catch (error) {
            console.warn(`Search index skipped ${path}.`, error);
          }
        }

        return dynamicEntries;
      })();

      return searchableContentPromise;
    }

    searchForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = searchForm.querySelector('input');
      const query = (input?.value || '').toLowerCase().trim();
      if (!query) return;

      const isDirectPage = siteIndex.find((entry) => entry.href.replace('.html', '') === query);
      if (isDirectPage) {
        window.location.href = isDirectPage.href;
        return;
      }

      const pageMatch = siteIndex.find((entry) => entry.terms.some((term) => term.includes(query) || query.includes(term)));
      if (pageMatch && query.length < 4) {
        window.location.href = pageMatch.href;
        return;
      }

      const dynamicEntries = await getSearchableContent();
      const exactMediaMatch = dynamicEntries.find((entry) => entry.terms.some((term) => term === query));
      if (exactMediaMatch) {
        window.location.href = exactMediaMatch.href;
        return;
      }

      const mediaMatch = dynamicEntries.find((entry) => entry.terms.some((term) => term.includes(query) || query.includes(term)));
      if (mediaMatch) {
        window.location.href = mediaMatch.href;
        return;
      }

      if (pageMatch) {
        window.location.href = pageMatch.href;
        return;
      }

      window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(`site:mccrack ${query}`)}`;
    });
  }

  window.mcApp = {
    applySettings,
    populateMediaGrid,
    organizeMovieSections,
    defaults: { DEFAULT_TITLE, DEFAULT_FAVICON, defaultWallpaper }
  };

  applySettings();
  populateMediaGrid();
  organizeMovieSections();
  setupSiteSearch();
  setupMediaLauncher();
  setupHashTargeting();
  setupBootFlow();
})();
