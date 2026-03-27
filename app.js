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
        <a class="media-tile" href="https://example.com/${kind.toLowerCase()}-${index}" target="_blank" rel="noreferrer">
          <img src="https://picsum.photos/seed/${kind.toLowerCase()}-${index}/600/600" alt="${kind} ${index}" />
          <span>${kind} ${index}</span>
        </a>
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
})();
