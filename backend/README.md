# Backend: Express + MongoDB

One Node.js process serves the whole site:

| Path | What answers |
|---|---|
| Every public page: `/`, `/about`, `/contact`, `/safety`, `/articles`, `/articles/<slug>`, `/blog/<slug>`, `/<section>/<slug>`, `/category/<x>`, `/tag/<x>`, `/<page-slug>` … | **Server-rendered by Vue on each request** (content from MongoDB): complete HTML with title, meta, Open Graph, Twitter, canonical, JSON-LD (WebPage/Article/BlogPosting, Breadcrumb, FAQ) and the page content |
| `/assets/*`, `/robots.txt` … | Built files from `frontend/dist/` |
| `/admin/*` | The admin panel (client-side, `noindex`) |
| `/api/*` | REST API |
| `/uploads/*` | Uploaded images |
| `/sitemap.xml`, `/rss.xml` | Built from MongoDB on each request |

Publishing in the admin writes to MongoDB, and the next request renders the
new content. Nothing needs rebuilding or restarting.

## Setup

1. Put your MongoDB connection string in **`backend/.env`** (copy
   `backend/.env.example` if the file is missing):
   ```
   MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/cryptolearner
   ```
   The server connects **before** it starts listening. Without a URI, or if
   MongoDB can't be reached, it exits with the reason (wrong host, rejected
   password, Atlas IP not allowed, local MongoDB not running) instead of
   failing requests later.

2. Development — two terminals:
   ```bash
   cd backend  && npm install && npm run dev    # API on http://localhost:3000
   cd frontend && npm run dev                   # site on http://localhost:5173
   ```
   Open **http://localhost:5173**. The Vite dev server proxies `/api`,
   `/uploads`, the sitemap/RSS and the server-rendered page routes
   (`/articles/<slug>`, `/blog/<slug>`, `/<section>/<slug>`, `/category/…`,
   `/tag/…`, page slugs) to the backend, which renders them from the live Vue
   source: Ctrl+U on an article shows the complete HTML in development too.
   `npm run dev` in the project root starts both at once.

3. Production:
   ```bash
   npm install && npm run build    # project root: frontend/dist + backend/ssr
   npm start                       # NODE_ENV=production in backend/.env
   ```

On every start, if there is no account for `ADMIN_EMAIL`, it is created as an
admin with `ADMIN_PASSWORD` (stored as a bcrypt hash): by default
**admin52@gmail.com / 123456**. The server logs a warning on every start until
that password is changed. If `ADMIN_PASSWORD` is empty, a random password is
written to `backend/.runtime/initial-admin.txt` instead. JWT secrets you leave
empty are generated once and kept in `backend/.runtime/secrets.json`.

More users (role `admin` or `editor`):

```bash
npm run create-user -- --email editor@example.com --password "a long password" --role editor --name "Jane"
```

Editors create, edit, publish and upload. Only admins can delete.

`GET /api/health` returns `{"mode":…,"build":true,"database":true}` when everything is in place.

## Environment

The backend reads **only `backend/.env`** (real environment variables, e.g.
from a hosting panel, take precedence). `backend/.env.example` lists every
variable. The frontend's build-time values (`VITE_SITE_URL`, `VITE_API_URL`,
`VITE_DEV_API`) are in `frontend/.env`.

| Variable | Default | Purpose |
|---|---|---|
| `MONGODB_URI` | — (required) | MongoDB connection string, including the database name |
| `PORT` | `3000` | Hosting panels usually set it themselves |
| `NODE_ENV` | `production` | `development` renders articles from the live Vue source (no build needed) |
| `SITE_URL` | `http://localhost:5173` | Public address: canonical URLs, sitemap, RSS; `https://…` in production |
| `JWT_SECRET`, `JWT_REFRESH_SECRET` | generated | Set explicitly when running several instances |
| `JWT_EXPIRE`, `JWT_REFRESH_EXPIRE` | `15m`, `30d` | Token lifetimes |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | — | Admin created on startup if that account doesn't exist |
| `UPLOAD_PATH` | `uploads` (inside backend/) | Where uploaded images are stored |
| `TRUST_PROXY` | `1` | Proxies in front of Node (correct client IPs for rate limits) |
| `DB_CONNECT_ATTEMPTS` | `3` | Connection attempts at startup before exiting |

Dependencies: express, mongoose, jsonwebtoken, bcrypt, multer, helmet,
compression, morgan, cookie-parser, dotenv — and jsdom, which server
rendering needs: the existing article components sanitize HTML and build the
table of contents with DOM APIs, and jsdom provides those on the server.

## Deploying

**cPanel "Setup Node.js App" (Passenger):** run `npm run release` in the
project root. It builds and writes `release/cryptolearner.us/` (plus a
`.tar.gz` of it): `backend/` with a production `.env` and a backend-only
`package-lock.json`, and `frontend/dist/`. Upload it as
`/home/USERNAME/cryptolearner.us/`, then:

- Application root `cryptolearner.us/backend`, startup file `passenger.cjs`
  (a CommonJS loader: Passenger `require()`s the startup file and
  `server.js` is an ES module), Node 20+, mode Production.
- "Run NPM Install" (or `npm ci --omit=dev` in `backend/`). Nothing is built
  on the server.
