import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import multer from "multer";
import { config } from "../config/env.js";
import { badRequest } from "../utils/httpError.js";

/** Raster images only: SVG can carry scripts, so it is never accepted. */
export const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

mkdirSync(config.uploads.dir, { recursive: true });

const storage = multer.diskStorage({
  destination: config.uploads.dir,
  // Random names: nothing user-controlled ever reaches the filesystem path.
  filename: (_req, file, cb) => {
    cb(null, `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${IMAGE_TYPES[file.mimetype]}`);
  },
});

const uploader = multer({
  storage,
  limits: { fileSize: config.uploads.maxBytes, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (IMAGE_TYPES[file.mimetype]) cb(null, true);
    else cb(badRequest("Only JPEG, PNG, WebP or GIF images can be uploaded."));
  },
});

/** Single image in the multipart field "file"; Multer errors become 400s. */
export function uploadImageFile(req, res, next) {
  uploader.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message = err.code === "LIMIT_FILE_SIZE" ? `Images can be at most ${config.uploads.maxBytes / 1024 / 1024} MB.` : err.message;
      return next(badRequest(message));
    }
    if (!err && !req.file) return next(badRequest('Attach the image as the "file" field.'));
    next(err);
  });
}
