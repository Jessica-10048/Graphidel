const ProductModel = require("../models/product.model");

// ➕ Créer un produit
const postProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.path : null;

    const product = await ProductModel.create({
      name,
      description,
      price,
      image,
    });

    res.status(201).json({ product, message: "Le produit a été créé." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Erreur lors de la création du produit." });
  }
};

// 📄 Obtenir tous les produits
const getAllProduct = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Erreur lors de la récupération des produits." });
  }
};

// 🔍 Obtenir un seul produit par ID
const getProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json("Produit non trouvé.");
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json("Erreur lors de la récupération du produit.");
  }
};

// 🛠️ Mettre à jour un produit
const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = req.file.path;

    const product = await ProductModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!product) return res.status(404).json("Produit non trouvé.");

    res.status(200).json({ product, message: "Produit mis à jour." });
  } catch (error) {
    console.log(error.message);
    res.status(500).json("Erreur lors de la mise à jour du produit.");
  }
};

// 🔴 Supprimer un produit


const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé." });

    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression produit:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



module.exports = {
  postProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
