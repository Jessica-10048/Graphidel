// routes/template.router.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();

const ctrl = require('../controllers/template.controller');
const { auth, authAdmin } = require('../middleware/auth');
// ---- Multer: stockage privé (pas servi statiquement) ----
const assetsDir = path.join(__dirname, '..', 'uploads', 'assets');
fs.mkdirSync(assetsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, assetsDir),
  filename: (_req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// ---- Routes /me d’abord pour éviter collision avec :idOrSlug ----
router.get('/me/downloads/list', auth, ctrl.myDownloads);
router.get('/me/downloads/:assetId', auth, ctrl.downloadAsset);

// CRUD publics / admin
router.get('/', ctrl.listTemplates);
router.post('/', authAdmin, ctrl.createTemplate);

router.get('/:idOrSlug', ctrl.getTemplate);
router.put('/:idOrSlug', authAdmin, ctrl.updateTemplate);
router.delete('/:idOrSlug', authAdmin, ctrl.deleteTemplate);

// Assets (admin)
router.post('/:idOrSlug/assets', authAdmin, upload.single('file'), ctrl.addAsset);
router.delete('/:idOrSlug/assets/:filename', authAdmin, ctrl.removeAsset);

// Preview inline (admin). Si tu veux public, enlève authAdmin.
router.get('/:idOrSlug/assets/:filename/preview', authAdmin, ctrl.previewAsset);

module.exports = router;
