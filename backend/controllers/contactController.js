import mongoose from "mongoose";
import { Message } from "../models/Message.js";
import { Subscriber } from "../models/Subscriber.js";
import { badRequest, notFound } from "../utils/httpError.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v, max) => String(v ?? "").trim().slice(0, max);

/** POST /api/contact — same rules as ContactForm.vue; stored for the admin (GET /api/messages). */
export async function submit(req, res) {
  const body = req.body || {};
  const data = {
    name: clean(body.name, 200),
    email: clean(body.email, 320).toLowerCase(),
    subject: clean(body.subject, 300),
    message: clean(body.message, 10000),
  };
  const fields = {};
  if (!data.name) fields.name = "Tell us your name.";
  if (!EMAIL.test(data.email)) fields.email = "Enter a valid email.";
  if (!data.subject) fields.subject = "Add a short subject.";
  if (data.message.length < 10) fields.message = "Message needs at least 10 characters.";
  if (Object.keys(fields).length) throw badRequest("Please check the form.", fields);

  await Message.create(data);
  res.status(201).json({ ok: true });
}

/** GET /api/messages (staff) */
export async function list(req, res) {
  const filter = req.query.unread ? { read: false } : {};
  const docs = await Message.find(filter).sort({ createdAt: -1 }).limit(500).lean();
  res.set("Cache-Control", "no-store").json(docs.map(({ _id, __v, ...m }) => ({ id: String(_id), ...m })));
}

/** PATCH /api/messages/:id { read } (staff) */
export async function markRead(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) throw notFound("Message not found.");
  const doc = await Message.findByIdAndUpdate(req.params.id, { read: req.body?.read !== false }, { returnDocument: "after" }).lean();
  if (!doc) throw notFound("Message not found.");
  res.json({ id: String(doc._id), read: doc.read });
}

/** DELETE /api/messages/:id (admin) */
export async function remove(req, res) {
  if (!mongoose.isValidObjectId(req.params.id) || !(await Message.findByIdAndDelete(req.params.id))) throw notFound("Message not found.");
  res.status(204).end();
}

/** POST /api/newsletter { email, source } — subscribing twice is fine. */
export async function subscribe(req, res) {
  const email = clean(req.body?.email, 320).toLowerCase();
  if (!EMAIL.test(email)) throw badRequest("Enter a valid email.", { email: "Enter a valid email." });
  await Subscriber.updateOne({ email }, { $setOnInsert: { email, source: clean(req.body?.source, 50) || "blog" } }, { upsert: true });
  res.status(201).json({ ok: true });
}

/** GET /api/newsletter (staff) */
export async function subscribers(req, res) {
  const docs = await Subscriber.find().sort({ createdAt: -1 }).lean();
  res.set("Cache-Control", "no-store").json(docs.map(({ _id, __v, ...s }) => ({ id: String(_id), ...s })));
}
