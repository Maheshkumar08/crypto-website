import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

// Every public page: the Express backend renders it on the server. Left to
// the dev server: its own files (/@vite, /src, /node_modules), anything with
// a file extension (images, robots.txt …) and the client-side admin.
const PAGE_ROUTES = /^\/(?!@|src\/|node_modules\/|admin(?:[/?#]|$)|api\/|uploads\/)(?![^?#]*\.[A-Za-z0-9]+(?:[?#]|$))/.source;

/** `npm run dev`: what the Vite dev server forwards to the Express backend. */
function devProxy(target) {
  const backendDown = (err, req, res) => {
    if (!res || res.headersSent || typeof res.writeHead !== "function") return;
    const message = `The API server at ${target} is not running (${err.code || err.message}). Start it: cd backend && npm run dev`;
    if (req.url.startsWith("/api/")) {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: { code: "backend-unavailable", message } }));
    } else {
      res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(message);
    }
  };
  const route = { target, changeOrigin: false, configure: (proxy) => proxy.on("error", backendDown) };
  return Object.fromEntries(
    ["/api", "/uploads", "/sitemap.xml", "/rss.xml", PAGE_ROUTES].map((path) => [path, route]),
  );
}

// `npm run build` runs two builds from this config:
//   vite build                              → dist/ (browser assets + index.html,
//                                              the template every page is rendered into)
//   vite build --ssr ... --mode backend     → ../backend/ssr (server bundle that
//                                              renders every page on each request)
export default defineConfig(({ mode }) => {
  const backend = mode === "backend";
  const env = loadEnv(mode, fileURLToPath(new URL(".", import.meta.url)), "VITE_");

  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // Not in Vue's HTML tag list, so it would otherwise compile as an
            // unresolved component and be missing from server-rendered HTML.
            isCustomElement: (tag) => tag === "marquee",
          },
        },
      }),
    ],

    build: backend
      ? {
          outDir: "../backend/ssr",
          emptyOutDir: true,
          copyPublicDir: false,
          target: "node20",
          rollupOptions: {
            output: {
              entryFileNames: "[name].mjs",
              chunkFileNames: "chunks/[name]-[hash].mjs",
            },
          },
        }
      : {
          target: "esnext",
          cssCodeSplit: true,
          // dist/.vite/ssr-manifest.json: which JS/CSS each page needs, so
          // the server can preload exactly those.
          ssrManifest: true,

          rollupOptions: {
            output: {
              manualChunks(id) {
                if (id.includes("node_modules")) {
                  if (id.includes("three")) return "three";
                  if (id.includes("gsap")) return "gsap";
                  if (id.includes("@tiptap")) return "tiptap";
                }
              },
            },
          },
        },

    ssr: backend
      ? {
          // Self-contained bundle: the server needs no frontend dependencies
          // resolved at runtime.
          noExternal: true,
        }
      : {
          // Transformed by Vite when the backend renders the live source.
          noExternal: [
            "three",
            "gsap",
            "@tiptap/vue-3",
            "@tiptap/starter-kit",
            "@tiptap/extension-link",
            "@tiptap/extension-image",
            "@tiptap/extension-underline",
            "@tiptap/extension-youtube",
            "@tiptap/extension-table",
            "@tiptap/extension-table-row",
            "@tiptap/extension-table-cell",
            "@tiptap/extension-table-header",
            "@tiptap/extension-placeholder",
          ],
        },

    // `npm run dev`: the API and server-rendered pages come from the Express
    // backend (cd backend && npm run dev), VITE_DEV_API in frontend/.env.
    server: {
      port: 5173,
      strictPort: true,
      proxy: devProxy(env.VITE_DEV_API || "http://localhost:3000"),
    },

  };
});
