// controllers/template.controller.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path'); // utilisé pour sendFile
const Template = require('../models/templates.model');
const Order = require('../models/order.model'); // userId, items[{productId}], status

const isObjectId = (v) => mongoose.Types.ObjectId.isValid(v);

// Helper: format prix en GBP (optionnel)
function formatGBP(amountNumber) {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amountNumber || 0);
  } catch {
    return `£${amountNumber}`;
  }
}

/* =========================
 *        CRUD PUBLIC
 * ========================= */

const createTemplate = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      currency = 'GBP',
      sku,
      images = [],
      previewUrl,
      categories = [],
      tags = [],
      isActive = true,
      isDigital = true,
      ownerId,
      metadata,
    } = req.body;

    const doc = await Template.create({
      name,
      description,
      price,
      currency,
      sku,
      images,
      previewUrl,
      categories,
      tags,
      isActive,
      isDigital,
      ownerId: ownerId || req.user?._id,
      metadata,
    });

    res.status(201).json({
      message: 'Template créé',
      data: doc,
      priceLabel: formatGBP(doc.price),
    });
  } catch (err) {
    if (err.code === 11000) err.status = 409; // duplicate key
    next(err);
  }
};

const listTemplates = async (req, res, next) => {
  try {
    const {
      q,
      minPrice,
      maxPrice,
      tag,
      category,
      isActive,
      currency,
      sort = '-createdAt',
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};
    if (typeof isActive !== 'undefined') filter.isActive = isActive === 'true';
    if (category) filter.categories = { $in: [category] };
    if (tag) filter.tags = { $in: [String(tag).toLowerCase()] };
    if (currency) filter.currency = String(currency).toUpperCase();
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (q) filter.$text = { $search: q };

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Template.find(filter).sort(sort).skip(skip).limit(limitNum),
      Template.countDocuments(filter),
    ]);

    res.json({
      data: items.map((x) => ({
        ...x.toObject(),
        priceLabel: x.currency === 'GBP' ? formatGBP(x.price) : x.price,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET by id or slug
const getTemplate = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const by = isObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
    const doc = await Template.findOne(by);
    if (!doc) return res.status(404).json({ message: 'Template introuvable' });

    res.json({
      data: doc,
      priceLabel: doc.currency === 'GBP' ? formatGBP(doc.price) : doc.price,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE
const updateTemplate = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const by = isObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };

    if ('slug' in req.body) delete req.body.slug;
    if ('currency' in req.body && req.body.currency) {
      req.body.currency = String(req.body.currency).toUpperCase();
    }

    const doc = await Template.findOneAndUpdate(by, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ message: 'Template introuvable' });

    res.json({
      message: 'Template mis à jour',
      data: doc,
      priceLabel: doc.currency === 'GBP' ? formatGBP(doc.price) : doc.price,
    });
  } catch (err) {
    if (err.code === 11000) err.status = 409;
    next(err);
  }
};

// DELETE
const deleteTemplate = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const by = isObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };

    const doc = await Template.findOneAndDelete(by);
    if (!doc) return res.status(404).json({ message: 'Template introuvable' });

    // (option) suppression physique des fichiers liés
    res.json({ message: 'Template supprimé' });
  } catch (err) {
    next(err);
  }
};

/* =========================
 *      ASSETS PRIVÉS
 * ========================= */

const addAsset = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const by = isObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };

    const payload = req.file
      ? {
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: req.file.path, // stocké hors /public
        }
      : {
          filename: req.body.filename,
          mimetype: req.body.mimetype,
          size: req.body.size ? Number(req.body.size) : undefined,
          path: req.body.path,
        };

    if (!payload?.filename || !payload?.path) {
      return res.status(400).json({ message: 'filename et path requis' });
    }

    const doc = await Template.findOne(by);
    if (!doc) return res.status(404).json({ message: 'Template introuvable' });

    if (typeof doc.addAsset === 'function') {
      doc.addAsset(payload);
    } else {
      if (!Array.isArray(doc.assets)) doc.assets = [];
      if (doc.assets.some((a) => a.filename === payload.filename)) {
        return res.status(409).json({ message: 'Asset déjà présent' });
      }
      doc.assets.push(payload);
    }

    await doc.save();
    res.status(201).json({ message: 'Asset ajouté', data: { filename: payload.filename } });
  } catch (err) {
    next(err);
  }
};

