/* For a static deployment, replace the contents of tmdb-config.js with this configuration.
   Browser-readable credentials cannot be secret; use a server-side TMDB proxy when secrecy is required. */
window.McCrackConfig = {
  tmdb: {
    readAccessToken: 'PASTE_YOUR_TMDB_READ_ACCESS_TOKEN_HERE',
    language: 'en-US'
  }
};
