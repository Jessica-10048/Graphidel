const multer = require("multer");
const path = require("path");
const fs = require("fs");

const DEST_ROOT = path.join(process.cwd(), "uploads", "public", "products");
fs.mkdirSync(DEST_ROOT, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, DEST_ROOT),
  filename: (_req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  },
});

function fileFilter(_req, file, cb) {
  const ok = ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.mimetype);
  if (!ok) return cb(new Error("Format d'image non supporté"), false);
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5 Mo / fichier
});

module.exports = upload;
