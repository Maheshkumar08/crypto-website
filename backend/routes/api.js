import { Router } from "express";
import * as authController from "../controllers/authController.js";
import * as articleController from "../controllers/articleController.js";
import * as contactController from "../controllers/contactController.js";
import { dashboard } from "../controllers/dashboardController.js";
import * as guideCardController from "../controllers/guideCardController.js";
import * as pageController from "../controllers/pageController.js";
import { search } from "../controllers/searchController.js";
import { health } from "../controllers/siteController.js";
import * as taxonomyController from "../controllers/taxonomyController.js";
import * as uploadController from "../controllers/uploadController.js";
import { authenticate, requireAuth, requireRole } from "../middleware/auth.js";
import { apiNotFound } from "../middleware/errorHandler.js";
import { apiLimiter, counterLimiter, formLimiter, loginLimiter } from "../middleware/rateLimits.js";
import { uploadImageFile } from "../middleware/upload.js";

/**
 * REST API. Reading is public (published content only); writing needs a
 * signed-in editor or admin; deleting needs an admin.
 */

const staff = requireRole("editor");
const admin = requireRole("admin");

/** /api/articles and /api/blogs: the same routes for each kind. */
function postsRouter(kind) {
  const router = Router();
  router.use((req, _res, next) => {
    req.kind = kind;
    next();
  });
  router.get("/", articleController.list);
  router.get("/slug-exists", requireAuth, articleController.slugExists);
  router.get("/id/:id", requireAuth, articleController.getById);
  router.get("/:slug", articleController.getBySlug);
  router.post("/", staff, articleController.create);
  router.put("/:id", staff, articleController.update);
  router.patch("/:id", staff, articleController.update);
  router.delete("/:id", admin, articleController.remove);
  router.post("/:id/views", counterLimiter, articleController.view);
  router.post("/:id/likes", counterLimiter, articleController.like);
  return router;
}

export function apiRouter() {
  const api = Router();
  api.use(apiLimiter);
  api.use(authenticate);

  api.get("/health", health);

  api.post("/auth/login", loginLimiter, authController.login);
  api.post("/auth/refresh", authController.refresh);
  api.post("/auth/logout", authController.logout);
  api.get("/auth/me", requireAuth, authController.me);

  api.use("/articles", postsRouter("article"));
  api.use("/blogs", postsRouter("blog"));

  api.get("/search", search);
  api.get("/categories", taxonomyController.categories);
  api.get("/tags", taxonomyController.tags);

  api.get("/pages", pageController.list);
  api.get("/pages/slug-exists", requireAuth, pageController.slugExists);
  api.get("/pages/id/:id", requireAuth, pageController.getById);
  api.get("/pages/:slug", pageController.getBySlug);
  api.post("/pages", staff, pageController.create);
  api.put("/pages/:id", staff, pageController.update);
  api.delete("/pages/:id", admin, pageController.remove);

  api.get("/guide-cards", guideCardController.list);
  api.get("/guide-cards/card-id-exists", requireAuth, guideCardController.cardIdExists);
  api.put("/guide-cards/reorder", staff, guideCardController.reorder);
  api.get("/guide-cards/:id", requireAuth, guideCardController.getById);
  api.post("/guide-cards", staff, guideCardController.create);
  api.put("/guide-cards/:id", staff, guideCardController.update);
  api.delete("/guide-cards/:id", admin, guideCardController.remove);

  api.post("/upload", staff, uploadImageFile, uploadController.upload);
  api.get("/upload", staff, uploadController.list);
  api.delete("/upload/:publicId", staff, uploadController.remove);

  api.get("/dashboard", staff, dashboard);

  api.post("/contact", formLimiter, contactController.submit);
  api.get("/messages", staff, contactController.list);
  api.patch("/messages/:id", staff, contactController.markRead);
  api.delete("/messages/:id", admin, contactController.remove);

  api.post("/newsletter", formLimiter, contactController.subscribe);
  api.get("/newsletter", staff, contactController.subscribers);

  api.use(apiNotFound);
  return api;
}
