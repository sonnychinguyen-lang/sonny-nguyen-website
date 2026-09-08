// Public assets must be resolved against Vite's BASE_URL, not an absolute "/",
// because the site is deployed under a subpath on GitHub Pages
// (/sonny-nguyen-website/) but at the root on Netlify/local dev. A literal
// "/photos/x.jpg" happens to work at the root and silently 404s under a subpath.
export const asset = (p) => import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + p.replace(/^\//, '')