const removeAsset = async (req, res, next) => {
  try {
    const { idOrSlug, filename } = req.params;
    const by = isObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };

    const doc = await Template.findOne(by).select('+assets.path');
    if (!doc) return res.status(404).json({ message: 'Template introuvable' });

    const before = doc.assets?.length || 0;
    doc.assets = (doc.assets || []).filter((a) => a.filename !== filename);
    const changed = (doc.assets?.length || 0) !== before;
    if (!changed) return res.status(404).json({ message: 'Asset introuvable' });

    // (option) suppression physique du fichier
    await doc.save();
    res.json({ message: 'Asset supprimé' });
  } catch (err) {
    next(err);
  }
};

/* =========================
 *  TÉLÉCHARGEMENTS SÉCURISÉS
 * ========================= */

const myDownloads = async (req, res, next) => {
  try {
    const orders = await Order.find({
      userId: req.user._id,
      status: 'paid',
    }).populate('items.productId');

    const assets = [];
    for (const order of orders) {
      for (const it of order.items) {
        const p = it.productId;
        if (p?.assets?.length) {
          p.assets.forEach((a) =>
            assets.push({
              templateId: String(p._id),
              templateName: p.name,
              filename: a.filename,
              assetId: `${p._id}:${a.filename}`,
              priceLabel: p.currency === 'GBP' ? formatGBP(p.price) : p.price,
            })
          );
        }
      }
    }
    res.json({ assets });
  } catch (err) {
    next(err);
  }
};

const downloadAsset = async (req, res, next) => {
  try {
    const { assetId } = req.params; // "<templateId>:<filename>"
    const [templateId, filename] = String(assetId).split(':');
    if (!isObjectId(templateId) || !filename) {
      return res.status(400).json({ message: 'assetId invalide' });
    }

    const owned = await Order.exists({
      userId: req.user._id,
      status: 'paid',
      'items.productId': templateId,
    });
    if (!owned) return res.status(403).json({ message: 'Accès refusé' });

    const doc = await Template.findById(templateId).select('+assets.path');
    if (!doc) return res.status(404).json({ message: 'Template introuvable' });

    const asset = (doc.assets || []).find((a) => a.filename === filename);
    if (!asset) return res.status(404).json({ message: 'Fichier introuvable' });

    if (!asset.path || !fs.existsSync(asset.path)) {
      return res.status(404).json({ message: 'Fichier manquant sur le serveur' });
    }

    return res.download(asset.path, asset.filename);
  } catch (err) {
    next(err);
  }
};

// 🔎 Prévisualiser un asset en inline (admin)
const previewAsset = async (req, res, next) => {
  try {
    const { idOrSlug, filename } = req.params;
    const by = isObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };

    const doc = await Template.findOne(by).select('+assets.path');
    if (!doc) return res.status(404).json({ message: 'Template introuvable' });

    const asset = (doc.assets || []).find((a) => a.filename === filename);
    if (!asset) return res.status(404).json({ message: 'Fichier introuvable' });
    if (!asset.path || !fs.existsSync(asset.path)) {
      return res.status(404).json({ message: 'Fichier manquant sur le serveur' });
    }

    res.setHeader('Content-Type', asset.mimetype || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${asset.filename}"`);
    return res.sendFile(path.resolve(asset.path));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTemplate,
  listTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
  addAsset,
  removeAsset,
  myDownloads,
  downloadAsset,
  previewAsset,
};
