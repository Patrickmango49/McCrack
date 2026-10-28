# McCrack File Organization Backup

> Purpose: preserve the original layout before any file/folder reorganization. If the reorganization is unwanted or breaks paths, use this file as the restoration guide.

## Original snapshot

- Repository: https://github.com/Patrickmango49/McCrack
- Original branch: `main`
- Baseline commit: `b2d4bd467bc862a52f2276efb83358133b5fef09`
- Baseline commit URL: https://github.com/Patrickmango49/McCrack/commit/b2d4bd467bc862a52f2276efb83358133b5fef09
- The baseline commit is the source of truth for original paths and file contents.

## Original tracked paths

These paths were present at the baseline. Keep the HTML pages in the repository root.

```text
.github/workflows/neocities.yml
.github/workflows/sync-games.yml
.github/workflows/validate.yml
.gitignore
404.html
CNAME
COS.html
OS.html
README.md
app.js
apps.html
browser.html
chat.html
config.example.js
favicon.png
game-repo-integration.js
games.html
games/README.md
google34d334d9b547ae14.html
index.html
library-data.js
manifest.webmanifest
more.html
movies.html
package-lock.json
scripts/validate-site.mjs
settings.html
styles.css
sw.js
tester-invite.js
```

## Files that should normally remain in the root

- All existing HTML pages: `404.html`, `COS.html`, `OS.html`, `apps.html`, `browser.html`, `chat.html`, `games.html`, `google34d334d9b547ae14.html`, `index.html`, `more.html`, `movies.html`, and `settings.html`.
- Root/deployment configuration: `CNAME`, `.gitignore`, `package-lock.json`, and `manifest.webmanifest`.
- Runtime files whose relative paths may be referenced by pages: `app.js`, `game-repo-integration.js`, `library-data.js`, `styles.css`, `sw.js`, `tester-invite.js`, and `config.example.js`, unless every dependency is checked and deliberately updated.
- Google verification file: `google34d334d9b547ae14.html` (keep its exact root path).
- Existing special folders: `.github/workflows/`, `games/`, and `scripts/`.

## Safe rollback procedure

1. Inspect the current repository and identify the exact files moved or renamed during the organization change.
2. Move each affected file back to the original path listed above. Restore its original name and capitalization exactly.
3. Revert any path references changed for the move. Check HTML `src`/`href` attributes, CSS `url(...)`, JavaScript imports/fetches, `manifest.webmanifest` icon paths, service-worker precache paths in `sw.js`, and GitHub Actions workflow paths.
4. If a moved file was edited as well, restore its original content from the baseline commit linked above, but preserve unrelated changes made after the baseline.
5. Run the site's validation workflow/script if available and check the changed-file diff before publishing.
6. Do not force-push, reset the live branch, or revert unrelated newer work just to undo a folder move.

### Git-based restoration

For a file that was moved or modified, retrieve the original version from the baseline commit and restore it at its original path. With a local clone, the original file content can be inspected with:

```bash
git show b2d4bd467bc862a52f2276efb83358133b5fef09:path/to/original-file
```

To restore a specific file's original content and path in a local clone (replace the example paths with the real affected paths):

```bash
git restore --source=b2d4bd467bc862a52f2276efb83358133b5fef09 -- path/to/original-file
```

If the file was moved, first restore/copy the original path from the baseline, then remove the moved duplicate only after verifying references. Review with `git status` and `git diff` before committing. Avoid `git reset --hard` or restoring the entire repository unless a full rollback is explicitly intended.

## Important notes

- This document is a map and recovery guide; it does not itself contain copies of every file's contents. Git preserves the original snapshot at the baseline commit above.
- Keep this file in the repository after the reorganization so it remains available as a guide.
- When asked to roll back, read this file first, compare the current tree to the baseline, and undo only the organization changes unless a full rollback is explicitly requested.


## Current organization change (2026-10-28)

The conservative asset organization moves only this repository-owned static image:

| Original path | New path |
|---|---|
| `favicon.png` | `assets/icons/favicon.png` |

The move also updates local favicon references in the HTML pages and `app.js`, the icon entries in `manifest.webmanifest`, and the precache list in `sw.js`. The HTML pages and other runtime/configuration files remain in their original locations. The original image blob is reused, so the image itself is unchanged.

To reverse only this organization change, move `assets/icons/favicon.png` back to `favicon.png` and change references to `assets/icons/favicon.png` back to `favicon.png` in the files listed above. Prefer using the original baseline commit for the exact prior contents, while preserving unrelated changes.
