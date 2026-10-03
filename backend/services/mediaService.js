import { unlink } from "node:fs/promises";
import path from "node:path";
import { config } from "../config/env.js";
import { IMAGE_TYPES } from "../middleware/upload.js";
import { Media } from "../models/Media.js";
import { badRequest, notFound } from "../utils/httpError.js";
import { readImageInfo } from "../utils/imageInfo.js";

export function publicUrl(filename) {
  return `/uploads/${filename}`;
}

/**
 * Records an uploaded file after checking its actual bytes are the image
 * type it claims to be (the browser-sent MIME type is only a hint).
 */
export async function registerUpload(file, { folder = "", userId } = {}) {
  let size;
  try {
    size = await readImageInfo(file.path);
  } catch {
    size = null;
  }
  const detected = size?.type;
  if (!detected || !IMAGE_TYPES[detected]) {
    await unlink(file.path).catch(() => {});
    throw badRequest("That file isn't a valid image.");
  }

  await Media.create({
    filename: file.filename,
    originalName: file.originalname.slice(0, 200),
    folder: String(folder).slice(0, 100),
    mimeType: detected,
    size: file.size,
    width: size.width ?? null,
    height: size.height ?? null,
    uploadedBy: userId || null,
  });

  return {
    url: publicUrl(file.filename),
    publicId: file.filename,
    width: size.width ?? null,
    height: size.height ?? null,
  };
}

export async function deleteUpload(publicId) {
  const filename = path.basename(String(publicId));
  const media = await Media.findOneAndDelete({ filename });
  if (!media) throw notFound("Image not found.");
  await unlink(path.join(config.uploads.dir, filename)).catch(() => {});
}

export async function listUploads({ limit = 100 } = {}) {
  const docs = await Media.find().sort({ createdAt: -1 }).limit(Math.min(500, Number(limit) || 100)).lean();
  return docs.map((m) => ({
    publicId: m.filename,
    url: publicUrl(m.filename),
    width: m.width,
    height: m.height,
    size: m.size,
    mimeType: m.mimeType,
    folder: m.folder,
    createdAt: m.createdAt,
  }));
}
