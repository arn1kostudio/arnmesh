# ArnMesh website

Static GitHub Pages site for ArnMesh.

## What is included

- `index.html` - the public landing page.
- `assets/css/styles.css` - responsive styling.
- `assets/js/site.js` - release-link detection, redirect logic, reveal animation, and hero mesh canvas.
- `assets/brand/arnmesh-icon.png` - app icon copied from the ArnMesh project.
- `assets/preview/arnmesh-product-preview.png` - sanitized product preview image.
- `downloads/` - redirect routes and optional local fallback folder for release assets.

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
