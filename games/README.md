# McCrack local games folder

This folder holds complete game folders mirrored from [Patrickmango49/game](https://github.com/Patrickmango49/game).

Because the source repository is roughly 15 GB, copying everything into McCrack at once would risk GitHub's repository and Pages publishing limits. The Games page continues to show the full source catalogue, and its **Sources** chooser offers a McCrack-hosted link whenever a local copy exists.

## Copy a safe batch automatically

1. Open the [Sync games workflow](https://github.com/Patrickmango49/McCrack/actions/workflows/sync-games.yml).
2. Select **Run workflow**.
3. Leave the default **600 MB** limit (the workflow will never accept more than 700 MB).
4. Run it and wait for the job to finish. It copies complete game folders, including their assets, while skipping folders that don't fit the remaining size budget or contain a single file over GitHub's 100 MB file limit.
5. When the workflow commits the batch, GitHub Pages should publish the newly copied games. Check a game's **Sources** panel to confirm the self-hosted link appears.

The workflow never deletes existing game folders. Run it again later to add another batch, as long as the total copied files remain under the configured cap.

Do not strip assets from a copied game folder: many games depend on sibling CSS, JavaScript, images, audio, or data files. Some games may still depend on external services or have licensing restrictions, so a copied folder is not a guarantee every game will run perfectly.
