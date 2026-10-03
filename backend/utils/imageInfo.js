import { open } from "node:fs/promises";

/**
 * Reads an image's real type and pixel size from its first bytes, so an
 * upload is accepted only if its content is actually an image (the MIME type
 * a browser sends is just a label). Supports JPEG, PNG, GIF and WebP.
 *
 * @returns {Promise<{ type: string, width: number, height: number } | null>}
 */
export async function readImageInfo(file) {
  const handle = await open(file, "r");
  try {
    const { buffer, bytesRead } = await handle.read(Buffer.alloc(512 * 1024), 0, 512 * 1024, 0);
    return parse(buffer.subarray(0, bytesRead));
  } finally {
    await handle.close();
  }
}

function parse(b) {
  if (b.length < 24) return null;

  // PNG: signature, then the IHDR chunk with width/height.
  if (b.readUInt32BE(0) === 0x89504e47 && b.readUInt32BE(4) === 0x0d0a1a0a && b.toString("ascii", 12, 16) === "IHDR") {
    return { type: "image/png", width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }

  // GIF87a / GIF89a: logical screen size.
  if (b.toString("ascii", 0, 3) === "GIF") {
    return { type: "image/gif", width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  }

  // WebP: RIFF container with a VP8 / VP8L / VP8X chunk.
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP" && b.length >= 30) {
    const chunk = b.toString("ascii", 12, 16);
    if (chunk === "VP8 ") return { type: "image/webp", width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { type: "image/webp", width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8X") return { type: "image/webp", width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 };
    return null;
  }

  // JPEG: walk the markers to the first start-of-frame (SOF) segment.
  if (b[0] === 0xff && b[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < b.length) {
      if (b[offset] !== 0xff) return null;
      const marker = b[offset + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        offset += 2;
        continue;
      }
      const length = b.readUInt16BE(offset + 2);
      const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (isSof) return { type: "image/jpeg", width: b.readUInt16BE(offset + 7), height: b.readUInt16BE(offset + 5) };
      offset += 2 + length;
    }
    return null;
  }

  return null;
}
