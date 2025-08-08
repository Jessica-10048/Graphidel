const ProductModel = require("../models/product.model"); // ✅ nom et chemin alignés

// ➕ Créer un produit (multi-images)
const postProduct = async (req, res) => {
  try {
    const { name, description, price, promo, discount } = req.body;
    const files = Array.isArray(req.files) ? req.files : [];
    const images = files.map(f => pathForClient(f.path));

    // compat : si form-data envoie 'image' simple via upload.single
    const image = req.file ? pathForClient(req.file.path) : null;

    const product = await ProductModel.create({
      name,
      description,
      price,
      promo: promo ?? null,
      discount: discount ?? 0,
      image,
      images,
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

    // Ajout de nouvelles images si présentes (upload.array)
    if (Array.isArray(req.files) && req.files.length > 0) {
      const newImages = req.files.map(f => pathForClient(f.path));
      // concatène au tableau existant si demandé
      updateData.$push = { images: { $each: newImages } };
    }

    // Remplacement éventuel de l'image "legacy" (upload.single)
    if (req.file) {
      updateData.image = pathForClient(req.file.path);
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

    // Optionnel : supprimer les fichiers du disque ici si besoin

    return res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("[DELETE /product/delete/:id] ERROR:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// util: on renvoie un chemin relatif depuis /uploads
const path = require("path");
function pathForClient(absPath) {
  // normalise pour obtenir 'uploads/public/...'
  const idx = absPath.lastIndexOf(path.join("uploads", "public"));
  return idx !== -1 ? absPath.slice(idx).replace(/\\/g, "/") : absPath;
}

module.exports = {
  postProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
