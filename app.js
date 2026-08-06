
const ROUTE_MAP = {
  '/': 'index.html',
  '/games': 'games.html',
  '/movies': 'movies.html',
  '/chat': 'chat.html',
  '/apps': 'apps.html',
  '/browser': 'browser.html',
  '/mccrackos': 'mccrackos.html',
  '/more': 'more.html',
  '/settings': 'settings.html'
};

const supportsCleanPathHost = () => {
  const host = window.location.hostname;
  return !(host.includes('github.io') || host === 'localhost' || host === '127.0.0.1');
};

const htmlToCleanPath = (fileName) => {
  if (fileName === 'index.html') return '/';
  return `/${fileName.replace(/\.html$/, '')}`;
};

const cleanToHtmlPath = (cleanPath) => ROUTE_MAP[cleanPath] || null;

const navigateToPath = (path) => {
  if (!path.startsWith('/')) {
    window.location.href = path;
    return;
  }
  if (supportsCleanPathHost()) {
    window.location.href = path;
    return;
  }
  const htmlPath = cleanToHtmlPath(path);
  window.location.href = htmlPath ? `/${htmlPath}` : path;
};

const applyCleanRouting = () => {
  const currentFile = window.location.pathname.split('/').pop();
  const cleanPath = htmlToCleanPath(currentFile || 'index.html');

  if (supportsCleanPathHost() && /\.html$/i.test(window.location.pathname) && currentFile) {
    window.location.replace(`${cleanPath}${window.location.search}${window.location.hash}`);
    return;
  }

  document.querySelectorAll('a[href]').forEach((anchor) => {
    const rawHref = anchor.getAttribute('href');
    if (!rawHref || rawHref.startsWith('http') || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
      return;
    }

    const match = rawHref.match(/^\/?([a-z0-9-]+)\.html$/i);
    if (match) {
      const cleanHref = match[1] === 'index' ? '/' : `/${match[1]}`;
      anchor.setAttribute('href', cleanHref);
    }

    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href') || '';
      if (!href.startsWith('/') || href === '/' || supportsCleanPathHost()) {
        return;
      }
      const htmlPath = cleanToHtmlPath(href);
      if (!htmlPath) return;
      event.preventDefault();
      window.location.assign(`/${htmlPath}${window.location.search}${window.location.hash}`);
    });
  });
};

applyCleanRouting();

