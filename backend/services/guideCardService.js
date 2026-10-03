import mongoose from "mongoose";
import { GuideCard } from "../models/GuideCard.js";
import { badRequest, conflict, notFound } from "../utils/httpError.js";
import { slugify } from "../utils/text.js";

/** Guide cards: the API shape matches src/services/guideCards.js. */
export function toClient(doc) {
  return {
    id: String(doc._id),
    cardId: doc.cardId,
    category: doc.category,
    title: doc.title,
    description: doc.description,
    order: doc.order || 0,
    enabled: doc.enabled !== false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

const text = (v) => (v == null ? "" : String(v).trim());

function fromClient(body) {
  const update = {};
  for (const key of ["title", "category", "description"]) {
    if (body[key] !== undefined) update[key] = text(body[key]);
  }
  if (body.cardId !== undefined) update.cardId = slugify(body.cardId);
  if (body.order !== undefined) update.order = Number(body.order) || 0;
  if (body.enabled !== undefined) update.enabled = !!body.enabled;
  return update;
}

function assertId(id) {
  if (!mongoose.isValidObjectId(id)) throw notFound("Guide card not found.");
}

function rethrowDuplicate(err) {
  if (err?.code === 11000) throw conflict("card-id-taken", "Another guide card already uses this card id.");
  throw err;
}

export async function listGuideCards({ category, enabledOnly = false } = {}) {
  const filter = {};
  if (category) filter.category = String(category);
  if (enabledOnly) filter.enabled = true;
  return (await GuideCard.find(filter).sort({ order: 1, createdAt: 1 }).lean()).map(toClient);
}

export async function getGuideCardById(id) {
  assertId(id);
  const doc = await GuideCard.findById(id).lean();
  if (!doc) throw notFound("Guide card not found.");
  return toClient(doc);
}

export async function cardIdExists(cardId, excludeId) {
  const filter = { cardId: slugify(cardId) };
  if (excludeId && mongoose.isValidObjectId(excludeId)) filter._id = { $ne: excludeId };
  return !!(await GuideCard.exists(filter));
}

export async function createGuideCard(body) {
  const data = fromClient(body);
  if (!data.cardId || !data.category) throw badRequest("A guide card needs a card id and a category.");
  try {
    return toClient((await GuideCard.create(data)).toObject());
  } catch (err) {
    return rethrowDuplicate(err);
  }
}

export async function updateGuideCard(id, body) {
  assertId(id);
  try {
    const doc = await GuideCard.findByIdAndUpdate(id, fromClient(body), { returnDocument: "after", runValidators: true }).lean();
    if (!doc) throw notFound("Guide card not found.");
    return toClient(doc);
  } catch (err) {
    return rethrowDuplicate(err);
  }
}

export async function deleteGuideCard(id) {
  assertId(id);
  if (!(await GuideCard.findByIdAndDelete(id))) throw notFound("Guide card not found.");
}

/** Saves a drag-reordered list: [{ id }, …] → order 0, 1, 2 … */
export async function reorderGuideCards(ids) {
  if (!Array.isArray(ids) || ids.some((id) => !mongoose.isValidObjectId(id))) {
    throw badRequest("Send the card ids in their new order.");
  }
  await GuideCard.bulkWrite(ids.map((id, order) => ({ updateOne: { filter: { _id: id }, update: { $set: { order } } } })));
}
