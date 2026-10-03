import * as cards from "../services/guideCardService.js";
import { badRequest } from "../utils/httpError.js";

/** GET /api/guide-cards?category=…&enabledOnly=1 — public (section pages). */
export async function list(req, res) {
  const enabledOnly = !req.user || ["1", "true"].includes(String(req.query.enabledOnly));
  res.set("Cache-Control", req.user ? "no-store" : "no-cache").json(await cards.listGuideCards({ category: req.query.category, enabledOnly }));
}

export async function getById(req, res) {
  res.set("Cache-Control", "no-store").json(await cards.getGuideCardById(req.params.id));
}

export async function cardIdExists(req, res) {
  if (!req.query.cardId) throw badRequest("Pass ?cardId=…");
  res.json({ exists: await cards.cardIdExists(req.query.cardId, req.query.excludeId) });
}

export async function create(req, res) {
  res.status(201).json(await cards.createGuideCard(req.body || {}));
}

export async function update(req, res) {
  res.json(await cards.updateGuideCard(req.params.id, req.body || {}));
}

export async function remove(req, res) {
  await cards.deleteGuideCard(req.params.id);
  res.status(204).end();
}

/** PUT /api/guide-cards/reorder { ids: [...] } */
export async function reorder(req, res) {
  await cards.reorderGuideCards(req.body?.ids);
  res.status(204).end();
}
