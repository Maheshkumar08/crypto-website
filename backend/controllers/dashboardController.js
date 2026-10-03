import { Article } from "../models/Article.js";
import { GuideCard } from "../models/GuideCard.js";
import { Media } from "../models/Media.js";
import { Message } from "../models/Message.js";
import { Page } from "../models/Page.js";
import { Subscriber } from "../models/Subscriber.js";
import { toClient } from "../services/articleService.js";

/** GET /api/dashboard — counts and recent activity for the admin. */
export async function dashboard(req, res) {
  const [byKind, totals, recent, pages, guideCards, media, unread, subscribers] = await Promise.all([
    Article.aggregate([{ $group: { _id: { kind: "$kind", status: "$status" }, count: { $sum: 1 } } }]),
    Article.aggregate([{ $group: { _id: null, views: { $sum: "$views" }, likes: { $sum: "$likes" } } }]),
    Article.find().sort({ updatedAt: -1 }).limit(8).select("-content").lean(),
    Page.countDocuments(),
    GuideCard.countDocuments(),
    Media.countDocuments(),
    Message.countDocuments({ read: false }),
    Subscriber.countDocuments(),
  ]);

  const count = (kind, status) => byKind.filter((r) => r._id.kind === kind && (!status || r._id.status === status)).reduce((n, r) => n + r.count, 0);

  res.set("Cache-Control", "no-store").json({
    articles: { total: count("article"), published: count("article", "published"), drafts: count("article", "draft") },
    blogs: { total: count("blog"), published: count("blog", "published"), drafts: count("blog", "draft") },
    pages,
    guideCards,
    media,
    messages: { unread },
    subscribers,
    views: totals[0]?.views || 0,
    likes: totals[0]?.likes || 0,
    recent: recent.map(toClient),
  });
}
