# Rifath — Immersive Portfolio

A living neural-network portfolio for Md Rakibul Islam Rifath, built with Three.js and WebGL.

Around 2,600 particles form a network that fires as visitors move through it and reshapes for each section: a brain, the name RIFATH, one cluster per project, a helix for experience, and HELLO. Clicking a project cluster or card opens a project window with the challenge, the steps taken, why it mattered and a small interactive demo.

## Files

- `index.html` – page content
- `neural.css` – styles
- `projects.js` – the project list; add an entry here to add a cluster and project window
- `neural.js` – the 3D network, section shapes and project windows
- `project.html`, `school-projects.html`, `personal-projects.html` and their scripts are the previous design's pages, kept so old links keep working

**Production domain:** `https://mdrakibulislam.com`

## Run locally

From the workspace root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`.

The site uses CDN-hosted Three.js and Google Fonts, so an internet connection is required on first load.

## Deploy

The folder is ready for GitHub Pages with the included `CNAME` file, or for Netlify/Vercel. The custom domain must still be purchased and its DNS records connected to the selected host.

### GitHub Pages

1. Create a public repository named `mdrakibulislam.com`.
2. Upload every file from this folder to the repository root, including `.nojekyll` and `CNAME`.
3. Open **Settings → Pages** in the repository.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. After purchasing the domain, set the DNS records requested by GitHub Pages and confirm `mdrakibulislam.com` under **Settings → Pages → Custom domain**.
