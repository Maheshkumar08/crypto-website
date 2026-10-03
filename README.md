# cryptolearner.us

```
frontend/   Vue 3 + Vite: the website and the admin panel (no Firebase)
backend/    Express + MongoDB: REST API, uploads, JWT auth, server-rendered article pages
scripts/    dev.mjs — runs both for `npm run dev`
```

Both folders are npm workspaces: one `npm install` at the root installs everything.

## Quick start

1. Put your MongoDB connection string in **`backend/.env`**:
   ```
   MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/cryptolearner
   ```
2. Development (two terminals), then open **http://localhost:5173**:
   ```bash
   cd backend  && npm install && npm run dev    # API + server rendering on :3000
   cd frontend && npm run dev                   # Vite on :5173, proxies to :3000
   ```
   (`npm run dev` in the project root starts both at once.)
3. Production: `npm install && npm run build && npm start` in the project root,
   with `NODE_ENV=production` and your real `SITE_URL` in `backend/.env`.

The admin account is created on startup from `backend/.env`:
**admin52@gmail.com / 123456** (stored as a bcrypt hash). Sign in at
`/admin/login`. The server warns on every start until you change it:

```bash
cd backend && npm run create-user -- --email admin52@gmail.com --password "a long, unique password"
```

## How it fits together

- **Every public page is rendered by Vue on the server, on every request**:
  home, about, contact, the section and legal pages, the article and blog
  listings, articles, blog posts, guides, categories, tags and CMS pages.
  Ctrl+U shows the complete HTML (content, navigation, footer, title, meta,
  canonical, Open Graph, Twitter, JSON-LD), then the browser takes over.
  Lists (article cards, guide cards) are loaded on the server too.
- Nothing is prerendered: publishing in the admin is live on the next
  request, and in development an edit to a `.vue` file shows on the next
  page load without a build. Only the admin (`/admin`) is client-rendered.
- The frontend talks to the backend only through the REST API.

Backend setup, environment variables, deployment (incl. cPanel) and the API
reference: [backend/README.md](backend/README.md).
