# McCrack local games folder

This folder is reserved for game files mirrored into McCrack.

The source repository, [Patrickmango49/game](https://github.com/Patrickmango49/game), is unusually large (GitHub reports a repository size of roughly 15 GB). Copying the entire repository into McCrack in one operation would risk repository and deployment limits, so this integration keeps the existing files untouched and currently discovers games from the source repository's published pages instead of silently copying a partial set.

- The McCrack Games page loads the source repository's top-level game folders.
- Game titles and descriptions are read from each game's own HTML metadata where available.
- The source chooser checks for a local file under `games/<game-slug>/index.html` and offers it only when that local copy exists.
- To create a true self-hosted copy, add each game's complete folder (including assets and scripts) here; keep each folder's internal relative paths intact.

Do not remove assets from game folders during a copy: many games depend on sibling CSS, JavaScript, images, audio, or data files.
