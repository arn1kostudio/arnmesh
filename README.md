# ArnMesh website

Static GitHub Pages site for ArnMesh.

## What is included

- `index.html` - the public landing page.
- `assets/css/styles.css` - responsive styling.
- `assets/js/site.js` - download-link detection, reveal animation, and hero mesh canvas.
- `assets/brand/arnmesh-icon.png` - app icon copied from the ArnMesh project.
- `assets/preview/arnmesh-product-preview.png` - sanitized product preview image.
- `downloads/` - optional local fallback folder for release assets.

## Local preview

Open `index.html` in a browser. Download buttons use the local `downloads/` folder outside GitHub Pages, so you can optionally place local builds there for testing.

## Updating downloads

When ArnMesh is rebuilt:

1. Upload the new `ArnMeshSetup.zip` and `ArnMesh-Android-release.apk` to the latest GitHub Release.
2. Update the SHA-256 strings in `index.html` if you want the page checksums to match the new release.
3. Commit any text or design updates.
