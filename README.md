# ArnMesh website

Static GitHub Pages site for ArnMesh.

## What is included

- `index.html` - the public landing page.
- `assets/css/styles.css` - responsive styling.
- `assets/js/site.js` - download-link detection, reveal animation, and hero mesh canvas.
- `assets/brand/arnmesh-icon.png` - app icon copied from the ArnMesh project.
- `assets/preview/arnmesh-product-preview.png` - sanitized product preview image.
- `downloads/` - optional local fallback folder for release assets.

## Publishing on GitHub Pages

1. Create a GitHub repository for the site.
2. Push this folder to the repository.
3. Enable GitHub Pages from the repository settings.
4. Create a GitHub Release and upload these files with exact names:
   - `ArnMeshSetup.exe`
   - `ArnMesh-Android-release.apk`
5. The site automatically builds direct download links like:
   - `https://github.com/<owner>/<repo>/releases/latest/download/ArnMeshSetup.exe`
   - `https://github.com/<owner>/<repo>/releases/latest/download/ArnMesh-Android-release.apk`

The Windows installer is larger than GitHub's normal repository file limit, so keep installers and APKs in Releases rather than committing them to the repository.

## Local preview

Open `index.html` in a browser. Download buttons use the local `downloads/` folder outside GitHub Pages, so you can optionally place local builds there for testing.

## Updating downloads

When ArnMesh is rebuilt:

1. Upload the new `ArnMeshSetup.exe` and `ArnMesh-Android-release.apk` to the latest GitHub Release.
2. Update the SHA-256 strings in `index.html` if you want the page checksums to match the new release.
3. Commit any text or design updates.

## Custom release URL

If the site uses a custom domain and cannot infer the GitHub repository from the URL, add this before `assets/js/site.js` in `index.html`:

```html
<script>
  window.ARNMESH_RELEASE_BASE =
    "https://github.com/OWNER/REPO/releases/latest/download/";
</script>
```
