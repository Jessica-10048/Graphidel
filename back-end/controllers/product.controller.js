// controllers/product.controller.js
const ProductModel = require("../models/product.model");
const path = require("path");

// on renvoie un chemin relatif web depuis /uploads/public
function pathForClient(absPath) {
  return String(absPath)
    .replace(/\\/g, "/")
    .replace(/^.*uploads\/public\//, "uploads/public/");
}

// ➕ Créer un produit (multi-images ou image simple)
const postProduct = async (req, res) => {
  try {
    const { name, description, price, promo, discount } = req.body;

    // fusionne 'images' et 'image' venant de upload.fields()
    const imgList = [];
    if (req.files?.images) imgList.push(...req.files.images);
    if (req.files?.image)  imgList.push(...req.files.image);

    const images = imgList.map((f) => pathForClient(f.path));
    const image  = req.files?.image?.[0]
      ? pathForClient(req.files.image[0].path)
      : null;

    const product = await ProductModel.create({
      name,
      description,
      price,
      promo: promo ?? null,
      discount: discount ?? 0,
      image,   // vignette unique "legacy"
      images,  // galerie
    });

    return res.status(201).json({ product, message: "Le produit a été créé." });
  } catch (error) {
    console.error("[POST /product/add] ERROR:", error);
    return res.status(500).json({ message: "Erreur lors de la création du produit." });
  }
};

// 📄 Obtenir tous les produits
const getAllProduct = async (_req, res) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 });
    console.log("[/api/product/all] count =", products.length);
    return res.status(200).json(products);
  } catch (error) {
    console.error("[/api/product/all] ERROR:", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des produits." });
  }
};

// 🔍 Obtenir un produit par ID
const getProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé." });
    return res.status(200).json(product);
  } catch (error) {
    console.error("[/api/product/get/:id] ERROR:", error);
    return res.status(500).json({ message: "Erreur lors de la récupération du produit." });
  }
};

// 🛠️ Mettre à jour un produit
const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // nouvelles images ajoutées via upload.fields()
    let newImages = [];
    if (req.files?.images) newImages.push(...req.files.images.map((f) => pathForClient(f.path)));
    if (req.files?.image)  newImages.push(...req.files.image.map((f)  => pathForClient(f.path)));

    if (newImages.length) {
      updateData.$push = { images: { $each: newImages } };
    }

    // remplacer l'image unique "legacy" si fournie
    if (req.files?.image?.[0]) {
      updateData.image = pathForClient(req.files.image[0].path);
    }

    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Produit non trouvé." });
    return res.status(200).json({ product, message: "Produit mis à jour." });
  } catch (error) {
    console.error("[PUT /product/update/:id] ERROR:", error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour du produit." });
  }
};

// 🔴 Supprimer un produit
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé." });

    // Optionnel : supprimer les fichiers physiques ici

    return res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("[DELETE /product/delete/:id] ERROR:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  postProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