- The server detects Passenger and lets it own the socket; `PORT` is unused.

- **Uploads** live in `UPLOAD_PATH` (the release sets `../uploads`, next to
  `backend/`, so redeploying the code never touches them). Back that folder
  up along with the database.
- **MongoDB Atlas:** allow the server's IP under Network Access.

## Moving the old Firestore content

A one-time import over Firestore's REST API (no Firebase SDK):

```bash
npm run import:firestore -- --project crypto-blog-b2fc7
# collections the old Firestore rules kept private (blogs, messages, newsletter):
npm run import:firestore -- --project crypto-blog-b2fc7 --service-account ./serviceAccountKey.json
```

It copies articles, blog posts, pages, guide cards, contact messages and
newsletter subscribers, keeping their dates. Running it again updates the
same documents instead of duplicating them.

## API

Responses are JSON. Errors look like `{ "error": { "code", "message", "fields"? } }`.
**Staff** = `Authorization: Bearer <accessToken>` of an admin or editor.

### Auth
| | |
|---|---|
| `POST /api/auth/login` `{ email, password }` | `{ user, accessToken }` + httpOnly refresh cookie (10 failed attempts / 15 min per IP) |
| `POST /api/auth/refresh` | New access token (refresh token rotated); 204 when not signed in |
| `POST /api/auth/logout` | Revokes the session |
| `GET /api/auth/me` | Current user (staff) |

### Articles and blog posts
`/api/articles` and `/api/blogs` have the same routes:

| | |
|---|---|
| `GET /api/articles` | Published posts. Query: `search`, `category`, `tag`, `featured`, `guideCardId`, `limit`, `skip`, `summary=1` (no body), `status=all\|draft` (staff) |
| `GET /api/articles/:slug` | One published post (drafts too for staff, used by preview) |
| `GET /api/articles/id/:id` | By id (staff) |
| `GET /api/articles/slug-exists?slug=&excludeId=` | `{ exists }` (staff) |
| `POST /api/articles` | Create (staff) |
| `PUT /api/articles/:id` | Update; `published: true` publishes (staff) |
| `DELETE /api/articles/:id` | Delete (admin) |
| `POST /api/articles/:id/views` | View counter |
| `POST /api/articles/:id/likes` `{ delta: 1\|-1 }` | Like counter |

Post body fields: `title, slug, description (excerpt), content (HTML),
category, tags[], coverImage (featuredImage), author, published / status,
seoTitle (metaTitle), seoDescription (metaDescription), canonicalUrl
(canonical), focusKeyword, ogTitle, ogDescription, ogImage, twitterTitle,
twitterDescription, schema, faqs[{question, answer}], featured, difficulty,
keyTakeaways[], guideCategory, guideCardId, guideSection`. The names in
brackets are the MongoDB field names, which the API accepts too.
`readingTime`, `publishedAt` and `updatedAt` are set by the server.

### Everything else
| | |
|---|---|
| `GET /api/search?q=…&type=articles,blogs,pages&limit=20` | `{ query, total, results: [{ type, title, description, path, … }] }`, published content only |
| `GET /api/categories?kind=article\|blog`, `GET /api/tags` | `[{ name, slug, count }]` of published posts |
| `GET /api/pages`, `GET /api/pages/:slug`, `GET /api/pages/id/:id`, `GET /api/pages/slug-exists`, `POST`, `PUT /:id`, `DELETE /:id` | Pages (same rules as posts) |
| `GET /api/guide-cards?category=`, `GET /:id`, `GET /card-id-exists`, `POST`, `PUT /:id`, `PUT /reorder { ids }`, `DELETE /:id` | Guide cards |
| `POST /api/upload` (multipart `file`, optional `folder`) | `{ url, publicId, width, height }`; JPEG/PNG/WebP/GIF up to `UPLOAD_MAX_MB` (staff) |
| `GET /api/upload`, `DELETE /api/upload/:publicId` | Media library (staff) |
| `GET /api/dashboard` | Counts and recent posts (staff) |
| `POST /api/contact` `{ name, email, subject, message }` | Stored; read them with `GET /api/messages` |
| `GET /api/messages`, `PATCH /api/messages/:id { read }`, `DELETE /api/messages/:id` | Contact messages (staff; delete: admin) |
| `POST /api/newsletter` `{ email, source }`, `GET /api/newsletter` | Newsletter (list: staff) |
| `GET /api/health` | `{ build, database }` |

## Layout

```
backend/
  package.json     backend dependencies and scripts (npm workspace)
  server.js        start: database, first admin, HTTP server (Passenger-aware)
  app.js           Express app: security headers, compression, JSON, routes
  config/          env.js (all settings), db.js (Mongoose connection)
  models/          Article, Page, GuideCard, User, Message, Subscriber, Media
  services/        business logic; ssr/ = server rendering of the Vue pages
  controllers/     request → service → response
  routes/          api.js (REST), site.js (pages, files, feeds)
  middleware/      auth (JWT, roles), security (Helmet + CSP), uploads, rate limits, errors
  utils/           text helpers, HTTP errors
  scripts/         create-user, import-firestore
  views/           error page
  uploads/         uploaded images (UPLOAD_PATH)
  ssr/             server bundle, written by npm run build
```
