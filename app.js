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
      document.body.style.background = 'linear-gradient(135deg, #09090d, #151726 40%, #1e2235)';
    }
  }

  window.mcApp = {
    applySettings,
    defaults: { DEFAULT_TITLE, DEFAULT_FAVICON, defaultWallpaper }
  };

  applySettings();
})();
