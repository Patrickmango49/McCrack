
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
  const defaultWallpaper = 'linear-gradient(170deg, #050505 0%, #1a1a1a 35%, #7d7d7d 70%, #dadada 100%)';
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
      <div class="media-launcher-controls" aria-label="Player controls">
        <button class="media-launcher-refresh" type="button" aria-label="Refresh player" title="Refresh">↻</button>
        <button class="media-launcher-close" type="button" aria-label="Close player" title="Close">✕</button>
      </div>
      <div class="media-launcher-shell">
        <div class="media-launcher-frame-wrap">
          <div class="media-launcher-loader" aria-live="polite">
            <div class="media-launcher-spinner" aria-hidden="true"></div>
            <p>${kind === 'movie' ? 'Loading movie…' : 'Loading game…'}</p>
          </div>
          <iframe id="mediaFrame" src="about:blank" referrerpolicy="no-referrer" allow="autoplay; fullscreen"></iframe>
        </div>
        <div class="media-launcher-actions">
          <button class="media-launcher-fullscreen" type="button">Fullscreen</button>
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
    const aboutBlankButton = launcher.querySelector('.media-launcher-aboutblank');
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
      openLauncher(tile.dataset.src);
    });

    frame.addEventListener('load', () => {
      clearLoader();
    });

    closeButton.addEventListener('click', closeLauncher);
    refreshButton.addEventListener('click', refreshLauncher);

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
      { selector: '.media-grid[data-media-static="movie"], .media-grid[data-media-kind="movie"]', label: 'Movies listed', placeholder: /^movie\s+\d+$/i, key: 'movies' }
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
    searchForm.className = 'nav-search';
    searchForm.setAttribute('role', 'search');
    searchForm.innerHTML = '<label class="sr-only" for="siteSearchInput">Search site</label><input id="siteSearchInput" name="q" type="search" placeholder="Search 𝕄𝕔ℂ𝕣𝕒𝕔𝕜..." aria-label="Search 𝕄𝕔ℂ𝕣𝕒𝕔𝕜" />';
    toolsWrap.appendChild(searchForm);

    if (settingsLink) {
      toolsWrap.appendChild(settingsLink);
    }

    topbarRow.appendChild(toolsWrap);

    const siteIndex = [
      { href: '/', terms: ['home', 'main', 'dashboard', 'launchpad', 'mccrack'] },
      { href: '/games', terms: ['games', 'game', 'popular', 'roblox', 'gaming'] },
      { href: '/movies', terms: ['movies', 'movie', 'films', 'watch'] },
      { href: '/apps', terms: ['apps', 'app', 'bypass', 'unblock', 'restriction'] },
      { href: '/browser', terms: ['browser', 'search web', 'internet'] },
      { href: '/chat', terms: ['chat', 'messages', 'talk'] },
      { href: '/mccrackos', terms: ['mccrackos', 'os', 'tools'] },
      { href: '/more', terms: ['more', 'extras', 'additional'] },
      { href: '/settings', terms: ['settings', 'theme', 'tab', 'customize'] }
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
        navigateToPath(isDirectPage.href);
        return;
      }

      const pageMatch = siteIndex.find((entry) => entry.terms.some((term) => term.includes(query) || query.includes(term)));
      if (pageMatch && query.length < 4) {
        navigateToPath(pageMatch.href);
        return;
      }

      const dynamicEntries = await getSearchableContent();
      const exactMediaMatch = dynamicEntries.find((entry) => entry.terms.some((term) => term === query));
      if (exactMediaMatch) {
        navigateToPath(exactMediaMatch.href);
        return;
      }

      const mediaMatch = dynamicEntries.find((entry) => entry.terms.some((term) => term.includes(query) || query.includes(term)));
      if (mediaMatch) {
        navigateToPath(mediaMatch.href);
        return;
      }

      if (pageMatch) {
        navigateToPath(pageMatch.href);
        return;
      }

      window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(`site:mccrack ${query}`)}`;
    });
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
  setupEmbedRefreshControls();
  setupMediaLauncher();
  setupPopularGamesByLikes();
  setupHashTargeting();
  setupBootFlow();
  setupHomeSplashMessage();
  setupDistrictNotice();
  setupLiveUsersCounter();
  setupContentCounts();
  registerServiceWorker();
  setupCommentBox();
  setupVisitorCounter();
})();
