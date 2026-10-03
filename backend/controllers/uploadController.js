import { deleteUpload, listUploads, registerUpload } from "../services/mediaService.js";

/** POST /api/upload (multipart "file", optional "folder") → { url, publicId, width, height } */
export async function upload(req, res) {
  res.status(201).json(await registerUpload(req.file, { folder: req.body?.folder, userId: req.user.id }));
}

/** GET /api/upload — the media library, newest first. */
export async function list(req, res) {
  res.set("Cache-Control", "no-store").json(await listUploads({ limit: req.query.limit }));
}

/** DELETE /api/upload/:publicId */
export async function remove(req, res) {
  await deleteUpload(req.params.publicId);
  res.status(204).end();
}
