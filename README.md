# Rifath — Immersive Portfolio

A cinematic personal portfolio for Md Rakibul Islam Rifath, built with Three.js, WebGL, GSAP, and ScrollTrigger.

**Production domain:** `https://mdrakibulislam.com`

## Run locally

From the workspace root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/portfolio/`.

The site uses CDN-hosted Three.js, GSAP, and Google Fonts, so an internet connection is required on first load.

## Deploy

The folder is ready for GitHub Pages with the included `CNAME` file, or for Netlify/Vercel. The custom domain must still be purchased and its DNS records connected to the selected host.

### GitHub Pages

1. Create a public repository named `mdrakibulislam.com`.
2. Upload every file from this folder to the repository root, including `.nojekyll` and `CNAME`.
3. Open **Settings → Pages** in the repository.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. After purchasing the domain, set the DNS records requested by GitHub Pages and confirm `mdrakibulislam.com` under **Settings → Pages → Custom domain**.