(function () {
  const DEFAULT_TITLE = '𝕄𝕔ℂ𝕣𝕒𝕔𝕜';
  const DEFAULT_FAVICON = 'favicon.png';
  const defaultWallpaper = 'linear-gradient(170deg, #030303 0%, #11100d 45%, #2b2110 100%)';
  const HOME_SPLASH_MESSAGES = [
    'Now with 99% less school surveillance.',
    'Alt-Tab faster.',
    'Is that a teacher behind you?',
    'This site is definitely not a gaming site.',
    'Teacher voice "I see you."',
    '"Just one more game" - You, 3 hours ago.',
    'Warning: Side effects include forgetting homework.',
    'Powered by boredom and questionable WiFi.',
    'Loading fun... unlike your homework.',
    'Not blocked, just better.',
    'Sneak 100.',
    'Get back to work! (Just kidding, play more).',
    'Your favorite distraction.',
    'Unblocking the fun.',
    "Don't look directly at the bugs!",
    'Homework? I hardly know her.',
    'Academically suspicious. Technically impressive.',
    'Shh... this tab is studying.',
    'Mission: look busy, have fun.',
    'Stealth mode activated.',
    'Neon nights. Zero limits.',
    'Drip mode: enabled.',
    'Your launchpad to chaotic fun.',
    'Built for speed, memes, and mayhem.',
    'Dark mode? We were born in it.',
    'Your tab just got a glow-up.',
    'Cooler than the school Chromebook policy.',
    'Fast clicks. Big vibes.',
    'Certified premium procrastination.',
    'One click away from peak boredom cure.',
    'Too smooth to be homework.',
    'Future-tech energy, browser edition.',
    'Powered by pixels and bad decisions.',
    'Looks like work. Plays like freedom.',
    'Welcome to your digital playground.',
    'Legendary tab status achieved.',
    'Aesthetics: maxed. Productivity: optional.',
    'Tap in. Zone out.',
    'Stay sneaky. Stay iconic.'
  ];

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

  function setupHomeSplashMessage() {
    const splashNode = document.getElementById('homeSplashMessage');
    if (!splashNode || !HOME_SPLASH_MESSAGES.length) return;

    const randomIndex = Math.floor(Math.random() * HOME_SPLASH_MESSAGES.length);
    splashNode.textContent = HOME_SPLASH_MESSAGES[randomIndex];
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64) || 'item';
  }


  function forceReloadFrame(frame) {
    if (!frame) return;

    const currentUrl = frame.getAttribute('src') || frame.src;
    if (!currentUrl || currentUrl === 'about:blank') return;

    try {
      if (frame.contentWindow && frame.contentWindow.location && frame.contentWindow.location.href !== 'about:blank') {
        frame.contentWindow.location.reload();
        return;
      }
    } catch (error) {
      // Cross-origin frames can block direct reload access; fallback below.
    }

    try {
      const parsed = new URL(currentUrl, window.location.href);
      parsed.searchParams.set('_mc_refresh', String(Date.now()));
      frame.src = parsed.toString();
    } catch (error) {
      const cacheBust = `_mc_refresh=${Date.now()}`;
      frame.src = currentUrl.includes('?') ? `${currentUrl}&${cacheBust}` : `${currentUrl}?${cacheBust}`;
    }
  }

  function setupEmbedRefreshControls() {
    document.querySelectorAll('.embed-launcher-wrap').forEach((wrap) => {
      const frame = wrap.querySelector('iframe');
      if (!frame || wrap.querySelector('.embed-refresh-button')) return;

      const refreshButton = document.createElement('button');
      refreshButton.className = 'embed-refresh-button';
      refreshButton.type = 'button';
      refreshButton.setAttribute('aria-label', 'Refresh embed');
      refreshButton.title = 'Refresh';
      refreshButton.textContent = '↻';
      refreshButton.addEventListener('click', () => {
        forceReloadFrame(frame);
      });

      wrap.appendChild(refreshButton);
    });
  }

  function setupMediaLauncher() {
    const mediaGrid = document.querySelector('.media-grid[data-media-kind], .media-grid[data-media-static]');
    const popularGrid = document.querySelector('.popular-grid');
    if (!mediaGrid && !popularGrid) return;

    const kind = mediaGrid && (mediaGrid.dataset.mediaKind === 'movie' || mediaGrid.dataset.mediaStatic === 'movie') ? 'movie' : 'game';
    const launcher = document.createElement('div');
    launcher.className = 'media-launcher';
    launcher.innerHTML = `
      <div class="media-launcher-shell">
        <div class="media-launcher-controls" aria-label="Player controls">
          <div class="media-launcher-control-group">
            <button class="media-launcher-refresh" type="button" aria-label="Refresh player" title="Refresh">↻ <span>Refresh</span></button>
            <button class="media-launcher-favorite" type="button" aria-label="Favorite current item" title="Favorite">♡ <span>Favorite</span></button>
            <button class="media-launcher-details" type="button" aria-label="Show details for current item" title="Details">ℹ <span>Details</span></button>
          </div>
          <button class="media-launcher-fullscreen" type="button" aria-label="Toggle fullscreen" title="Fullscreen">⛶ <span>Fullscreen</span></button>
          <button class="media-launcher-close" type="button" aria-label="Close player" title="Close">✕</button>
        </div>
        <div class="media-launcher-frame-wrap">
          <div class="media-launcher-loader" aria-live="polite">
            <div class="media-launcher-spinner" aria-hidden="true"></div>
            <p>${kind === 'movie' ? 'Loading movie…' : 'Loading game…'}</p>
          </div>
          <iframe id="mediaFrame" src="about:blank" referrerpolicy="no-referrer" allow="autoplay; fullscreen"></iframe>
        </div>
        <div class="media-launcher-actions">
          ${kind === 'game' ? '<button class="media-launcher-aboutblank" type="button">Open in About:Blank</button>' : ''}
        </div>
      </div>
    `;

    document.body.appendChild(launcher);

    const closeButton = launcher.querySelector('.media-launcher-close');
    const refreshButton = launcher.querySelector('.media-launcher-refresh');
    const frame = launcher.querySelector('#mediaFrame');
    const loader = launcher.querySelector('.media-launcher-loader');
    const fullscreenButton = launcher.querySelector('.media-launcher-fullscreen');
    const launcherFavoriteButton = launcher.querySelector('.media-launcher-favorite');
    const launcherDetailsButton = launcher.querySelector('.media-launcher-details');
    const aboutBlankButton = launcher.querySelector('.media-launcher-aboutblank');
    const frameWrap = launcher.querySelector('.media-launcher-frame-wrap');
    let currentTile = null;

    function clearLoader() {
      loader.classList.add('is-hidden');
    }

    function showLoader() {
      loader.classList.remove('is-hidden');
      window.setTimeout(clearLoader, 4000);
    }

    function fitLauncherToViewport() {
      const viewportWidth = Math.max(320, window.innerWidth - 24);
      const viewportHeight = Math.max(260, window.innerHeight - 116);
      const width = Math.min(1480, viewportWidth, viewportHeight * (16 / 9));
      const height = width * (9 / 16);

      frameWrap.style.width = `${Math.floor(width)}px`;
      frameWrap.style.height = `${Math.floor(height)}px`;
    }

    function openLauncher(url, tile = null) {
      currentTile = tile;
      if (tile) {
        launcher.dataset.currentFavoriteId = getTileId(tile);
        launcher.dataset.currentKind = getTileKind(tile);
      }
      syncLauncherFavoriteState();
      fitLauncherToViewport();
      showLoader();
      frame.src = url;
      launcher.classList.add('is-open');
      document.body.classList.add('launcher-open');
    }

    function refreshLauncher() {
      if (!launcher.classList.contains('is-open')) return;
      if (!frame.src || frame.src === 'about:blank') return;
      showLoader();
      forceReloadFrame(frame);
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
      openLauncher(tile.dataset.src, tile);
    });

    frame.addEventListener('load', () => {
      clearLoader();
    });

    closeButton.addEventListener('click', closeLauncher);
    refreshButton.addEventListener('click', refreshLauncher);
    launcherFavoriteButton?.addEventListener('click', (event) => {
      event.preventDefault();
      currentTile?.querySelector('.favorite-toggle')?.click();
      syncLauncherFavoriteState();
    });
    launcherDetailsButton?.addEventListener('click', (event) => {
      event.preventDefault();
      currentTile?.querySelector('.quick-actions [data-quick-action="details"]')?.click();
    });

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


    if (aboutBlankButton) {
      aboutBlankButton.addEventListener('click', () => {
        const gameUrl = frame.src;
        if (!gameUrl || gameUrl === 'about:blank') return;

        const newTab = window.open('about:blank', '_blank');
        if (!newTab) return;

        newTab.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <title>Game</title>
  <style>
    html, body {
      margin: 0;
      height: 100%;
      overflow: hidden;
      background: #000;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  </style>
</head>
<body>
  <iframe src="${gameUrl}" allow="autoplay; fullscreen" referrerpolicy="no-referrer"></iframe>
</body>
</html>`);
        newTab.document.close();
      });
    }

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



  function setupLiveUsersCounter() {
    if (document.querySelector('.live-users-counter')) return;

    const SUPABASE_URL = 'https://ptzkldvdqekcvkvrhlqc.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0emtsZHZkcWVrY3ZrdnJobHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzI5MTEsImV4cCI6MjA5MzY0ODkxMX0.ENSTtqcl2rJoz4E9JPT5CozlKO1mWH4bCUJnB-EYnQo';
    const TAB_STORAGE_KEY = 'mc_presence_tab_uuid';

    const badge = document.createElement('div');
    badge.className = 'live-users-counter';
    badge.setAttribute('role', 'status');
    badge.setAttribute('aria-live', 'polite');
    badge.innerHTML = '<span id="live-user-count">0</span> online';
    document.body.appendChild(badge);

    const countElement = badge.querySelector('#live-user-count');
    let currentCount = 0;
    let channel;

    function updateUserCount() {
      if (!channel) return;
      const state = channel.presenceState();
      console.log('[live-users] presence state:', state);
      const nextCount = Object.values(state || {}).reduce((acc, sessions) => {
        const sessionCount = Array.isArray(sessions) ? sessions.length : 0;
        return acc + sessionCount;
      }, 0);
      const safeCount = Number.isFinite(nextCount) ? Math.max(0, Math.floor(nextCount)) : 0;
      console.log('[live-users] final count:', safeCount);
      const oldCount = currentCount;
      currentCount = safeCount;
      if (countElement) countElement.textContent = String(safeCount);
      if (oldCount !== safeCount) {
        badge.classList.remove('count-bump');
        void badge.offsetWidth;
        badge.classList.add('count-bump');
      }
    }

    function getUniqueUserId() {
      let tabUuid = window.sessionStorage.getItem(TAB_STORAGE_KEY);
      if (!tabUuid) {
        if (window.crypto?.randomUUID) {
          tabUuid = window.crypto.randomUUID();
        } else {
          tabUuid = `user_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
        }
        window.sessionStorage.setItem(TAB_STORAGE_KEY, tabUuid);
      }
      console.log('[live-users] generated UUID:', tabUuid);
      return tabUuid;
    }

    function loadSupabaseSdk() {
      if (window.supabase?.createClient) return Promise.resolve(window.supabase);
      return new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-supabase-sdk="true"]');
        if (existing) {
          existing.addEventListener('load', () => resolve(window.supabase), { once: true });
          existing.addEventListener('error', () => reject(new Error('Supabase SDK failed to load.')), { once: true });
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js';
        script.async = true;
        script.dataset.supabaseSdk = 'true';
        script.addEventListener('load', () => resolve(window.supabase), { once: true });
        script.addEventListener('error', () => reject(new Error('Supabase SDK failed to load.')), { once: true });
        document.head.appendChild(script);
      });
    }

    loadSupabaseSdk().then((supabaseBrowser) => {
      if (!supabaseBrowser?.createClient) {
        if (countElement) countElement.textContent = '0';
        return;
      }

      const supabase = supabaseBrowser.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      channel = supabase.channel('online-users', {
        config: {
          presence: {
            key: getUniqueUserId()
          }
        }
      });

      channel
        .on('presence', { event: 'sync' }, updateUserCount)
        .on('presence', { event: 'join' }, updateUserCount)
        .on('presence', { event: 'leave' }, updateUserCount)
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ online_at: new Date().toISOString() });
            updateUserCount();
          }
        });

      window.addEventListener('beforeunload', () => {
        channel?.untrack();
      });
    }).catch((error) => {
      console.warn('Live users presence is unavailable.', error);
      if (countElement) countElement.textContent = '0';
    });
  }



  function setupPopularGamesByLikes() {
    const popularGrid = document.querySelector('.popular-grid');
    if (!popularGrid) return;

    const allGameTiles = Array.from(document.querySelectorAll('.media-grid .media-tile[data-src], .popular-grid .media-tile[data-src]'));
    if (!allGameTiles.length) return;

    const GAME_LIKES_KEY = 'mc_game_likes_v1';

    function getLikesMap() {
      try {
        const parsed = JSON.parse(localStorage.getItem(GAME_LIKES_KEY) || '{}');
        return parsed && typeof parsed === 'object' ? parsed : {};
      } catch (error) {
        return {};
      }
    }

    function saveLikesMap(map) {
      localStorage.setItem(GAME_LIKES_KEY, JSON.stringify(map));
    }

    function gameIdFromTile(tile) {
      const title = textFromTile(tile);
      return slugify(title || tile.id || tile.dataset.src);
    }

    function buildPopularTile(tile, likesMap) {
      const title = textFromTile(tile);
      const image = tile.querySelector('img')?.src || '';
      const src = tile.dataset.src || '';
      const gameId = gameIdFromTile(tile);
      const likes = Number(likesMap[gameId] || 0);

      const card = document.createElement('button');
      card.className = 'popular-tile media-tile';
      card.type = 'button';
      card.dataset.src = src;
      card.dataset.gameId = gameId;
      card.innerHTML = `<img src="${image}" alt="${title}" /><span>${title}</span><small class="popular-like-count">👍 ${likes}</small>`;
      return card;
    }

    function renderPopular() {
      const likesMap = getLikesMap();
      const sorted = [...allGameTiles].sort((a, b) => {
        const likesA = Number(likesMap[gameIdFromTile(a)] || 0);
        const likesB = Number(likesMap[gameIdFromTile(b)] || 0);
        if (likesB !== likesA) return likesB - likesA;
        return textFromTile(a).localeCompare(textFromTile(b));
      });

      const top = sorted.slice(0, 4);
      popularGrid.innerHTML = '';
      top.forEach((tile) => popularGrid.appendChild(buildPopularTile(tile, likesMap)));
      decorateMediaTiles();
    }

    document.addEventListener('click', (event) => {
      const tile = event.target.closest('.media-grid .media-tile[data-src], .popular-grid .media-tile[data-src]');
      if (!tile) return;

      const likesMap = getLikesMap();
      const gameId = tile.dataset.gameId || gameIdFromTile(tile);
      likesMap[gameId] = Number(likesMap[gameId] || 0) + 1;
      saveLikesMap(likesMap);
      renderPopular();
    });

    renderPopular();
  }

  function setupVisitorCounter() {
    if (document.querySelector('.visitor-counter')) return;

    const counter = document.createElement('section');
    counter.className = 'visitor-counter';
    counter.setAttribute('aria-label', 'Visitor counter');
    counter.innerHTML = `
      <p class="visitor-counter-label">Visitor Count:</p>
      <div class="visitor-counter-widget" align="center">
        <a href="https://www.counter12.com">
          <img src="https://www.counter12.com/img-8Zdb8CWzZ97WZ79B-63.gif" border="0" alt="contador de visitas gratis" />
        </a>
      </div>
    `;

    const adScript = document.createElement('script');
    adScript.src = 'https://www.counter12.com/ad.js?id=8Zdb8CWzZ97WZ79B';
    adScript.type = 'text/javascript';
    counter.querySelector('.visitor-counter-widget')?.appendChild(adScript);

    document.body.appendChild(counter);
  }


  function setupContentCounts() {
    const targets = [
      { selector: '.media-grid[data-media-static="game"], .media-grid[data-media-kind="game"]', label: 'Games listed', placeholder: /^game\s+\d+$/i, key: 'games' },
      { selector: '.media-grid[data-media-static="movie"], .media-grid[data-media-kind="movie"]', label: 'Movies listed', placeholder: /^movie\s+\d+$/i, key: 'movies' },
      { selector: '.media-grid[data-media-static="app"], .media-grid[data-media-kind="app"]', label: 'Apps listed', placeholder: /^app\s+\d+$/i, key: 'apps' }
    ];

    targets.forEach((target) => {
      const grid = document.querySelector(target.selector);
      if (!grid) return;

      const tiles = Array.from(grid.querySelectorAll('.media-tile'));
      const total = tiles.filter((tile) => {
        const title = textFromTile(tile);
        return title && !PLACEHOLDER_TITLE_PATTERN.test(title.trim()) && !target.placeholder.test(title.trim());
      }).length;

      let stats = document.querySelector(`.content-count[data-kind="${target.key}"]`);
      if (!stats) {
        stats = document.createElement('section');
        stats.className = 'content-count';
        stats.dataset.kind = target.key;
        grid.parentElement?.insertBefore(stats, grid);
      }

      stats.textContent = `${target.label}: ${total}`;
    });
  }

  function setupCommentBox() {
    if (document.getElementById('HCB_comment_box')) return;

    const wrap = document.createElement('section');
    wrap.className = 'comment-box-wrap';
    wrap.innerHTML = '<div id="HCB_comment_box"><a href="http://www.htmlcommentbox.com">Comment Form</a> is loading comments...</div>';

    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = 'https://www.htmlcommentbox.com/static/skins/bootstrap/twitter-bootstrap.css?v=0';
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'hcb';
    script.text = `(function(){var l=(""+window.location).replace(/'/g,"%27"),h="https://www.htmlcommentbox.com",s=document.createElement("script");s.setAttribute("type","text/javascript");s.setAttribute("src",h+"/jread?page="+encodeURIComponent(l).replace("+","%2B")+"&mod=%241%24wq1rdBcg%24I3r2GT%2Fx7THiMqvTNrVqO."+"&opts=16798&num=10&ts=1767912634724");if(typeof s!=="undefined"){document.getElementsByTagName("head")[0].appendChild(s);}})();`;

    document.body.appendChild(wrap);
    document.body.appendChild(script);
  }

  function setupBootFlow() {
    if (window.sessionStorage.getItem('mc_boot_seen') === '1') return;

    const bootOverlay = document.createElement('div');
    bootOverlay.className = 'boot-overlay';
    bootOverlay.innerHTML = `
      <div class="boot-get-started-stage">
        <button class="boot-get-started-btn" type="button">Get Started</button>
        <p class="boot-get-started-hint"><em>Press Enter twice to skip boot screen</em></p>
      </div>
      <div class="boot-video-stage" hidden>
        <video class="boot-video" src="https://files.catbox.moe/ixrvlm.mp4" muted playsinline preload="auto"></video>
      </div>
      <div class="boot-choice-stage" hidden>
        <h2>Choose your McCrack version</h2>
        <p class="boot-choice-subtitle">Pick where you want to launch your experience.</p>
        <div class="boot-choice-actions">
          <button class="boot-continue-btn" type="button">Actual official McCrack</button>
          <a class="boot-sites-btn" href="https://sites.google.com/view/mccrack1234/" target="_blank" rel="noopener noreferrer">McCrack Google Sites version</a>
        </div>
      </div>
    `;

    document.body.appendChild(bootOverlay);
    document.body.classList.add('boot-active');

    const getStartedStage = bootOverlay.querySelector('.boot-get-started-stage');
    const getStartedButton = bootOverlay.querySelector('.boot-get-started-btn');
    const video = bootOverlay.querySelector('.boot-video');
    const continueButton = bootOverlay.querySelector('.boot-continue-btn');
    const videoStage = bootOverlay.querySelector('.boot-video-stage');
    const choiceStage = bootOverlay.querySelector('.boot-choice-stage');
    let didFinish = false;
    let bootStage = 'start';

    function showChoiceStage() {
      if (bootStage === 'choice') return;
      bootStage = 'choice';
      bootOverlay.classList.add('boot-switching');
      window.setTimeout(() => {
        getStartedStage.hidden = true;
        videoStage.hidden = true;
        choiceStage.hidden = false;
        choiceStage.classList.add('is-visible');
        bootOverlay.classList.remove('boot-switching');
      }, 320);
    }

    function startBootVideo() {
      if (bootStage !== 'start') return;
      bootStage = 'video';
      getStartedStage.hidden = true;
      choiceStage.hidden = true;
      videoStage.hidden = false;
      choiceStage.classList.remove('is-visible');
      video.currentTime = 0;
      video.load();
      video.play().catch(() => {
        showChoiceStage();
      });
    }

    function skipBootVideo() {
      if (bootStage !== 'video') return;
      video.pause();
      showChoiceStage();
    }

    function handleBootKeydown(event) {
      if (event.key !== 'Enter' || event.repeat) return;
      event.preventDefault();

      if (bootStage === 'start') {
        startBootVideo();
        return;
      }

      if (bootStage === 'video') {
        skipBootVideo();
      }
    }
    function cleanupBootOverlay() {
      if (didFinish) return;
      didFinish = true;
      choiceStage.hidden = false;
      window.sessionStorage.setItem('mc_boot_seen', '1');
      document.body.classList.remove('boot-active');
      document.removeEventListener('keydown', handleBootKeydown);
      bootOverlay.remove();
    }

    function finishBootFlow() {
      bootOverlay.classList.add('is-exiting');
      bootOverlay.addEventListener('transitionend', cleanupBootOverlay, { once: true });
      window.setTimeout(cleanupBootOverlay, 560);
    }

    video.addEventListener('ended', showChoiceStage);
    video.addEventListener('error', showChoiceStage);
    continueButton.addEventListener('click', finishBootFlow);
    getStartedButton.addEventListener('click', startBootVideo);
    document.addEventListener('keydown', handleBootKeydown);
  }



  const CONTENT_DATABASE = {
    game: [
      ['3D Tetris','Classic block-stacking puzzle with a 3D twist. Rotate and drop tetrominoes in a deeper playfield for higher scores and faster action.'],['Dash','Fast-paced endless runner where you jump, slide, and dash through obstacles at increasing speeds.'],['8 Ball Pool','Realistic online multiplayer pool. Challenge friends or random players in 8-ball matches with smooth physics.'],['10 Minutes Till Dawn','Intense survival roguelike. Survive waves of monsters for 10 minutes while upgrading your character between runs.'],['A Dance of Fire and Ice','Rhythm game where two characters (fire and ice) move along a track in perfect sync with the music. Precision timing is everything.'],['A Small World Cup','Charming low-poly soccer game with simple controls and chaotic multiplayer matches.'],['Among Us','Social deduction classic. Complete tasks as a crewmate or sabotage and eliminate as an impostor.'],['Bad Parenting 1','Dark comedy adventure about terrible parenting decisions and their consequences.'],["Baldi's Basics",'Horror education parody. Collect notebooks while avoiding the slap-happy teacher Baldi in a nightmarish school.'],['Basket Random','Physics-based basketball with ridiculous ragdoll players and completely random outcomes.'],['Basketball Stars','Smooth mobile-style basketball with one-on-one matches, special moves, and career mode.'],['Bendy and the Ink Machine','Horror adventure set in an abandoned cartoon studio filled with ink monsters and dark secrets.'],['BitLife','Text-based life simulator. Live out an entire life making choices that shape your fate from birth to death.'],['Block Post','Voxel-style multiplayer shooter with building elements and intense combat.'],['Bowmasters','Side-view archery battle game with physics-based projectiles and a roster of quirky characters.'],['Brawl Stars','Fast 3v3 multiplayer brawler with unique characters, modes, and short intense matches.'],['Buckshot Roulette','Tense psychological horror game of Russian roulette with a shotgun, items, and mind games.'],['BuildNow.GG','Browser-based building and combat game with creative freedom and multiplayer action.'],['Champion Island Games','Google’s Olympic-themed adventure with sports minigames and exploration across a colorful island.'],['Cheese Chompers 3D','Chaotic 3D multiplayer where players race and fight to collect the most cheese.'],['Cluster Rush','High-speed truck platformer. Jump from truck to truck while avoiding obstacles in an endless run.'],['Cookie Clicker','The ultimate idle clicker. Bake cookies, buy upgrades, and watch numbers go infinitely high.'],['Core Ball','Precision timing game. Shoot the ball into the rotating core at the perfect moment.'],['Crazy Cattle 3D','Absurd physics-based cattle chaos in 3D.'],['Crossy Road','Endless hopper. Cross roads, rivers, and railways while collecting coins and unlocking characters.'],['Cuphead','Run-and-gun boss rush with 1930s cartoon aesthetics and extremely challenging fights.'],['DeadShot.io','Browser multiplayer shooter focused on quick matches and sharp aim.'],['Dirt Bike Mad Skills','Physics-based dirt bike stunt and racing game with big air and crashes.'],['Doodle Baseball','Simple, charming baseball game with doodle-style graphics.'],['Drift Boss','One-button endless drifting game. Time your drifts perfectly around corners.'],['Drift Hunters','Open-world drifting simulator with tunable cars and points for stylish slides.'],['Drive Mad','Physics-based driving challenges. Get your vehicle to the finish through crazy obstacle courses.'],['EaglerCraft 1.5.2 / 1.8.8 / 1.12.2 / 1.20.1 / EaglercraftZ 1.20.4','Browser versions of Minecraft. Play classic or modern Minecraft right in your browser.'],['Escape Road 2','High-speed chase game. Outrun the police through traffic and obstacles.'],['Extreme Cart Ride (Fake Roblox)','Fast cart racing experience inspired by popular Roblox experiences.'],['Fireboy and Watergirl','Co-op puzzle platformer. Guide the fire and water characters through temple levels together.'],['Five Nights at Epstein’s','Fan-made horror night-shift survival game with a dark theme.'],['Five Nights at Freddy’s','Iconic horror game. Survive the night shift while animatronics try to get you.'],['Flappy Bird','The simple, frustrating classic. Tap to keep the bird flying between pipes.'],['Football Legends','Arcade soccer with special moves, famous players, and over-the-top action.'],['Friday Night Funkin’','Rhythm battle game. Out-rap opponents with arrow key timing to the beat.'],['Funny Shooter 2','Humorous first-person shooter with silly enemies and over-the-top weapons.'],['GDash Waves','Geometry Dash-style wave levels with tight timing and precision flying.'],['Geometry Dash (Scratch) / Geometry Dash Lite','Rhythm-based platformer. Jump and fly through obstacle courses synced to music.'],['Getaway Shootout','Chaotic multiplayer party game. Race to the exit while shooting and shoving opponents.'],['Granny (Knock-Off Version)','Horror escape game. Sneak out of the house while avoiding Granny.'],['Grow a Garden (Fake Roblox)','Farming and gardening simulator in the style of popular Roblox experiences.'],['Hill Climb Racing / Hill Climb Racing (Scratch)','Physics-based hill climbing. Upgrade your vehicle and conquer wild terrain.'],['Hobo','Side-scrolling adventure about a hobo surviving the streets with dark humor.'],['Hollow Knight','Acclaimed metroidvania. Explore a vast underground kingdom filled with insects and secrets.'],['Hollow Knight: Silksong','Sequel to Hollow Knight starring Hornet in a new silk-filled kingdom.'],['Italian Brainrot Clicker 2','Absurd meme clicker filled with Italian brainrot characters and upgrades.'],['Karlson','Fast-paced FPS platformer by Dani. Speedrun levels with insane movement tech.'],['Level Devil','Tricky platformer full of fake-outs, traps, and devilish level design.'],['Madalin Stunt Cars 2','Open-world stunt driving with high-speed cars and multiplayer.'],['Massive Multiplayer Platformer v1.3','Large-scale multiplayer platforming chaos.'],['Monkey Mart','Idle supermarket management. Expand your store and hire monkey workers.'],['Moto X3M / Moto X3M: Spooky Land','Motocross stunt racing with flips, crashes, and creative tracks (plus a Halloween version).'],['Mr. Racer','Racing game focused on speed and competition.'],['MX OffRoad Mountain Bike','Off-road mountain bike racing and stunts.'],['Myinstants','Soundboard app/game for playing popular meme and viral sound effects.'],['N-Gon','Fast-paced 2D physics combat with modular weapons and destruction.'],['NZP','Zombie survival shooter experience.'],['Obby: Aimbot Arena Shooter (Fake Roblox)','Obby-style arena shooter with aim-focused combat.'],['OvO','Precision parkour platformer with smooth movement and hard levels.'],['Paper.io 2','Claim territory by drawing lines. Don’t get cut off by other players.'],['Pokemon Emerald','Classic Game Boy Advance Pokémon adventure in the Hoenn region.'],['Polytrack','Minimalist low-poly racing with clean tracks and smooth handling.'],['R.E.P.O.','Horror co-op extraction game. Loot items while avoiding monsters.'],['Raft','Survival craft on a raft. Expand your floating base while gathering resources from the ocean.'],['Ragdoll Hit','Physics ragdoll combat and hitting challenges.'],['Raldi’s Crack House','Chaotic parody of Baldi’s Basics with a much darker, wilder setting.'],['Red Ball 4','Adventure platformer starring a red ball rolling through creative levels.'],['Retro Bowl','Pixel-art American football management and gameplay hybrid.'],['Roblox','Massive platform of user-created games and experiences.'],['Rocket League','Soccer with rocket-powered cars. Aerials, boosts, and competitive matches.'],['Rooftop Run','Endless runner across city rooftops with jumps and obstacles.'],['Run 3','Tunnel running platformer in space with gravity shifts and multiple characters.'],['Sketchbook 0.4','Simple drawing and sketching tool.'],['Slither.io','Grow your snake by eating pellets and other players while avoiding collisions.'],['Slope / Slope Duels','High-speed ball rolling down a neon slope. Avoid falling off the edges (plus multiplayer duels).'],['Smash Karts','Kart racing with weapons and power-ups in chaotic multiplayer races.'],['Snow Rider 3D','3D snowboarding downhill run with obstacles and speed.'],['Snowball.io','Roll a snowball and knock other players off the arena.'],['Solar Smash','Planet destruction sandbox. Smash planets with weapons and natural disasters.'],['Space Huggers','Fast pixel-art action with unique movement and combat.'],['Steal a Brainrot Duel (Fake Roblox)','Competitive duel experience inspired by popular Roblox brainrot games.'],['Stick War','Strategy game commanding stick-figure armies in medieval battles.'],['Stickman Hook','Swing from point to point with a grappling hook in satisfying physics levels.'],['Stunt Dirt Bike','Dirt bike stunts and freestyle tricks.'],['Subway Surfers','Iconic endless runner. Dash through subway tracks while dodging trains.'],['Super Liquid Soccer','Physics-based liquid soccer with wild, bouncy matches.'],['Super Mario 64','The revolutionary 3D Mario platformer. Explore Peach’s castle and collect stars.'],['Super Mario Bros.','The classic side-scrolling Mario adventure that started it all.'],['Super Smash Flash','Flash-based Super Smash Bros. style fighter with a huge roster.'],['Survival Race','Racing survival hybrid with elimination-style gameplay.'],['Tag','Multiplayer tag game. Chase or be chased in various maps.'],['Terraria / Terraria (Scratch)','2D sandbox adventure. Dig, build, fight bosses, and explore a vast world.'],['The Grim Donut (PinkBike)','Bike freeride/stunt experience with a unique theme.'],['They Are Coming','Tower defense or survival against endless waves of enemies.'],['Time Shooter 3 S.W.A.T.','Bullet-time FPS. Slow time while aiming and clear rooms of enemies.'],['Tiny Fishing','Idle fishing game. Catch fish, upgrade your gear, and expand your aquarium.'],['Tomb of the Mask','Fast maze runner. Dash through tombs collecting points while avoiding traps.'],['Trees Hate You','Surreal or comedic game where the trees are the enemy.'],['Tunnel Road','High-speed tunnel driving/racing experience.'],['UltraKill','Ultra-violent fast-paced FPS with stylish movement and ranking system.'],['Veck.io','Browser multiplayer game (typically arena or io-style combat).']
    ],
    movie: [
      ['A Bug’s Life','Pixar adventure about a misfit ant who recruits warrior bugs to save his colony.'],['A Charlie Brown Christmas','Classic Peanuts special about the true meaning of Christmas.'],['A Goofy Movie','Goofy and Max take a father-son road trip full of laughs and bonding.'],['Alien: Romulus','Horror sequel set between the original Alien films, following young colonists facing xenomorphs.'],['Alvin and the Chipmunks / The Squeakquel / Chipwrecked','Live-action/CGI comedies about the singing chipmunks and their chaotic adventures.'],['An Extremely Goofy Movie','Goofy goes to college with Max in this direct-to-video sequel.'],['Ant-Man and the Wasp: Quantumania','Marvel adventure that takes Scott Lang and the family into the Quantum Realm.'],['Avengers: Infinity War / Avengers: Endgame','The epic two-part culmination of the Infinity Saga as the Avengers face Thanos.'],['The Amazing Spider-Man / The Amazing Spider-Man 2','Andrew Garfield’s take on Peter Parker facing new villains and personal struggles.'],['Barbie','Greta Gerberg’s colorful comedy about Barbie leaving Barbieland for the real world.'],['Batman / Batman Returns','Tim Burton’s gothic Batman films starring Michael Keaton.'],['Beavis and Butt-Head Do America / Do the Universe','The duo’s chaotic animated adventures across America and beyond.'],['Black Panther / Black Panther: Wakanda Forever','Marvel’s groundbreaking films centered on Wakanda and the legacy of T’Challa.'],['Black Phone 2','Horror sequel continuing the story of the mysterious black phone.'],['Blue Beetle','DC’s teen superhero origin story about Jaime Reyes and the alien scarab.'],['Borderlands','Live-action adaptation of the chaotic looter-shooter video game.'],['The Bad Guys 2','Animated sequel about the reformed animal criminals pulled back into action.'],['The Batman','Matt Reeves’ dark, detective-focused take on Batman starring Robert Pattinson.'],['Cars / Cars 2 / Cars 3','Pixar’s racing adventures following Lightning McQueen and his friends.'],['Deadpool / Deadpool 2 / Deadpool & Wolverine','R-rated Marvel comedies starring the fourth-wall-breaking merc with a mouth.'],['Despicable Me 4','Latest chapter in Gru’s family adventures with the Minions.'],['Detective Pikachu','Live-action Pokémon mystery starring a talking Pikachu.'],['Diary of a Wimpy Kid / Rodrick Rules / Dog Days','Live-action adaptations of the popular middle-school book series.'],['The Dark Knight','Christopher Nolan’s acclaimed Batman film featuring Heath Ledger’s Joker.'],['The Day the Earth Blew Up','Animated Looney Tunes feature-length adventure.'],['Finding Nemo / Finding Dory','Pixar underwater adventures about a clownfish and his forgetful friend.'],['Five Nights at Freddy’s 2','Horror sequel based on the popular video game series.'],['Ford v Ferrari','Drama about the rivalry between Ford and Ferrari at the 24 Hours of Le Mans.'],['The Flash','DC multiverse adventure starring Ezra Miller as the Scarlet Speedster.'],['Gladiator / Gladiator II','Epic historical dramas about Roman gladiators seeking revenge and glory.'],['GOAT','Sports or underdog story (context-dependent title).'],['Guardians of the Galaxy Vol. 3','Marvel’s emotional conclusion to the Guardians’ story.'],['Home Alone / Home Alone 2: Lost in New York','Classic holiday comedies about a boy defending his house (and later New York) from burglars.'],['Hoppers','Upcoming or lesser-known animated adventure.'],['Inside Out / Inside Out 2','Pixar films exploring emotions inside a young girl’s mind.'],['Interstellar','Christopher Nolan’s epic about space travel, time, and saving humanity.'],['Iron Man / Iron Man 2 / Iron Man 3','The films that launched the Marvel Cinematic Universe with Tony Stark.'],['It / It Chapter Two','Horror adaptations of Stephen King’s clown that preys on children (and later adults).'],['The Incredibles','Pixar superhero family adventure about retired heroes forced back into action.'],['KPop Demon Hunters','Animated or live-action story blending K-pop and supernatural demon fighting.'],['Luca','Pixar coming-of-age story set on the Italian Riviera about sea monsters on land.'],['The Lego Batman Movie / The Lego Movie / The Lego Movie 2 / The Lego Ninjago Movie','LEGO-branded animated comedies full of humor, action, and creativity.'],['The Little Rascals','Classic comedy about a group of neighborhood kids and their adventures.'],['The Lorax','Animated adaptation of Dr. Seuss’s environmental tale.'],['Major Payne','Comedy about a tough Marine drill instructor training a group of kids.'],['Migration','Illumination animated comedy about a family of ducks on a big journey.'],['Moana / Moana 2','Disney’s Polynesian adventure about a young wayfinder and the demigod Maui.'],['Mortal Kombat','Live-action adaptation of the fighting game franchise.'],['Mufasa: The Lion King','Prequel exploring the origin story of Mufasa.'],['Oppenheimer','Christopher Nolan’s biographical drama about the father of the atomic bomb.'],['Pixels','Comedy about 1980s arcade characters invading Earth.'],['Ralph Breaks the Internet','Sequel to Wreck-It Ralph where the characters enter the internet.'],['The Regular Show: The Movie','Feature-length adventure based on the Cartoon Network series.'],['Smile / Smile 2','Psychological horror films about a contagious curse that spreads through smiles.'],['Sonic the Hedgehog / Sonic the Hedgehog 2','Live-action/CGI adventures of the blue blur and his friends.'],['Space Jam / Space Jam: A New Legacy','Basketball comedies mixing live-action with Looney Tunes (and later other Warner characters).'],['Spider-Man / Spider-Man 2 / Spider-Man 3','Sam Raimi’s original trilogy starring Tobey Maguire.'],['Spider-Man: Homecoming / Far From Home / No Way Home','MCU Spider-Man trilogy starring Tom Holland.'],['Spider-Man: Into the Spider-Verse / Across the Spider-Verse','Acclaimed animated Spider-Man films that redefined the character and multiverse storytelling.'],['Superman','Classic or modern take on the Man of Steel.'],['Teen Titans: Trouble in Tokyo','Animated Teen Titans adventure in Japan.'],['Teenage Mutant Ninja Turtles: Mutant Mayhem','Fresh animated take on the turtle heroes with a young, energetic vibe.'],['Terrifier / Terrifier 2 / Terrifier 3','Extremely gory horror films starring the clown Art the Clown.'],['Thor: Ragnarok','Marvel’s colorful, comedic Thor adventure directed by Taika Waititi.'],['Transformers One','Animated origin story of the Transformers on Cybertron.'],['Turbo','DreamWorks animated film about a snail who dreams of racing in the Indy 500.'],['Twisters','Action-adventure about storm chasers facing extreme tornadoes.'],['The Underdoggs','Sports comedy starring Snoop Dogg about a washed-up football player coaching a kids’ team.'],['Venom / Venom: Let There Be Carnage','Sony’s anti-hero films about Eddie Brock and the symbiotic alien Venom.'],['The Wild Robot','Animated adaptation of the book about a robot stranded on an island who learns to survive with animals.'],['White Men Can’t Jump (1992) / (2023)','Sports comedy about street basketball hustlers (original and remake).'],['Wicked: For Good','Second part of the Wicked film adaptation telling the story of the witches of Oz.'],['Willy Wonka & the Chocolate Factory','Classic 1971 musical fantasy starring Gene Wilder as the eccentric candy maker.'],['Wreck-It Ralph','Disney animated film about a video game villain who wants to be a hero.'],['Zootopia','Disney animated buddy-cop comedy set in a city of anthropomorphic animals.']
    ],
    app: [
      ['Discord','Voice, video, and text chat platform built for communities, friends, and gaming.'],['Freefy','Music streaming or free music-related app (likely focused on free listening).'],['Instagram','Photo and video sharing social network with Stories, Reels, and messaging.'],['NVIDIA GeForce Now','Cloud gaming service that lets you stream PC games to almost any device.'],['Senshi','Niche or specialized app (often related to anime, gaming, or community features depending on exact product).'],['SoundCloud','Music streaming and discovery platform especially popular with independent artists and electronic music.'],['Stake.us','Social casino and gaming platform (sweepstakes-style).'],['StreamX','Streaming-focused app for video or live content.'],['TikTok','Short-form video social network driven by the For You page algorithm.'],['Vidbox (All Streaming Providers For Free)','App that aggregates or provides access to multiple streaming services.']
    ]
  };

  const CONTENT_LOOKUP = Object.fromEntries(Object.entries(CONTENT_DATABASE).map(([kind, rows]) => [kind, rows.map(([title, description]) => ({ title, description, tags: title.split(/\s*\/\s*|\s+/).filter(Boolean) }))]));

  function normalizeTitle(value) {
    return String(value || '').toLowerCase().replace(/[’']/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function findContentInfo(kind, title) {
    const normalized = normalizeTitle(title);
    const items = CONTENT_LOOKUP[kind] || [];
    return items.find((item) => normalizeTitle(item.title) === normalized)
      || items.find((item) => normalizeTitle(item.title).split(' ').includes(normalized) || normalized.split(' ').includes(normalizeTitle(item.title)))
      || items.find((item) => normalizeTitle(item.title).includes(normalized) || normalized.includes(normalizeTitle(item.title)))
      || { title, description: '', tags: [] };
  }

  const PLACEHOLDER_TITLE_PATTERN = /^(?:game|movie|app)\s+\d+$/i;
  const DISTRICT_ALERT_MESSAGE = "For the Waterford Public Schools District, Movies don't work because of the Google Drive blocking system they added, I will try to fix them with a proxy as soon as possible!";

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


  function organizeGameTilesAlphabetically() {
    const mediaGrid = document.querySelector('.media-grid[data-media-static="game"], .media-grid[data-media-kind="game"]');
    if (!mediaGrid) return;

    const tiles = Array.from(mediaGrid.querySelectorAll('.media-tile'));
    if (!tiles.length) return;

    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    const realTiles = tiles.filter((tile) => !PLACEHOLDER_TITLE_PATTERN.test(textFromTile(tile).trim()));
    const placeholderTiles = tiles.filter((tile) => PLACEHOLDER_TITLE_PATTERN.test(textFromTile(tile).trim()));

    realTiles.sort((tileA, tileB) => collator.compare(textFromTile(tileA), textFromTile(tileB)));

    mediaGrid.innerHTML = '';

    const rowSize = 5;
    const orderedTiles = [...realTiles, ...placeholderTiles];
    for (let i = 0; i < orderedTiles.length; i += rowSize) {
      const row = document.createElement('div');
      row.className = 'media-row';
      row.dataset.row = String(Math.floor(i / rowSize) + 1);
      orderedTiles.slice(i, i + rowSize).forEach((tile) => row.appendChild(tile));
      mediaGrid.appendChild(row);
    }
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

    const realTiles = tiles.filter((tile) => !PLACEHOLDER_TITLE_PATTERN.test(textFromTile(tile).trim()));
    const placeholderTiles = tiles.filter((tile) => PLACEHOLDER_TITLE_PATTERN.test(textFromTile(tile).trim()));

    realTiles
      .sort((tileA, tileB) => collator.compare(textFromTile(tileA), textFromTile(tileB)))
      .forEach((tile) => {
        const title = textFromTile(tile);
        const sectionKey = movieSectionKey(title);

        if (!groupedTiles.has(sectionKey)) {
          groupedTiles.set(sectionKey, []);
        }

        groupedTiles.get(sectionKey).push(tile);
      });

    if (placeholderTiles.length) {
      groupedTiles.set('#', [...(groupedTiles.get('#') || []), ...placeholderTiles]);
    }

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


  function setupDistrictNotice() {
    const main = document.querySelector('main');
    if (!main) return;

    const firstHeading = main.querySelector('h1');
    if (!firstHeading) return;

    let notice = main.querySelector('.district-notice');
    if (!notice) {
      notice = document.createElement('p');
      notice.className = 'district-notice';
    }

    notice.textContent = DISTRICT_ALERT_MESSAGE;

    const heroSection = firstHeading.closest('section') || firstHeading.parentElement;
    if (heroSection) {
      heroSection.insertAdjacentElement('afterend', notice);
    }
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



  const FAVORITES_KEY = 'mc_favorites_v2';

  function getTileId(tile) {
    return tile?.id || slugify(`${textFromTile(tile)}-${tile?.dataset?.src || ''}`);
  }

  function getTileKind(tile) {
    const grid = tile.closest('[data-media-kind], [data-media-static]');
    if (location.pathname.includes('apps')) return 'app';
    return grid?.dataset.mediaKind || (grid?.dataset.mediaStatic === 'app' ? 'app' : (grid?.dataset.mediaStatic === 'movie' ? 'movie' : (location.pathname.includes('movie') ? 'movie' : 'game')));
  }

  function favoritesKey(kind = getPageKind()) { return `${FAVORITES_KEY}_${kind}`; }

  function getPageKind() {
    const grid = document.querySelector('.media-grid[data-media-kind], .media-grid[data-media-static]');
    if (grid?.dataset.mediaKind) return grid.dataset.mediaKind;
    if (location.pathname.includes('apps')) return 'app';
    if (grid?.dataset.mediaStatic === 'app') return 'app';
    if (grid?.dataset.mediaStatic === 'movie') return 'movie';
    if (location.pathname.includes('movies')) return 'movie';
    return 'game';
  }

  function readFavorites(kind = getPageKind()) {
    try { return JSON.parse(localStorage.getItem(favoritesKey(kind)) || '[]'); } catch { return []; }
  }

  function saveFavorites(items, kind = getPageKind()) { localStorage.setItem(favoritesKey(kind), JSON.stringify(items)); }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "\'": '&#39;' }[char]));
  }

  function showToast(message, type = 'success') {
    let tray = document.querySelector('.toast-tray');
    if (!tray) {
      tray = document.createElement('div');
      tray.className = 'toast-tray';
      tray.setAttribute('aria-live', 'polite');
      document.body.appendChild(tray);
    }
    const toast = document.createElement('div');
    toast.className = `premium-toast premium-toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : '•'}</span><span>${message}</span>`;
    tray.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    window.setTimeout(() => {
      toast.classList.remove('is-visible');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 2600);
  }

  function decorateMediaTiles() {
    document.querySelectorAll('.media-tile[data-src]').forEach((tile) => {
      if (tile.dataset.premiumReady) return;
      tile.dataset.premiumReady = 'true';
      const title = textFromTile(tile);
      const id = getTileId(tile);
      tile.dataset.favoriteId = id;
      tile.setAttribute('aria-label', title ? `Play ${title}` : 'Open media');
      const span = tile.querySelector('span');
      if (span && !span.classList.contains('media-title')) span.classList.add('media-title');
      const overlay = document.createElement('span');
      overlay.className = 'quick-actions';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.innerHTML = '<span data-quick-action="play">▶ Play</span><span data-quick-action="favorite">♥ Favorite</span><span data-quick-action="details">ℹ Details</span>';
      const fav = document.createElement('button');
      fav.className = 'favorite-toggle';
      fav.type = 'button';
      fav.setAttribute('aria-label', `Add ${title || 'item'} to favorites`);
      fav.innerHTML = '♡';
      tile.append(overlay, fav);
    });
    syncFavoriteButtons();
  }

  function syncLauncherFavoriteState() {
    const launcher = document.querySelector('.media-launcher');
    const button = launcher?.querySelector('.media-launcher-favorite');
    if (!button) return;
    const currentId = launcher?.dataset.currentFavoriteId;
    const currentKind = launcher?.dataset.currentKind || getPageKind();
    const active = currentId ? new Set(readFavorites(currentKind).map((item) => item.id)).has(currentId) : false;
    button.classList.toggle('is-favorite', active);
    button.innerHTML = `${active ? '♥' : '♡'} <span>${active ? 'Favorited' : 'Favorite'}</span>`;
  }

  function syncFavoriteButtons() {
    const ids = new Set(readFavorites(getPageKind()).map((item) => item.id));
    document.querySelectorAll('.favorite-toggle').forEach((button) => {
      const tile = button.closest('.media-tile');
      const active = ids.has(getTileId(tile));
      button.classList.toggle('is-favorite', active);
      button.innerHTML = active ? '♥' : '♡';
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function setupFavorites() {
    decorateMediaTiles();
    document.addEventListener('click', (event) => {
      const quickFavorite = event.target.closest('.quick-actions [data-quick-action="favorite"]');
      if (quickFavorite) {
        event.preventDefault();
        event.stopPropagation();
        quickFavorite.closest('.media-tile')?.querySelector('.favorite-toggle')?.click();
        return;
      }
      const button = event.target.closest('.favorite-toggle');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      const tile = button.closest('.media-tile');
      const id = getTileId(tile);
      const kind = getTileKind(tile);
      const favorites = readFavorites(kind);
      const exists = favorites.some((item) => item.id === id);
      if (exists) {
        saveFavorites(favorites.filter((item) => item.id !== id), kind);
        showToast('Removed from Favorites');
      } else {
        favorites.unshift({ id, title: textFromTile(tile), image: tile.querySelector('img')?.src || '', src: tile.dataset.src || '', kind });
        saveFavorites(favorites.slice(0, 300), kind);
        button.classList.add('favorite-pop');
        window.setTimeout(() => button.classList.remove('favorite-pop'), 420);
        showToast('Added to Favorites');
      }
      syncFavoriteButtons();
      syncLauncherFavoriteState();
      renderFavoritesSection();
      document.dispatchEvent(new CustomEvent('mc:favorites-changed'));
    }, true);
    renderFavoritesSection();
  }

  function renderFavoritesSection() {
    const main = document.querySelector('main');
    if (!main) return;
    let section = document.querySelector('.favorites-section');
    const kind = getPageKind();
    const items = readFavorites(kind);
    if (!items.length) { section?.remove(); return; }
    if (!section) {
      section = document.createElement('section');
      section.className = 'favorites-section reveal-on-scroll';
      section.innerHTML = `<div class="section-heading"><h2>Favorites</h2><p>Your saved ${kind}s stay here.</p></div><div class="favorites-grid"></div>`;
      const grid = main.querySelector('.media-grid');
      main.insertBefore(section, grid || main.firstChild?.nextSibling || null);
    }
    const grid = section.querySelector('.favorites-grid');
    grid.innerHTML = items.slice(0, 10).map((item) => `<button class="media-tile favorite-card" type="button" data-src="${escapeHtml(item.src)}" id="fav-${escapeHtml(item.id)}" data-favorite-id="${escapeHtml(item.id)}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}"><span class="media-title">${escapeHtml(item.title)}</span></button>`).join('');
    decorateMediaTiles();
  }



  function setupLibraryFilters() {
    const grid = document.querySelector('.media-grid[data-media-kind], .media-grid[data-media-static]');
    const hero = document.querySelector('main .hero');
    if (!grid || !hero || document.querySelector('.library-toolbar')) return;
    const kind = getPageKind();
    const toolbar = document.createElement('section');
    toolbar.className = 'library-toolbar';
    toolbar.innerHTML = `
      <button class="library-filter is-active" type="button" data-filter="all">All ${kind}s</button>
      <button class="library-filter" type="button" data-filter="favorites">♥ Favorites</button>
      <p class="library-filter-count" aria-live="polite"></p>`;
    hero.insertAdjacentElement('afterend', toolbar);
    const count = toolbar.querySelector('.library-filter-count');
    function applyFilter(mode) {
      toolbar.querySelectorAll('.library-filter').forEach((btn) => btn.classList.toggle('is-active', btn.dataset.filter === mode));
      const favoriteIds = new Set(readFavorites(kind).map((item) => item.id));
      let shown = 0;
      grid.querySelectorAll('.media-tile[data-src]').forEach((tile) => {
        const visible = mode !== 'favorites' || favoriteIds.has(getTileId(tile));
        tile.classList.toggle('is-filtered-out', !visible);
        if (visible) shown += 1;
      });
      grid.querySelectorAll('.media-row, .movie-section').forEach((group) => {
        group.classList.toggle('is-filtered-out', !group.querySelector('.media-tile:not(.is-filtered-out)'));
      });
      count.textContent = mode === 'favorites' ? `${shown} favorite ${kind}${shown === 1 ? '' : 's'} shown` : 'Showing the full library';
    }
    toolbar.addEventListener('click', (event) => {
      const button = event.target.closest('.library-filter');
      if (!button) return;
      applyFilter(button.dataset.filter);
    });
    document.addEventListener('mc:favorites-changed', () => applyFilter(toolbar.querySelector('.library-filter.is-active')?.dataset.filter || 'all'));
    applyFilter('all');
  }

  function setupDetailsModal() {
    if (document.querySelector('.details-modal')) return;
    const modal = document.createElement('div');
    modal.className = 'details-modal';
    modal.innerHTML = `<div class="details-card" role="dialog" aria-modal="true" aria-labelledby="detailsTitle"><button class="details-close" type="button" aria-label="Close details">×</button><div class="details-content"></div></div>`;
    document.body.appendChild(modal);
    const content = modal.querySelector('.details-content');
    const close = () => { modal.classList.remove('is-open'); document.body.classList.remove('details-open'); };
    const open = (tile) => {
      const kind = getTileKind(tile);
      const title = textFromTile(tile);
      const info = findContentInfo(kind, title);
      const image = tile.querySelector('img')?.src || '';
      const kindLabel = kind === 'movie' ? 'Movie' : kind === 'app' ? 'App' : 'Game';
      const primaryLabel = kind === 'app' ? 'Name' : 'Title';
      const descriptionLabel = kind === 'movie' ? 'Synopsis' : 'Description';
      const metaLabel = kind === 'app' ? 'Category' : kind === 'movie' ? 'Genre' : 'Genre';
      const platform = kind === 'game' ? '<div><dt>Platform</dt><dd>Browser</dd></div>' : '';
      content.innerHTML = `
        <img class="details-art" src="${escapeHtml(image)}" alt="${escapeHtml(title)}" />
        <div class="details-copy">
          <p class="details-kicker">${kindLabel} Details</p>
          <h2 id="detailsTitle">${escapeHtml(info.title || title)}</h2>
          <p class="details-description">${escapeHtml(info.description || '')}</p>
          <dl class="details-meta">
            <div><dt>${primaryLabel}</dt><dd>${escapeHtml(info.title || title)}</dd></div>
            <div><dt>${descriptionLabel}</dt><dd>${escapeHtml(info.description || '')}</dd></div>
            <div><dt>${metaLabel}</dt><dd></dd></div>
            ${kind === 'game' ? '<div><dt>Player Mode</dt><dd></dd></div>' : ''}
            ${kind === 'app' ? '<div><dt>Purpose</dt><dd></dd></div><div><dt>Official Website</dt><dd></dd></div>' : ''}
            ${platform}
            <div><dt>Tags</dt><dd>${(info.tags || []).map(escapeHtml).join(', ')}</dd></div>
          </dl>
        </div>`;
      modal.classList.add('is-open');
      document.body.classList.add('details-open');
    };
    document.addEventListener('click', (event) => {
      const action = event.target.closest('.quick-actions [data-quick-action="details"]');
      if (!action) return;
      const quick = action.closest('.quick-actions');
      const tile = quick.closest('.media-tile[data-src]');
      if (!tile) return;
      event.preventDefault(); event.stopPropagation(); open(tile);
    }, true);
    modal.querySelector('.details-close').addEventListener('click', close);
    modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('is-open')) close(); });
  }

  function setupSkeletonLoading() {
    document.querySelectorAll('.media-tile img').forEach((img) => {
      const tile = img.closest('.media-tile');
      if (!tile || img.complete) return;
      tile.classList.add('is-loading');
      img.addEventListener('load', () => tile.classList.remove('is-loading'), { once: true });
      img.addEventListener('error', () => tile.classList.remove('is-loading'), { once: true });
    });
  }

  function setupScrollAnimations() {
    const items = document.querySelectorAll('.hero, .card, .media-tile, .movie-section, .home-splash-panel');
    if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-revealed')); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }), { threshold: 0.08, rootMargin: '40px' });
    items.forEach((el, index) => { el.classList.add('reveal-on-scroll'); el.style.setProperty('--reveal-delay', `${Math.min(index % 12, 8) * 22}ms`); observer.observe(el); });
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((error) => {
        console.warn('Service worker registration failed.', error);
      });
    });
  }

  function setupSiteSearch() {
    const topbarRow = document.querySelector('.topbar-row');
    if (!topbarRow || topbarRow.querySelector('.nav-search')) return;

    const settingsLink = topbarRow.querySelector('.settings-link');
    const toolsWrap = document.createElement('div');
    toolsWrap.className = 'topbar-tools';

    const searchForm = document.createElement('form');
    searchForm.className = 'nav-search premium-search';
    searchForm.setAttribute('role', 'search');
    searchForm.innerHTML = `
      <label class="sr-only" for="siteSearchInput">Search site</label>
      <input id="siteSearchInput" name="q" type="search" autocomplete="off" placeholder="Search games, movies, apps…" aria-label="Search 𝕄𝕔ℂ𝕣𝕒𝕔𝕜" aria-expanded="false" aria-controls="siteSearchSuggestions" />
      <kbd>/</kbd>
      <div id="siteSearchSuggestions" class="search-suggestions" role="listbox"></div>`;
    toolsWrap.appendChild(searchForm);
    if (settingsLink) toolsWrap.appendChild(settingsLink);
    topbarRow.appendChild(toolsWrap);

    const input = searchForm.querySelector('input');
    const suggestions = searchForm.querySelector('.search-suggestions');
    let activeIndex = -1;
    let cachedResults = [];
    const siteIndex = [
      { title: 'Home', href: '/', kind: 'Page', terms: ['home', 'main', 'dashboard', 'launchpad', 'mccrack'] },
      { title: 'Games', href: '/games', kind: 'Page', terms: ['games', 'game', 'popular', 'roblox', 'gaming', 'minecraft', 'terraria'] },
      { title: 'Movies', href: '/movies', kind: 'Page', terms: ['movies', 'movie', 'films', 'watch'] },
      { title: 'Apps', href: '/apps', kind: 'Page', terms: ['apps', 'app', 'bypass', 'unblock', 'restriction'] },
      { title: 'Browser', href: '/browser', kind: 'Page', terms: ['browser', 'search web', 'internet'] },
      { title: 'Chat', href: '/chat', kind: 'Page', terms: ['chat', 'messages', 'talk'] },
      { title: '𝕄𝕔ℂ𝕣𝕒𝕔𝕜OS', href: '/mccrackos', kind: 'Page', terms: ['mccrackos', 'os', 'tools'] },
      { title: 'More', href: '/more', kind: 'Page', terms: ['more', 'extras', 'additional'] },
      { title: 'Settings', href: '/settings', kind: 'Page', terms: ['settings', 'theme', 'tab', 'customize'] }
    ];

    let searchableContentPromise;
    async function getSearchableContent() {
      if (searchableContentPromise) return searchableContentPromise;
      searchableContentPromise = (async () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const entries = [];
        entries.push(...buildLocalTileEntries(document, currentPath));
        for (const path of ['games.html', 'movies.html', 'apps.html'].filter((path) => path !== currentPath)) {
          try { entries.push(...buildLocalTileEntries(await readDocFromPage(path), path)); } catch (error) { console.warn(`Search index skipped ${path}.`, error); }
        }
        return entries.map((entry) => ({ ...entry, title: entry.terms[0] || entry.href, kind: entry.href.includes('movie') ? 'Movie' : (entry.href.includes('app') ? 'App' : 'Game') }));
      })();
      return searchableContentPromise;
    }

    const fuzzyScore = (query, value) => {
      query = query.toLowerCase(); value = value.toLowerCase();
      if (!query) return 0;
      if (value === query) return 1000;
      if (value.includes(query)) return 700 - value.indexOf(query);
      let qi = 0, score = 0;
      for (let vi = 0; vi < value.length && qi < query.length; vi++) {
        if (value[vi] === query[qi]) { score += 22 - Math.min(vi, 12); qi++; }
      }
      return qi === query.length ? score : 0;
    };
    const highlight = (title, query) => {
      let qi = 0;
      return [...title].map((char) => char.toLowerCase() === query[qi]?.toLowerCase() ? (qi++, `<mark>${char}</mark>`) : char).join('');
    };
    const openResult = (result) => { if (result) { showToast('Search Complete'); navigateToPath(result.href); } };
    const render = (query, results) => {
      input.setAttribute('aria-expanded', String(Boolean(query)));
      suggestions.classList.toggle('is-open', Boolean(query));
      if (!query) { suggestions.innerHTML = ''; return; }
      if (!results.length) {
        suggestions.innerHTML = '<div class="search-empty"><strong>No results found.</strong><span>Try searching for:</span><em>Minecraft</em><em>Roblox</em><em>Terraria</em></div>'; return;
      }
      suggestions.innerHTML = results.slice(0, 8).map((r, i) => `<button type="button" role="option" class="search-suggestion ${i === activeIndex ? 'is-active' : ''}" data-index="${i}"><span>${highlight(r.title, query)}</span><small>${r.kind}</small></button>`).join('');
    };
    const update = async () => {
      const query = input.value.trim(); activeIndex = -1;
      const entries = [...siteIndex, ...(await getSearchableContent())];
      cachedResults = entries.map((entry) => ({ ...entry, score: Math.max(...entry.terms.map((term) => fuzzyScore(query, term))) })).filter((entry) => entry.score > 0).sort((a,b) => b.score - a.score);
      render(query, cachedResults);
    };
    input.addEventListener('input', update);
    suggestions.addEventListener('click', (event) => openResult(cachedResults[Number(event.target.closest('.search-suggestion')?.dataset.index)]));
    searchForm.addEventListener('submit', (event) => { event.preventDefault(); openResult(cachedResults[Math.max(activeIndex, 0)]); });
    document.addEventListener('keydown', (event) => {
      if (event.key === '/' && document.activeElement !== input && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) { event.preventDefault(); input.focus(); update(); }
      if (event.key === 'Escape') { suggestions.classList.remove('is-open'); input.setAttribute('aria-expanded', 'false'); }
      if (document.activeElement !== input || !suggestions.classList.contains('is-open')) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); activeIndex = (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + Math.min(cachedResults.length, 8)) % Math.min(cachedResults.length, 8); render(input.value.trim(), cachedResults); }
      if (event.key === 'Enter' && activeIndex >= 0) { event.preventDefault(); openResult(cachedResults[activeIndex]); }
    });
    getSearchableContent().then(() => input.value && update());
  }

  window.mcApp = {
    applySettings,
    populateMediaGrid,
    organizeGameTilesAlphabetically,
    organizeMovieSections,
    defaults: { DEFAULT_TITLE, DEFAULT_FAVICON, defaultWallpaper }
  };

  applySettings();
  populateMediaGrid();
  organizeGameTilesAlphabetically();
  organizeMovieSections();
  setupSiteSearch();
  setupFavorites();
  setupLibraryFilters();
  setupDetailsModal();
  setupSkeletonLoading();
  setupScrollAnimations();
  setupEmbedRefreshControls();
  setupMediaLauncher();
  setupPopularGamesByLikes();
  setupHashTargeting();
  setupHomeSplashMessage();
  setupDistrictNotice();
  setupLiveUsersCounter();
  setupContentCounts();
  registerServiceWorker();
  setupCommentBox();
  setupVisitorCounter();
})();
