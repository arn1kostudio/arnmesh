# ArnMesh website

Static GitHub Pages site for ArnMesh.

## What is included

- `index.html` - the public landing page.
- `assets/css/styles.css` - responsive styling.
- `assets/js/site.js` - release-link detection, redirect logic, reveal animation, and hero mesh canvas.
- `assets/brand/arnmesh-icon.png` - app icon copied from the ArnMesh project.
- `assets/preview/arnmesh-product-preview.png` - sanitized product preview image.
- `downloads/` - redirect routes and optional local fallback folder for release assets.

## Publishing on GitHub Pages

1. Create a GitHub repository for the site.
2. Push this folder to the repository.
3. Enable GitHub Pages from the repository settings.
4. Create a GitHub Release and upload these files with exact names:
   - `ArnMeshSetup.zip`
   - `ArnMeshSetup.exe`
   - `app-release.apk`
5. The site automatically routes these stable URLs to the latest release asset:
   - `https://<owner>.github.io/<repo>/downloads/windows/`
   - `https://<owner>.github.io/<repo>/downloads/windows-exe/`
   - `https://<owner>.github.io/<repo>/downloads/android/`

The Windows installer is larger than GitHub's normal repository file limit, so keep installers and APKs in Releases rather than committing them to the repository.

## Local preview

Open `index.html` in a browser. The download routes can also use local fallback files if you place them in:

- `downloads/ArnMeshSetup.zip`
- `downloads/ArnMeshSetup.exe`
- `downloads/app-release.apk`

## Updating downloads

When ArnMesh is rebuilt:

1. Upload the new `ArnMeshSetup.zip`, `ArnMeshSetup.exe`, and `app-release.apk` to the latest GitHub Release.
2. Commit any text or design updates.

## Custom release URL

If the site uses a custom domain and cannot infer the GitHub repository from the URL, add this before `assets/js/site.js` in `index.html`:

```html
<script>
  window.ARNMESH_RELEASE_BASE =
    "https://github.com/OWNER/REPO/releases/latest/download/";
</script>
```
